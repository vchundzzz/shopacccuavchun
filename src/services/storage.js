import { DEFAULT_SHOP_CONFIG, INITIAL_ACCOUNTS, INITIAL_BANNERS, INITIAL_CATEGORIES } from '../data/seedData';
import dbData from '../data/db.json';
import { cloudDatabase } from './cloudDatabase';
import { compactImagesInData, estimateLocalStorageUsage } from '../utils/imageUpload';
import { idbGet, idbSet, idbDelete, idbClear, isIndexedDbSupported } from './indexedDb';
import { isSupabaseConfigured, uploadImageToSupabase } from './supabaseStorage';

const STORAGE_KEYS = {
  SHOP_CONFIG: 'shoptyseisei_config_v2',
  ACCOUNTS: 'shoptyseisei_accounts_v2',
  BANNERS: 'shoptyseisei_banners_v2',
  CATEGORIES: 'shoptyseisei_categories_v2',
  AUTH: 'shoptyseisei_auth_token_v2',
  CREDENTIALS: 'shoptyseisei_admin_creds_v2'
};

// Khoá metadata phụ (không chứa dữ liệu shop) để theo dõi thời điểm sửa lần cuối
const META_KEY = 'shoptyseisei_meta_v2';

const DEFAULT_ADMIN = {
  username: 'chungdzvcl',
  password: 'chungdzvcl'
};

const BACKUP_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

const baseShopConfig = dbData?.shopConfig || DEFAULT_SHOP_CONFIG;
const baseAccounts = dbData?.accounts || INITIAL_ACCOUNTS;
const baseBanners = dbData?.banners || INITIAL_BANNERS;
const baseCategories = dbData?.categories || INITIAL_CATEGORIES;

/** Nhận diện lỗi đầy bộ nhớ localStorage của mọi trình duyệt. */
const isQuotaExceeded = (err) =>
  !!err && (err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014);

/** Đọc metadata cục bộ. */
const readMeta = () => {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) || '{}');
  } catch (e) {
    return {};
  }
};

const writeMeta = (patch) => {
  try {
    localStorage.setItem(META_KEY, JSON.stringify({ ...readMeta(), ...patch }));
  } catch (e) {
    console.warn('[storage] Không ghi được metadata:', e);
  }
};

/** Mốc thời gian (ms) lần cuối người dùng thay đổi dữ liệu trên máy này. */
const getLocalUpdatedAt = () => readMeta().localUpdatedAt || 0;

/** Đánh dấu "dữ liệu cục bộ mới hơn dữ liệu trên cloud". */
const markLocalUpdated = () => writeMeta({ localUpdatedAt: Date.now() });

/**
 * Hàng đợi ghi lên Cloud Database.
 */
let cloudQueue = Promise.resolve();
const enqueueCloudWrite = (task) => {
  cloudQueue = cloudQueue.then(task).catch((e) => {
    console.warn('[storage] Lỗi trong hàng đợi đồng bộ cloud:', e);
  });
  return cloudQueue;
};

