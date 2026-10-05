/**
 * Tiện ích xử lý và nén ảnh tải lên từ máy tính cho SHOPVANCHUNG
 * 
 * Tự động scale và tối ưu hóa ảnh thông minh:
 * - Ảnh chụp màn hình game / ảnh acc (không có vùng trong suốt): Luôn nén JPEG chất lượng cao (giảm từ 2.5MB xuống ~40-70KB)
 * - Logo / Sticker có nền trong suốt: Giữ nguyên định dạng PNG trong suốt
 * - Hỗ trợ cả Supabase Cloud Storage (không giới hạn) và lưu trữ cục bộ
 */

export const IMAGE_BUDGET_BYTES = 80 * 1024; // ~80KB / ảnh
export const IMAGE_COMPRESS_THRESHOLD = 50 * 1024; // 50KB

const scaleToFit = (width, height, maxWidth, maxHeight) => {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
};

/**
 * Kiểm tra xem canvas có pixel trong suốt thực sự hay không
 */
const checkHasAlphaTransparency = (ctx, width, height) => {
  try {
    const imgData = ctx.getImageData(0, 0, width, height).data;
    // Lấy mẫu nhanh cách quãng để tối ưu hiệu năng
    const step = Math.max(1, Math.floor(imgData.length / 5000));
    for (let i = 3; i < imgData.length; i += 4 * step) {
      if (imgData[i] < 250) {
        return true;
      }
    }
  } catch (e) {
    // Nếu bị lỗi bảo mật context (cross-origin), trả về false
  }
  return false;
};

/**
 * Nén lại một data-URL ảnh đã tồn tại (dùng để thu gọn dữ liệu cũ trong localStorage/IndexedDB).
 * Tự phát hiện ảnh có nền trong suốt để không làm hỏng logo PNG.
 */
export const compressDataUrl = (dataUrl, maxWidth = 1000, maxHeight = 1000, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    // Nếu ảnh đã nhỏ hơn ngưỡng nén, giữ nguyên
    if (dataUrl.length <= IMAGE_COMPRESS_THRESHOLD) {
      return resolve(dataUrl);
    }

    const img = new Image();

    img.onload = () => {
      try {
        const { width, height } = scaleToFit(img.width, img.height, maxWidth, maxHeight);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(dataUrl);

        ctx.drawImage(img, 0, 0, width, height);

        const hasAlpha = checkHasAlphaTransparency(ctx, width, height);

        const encoded = hasAlpha
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality);

        // Chỉ dùng kết quả mới nếu thực sự nhẹ hơn bản gốc
        resolve(encoded.length < dataUrl.length ? encoded : dataUrl);
      } catch (e) {
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

/**
 * Duyệt toàn bộ object/array và nén mọi ảnh base64 nặng bên trong.
 */
export const compactImagesInData = async (value, options = {}) => {
  const { maxWidth = 1000, maxHeight = 1000, quality = 0.7, minBytes = IMAGE_COMPRESS_THRESHOLD } = options;

  const walk = async (node) => {
    if (typeof node === 'string') {
      if (node.startsWith('data:image') && node.length > minBytes) {
        return compressDataUrl(node, maxWidth, maxHeight, quality);
      }
      return node;
    }
    if (Array.isArray(node)) {
      const out = [];
      for (const item of node) out.push(await walk(item));
      return out;
    }
    if (node && typeof node === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(node)) {
        out[k] = await walk(v);
      }
      return out;
    }
    return node;
  };

  return walk(value);
};

/** Kiểm tra chuỗi có phải ảnh base64 nặng hay không. */
export const isHeavyImage = (value, minBytes = IMAGE_COMPRESS_THRESHOLD) =>
  typeof value === 'string' && value.startsWith('data:image') && value.length > minBytes;

/**
 * Ước lượng dung lượng localStorage đang dùng (tính theo UTF-16 như trình duyệt).
 * Trả về { usedBytes, limitBytes, usedMB, percent, overQuota }
 */
export const estimateLocalStorageUsage = (limitBytes = 5 * 1024 * 1024) => {
  let usedBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key) || '';
      usedBytes += (key.length + value.length) * 2; // UTF-16 code unit = 2 byte
    }
  } catch (e) {
    console.warn('Không ước lượng được dung lượng localStorage:', e);
  }
  return {
    usedBytes,
    limitBytes,
    usedMB: +(usedBytes / 1048576).toFixed(2),
    percent: Math.min(100, Math.round((usedBytes / limitBytes) * 100)),
    overQuota: usedBytes >= limitBytes
  };
};

/**
 * Đọc và nén file ảnh tải lên từ máy tính:
 * - Tự động phát hiện ảnh có độ trong suốt (logo): giữ PNG
 * - Với ảnh chụp màn hình game (Free Fire, Liên Quân): chuyển sang JPEG chất lượng 0.72 giúp giảm từ 3MB xuống 40-70KB
 */
export const compressAndReadFile = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.72) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Không có tệp được chọn'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('Tệp tải lên không phải là định dạng hình ảnh hợp lệ'));
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Tính tỉ lệ co giãn ảnh
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          return resolve(readerEvent.target.result);
        }

        // Vẽ ảnh lên canvas đã resize
        ctx.drawImage(img, 0, 0, width, height);

        // Kiểm tra xem ảnh có trong suốt thật hay không
        let hasAlpha = false;
        if (file.type === 'image/png' || file.type === 'image/webp') {
          hasAlpha = checkHasAlphaTransparency(ctx, width, height);
        }

        try {
          // Nếu có pixel trong suốt (logo), giữ định dạng PNG
          // Với tất cả ảnh game không trong suốt (screenshots), dùng JPEG để dung lượng siêu nhẹ
          const compressedDataUrl = hasAlpha
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (e) {
          resolve(readerEvent.target.result);
        }
      };

      img.onerror = () => {
        resolve(readerEvent.target.result);
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Xử lý nén nhiều file ảnh cùng lúc
 */
export const processMultipleFiles = async (fileList, maxWidth = 1000, maxHeight = 1000, quality = 0.72) => {
  const files = Array.from(fileList);
  const results = [];

  for (const file of files) {
    try {
      const dataUrl = await compressAndReadFile(file, maxWidth, maxHeight, quality);
      results.push(dataUrl);
    } catch (err) {
      console.warn('Lỗi khi nén tệp ảnh:', file.name, err);
    }
  }

  return results;
};
