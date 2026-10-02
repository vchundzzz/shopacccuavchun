import { DEFAULT_SHOP_CONFIG, INITIAL_ACCOUNTS, INITIAL_BANNERS, INITIAL_CATEGORIES } from '../data/seedData';

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

export const storage = {
  // --- SHOP CONFIG (BRANDING, LOGO, AVATAR, BANNERS, POPUP, HOTLINES) ---
  getShopConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOP_CONFIG);
      if (data) {
        const parsed = JSON.parse(data);
        let updated = false;
        // Migrate old shoptyseisei logos and branding to SHOPVANCHUNG
        if (!parsed.blackLogo || parsed.blackLogo.includes('shoptyseisei.net/uploads')) {
          parsed.blackLogo = DEFAULT_SHOP_CONFIG.blackLogo;
          updated = true;
        }
        if (!parsed.whiteLogo || parsed.whiteLogo.includes('shoptyseisei.net/uploads')) {
          parsed.whiteLogo = DEFAULT_SHOP_CONFIG.whiteLogo;
          updated = true;
        }
        if (!parsed.avatar || parsed.avatar.includes('shoptyseisei.net/uploads')) {
          parsed.avatar = DEFAULT_SHOP_CONFIG.avatar;
          updated = true;
        }
        if (!parsed.shopName || parsed.shopName === 'SHOPTYSEISEI.NET') {
          parsed.shopName = 'SHOPVANCHUNG';
          updated = true;
        }
        const merged = { ...DEFAULT_SHOP_CONFIG, ...parsed };
        if (updated) {
          this.saveShopConfig(merged);
        }
        return merged;
      }
    } catch (e) {
      console.error('Error reading shop config from localStorage', e);
    }
    this.saveShopConfig(DEFAULT_SHOP_CONFIG);
    return DEFAULT_SHOP_CONFIG;
  },

  saveShopConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOP_CONFIG, JSON.stringify(config));
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
        const filtered = parsed.filter(a => a.game !== 'fcmobile');
        // Ensure MS 87898 and the new accounts are present
        const has87898 = filtered.some(a => a.id === '87898' || a.code === '87898');
        if (!has87898) {
          const freshAccounts = INITIAL_ACCOUNTS.filter(a => a.game !== 'fcmobile');
          const merged = [...freshAccounts.slice(0, 6), ...filtered];
          this.saveAccounts(merged);
          return merged;
        }
        return filtered;
      }
    } catch (e) {
      console.error('Error reading accounts from localStorage', e);
    }
    const cleanInitial = INITIAL_ACCOUNTS.filter(a => a.game !== 'fcmobile');
    this.saveAccounts(cleanInitial);
    return cleanInitial;
  },

  saveAccounts(accounts) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
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
    const accounts = this.getAccounts();
    const updated = accounts.filter(acc => acc.id !== id && acc.code !== id);
    this.saveAccounts(updated);
    return updated;
  },

  toggleAccountSold(id) {
    const accounts = this.getAccounts();
    const updated = accounts.map(acc => {
      if (acc.id === id || acc.code === id) {
        const nextStatus = acc.status === 'sold' ? 'available' : 'sold';
        return { ...acc, status: nextStatus };
      }
      return acc;
    });
    this.saveAccounts(updated);
    return updated;
  },

  toggleAccountHidden(id) {
    const accounts = this.getAccounts();
    const updated = accounts.map(acc => {
      if (acc.id === id || acc.code === id) {
        return { ...acc, hidden: !acc.hidden };
      }
      return acc;
    });
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
    this.saveBanners(INITIAL_BANNERS);
    return INITIAL_BANNERS;
  },

  saveBanners(banners) {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
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
    const cleanCats = INITIAL_CATEGORIES.filter(c => c.game !== 'fcmobile');
    this.saveCategories(cleanCats);
    return cleanCats;
  },

  saveCategories(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
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
