/**
 * Tiện ích xử lý và nén ảnh tải lên từ máy tính
 * Tự động scale và nén JPEG để tối ưu dung lượng lưu trữ trong localStorage (giảm từ vài MB xuống ~40-90KB)
 */

export const compressAndReadFile = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
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

        // Chuyển canvas thành base64 JPEG với quality tối ưu
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
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

export const processMultipleFiles = async (fileList, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
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