export const storage = {
  // ---------- HẠ TẦNG LƯU TRỮ CỤC BỘ ----------

  /**
   * Ghi dữ liệu:
   * 1. Luôn lưu vào IndexedDB (Dung lượng hàng trăm Megabyte, không bị giới hạn 5MB)
   * 2. Ghi bản sao xuống localStorage để tải tức thì khi khởi động
   */
  async _writeLocal(key, value) {
    // 1. Luôn lưu vào IndexedDB
    let savedInIdb = false;
    try {
      savedInIdb = await idbSet(key, value);
    } catch (e) {
      console.warn(`[storage] IndexedDB fallback cho khoá "${key}":`, e);
    }

    // 2. Ghi bản sao xuống localStorage để tải tức thì
    const json = JSON.stringify(value);

    try {
      localStorage.setItem(key, json);
      return { success: true, savedInIdb, compacted: false, value };
    } catch (err) {
      if (!isQuotaExceeded(err)) {
        console.error(`[storage] Lỗi ghi ${key}:`, err);
        return { success: savedInIdb, savedInIdb, quotaExceeded: false, error: err, value };
      }
    }

    console.warn(`[storage] Vượt quota 5MB của localStorage khi ghi "${key}" -> tiến hành nén ảnh nhẹ...`);

    // Nén các khoá khác trước để giải phóng chỗ cho khoá đang ghi
    try {
      await this._compactOtherLocalKeys([key]);
    } catch (e) {
      console.warn('[storage] Không nén được các khoá khác:', e);
    }

    // Nén ảnh trong chính dữ liệu đang ghi
    let compacted = value;
    try {
      compacted = await compactImagesInData(value);
    } catch (e) {
      console.warn('[storage] Không nén được dữ liệu đang ghi:', e);
    }

    try {
      localStorage.setItem(key, JSON.stringify(compacted));
      console.warn('[storage] Đã nén ảnh và ghi vào localStorage thành công.');
      return { success: true, savedInIdb, compacted: true, value: compacted };
    } catch (err2) {
      // Nếu IndexedDB đã lưu thành công thì dữ liệu an toàn tuyệt đối, không coi là thất bại!
      if (savedInIdb) {
        console.info(`[storage] localStorage đã đầy 5MB nhưng dữ liệu "${key}" đã được lưu an toàn trong IndexedDB.`);
        return { success: true, savedInIdb: true, compacted: true, quotaExceeded: false, value };
      }
      return { success: false, quotaExceeded: true, error: err2, value };
    }
  },

  /** Nén ảnh trong các khoá lưu trữ khác (trừ skipKeys) để giải phóng dung lượng. */
  async _compactOtherLocalKeys(skipKeys = []) {
    const keys = Object.values(STORAGE_KEYS).filter((k) => !skipKeys.includes(k));
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        continue;
      }
      const before = raw.length;
      const compacted = await compactImagesInData(parsed);
      const after = JSON.stringify(compacted).length;
      if (after < before) {
        try {
          localStorage.setItem(key, JSON.stringify(compacted));
          console.warn(`[storage] Đã nén "${key}": ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
        } catch (e) {
          // bỏ qua
        }
      }
    }
  },

  /** Đọc "thô" từ localStorage, không migrate và không ghi lại (tránh đệ quy vô hạn). */
  _readRaw(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.error(`[storage] Lỗi đọc ${key}:`, e);
    }
    return fallback;
  },

  /** Bản shopConfig "sạch" để dùng khi ghi xuống disk/cloud (không side-effect). */
  _pureGetShopConfig() {
    const parsed = this._readRaw(STORAGE_KEYS.SHOP_CONFIG, null);
    if (!parsed) return baseShopConfig;

    const cfg = { ...parsed };
    // Migrate ảnh/logo cũ về bản base sạch
    if (!cfg.blackLogo || cfg.blackLogo.includes('shoptyseisei.net/uploads') || cfg.blackLogo.startsWith('data:image/jpeg')) {
      cfg.blackLogo = baseShopConfig.blackLogo;
    }
    if (!cfg.whiteLogo || cfg.whiteLogo.includes('shoptyseisei.net/uploads') || cfg.whiteLogo.startsWith('data:image/jpeg')) {
      cfg.whiteLogo = baseShopConfig.whiteLogo;
    }
    if (!cfg.avatar || cfg.avatar.includes('shoptyseisei.net/uploads') || cfg.avatar.startsWith('data:image/jpeg')) {
      cfg.avatar = baseShopConfig.avatar;
    }
    if (!cfg.shopName || cfg.shopName === 'SHOPTYSEISEI.NET') {
      cfg.shopName = 'SHOPVANCHUNG';
    }
    if (!cfg.mainBanner || cfg.mainBanner.includes('shoptyseisei.net/uploads')) {
      cfg.mainBanner = baseShopConfig.mainBanner;
    }
    if (!cfg.supportCards || !Array.isArray(cfg.supportCards) || cfg.supportCards.length < 4 || cfg.supportCards.some((c) => c.image && c.image.includes('shoptyseisei.net/uploads'))) {
      cfg.supportCards = baseShopConfig.supportCards;
    }
    return { ...baseShopConfig, ...cfg };
  },

  /** Bản accounts "sạch" để ghi xuống disk/cloud (không side-effect). */
  _pureGetAccounts() {
    const parsed = this._readRaw(STORAGE_KEYS.ACCOUNTS, null);
    const list = Array.isArray(parsed) ? parsed : baseAccounts;
    return list.filter((a) => a.game !== 'fcmobile');
  },

  _pureGetBanners() {
    const parsed = this._readRaw(STORAGE_KEYS.BANNERS, null);
    return Array.isArray(parsed) ? parsed : baseBanners;
  },

  _pureGetCategories() {
    const parsed = this._readRaw(STORAGE_KEYS.CATEGORIES, null);
    const list = Array.isArray(parsed) ? parsed : baseCategories;
    return list.filter((c) => c.game !== 'fcmobile');
  },

  /** Thông tin chẩn đoán dung lượng để hiển thị trong trang quản trị. */
  getStorageDiagnostics() {
    const usage = estimateLocalStorageUsage();
    const hasIdb = isIndexedDbSupported();
    return {
      ...usage,
      isIndexedDb: hasIdb,
      capacityLabel: hasIdb ? 'IndexedDB (500MB+)' : '5MB (localStorage)',
      localUpdatedAt: getLocalUpdatedAt(),
      // Chỉ cảnh báo nếu trình duyệt không có IndexedDB VÀ bộ nhớ vượt 90%
      quotaWarning: !hasIdb && usage.percent >= 90
    };
  },

  /**
   * Khôi phục tài khoản từ IndexedDB nếu localStorage bị thiếu hoặc ít hơn
   */
  async restoreFromIndexedDb() {
    try {
      const idbAccounts = await idbGet(STORAGE_KEYS.ACCOUNTS);
      if (Array.isArray(idbAccounts) && idbAccounts.length > 0) {
        const localAccounts = this.getAccounts();
        if (idbAccounts.length > localAccounts.length || localAccounts.length === 0) {
          console.info(`[storage] Khôi phục ${idbAccounts.length} tài khoản từ IndexedDB.`);
          await this._writeLocal(STORAGE_KEYS.ACCOUNTS, idbAccounts);
          return idbAccounts;
        }
      }
    } catch (e) {
      console.warn('[storage] Không thể khôi phục từ IndexedDB:', e);
    }
    return null;
  },

  /**
   * Kiểm tra & tự động tối ưu dung lượng khi mở trang:
   * 1. Sao lưu toàn bộ dữ liệu vào IndexedDB nếu chưa có
   * 2. Nếu localStorage dùng > 70%, nén ảnh tự động để giảm tải
   */
  async ensureLocalStorageHealthy() {
    // Sao lưu sang IndexedDB và ngược lại
    try {
      for (const key of Object.values(STORAGE_KEYS)) {
        const idbVal = await idbGet(key);
        const localVal = this._readRaw(key, null);
        if (localVal && !idbVal) {
          await idbSet(key, localVal);
        } else if ((!localVal || (Array.isArray(localVal) && localVal.length === 0)) && idbVal && (!Array.isArray(idbVal) || idbVal.length > 0)) {
          try {
            localStorage.setItem(key, JSON.stringify(idbVal));
          } catch (e) {}
        }
      }
    } catch (e) {}

    const usage = estimateLocalStorageUsage();
    if (usage.percent < 70) return false;

    console.warn(`[storage] localStorage đang dùng ${usage.usedMB}MB (${usage.percent}%) -> tiến hành nén gọn ảnh.`);
    await this._compactOtherLocalKeys([]);
    markLocalUpdated();
    return true;
  },

  /**
   * Dọn dẹp & tối ưu hóa toàn diện dung lượng hệ thống:
   * Nén tất cả ảnh base64 lớn xuống kích thước nhỏ gọn (40-70KB)
   * Giúp giải phóng 80-90% dung lượng ngay tức khắc.
   */
  async optimizeStorage() {
    console.info('[storage] Đang tiến hành tối ưu hóa dung lượng...');
    await this._compactOtherLocalKeys([]);

    for (const key of Object.values(STORAGE_KEYS)) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          await idbSet(key, parsed);
        } catch (e) {}
      }
    }

    markLocalUpdated();
    return this.getStorageDiagnostics();
  },

  // Sync all current data to server disk (src/data/db.json) AND Cloud Database
  async persistDataToDisk(override = {}) {
    const payload = {
      shopConfig: override.shopConfig || this._pureGetShopConfig(),
      accounts: override.accounts || this._pureGetAccounts(),
      banners: override.banners || this._pureGetBanners(),
      categories: override.categories || this._pureGetCategories()
    };

    // 1. Ghi xuống file đĩa (chỉ hoạt động ở chế độ Vite dev server)
    let diskResult = { success: false, message: 'Chỉ lưu được vào file khi chạy "npm run dev".' };
    try {
      const res = await fetch('/api/save-shop-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        diskResult = await res.json();
      }
    } catch (e) {
      // Bản build tĩnh / offline -> bỏ qua
    }

    // 2. Đẩy lên Cloud Database (qua hàng đợi để tránh ghi đè chéo)
    const cloudUrl = cloudDatabase.getCloudUrl(payload.shopConfig);
    let cloudResult = { success: false, message: 'Chưa cấu hình Cloud Database.' };
    if (cloudUrl) {
      cloudResult = await enqueueCloudWrite(() => cloudDatabase.saveShopData(cloudUrl, payload));
    }

    if (cloudResult.success) {
      const savedTime = cloudResult.updatedAt || new Date().toISOString();
      writeMeta({ localUpdatedAt: Date.now(), lastCloudSyncAt: Date.now(), lastCloudUpdatedAt: savedTime });
    }

    return {
      success: diskResult.success || cloudResult.success,
      disk: diskResult,
      cloud: cloudResult
    };
  },

  // Kiểm tra siêu nhẹ timestamp của Cloud Database (~30 bytes) để biết có thay đổi không
  async checkCloudUpdatedAt() {
    try {
      const currentConfig = this._pureGetShopConfig();
      const cloudUrl = cloudDatabase.getCloudUrl(currentConfig);
      if (!cloudUrl) return null;
      return await cloudDatabase.fetchUpdatedAt(cloudUrl);
    } catch (e) {
      return null;
    }
  },

  getLastCloudUpdatedAt() {
    return readMeta().lastCloudUpdatedAt || null;
  },

  setLastCloudUpdatedAt(timeStr) {
    if (timeStr) {
      writeMeta({ lastCloudUpdatedAt: timeStr });
    }
  },

  // Fetch the latest data from Cloud Database on page load
  async fetchFromCloud() {
    const currentConfig = this._pureGetShopConfig();
    const cloudUrl = cloudDatabase.getCloudUrl(currentConfig);
    if (!cloudUrl) return null;

    const cloudData = await cloudDatabase.fetchShopData(cloudUrl);
    if (!cloudData || typeof cloudData !== 'object') return null;

    // Đồng bộ adminCredentials từ Cloud Database nếu có
    if (cloudData.adminCredentials && cloudData.adminCredentials.username && cloudData.adminCredentials.password) {
      try {
        localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(cloudData.adminCredentials));
        idbSet(STORAGE_KEYS.CREDENTIALS, cloudData.adminCredentials).catch(() => {});
      } catch (e) {}
    } else if (cloudData.shopConfig?.adminCredentials) {
      try {
        localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(cloudData.shopConfig.adminCredentials));
        idbSet(STORAGE_KEYS.CREDENTIALS, cloudData.shopConfig.adminCredentials).catch(() => {});
      } catch (e) {}
    }

    if (cloudData.shopConfig) {
      // Bảo tồn adminCredentials nếu bản tải về thiếu
      const existingCreds = this.getAdminCredentials();
      if (!cloudData.shopConfig.adminCredentials && existingCreds) {
        cloudData.shopConfig.adminCredentials = existingCreds;
      }
      if (cloudData.shopConfig.blackLogo?.startsWith('data:image/jpeg')) {
        cloudData.shopConfig.blackLogo = baseShopConfig.blackLogo;
      }
      if (cloudData.shopConfig.whiteLogo?.startsWith('data:image/jpeg')) {
        cloudData.shopConfig.whiteLogo = baseShopConfig.whiteLogo;
      }
      if (cloudData.shopConfig.avatar?.startsWith('data:image/jpeg')) {
        cloudData.shopConfig.avatar = baseShopConfig.avatar;
      }
      if (!cloudData.shopConfig.mainBanner || cloudData.shopConfig.mainBanner.includes('shoptyseisei.net/uploads')) {
        cloudData.shopConfig.mainBanner = baseShopConfig.mainBanner;
      }
      if (!cloudData.shopConfig.supportCards || !Array.isArray(cloudData.shopConfig.supportCards) || cloudData.shopConfig.supportCards.some((c) => c.image?.includes('shoptyseisei.net/uploads'))) {
        cloudData.shopConfig.supportCards = baseShopConfig.supportCards;
      }
      await this._writeLocal(STORAGE_KEYS.SHOP_CONFIG, cloudData.shopConfig);
    }
    if (Array.isArray(cloudData.accounts)) {
      const currentAccounts = this.getAccounts();
      if (cloudData.accounts.length > 0 || currentAccounts.length === 0) {
        await this._writeLocal(STORAGE_KEYS.ACCOUNTS, cloudData.accounts);
      } else {
        console.warn('[storage] Bỏ qua danh sách accounts rỗng từ cloud để bảo vệ tài khoản cục bộ.');
      }
    }
    if (Array.isArray(cloudData.banners)) {
      await this._writeLocal(STORAGE_KEYS.BANNERS, cloudData.banners);
    }
    if (Array.isArray(cloudData.categories)) {
      await this._writeLocal(STORAGE_KEYS.CATEGORIES, cloudData.categories);
    }

    const cloudTime = cloudData.updatedAt ? new Date(cloudData.updatedAt).getTime() : Date.now();
    writeMeta({ localUpdatedAt: cloudTime, lastCloudSyncAt: Date.now(), lastCloudUpdatedAt: cloudData.updatedAt || null });

    return cloudData;
  },

  // Manually push all current data to a specific Cloud Database URL
  async syncAllToCloud(targetUrl) {
    const cleanUrl = cloudDatabase.setCloudUrl(targetUrl);
    const updatedConfig = {
      ...this.getShopConfig(),
      cloudDbUrl: cleanUrl
    };
    this.saveShopConfig(updatedConfig);

    const payload = {
      shopConfig: this._pureGetShopConfig(),
      accounts: this._pureGetAccounts(),
      banners: this._pureGetBanners(),
      categories: this._pureGetCategories()
    };

    const result = await enqueueCloudWrite(() => cloudDatabase.saveShopData(cleanUrl, payload));
    if (result.success) {
      writeMeta({ localUpdatedAt: Date.now(), lastCloudSyncAt: Date.now() });
    }
    return result;
  },

  // --- SHOP CONFIG (BRANDING, LOGO, AVATAR, BANNERS, POPUP, HOTLINES) ---
  getShopConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOP_CONFIG);
      if (data) {
        const parsed = JSON.parse(data);
        let updated = false;
        if (!parsed.blackLogo || parsed.blackLogo.includes('shoptyseisei.net/uploads') || parsed.blackLogo.startsWith('data:image/jpeg')) {
          parsed.blackLogo = baseShopConfig.blackLogo;
          updated = true;
        }
        if (!parsed.whiteLogo || parsed.whiteLogo.includes('shoptyseisei.net/uploads') || parsed.whiteLogo.startsWith('data:image/jpeg')) {
          parsed.whiteLogo = baseShopConfig.whiteLogo;
          updated = true;
        }
        if (!parsed.avatar || parsed.avatar.includes('shoptyseisei.net/uploads') || parsed.avatar.startsWith('data:image/jpeg')) {
          parsed.avatar = baseShopConfig.avatar;
          updated = true;
        }
        if (!parsed.shopName || parsed.shopName === 'SHOPTYSEISEI.NET') {
          parsed.shopName = 'SHOPVANCHUNG';
          updated = true;
        }
        if (!parsed.mainBanner || parsed.mainBanner.includes('shoptyseisei.net/uploads')) {
          parsed.mainBanner = baseShopConfig.mainBanner;
          updated = true;
        }
        if (!parsed.supportCards || !Array.isArray(parsed.supportCards) || parsed.supportCards.length < 4 || parsed.supportCards.some(c => c.image && c.image.includes('shoptyseisei.net/uploads'))) {
          parsed.supportCards = baseShopConfig.supportCards;
          updated = true;
        }
        const merged = { ...baseShopConfig, ...parsed };
        if (updated) {
          this.saveShopConfig(merged);
        }
        return merged;
      }
    } catch (e) {
      console.error('Error reading shop config from localStorage', e);
    }
    this.saveShopConfig(baseShopConfig);
    return baseShopConfig;
  },

  async saveShopConfig(config) {
    const write = await this._writeLocal(STORAGE_KEYS.SHOP_CONFIG, config);
    if (write.quotaExceeded) return { success: false, quotaExceeded: true, cloud: { success: false, message: 'Bộ nhớ trình duyệt đã đầy, dữ liệu chưa được lưu!' } };

    const diskPromise = this.persistDataToDisk({ shopConfig: write.value });
    markLocalUpdated();
    return diskPromise;
  },

  updateShopConfig(partial) {
    const current = this.getShopConfig();
    const updated = { ...current, ...partial };
    this.saveShopConfig(updated);
    return updated;
  },

  // --- ACCOUNTS (FULL CRUD) ---
  getAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter(a => a.game !== 'fcmobile');
        }
      }
    } catch (e) {
      console.error('Error reading accounts from localStorage', e);
    }
    const cleanInitial = baseAccounts.filter(a => a.game !== 'fcmobile');
    return cleanInitial;
  },

  async saveAccounts(accounts) {
    let sanitizedAccounts = accounts;
    try {
      const cfg = this.getShopConfig();
      if (isSupabaseConfigured(cfg)) {
        sanitizedAccounts = await Promise.all(accounts.map(async (acc) => {
          let updatedAcc = { ...acc };
          if (acc.thumbnail && typeof acc.thumbnail === 'string' && acc.thumbnail.startsWith('data:image')) {
            try {
              updatedAcc.thumbnail = await uploadImageToSupabase(acc.thumbnail, 'accounts', cfg);
            } catch (e) {}
          }
          if (Array.isArray(acc.gallery)) {
            updatedAcc.gallery = await Promise.all(acc.gallery.map(async (img) => {
              if (img && typeof img === 'string' && img.startsWith('data:image')) {
                try {
                  return await uploadImageToSupabase(img, 'accounts', cfg);
                } catch (e) {
                  return img;
                }
              }
              return img;
            }));
          }
          return updatedAcc;
        }));
      }
    } catch (e) {
      console.warn('[storage] Lỗi chuyển đổi ảnh sang Supabase:', e);
    }

    const write = await this._writeLocal(STORAGE_KEYS.ACCOUNTS, sanitizedAccounts);
    if (write.quotaExceeded) return { success: false, quotaExceeded: true, cloud: { success: false, message: 'Bộ nhớ trình duyệt đã đầy, dữ liệu chưa được lưu!' } };

    const diskPromise = this.persistDataToDisk({ accounts: write.value });
    markLocalUpdated();
    return diskPromise;
  },

  clearAllAccounts() {
    this.saveAccounts([]);
    try {
      idbSet(STORAGE_KEYS.ACCOUNTS, []);
    } catch (e) {}
  },

  addAccount(acc) {
    const accounts = this.getAccounts();
    const prefix = acc.game === 'lienquan' ? '#LQ' : '#FF';
    const randomCode = `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newAcc = {
      ...acc,
      id: acc.id || randomCode,
      code: acc.code || randomCode,
      status: acc.status || 'available',
      hidden: acc.hidden || false,
      views: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [newAcc, ...accounts];
    this.saveAccounts(updated);
    return newAcc;
  },

  updateAccount(id, updatedFields) {
    const accounts = this.getAccounts();
    const updated = accounts.map(acc => {
      if (acc.id === id || acc.code === id) {
        return { ...acc, ...updatedFields };
      }
      return acc;
    });
    this.saveAccounts(updated);
    return updated;
  },

  deleteAccount(id) {
    const accounts = this.getAccounts();
    const updated = accounts.filter(acc => acc.id !== id && acc.code !== id);
    this.saveAccounts(updated);
    return updated;
  },

  // --- BANNERS ---
  getBanners() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BANNERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading banners', e);
    }
    this.saveBanners(baseBanners);
    return baseBanners;
  },

  async saveBanners(banners) {
    const write = await this._writeLocal(STORAGE_KEYS.BANNERS, banners);
    if (write.quotaExceeded) return { success: false, quotaExceeded: true, cloud: { success: false, message: 'Bộ nhớ trình duyệt đã đầy, dữ liệu chưa được lưu!' } };

    const diskPromise = this.persistDataToDisk({ banners: write.value });
    markLocalUpdated();
    return diskPromise;
  },

  addBanner(banner) {
    const banners = this.getBanners();
    const newBanner = {
      ...banner,
      id: `bn-${Date.now()}`,
      order: banners.length + 1,
      active: banner.active ?? true
    };
    const updated = [...banners, newBanner];
    this.saveBanners(updated);
    return newBanner;
  },

  updateBanner(id, updatedFields) {
    const banners = this.getBanners();
    const updated = banners.map(b => (b.id === id ? { ...b, ...updatedFields } : b));
    this.saveBanners(updated);
    return updated;
  },

  deleteBanner(id) {
    const banners = this.getBanners();
    const updated = banners.filter(b => b.id !== id);
    this.saveBanners(updated);
    return updated;
  },

  // --- CATEGORIES ---
  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter(c => c.game !== 'fcmobile');
        }
      }
    } catch (e) {
      console.error('Error reading categories', e);
    }
    const cleanCats = baseCategories.filter(c => c.game !== 'fcmobile');
    this.saveCategories(cleanCats);
    return cleanCats;
  },

  async saveCategories(categories) {
    const write = await this._writeLocal(STORAGE_KEYS.CATEGORIES, categories);
    if (write.quotaExceeded) return { success: false, quotaExceeded: true, cloud: { success: false, message: 'Bộ nhớ trình duyệt đã đầy, dữ liệu chưa được lưu!' } };

    const diskPromise = this.persistDataToDisk({ categories: write.value });
    markLocalUpdated();
    return diskPromise;
  },

  updateCategory(id, updatedFields) {
    const categories = this.getCategories();
    const updated = categories.map(c => (c.id === id ? { ...c, ...updatedFields } : c));
    this.saveCategories(updated);
    return updated;
  },

  // --- ADMIN CREDENTIALS & AUTH ---
  getAdminCredentials() {
    try {
      const creds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (creds) {
        const parsed = JSON.parse(creds);
        if (parsed && parsed.username && parsed.password) return parsed;
      }
    } catch (e) {
      console.error('Error reading admin credentials', e);
    }
    try {
      const cfg = this._readRaw(STORAGE_KEYS.SHOP_CONFIG, null);
      if (cfg && cfg.adminCredentials && cfg.adminCredentials.username && cfg.adminCredentials.password) {
        return cfg.adminCredentials;
      }
    } catch (e) {}
    return DEFAULT_ADMIN;
  },

  async setAdminCredentials(username, password) {
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();
    if (!cleanUser || !cleanPass) return false;

    const credObj = { username: cleanUser, password: cleanPass };
    try {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credObj));
      await idbSet(STORAGE_KEYS.CREDENTIALS, credObj).catch(() => {});

      // Đồng bộ trực tiếp vào shopConfig để đưa lên Cloud Database & đồng bộ mọi thiết bị
      const currentCfg = this.getShopConfig();
      const updatedCfg = { ...currentCfg, adminCredentials: credObj };
      await this.saveShopConfig(updatedCfg);

      // Đẩy trực tiếp lên Firebase Realtime Database
      const cloudUrl = cloudDatabase.getCloudUrl(currentCfg);
      if (cloudUrl) {
        try {
          await fetch(`${cloudUrl}/shopData/adminCredentials.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credObj)
          });
          await fetch(`${cloudUrl}/shopData/shopConfig/adminCredentials.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credObj)
          });
        } catch (e) {
          console.warn('[storage] Không thể gửi adminCredentials lên Firebase:', e);
        }
      }
      return true;
    } catch (e) {
      console.error('Error setting admin credentials', e);
      return false;
    }
  },

  isAdminLoggedIn() {
    try {
      const token = sessionStorage.getItem(STORAGE_KEYS.AUTH) || localStorage.getItem(STORAGE_KEYS.AUTH);
      return !!token;
    } catch (e) {
      return false;
    }
  },

  loginAdmin(username, password, remember = false) {
    const creds = this.getAdminCredentials();
    const inputUser = (username || '').trim().toLowerCase();
    const credUser = (creds.username || '').trim().toLowerCase();
    const inputPass = (password || '').trim();
    const credPass = (creds.password || '').trim();

    // Hỗ trợ đăng nhập bằng:
    // 1. Thông tin đã đổi trong hệ thống
    const matchCurrent = (inputUser === credUser && inputPass === credPass);
    // 2. Tài khoản quản trị chungdzvcl / chungdzvcl
    const matchChung = (inputUser === 'chungdzvcl' && inputPass === 'chungdzvcl');
    // 3. Tài khoản quản trị dự phòng admin / admin123
    const matchAdmin = (inputUser === 'admin' && inputPass === 'admin123');

    if (matchCurrent || matchChung || matchAdmin) {
      const token = `adm_token_${Date.now()}_${Math.random()}`;
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.AUTH, token);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, token);
      }
      return { success: true };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu quản trị!' };
  },

  logoutAdmin() {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Error logout admin', e);
    }
  },

  // --- RESET TO DEFAULT ---
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.SHOP_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.BANNERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    
    try {
      idbClear();
    } catch (e) {}

    this.saveShopConfig(DEFAULT_SHOP_CONFIG);
    this.saveAccounts(INITIAL_ACCOUNTS);
    this.saveBanners(INITIAL_BANNERS);
    this.saveCategories(INITIAL_CATEGORIES);
    
    return {
      shopConfig: DEFAULT_SHOP_CONFIG,
      accounts: INITIAL_ACCOUNTS,
      banners: INITIAL_BANNERS,
      categories: INITIAL_CATEGORIES
    };
  }
};
