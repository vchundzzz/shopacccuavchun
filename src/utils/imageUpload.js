/**
 * Tiện ích xử lý và nén ảnh tải lên từ máy tính
 * Tự động scale và nén JPEG để tối ưu dung lượng lưu trữ trong localStorage (giảm từ vài MB xuống ~40-90KB)
 *
 * LƯU Ý QUAN TRỌNG:
 * localStorage của trình duyệt chỉ cho phép ~5MB (tính theo UTF-16, tức gấp đôi độ dài chuỗi).
 * Toàn bộ dữ liệu shop (shopConfig + accounts + categories) phải nằm gọn trong giới hạn này,
 * nếu không mọi thao tác ghi sẽ ném QuotaExceededError và dữ liệu sẽ "tự quay về" sau khi tải lại trang.
 * -> Mọi ảnh base64 đều cần được nén vưới IMAGE_BUDGET_BYTES.
 */

/**
 * Ngân sách dung lượng cho MỘT ảnh base64.
 *
 * localStorage chỉ cho phép ~5MB (tính theo UTF-16). Với 14 acc x 3 ảnh + banner + danh mục,
 * mỗi ảnh chỉ nên chiếm tối đa ~40KB để tổng nằm gọn trong giới hạn.
 * Ảnh 210KB/ảnh (mặc định cũ) khiến 42 ảnh = ~9MB -> vượt quota -> mất dữ liệu.
 */
export const IMAGE_BUDGET_BYTES = 40 * 1024; // ~40KB / ảnh

/** Ngưỡng coi là "ảnh quá nặng" cần nén lại (chặt hơn ngân sách để chừa biên an toàn). */
export const IMAGE_COMPRESS_THRESHOLD = IMAGE_BUDGET_BYTES * 0.6;

const scaleToFit = (width, height, maxWidth, maxHeight) => {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
};

/**
 * Nén lại một data-URL ảnh đã tồn tại (dùng để "chữa" ảnh cũ quá nặng trong db.json / localStorage).
 * Tự phát hiện ảnh có nền trong suốt để không làm hỏng logo PNG.
 * Luôn trả về chuỗi hợp lệ - nếu không nén được thì trả về nguyên đầu vào.
 */
export const compressDataUrl = (dataUrl, maxWidth = 900, maxHeight = 900, quality = 0.6) => {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    // Đã nhỏ gọn -> giữ nguyên, khỏi tốn công decode lại
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

        // Kiểm tra ảnh có pixel trong suốt không (logo PNG) -> phải giữ nền trong suốt
        let hasAlpha = false;
        try {
          const pixels = ctx.getImageData(0, 0, width, height).data;
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 250) { hasAlpha = true; break; }
          }
        } catch (e) {
          hasAlpha = dataUrl.startsWith('data:image/png') || dataUrl.startsWith('data:image/webp');
        }

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
 * Dùng để "làm sạch" dữ liệu trước khi ghi xuống localStorage hoặc đẩy lên Cloud Database.
 * Không mutate đối tượng gốc - trả về bản sao đã nén.
 */
export const compactImagesInData = async (value, options = {}) => {
  const { maxWidth = 900, maxHeight = 900, quality = 0.6, minBytes = IMAGE_COMPRESS_THRESHOLD } = options;

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

export const compressAndReadFile = (file, maxWidth = 900, maxHeight = 900, quality = 0.62) => {
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

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback nếu không tạo được canvas context
          return resolve(readerEvent.target.result);
        }

        // Vẽ ảnh lên canvas đã resize
        ctx.drawImage(img, 0, 0, width, height);

        // Kiểm tra nếu là ảnh có độ trong suốt (PNG, WebP, SVG) thì giữ nguyên định dạng để không bị đen nền
        const isTransparentFormat = file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/svg+xml';

        try {
          const compressedDataUrl = isTransparentFormat
            ? canvas.toDataURL(file.type === 'image/webp' ? 'image/webp' : 'image/png')
            : canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (e) {
          // Fallback sang định dạng ban đầu
          resolve(readerEvent.target.result);
        }
      };

      img.onerror = () => {
        // Fallback trực tiếp nếu không load được image object
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

export const processMultipleFiles = async (fileList, maxWidth = 900, maxHeight = 900, quality = 0.62) => {
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
