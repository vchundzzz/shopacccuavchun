import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link, Check, RefreshCw } from 'lucide-react';
import { compressAndReadFile } from '../utils/imageUpload';
import './ImageFileInput.css';

export default function ImageFileInput({
  value,
  onChange,
  label,
  aspectRatio = 'card', // 'banner' | 'card' | 'square' | 'wide'
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
  required = false
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressAndReadFile(file, maxWidth, maxHeight, quality);
      onChange(compressedDataUrl);
    } catch (err) {
      alert('Không thể đọc tệp ảnh: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setIsProcessing(false);
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
                <RefreshCw size={24} className="spin-icon text-primary" />
                <span>Đang xử lý và nén ảnh...</span>
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

      {value && value.startsWith('data:image') && (
        <div className="file-ready-badge text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
          <Check size={14} className="text-emerald-500" />
          <span>Đã nạp tệp ảnh từ máy! Bạn nhớ bấm nút "LƯU" để cập nhật sang trang cửa hàng.</span>
        </div>
      )}

      {/* URL Fallback link option */}
      <div className="url-toggle-bar">
        <button 
          type="button" 
          className="url-toggle-btn"
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          <Link size={12} />
          <span>{showUrlInput ? 'Ẩn ô nhập URL link' : 'Hoặc nhập link URL ảnh trực tiếp'}</span>
        </button>

        {showUrlInput && (
          <div className="url-input-box mt-1 flex gap-2">
            <input 
              type="url" 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="https://..."
              className="admin-input flex-1 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
