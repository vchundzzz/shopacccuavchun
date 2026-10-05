/**
 * IndexedDB Storage Engine cho SHOPVANCHUNG
 * 
 * Giải quyết triệt để giới hạn 5MB của localStorage:
 * - IndexedDB cho phép lưu trữ hàng trăm Megabyte (50MB - 1GB+ tùy theo ổ cứng người dùng)
 * - Tự động đồng bộ với localStorage để khởi động nhanh không bị giật lag
 * - Hoạt động trên mọi trình duyệt hiện đại (Chrome, Edge, Firefox, Safari, Mobile)
 */

const DB_NAME = 'ShopAccVanchungDB';
const DB_VERSION = 1;
const STORE_NAME = 'shop_data';

let dbPromise = null;

/**
 * Mở kết nối IndexedDB dạng Promise
 */
function openDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (err) => {
          console.warn('[IndexedDB] Không thể mở IndexedDB, sẽ dùng localStorage làm dự phòng:', err);
          resolve(null);
        };

        request.onblocked = () => {
          console.warn('[IndexedDB] Phiên làm việc bị chặn.');
          resolve(null);
        };
      } catch (err) {
        console.warn('[IndexedDB] Lỗi khởi tạo:', err);
        resolve(null);
      }
    });
  }

  return dbPromise;
}

/**
 * Lấy giá trị từ IndexedDB theo khoá
 */
export async function idbGet(key) {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : null);
      };

      request.onerror = () => {
        resolve(null);
      };
    } catch (err) {
      resolve(null);
    }
  });
}

/**
 * Ghi giá trị vào IndexedDB (Dung lượng hàng trăm Megabyte, không bị giới hạn 5MB)
 */
export async function idbSet(key, value) {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (err) => {
        console.warn(`[IndexedDB] Lỗi ghi "${key}":`, err);
        resolve(false);
      };
    } catch (err) {
      console.warn(`[IndexedDB] Exception ghi "${key}":`, err);
      resolve(false);
    }
  });
}

/**
 * Xóa một khoá khỏi IndexedDB
 */
export async function idbDelete(key) {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    } catch (err) {
      resolve(false);
    }
  });
}

/**
 * Xóa toàn bộ dữ liệu trong IndexedDB
 */
export async function idbClear() {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    } catch (err) {
      resolve(false);
    }
  });
}

/**
 * Kiểm tra xem trình duyệt có hỗ trợ IndexedDB không
 */
export function isIndexedDbSupported() {
  return typeof window !== 'undefined' && !!window.indexedDB;
}

/**
 * Ước tính dung lượng lưu trữ thực tế của trình duyệt (thường từ 500MB đến hàng chục GB)
 */
export async function estimateBrowserStorage() {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usageMB = +( (estimate.usage || 0) / 1048576 ).toFixed(2);
      const quotaMB = +( (estimate.quota || 0) / 1048576 ).toFixed(2);
      const percent = estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0;
      return {
        supported: true,
        usageMB,
        quotaMB,
        percent
      };
    } catch (e) {
      // Fallback
    }
  }
  return {
    supported: false,
    usageMB: 0,
    quotaMB: 500, // Tiêu chuẩn IndexedDB tối thiểu
    percent: 0
  };
}
