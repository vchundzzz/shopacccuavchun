import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  URL: 'shop_supabase_url',
  ANON_KEY: 'shop_supabase_anon_key'
};

// Default Supabase project configuration for vanchung.click
const DEFAULT_URL = 'https://gkkonaaxggjulbutweoc.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_tY5YIukRNlmkJ21GkVQLeA_1ALvNmu8';

const ENV_URL = import.meta.env?.VITE_SUPABASE_URL || DEFAULT_URL;
const ENV_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

let cachedClient = null;
let currentUrl = '';
let currentKey = '';

export const supabaseClient = {
  getCredentials(shopConfig) {
    const url = shopConfig?.supabaseUrl || localStorage.getItem(STORAGE_KEYS.URL) || ENV_URL || DEFAULT_URL;
    const anonKey = shopConfig?.supabaseAnonKey || localStorage.getItem(STORAGE_KEYS.ANON_KEY) || ENV_ANON_KEY || DEFAULT_ANON_KEY;
    return {
      url: url.trim(),
      anonKey: anonKey.trim()
    };
  },

  setCredentials(url, anonKey) {
    try {
      if (url && anonKey) {
        localStorage.setItem(STORAGE_KEYS.URL, url.trim());
        localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.URL);
        localStorage.removeItem(STORAGE_KEYS.ANON_KEY);
      }
      cachedClient = null;
      currentUrl = '';
      currentKey = '';
    } catch (e) {
      console.warn('Could not save Supabase credentials', e);
    }
  },

  getClient(shopConfig) {
    const { url, anonKey } = this.getCredentials(shopConfig);
    if (!url || !anonKey) return null;

    if (cachedClient && currentUrl === url && currentKey === anonKey) {
      return cachedClient;
    }

    try {
      cachedClient = createClient(url, anonKey);
      currentUrl = url;
      currentKey = anonKey;
      return cachedClient;
    } catch (err) {
      console.error('Lỗi khởi tạo Supabase Client:', err);
      return null;
    }
  },

  isConfigured(shopConfig) {
    const { url, anonKey } = this.getCredentials(shopConfig);
    return Boolean(url && anonKey);
  }
};
