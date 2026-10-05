// Cloud Database Service - Firebase Realtime Database Connector
// Allows real-time live synchronization across all visitors and custom domains without any servers

const CLOUD_CONFIG_KEY = 'shop_cloud_db_url_v1';
export const DEFAULT_FIREBASE_URL = 'https://shopaccvchun-default-rtdb.asia-southeast1.firebasedatabase.app';

export const cloudDatabase = {
  // Normalize Firebase URL to ensure it has https:// and no trailing slash or /shopData.json
  normalizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    // Remove trailing slashes
    url = url.replace(/\/+$/, '');
    // If user pasted with .json, remove it
    url = url.replace(/\/[a-zA-Z0-9_\-]+\.json$/, '');
    return url;
  },

  // Get configured Cloud DB URL from localStorage or shopConfig
  getCloudUrl(shopConfig) {
    if (shopConfig?.cloudDbUrl) {
      return this.normalizeUrl(shopConfig.cloudDbUrl);
    }
    try {
      const local = localStorage.getItem(CLOUD_CONFIG_KEY);
      if (local) return this.normalizeUrl(local);
    } catch (e) {
      // ignore
    }
    return DEFAULT_FIREBASE_URL;
  },

  // Save Cloud DB URL
  setCloudUrl(url) {
    try {
      const clean = this.normalizeUrl(url);
      if (clean) {
        localStorage.setItem(CLOUD_CONFIG_KEY, clean);
      } else {
        localStorage.removeItem(CLOUD_CONFIG_KEY);
      }
      return clean;
    } catch (e) {
      return '';
    }
  },

  // Test connection to the Firebase Database
  async testConnection(rawUrl) {
    const baseUrl = this.normalizeUrl(rawUrl);
    if (!baseUrl) {
      return { success: false, message: 'Vui lòng nhập đường dẫn URL Firebase Realtime Database!' };
    }

    const testUrl = `${baseUrl}/ping.json`;
    const startTime = Date.now();

    try {
      // Test write ping
      const res = await fetch(testUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: true, timestamp: Date.now() })
      });

      const latency = Date.now() - startTime;

      if (res.ok) {
        return {
          success: true,
          latency,
          message: `Kết nối thành công tới Firebase Cloud Database! (Tốc độ phản hồi: ${latency}ms)`
        };
      } else {
        const errorText = await res.text();
        return {
          success: false,
          message: `Không thể ghi dữ liệu (Mã lỗi ${res.status}). Hãy đảm bảo Rules trong Firebase của bạn đã đặt read/write: true.`
        };
      }
    } catch (err) {
      return {
        success: false,
        message: `Lỗi kết nối mạng: ${err.message}. Vui lòng kiểm tra lại định dạng link URL.`
      };
    }
  },

  // Fetch all shop data from the Cloud Database
  async fetchShopData(rawUrl) {
    const baseUrl = this.normalizeUrl(rawUrl) || DEFAULT_FIREBASE_URL;
    if (!baseUrl) return null;

    const dataUrl = `${baseUrl}/shopData.json?t=${Date.now()}`;

    try {
      const res = await fetch(dataUrl, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && typeof data === 'object') {
        // Firebase Realtime DB tự động xóa các field có array rỗng []
        // Do đó nếu thiếu, chuẩn hóa về array rỗng [] để tránh bị khôi phục nhầm dữ liệu mẫu
        if (!data.accounts) {
          data.accounts = [];
        } else if (!Array.isArray(data.accounts) && typeof data.accounts === 'object') {
          data.accounts = Object.values(data.accounts);
        }

        if (!data.banners) {
          data.banners = [];
        } else if (!Array.isArray(data.banners) && typeof data.banners === 'object') {
          data.banners = Object.values(data.banners);
        }

        if (!data.categories) {
          data.categories = [];
        } else if (!Array.isArray(data.categories) && typeof data.categories === 'object') {
          data.categories = Object.values(data.categories);
        }

        return data;
      }
      return null;
    } catch (err) {
      console.warn('Lỗi tải dữ liệu từ Cloud Database:', err.message);
      return null;
    }
  },

  // Save all shop data to the Cloud Database
  async saveShopData(rawUrl, payload) {
    const baseUrl = this.normalizeUrl(rawUrl);
    if (!baseUrl) return { success: false, message: 'Chưa cấu hình URL Cloud Database' };

    const dataUrl = `${baseUrl}/shopData.json`;

    try {
      const enrichedPayload = {
        ...payload,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch(dataUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedPayload)
      });

      if (res.ok) {
        return { success: true, message: 'Đã lưu và đồng bộ lên đám mây thành công!' };
      } else {
        const errText = await res.text();
        return { success: false, message: `Lỗi lưu đám mây (${res.status}): ${errText}` };
      }
    } catch (err) {
      console.warn('Lỗi đồng bộ lên Cloud Database:', err.message);
      return { success: false, message: `Lỗi mạng khi lưu đám mây: ${err.message}` };
    }
  }
};
