import { DEFAULT_SHOP_CONFIG, INITIAL_ACCOUNTS, INITIAL_BANNERS, INITIAL_CATEGORIES } from '../data/seedData';
import dbData from '../data/db.json';
import { cloudDatabase } from './cloudDatabase';
import { supabaseService } from './supabaseService';
import { supabaseClient } from './supabaseClient';

const STORAGE_KEYS = {
  SHOP_CONFIG: 'shoptyseisei_config_v2',
  ACCOUNTS: 'shoptyseisei_accounts_v2',
  BANNERS: 'shoptyseisei_banners_v2',
  CATEGORIES: 'shoptyseisei_categories_v2',
  AUTH: 'shoptyseisei_auth_token_v2',
  CREDENTIALS: 'shoptyseisei_admin_creds_v2'
};

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

const baseShopConfig = dbData?.shopConfig || DEFAULT_SHOP_CONFIG;
const baseAccounts = dbData?.accounts || INITIAL_ACCOUNTS;
const baseBanners = dbData?.banners || INITIAL_BANNERS;
const baseCategories = dbData?.categories || INITIAL_CATEGORIES;

export const storage = {
  // Sync all current data to server disk (src/data/db.json), Supabase SQL, AND Cloud Database (Firebase)
  async persistDataToDisk(override = {}) {
    const payload = {
      shopConfig: override.shopConfig || this.getShopConfig(),
      accounts: override.accounts || this.getAccounts(),
      banners: override.banners || this.getBanners(),
      categories: override.categories || this.getCategories()
    };

    let diskResult = { success: false };
    let cloudResult = { success: false };
    let supabaseResult = { success: false };

    // 1. Save to local disk via Vite dev server middleware (if local)
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
      // Offline / static build
    }

    // 2. Save to Supabase (Cloud SQL) if configured
    if (supabaseClient.isConfigured(payload.shopConfig)) {
      supabaseResult = await supabaseService.saveAllData(payload, payload.shopConfig);
    }

    // 3. Save to Cloud Database (Firebase) if URL is configured
    const cloudUrl = cloudDatabase.getCloudUrl(payload.shopConfig);
    if (cloudUrl) {
      cloudResult = await cloudDatabase.saveShopData(cloudUrl, payload);
    }

    return {
      success: diskResult.success || cloudResult.success || supabaseResult.success,
      disk: diskResult,
      cloud: cloudResult,
      supabase: supabaseResult
    };
  },

  // Fetch the latest data from Cloud Database on page load (Supabase first, Firebase fallback)
  async fetchFromCloud() {
    const currentConfig = this.getShopConfig();

    // 1. Try Supabase (PostgreSQL Cloud SQL) first if configured
    if (supabaseClient.isConfigured(currentConfig)) {
      const supabaseData = await supabaseService.fetchShopData(currentConfig);
      if (supabaseData) {
        if (supabaseData.shopConfig) {
          localStorage.setItem(STORAGE_KEYS.SHOP_CONFIG, JSON.stringify(supabaseData.shopConfig));
        }
        if (Array.isArray(supabaseData.accounts)) {
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(supabaseData.accounts));
        }
        if (Array.isArray(supabaseData.banners)) {
          localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(supabaseData.banners));
        }
        if (Array.isArray(supabaseData.categories)) {
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(supabaseData.categories));
        }
        return supabaseData;
      }
    }

    // 2. Fallback to Firebase Realtime Database
    const cloudUrl = cloudDatabase.getCloudUrl(currentConfig);
    if (!cloudUrl) return null;

    const cloudData = await cloudDatabase.fetchShopData(cloudUrl);
    if (cloudData && typeof cloudData === 'object') {
      // Cache cloud data into localStorage so next visit is instant
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
        localStorage.setItem(STORAGE_KEYS.SHOP_CONFIG, JSON.stringify(cloudData.shopConfig));
      }
      if (Array.isArray(cloudData.accounts)) {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(cloudData.accounts));
      }
      if (Array.isArray(cloudData.banners)) {
        localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(cloudData.banners));
      }
      if (Array.isArray(cloudData.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cloudData.categories));
      }
      return cloudData;
    }
    return null;
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
      shopConfig: updatedConfig,
      accounts: this.getAccounts(),
      banners: this.getBanners(),
      categories: this.getCategories()
    };

    return await cloudDatabase.saveShopData(cleanUrl, payload);
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

  saveShopConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOP_CONFIG, JSON.stringify(config));
      return this.persistDataToDisk({ shopConfig: config });
    } catch (e) {
      console.error('Error saving shop config to localStorage', e);
    }
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

  saveAccounts(accounts) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      return this.persistDataToDisk({ accounts });
    } catch (e) {
      console.error('Error saving accounts to localStorage', e);
    }
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
    const cleanId = String(id);
    const accounts = this.getAccounts();
    const updated = accounts.filter(acc => String(acc.id) !== cleanId && String(acc.code) !== cleanId);
    this.saveAccounts(updated);
    supabaseService.deleteAccount(cleanId, this.getShopConfig());
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

  saveBanners(banners) {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
      return this.persistDataToDisk({ banners });
    } catch (e) {
      console.error('Error saving banners', e);
    }
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

  saveCategories(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return this.persistDataToDisk({ categories });
    } catch (e) {
      console.error('Error saving categories', e);
    }
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
