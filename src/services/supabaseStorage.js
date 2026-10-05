/**
 * Supabase Storage Service cho SHOPVANCHUNG
 * 
 * Cho phép lưu trữ hình ảnh không giới hạn trên Supabase Cloud Storage:
 * - Thay vì lưu ảnh Base64 nặng vài MB vào localStorage/db.json (gây lỗi vượt quota 5MB),
 *   ảnh được tải thẳng lên Supabase Bucket và trả về link Public URL siêu nhẹ (~80 bytes).
 * - Cung cấp CDN tốc độ cao, hiển thị ảnh siêu mượt trên cả điện thoại và máy tính.
 * - Miễn phí 1GB lưu trữ vĩnh viễn trên Supabase.
 */

import { createClient } from '@supabase/supabase-js';

// Cache client instance để tránh khởi tạo nhiều lần
let cachedClient = null;
let lastUrl = '';
let lastKey = '';

/**
 * Lấy cấu hình Supabase từ shopConfig hoặc biến môi trường
 */
export function getSupabaseCredentials(shopConfig = {}) {
  const url = shopConfig.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = shopConfig.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const bucket = shopConfig.supabaseBucket || import.meta.env.VITE_SUPABASE_BUCKET || 'shop-images';

  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
    bucket: bucket.trim() || 'shop-images'
  };
}

/**
 * Kiểm tra xem Supabase Storage đã được cấu hình chưa
 */
export function isSupabaseConfigured(shopConfig = {}) {
  const { url, anonKey } = getSupabaseCredentials(shopConfig);
  return Boolean(url && anonKey && url.includes('supabase.co'));
}

/**
 * Khởi tạo client Supabase
 */
export function getSupabaseClient(shopConfig = {}) {
  const { url, anonKey } = getSupabaseCredentials(shopConfig);
  if (!url || !anonKey) return null;

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('[SupabaseStorage] Lỗi khởi tạo client:', err);
    return null;
  }
}

/**
 * Kiểm tra kết nối và bucket trên Supabase
 */
export async function testSupabaseConnection(url, anonKey, bucket = 'shop-images') {
  if (!url || !anonKey) {
    return {
      success: false,
      message: 'Vui lòng nhập đầy đủ Supabase Project URL và Public Anon Key!'
    };
  }

  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  const cleanBucket = (bucket || 'shop-images').trim();

  try {
    const client = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false }
    });

    // Thử truy vấn danh sách file hoặc thông tin bucket
    const { data, error } = await client.storage.from(cleanBucket).list('', { limit: 1 });

    if (error) {
      if (error.message?.includes('not found') || error.message?.includes('Bucket')) {
        return {
          success: false,
          bucketMissing: true,
          message: `Kết nối thành công nhưng chưa tìm thấy bucket "${cleanBucket}". Hãy tạo bucket "${cleanBucket}" trên Supabase và bật chế độ "Public Bucket".`
        };
      }
      return {
        success: false,
        message: `Lỗi kết nối Supabase: ${error.message}`
      };
    }

    return {
      success: true,
      message: `Kết nối thành công tới Supabase Storage! Bucket "${cleanBucket}" sẵn sàng lưu ảnh.`
    };
  } catch (err) {
    return {
      success: false,
      message: `Không thể kết nối Supabase: ${err.message || 'Lỗi mạng'}`
    };
  }
}

/**
 * Chuyển đổi File hoặc dataURL thành Blob đã tối ưu dung lượng (để upload siêu nhanh)
 */
async function fileToOptimizedBlob(fileOrDataUrl, maxWidth = 1280, maxHeight = 1280, quality = 0.75) {
  return new Promise((resolve, reject) => {
    // Nếu là File từ <input type="file" />
    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(fileOrDataUrl);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(fileOrDataUrl);

        ctx.drawImage(img, 0, 0, width, height);

        // Kiểm tra xem ảnh có trong suốt hay không
        let isPng = fileOrDataUrl.type === 'image/png';
        if (isPng) {
          try {
            const data = ctx.getImageData(0, 0, width, height).data;
            let hasAlpha = false;
            for (let i = 3; i < data.length; i += 20) {
              if (data[i] < 250) { hasAlpha = true; break; }
            }
            if (!hasAlpha) isPng = false;
          } catch (e) {
            isPng = false;
          }
        }

        const mime = isPng ? 'image/png' : 'image/jpeg';
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ blob, extension: isPng ? 'png' : 'jpg', contentType: mime });
          } else {
            resolve({ blob: fileOrDataUrl, extension: 'jpg', contentType: 'image/jpeg' });
          }
        }, mime, quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ blob: fileOrDataUrl, extension: 'jpg', contentType: 'image/jpeg' });
      };

      img.src = objectUrl;
      return;
    }

    // Nếu là Base64 Data URL
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:image')) {
      const isPng = fileOrDataUrl.startsWith('data:image/png');
      const arr = fileOrDataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || (isPng ? 'image/png' : 'image/jpeg');
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      resolve({ blob, extension: isPng ? 'png' : 'jpg', contentType: mime });
      return;
    }

    reject(new Error('Dữ liệu ảnh không hợp lệ'));
  });
}

/**
 * Tải một ảnh lên Supabase Storage
 * Trả về đường link Public URL có thể truy cập toàn cầu
 */
export async function uploadImageToSupabase(fileOrDataUrl, folder = 'accounts', shopConfig = {}) {
  const { bucket } = getSupabaseCredentials(shopConfig);
  const client = getSupabaseClient(shopConfig);

  if (!client) {
    throw new Error('Chưa cấu hình Supabase Storage! Vui lòng vào mục "Database Đám Mây" để nhập URL và Anon Key.');
  }

  // Chuyển ảnh thành Blob đã tối ưu
  const { blob, extension, contentType } = await fileToOptimizedBlob(fileOrDataUrl);

  // Tạo tên file duy nhất theo timestamp và chuỗi ngẫu nhiên
  const randomStr = Math.random().toString(36).substring(2, 9);
  const fileName = `${folder}/${Date.now()}_${randomStr}.${extension}`;

  // Đẩy lên Supabase Storage
  const { data, error } = await client.storage
    .from(bucket)
    .upload(fileName, blob, {
      contentType,
      cacheControl: '31536000', // Cache 1 năm trên CDN
      upsert: true
    });

  if (error) {
    console.error('[SupabaseStorage] Lỗi upload:', error);
    throw new Error(`Upload ảnh lên Supabase thất bại: ${error.message}`);
  }

  // Lấy đường dẫn công khai (Public URL)
  const { data: publicData } = client.storage
    .from(bucket)
    .getPublicUrl(fileName);

  if (!publicData || !publicData.publicUrl) {
    throw new Error('Không lấy được Public URL từ Supabase');
  }

  return publicData.publicUrl;
}

/**
 * Tải đồng thời nhiều ảnh lên Supabase Storage
 */
export async function uploadMultipleImagesToSupabase(fileList, folder = 'accounts', shopConfig = {}) {
  const files = Array.from(fileList);
  const results = [];

  for (const file of files) {
    try {
      const publicUrl = await uploadImageToSupabase(file, folder, shopConfig);
      results.push(publicUrl);
    } catch (err) {
      console.warn('[SupabaseStorage] Bỏ qua 1 file lỗi:', err);
    }
  }

  return results;
}
