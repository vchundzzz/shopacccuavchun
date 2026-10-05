import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link, Check, RefreshCw, Cloud } from 'lucide-react';
import { compressAndReadFile } from '../utils/imageUpload';
import { isSupabaseConfigured, uploadImageToSupabase } from '../services/supabaseStorage';
import { storage } from '../services/storage';
import './ImageFileInput.css';

export default function ImageFileInput({
  value,
  onChange,
  label,
  aspectRatio = 'card', // 'banner' | 'card' | 'square' | 'wide'
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.72,
  folder = 'uploads',
  required = false
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const cfg = storage.getShopConfig();

      // Nếu đã cấu hình Supabase Storage -> Tải trực tiếp lên Cloud để lưu trữ không giới hạn!
      if (isSupabaseConfigured(cfg)) {
        try {
          setProcessingText('Đang đẩy ảnh lên Supabase Storage...');
          const publicUrl = await uploadImageToSupabase(file, folder, cfg);
          onChange(publicUrl);
          return;
        } catch (cloudErr) {
          console.warn('[ImageFileInput] Supabase upload lỗi, tự động chuyển sang nén cục bộ:', cloudErr);
        }
      }

      // Fallback nén nhẹ cục bộ nếu chưa có Supabase
      setProcessingText('Đang tối ưu và nén ảnh...');
      const compressedDataUrl = await compressAndReadFile(file, maxWidth, maxHeight, quality);
      onChange(compressedDataUrl);
    } catch (err) {
      alert('Không thể đọc tệp ảnh: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setIsProcessing(false);
      setProcessingText('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isCloudImage = value && value.includes('supabase.co');

  return (
    <div className="image-file-input-wrapper">
      {label && <label className="image-file-label">{label}</label>}

      {/* Drop / Click Area */}
      <div 
        className={`image-upload-dropzone ${isDragging ? 'is-dragging' : ''} ${value ? 'has-image' : ''} aspect-${aspectRatio}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {value ? (
          /* Preview Display */
          <div className="image-preview-container">
            <img src={value} alt="Preview" className="preview-img-element" />
            <div className="image-hover-overlay">
              <button 
                type="button" 
                className="btn-change-image"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <RefreshCw size={14} />
                <span>Đổi tệp khác</span>
              </button>
              <button 
                type="button" 
                className="btn-remove-image" 
                onClick={handleClear}
                title="Xóa ảnh này"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Upload Prompt */
          <div className="upload-prompt">
            {isProcessing ? (
              <div className="uploading-spinner">
                <RefreshCw size={24} className="spin-icon text-primary animate-spin" />
                <span>{processingText || 'Đang xử lý ảnh...'}</span>
              </div>
            ) : (
              <>
                <div className="upload-icon-circle">
                  <UploadCloud size={24} />
                </div>
                <div className="upload-text-group">
                  <span className="upload-main-text">Bấm để chọn tệp ảnh từ máy tính</span>
                  <span className="upload-sub-text">hoặc kéo thả ảnh PNG, JPG, WebP vào đây</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isCloudImage && (
        <div className="file-ready-badge text-xs text-cyan-400 font-semibold flex items-center gap-1.5 mt-1">
          <Cloud size={14} className="text-cyan-400" />
          <span>Ảnh đã được lưu trên Supabase Storage Cloud (Không tốn dung lượng máy).</span>
        </div>
      )}

      {value && !isCloudImage && value.startsWith('data:image') && (
        <div className="file-ready-badge text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
          <Check size={14} className="text-emerald-400" />
          <span>Đã tối ưu hóa nén ảnh! Bạn nhớ bấm nút "LƯU" để cập nhật.</span>
        </div>
      )}

      {/* Manual URL Link Toggle */}
      <div className="image-input-footer mt-1.5 flex items-center justify-between text-xs">
        <button 
          type="button" 
          className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          <Link size={12} />
          <span>{showUrlInput ? 'Ẩn ô dán link ảnh' : 'Dán đường dẫn ảnh Online (URL)'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="manual-url-box mt-2 flex gap-2">
          <input 
            type="url" 
            placeholder="https://example.com/anh-cua-ban.jpg"
            value={value && !value.startsWith('data:image') ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input flex-1 text-xs"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
          {value && !value.startsWith('data:image') && (
            <button 
              type="button" 
              className="btn-gaming-outline text-xs px-2.5"
              onClick={handleClear}
            >
              Xóa link
            </button>
          )}
        </div>
      )}
    </div>
  );
}
