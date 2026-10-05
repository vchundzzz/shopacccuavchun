import { DEFAULT_SHOP_CONFIG, INITIAL_ACCOUNTS, INITIAL_BANNERS, INITIAL_CATEGORIES } from '../data/seedData';
import dbData from '../data/db.json';
import { cloudDatabase } from './cloudDatabase';
import { compactImagesInData, estimateLocalStorageUsage } from '../utils/imageUpload';

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
 * Tránh việc nhiều thao tác CRUD chạy song song và ghi đè lẫn nhau (race condition),
 * khiến dữ liệu trên cloud bị "lùi" về bản cũ.
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
   * Ghi dữ liệu xuống localStorage, tự động xử lý vượt quota.
   * Chiến lược: ghi thẳng -> nếu QuotaExceededError thì nén toàn bộ ảnh base64 trong dữ liệu
   * (và các khoá khác) rồi thử lại. Trả về kết quả chi tiết để lớp giao diện báo lỗi.
   */
  async _writeLocal(key, value) {
    const json = JSON.stringify(value);

    // Đường đi nhanh: dữ liệu vừa phải -> ghi ngay
    try {
      localStorage.setItem(key, json);
      return { success: true, compacted: false, value };
    } catch (err) {
      if (!isQuotaExceeded(err)) {
        console.error(`[storage] Lỗi ghi ${key}:`, err);
        return { success: false, quotaExceeded: false, error: err };
      }
    }

    console.warn(`[storage] Vượt quota khi ghi "${key}" -> đang nén ảnh tự động...`);

    // QUAN TRỌNG: phải nén các khoá KHÁC trước, để giải phóng chỗ cho khoá đang ghi.
    // Nếu nén sau, thao tác setItem của chính khoá này vẫn luôn thất bại.
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
      console.warn('[storage] Đã nén ảnh và ghi lại thành công.');
      return { success: true, compacted: true, value: compacted };
    } catch (err2) {
      console.error(
        '[storage] Vẫn vượt quota sau khi nén. Dữ liệu chỉ được giữ trong RAM. ' +
        'Hãy dùng ảnh nhẹ hơn hoặc xoá bớt ảnh. Lỗi:', err2
      );
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
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
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
    return {
      ...usage,
      localUpdatedAt: getLocalUpdatedAt(),
      quotaWarning: usage.percent >= 80
    };
  },

  /**
   * Kiểm tra & tự chữa dung lượng localStorage.
   * Gọi một lần khi mở app: nén toàn bộ ảnh base64 đang lưu quá nặng.
   * Trả về true nếu có thay đổi (tức là cần đồng bộ lại lên cloud).
   */
  async ensureLocalStorageHealthy() {
    const usage = estimateLocalStorageUsage();
    if (!usage.overQuota && usage.percent < 85) return false;

    console.warn(`[storage] localStorage đang dùng ${usage.usedMB}MB (${usage.percent}%) -> tiến hành nén ảnh.`);
    await this._compactOtherLocalKeys([]);
    markLocalUpdated();
    return true;
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
      // Đồng bộ thành công -> mốc thời gian cục bộ không còn "mới hơn" cloud nữa
      writeMeta({ localUpdatedAt: Date.now(), lastCloudSyncAt: Date.now() });
    }

    return {
      success: diskResult.success || cloudResult.success,
      disk: diskResult,
      cloud: cloudResult
    };
  },

  // Fetch the latest data from Cloud Database on page load
  async fetchFromCloud() {
    const currentConfig = this._pureGetShopConfig();
    const cloudUrl = cloudDatabase.getCloudUrl(currentConfig);
    if (!cloudUrl) return null;

    const cloudData = await cloudDatabase.fetchShopData(cloudUrl);
    if (!cloudData || typeof cloudData !== 'object') return null;

    // CHỐNG GHI ĐÈ MẤT THAY ĐỔI CỤC BỘ:
    // Nếu admin vừa sửa trên máy này mà lần đồng bộ cloud bị lỗi (mạng/quota),
    // dữ liệu trên cloud sẽ cũ hơn -> tuyệt đối không ghi đè bản cục bộ.
    const localUpdatedAt = getLocalUpdatedAt();
    const cloudTime = cloudData.updatedAt ? new Date(cloudData.updatedAt).getTime() : 0;
    if (localUpdatedAt && cloudTime && cloudTime < localUpdatedAt) {
      console.warn('[storage] Dữ liệu trên cloud cũ hơn bản cục bộ -> giữ bản cục bộ để tránh mất dữ liệu vừa sửa.');
      return null;
    }

    if (cloudData.shopConfig) {
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
      await this._writeLocal(STORAGE_KEYS.ACCOUNTS, cloudData.accounts);
    }
    if (Array.isArray(cloudData.banners)) {
      await this._writeLocal(STORAGE_KEYS.BANNERS, cloudData.banners);
    }
    if (Array.isArray(cloudData.categories)) {
      await this._writeLocal(STORAGE_KEYS.CATEGORIES, cloudData.categories);
    }

    // Đồng bộ mốc thời gian cục bộ theo đúng bản vừa nhận từ cloud
    if (cloudTime) writeMeta({ localUpdatedAt: cloudTime, lastCloudSyncAt: Date.now() });

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
        // Migrate old shoptyseisei logos and branding to SHOPVANCHUNG, and strip opaque JPEG logos
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
        // Migrate old or broken external banners to clean local assets
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

    // Dùng bản đã nén để đẩy lên cloud -> payload nhẹ, upload nhanh, ít lỗi mạng
    const diskPromise = this.persistDataToDisk({ shopConfig: write.value });
    markLocalUpdated(); // luôn đánh dấu, kể cả khi vừa nén ảnh
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
        return parsed.filter(a => a.game !== 'fcmobile');
      }
    } catch (e) {
      console.error('Error reading accounts from localStorage', e);
    }
    const cleanInitial = baseAccounts.filter(a => a.game !== 'fcmobile');
    this.saveAccounts(cleanInitial);
    return cleanInitial;
  },

  async saveAccounts(accounts) {
    const write = await this._writeLocal(STORAGE_KEYS.ACCOUNTS, accounts);
    if (write.quotaExceeded) return { success: false, quotaExceeded: true, cloud: { success: false, message: 'Bộ nhớ trình duyệt đã đầy, dữ liệu chưa được lưu!' } };

    const diskPromise = this.persistDataToDisk({ accounts: write.value });
    markLocalUpdated(); // luôn đánh dấu, kể cả khi vừa nén ảnh
    return diskPromise;
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
        return JSON.parse(data);
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
    markLocalUpdated(); // luôn đánh dấu, kể cả khi vừa nén ảnh
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
        return parsed.filter(c => c.game !== 'fcmobile');
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
    markLocalUpdated(); // luôn đánh dấu, kể cả khi vừa nén ảnh
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
      if (creds) return JSON.parse(creds);
    } catch (e) {
      console.error('Error reading admin credentials', e);
    }
    return DEFAULT_ADMIN;
  },

  setAdminCredentials(username, password) {
    try {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify({ username, password }));
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
    if (username.trim() === creds.username && password === creds.password) {
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
