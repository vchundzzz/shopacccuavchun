import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Flame, 
  Trophy, 
  FolderTree, 
  Save, 
  X,
  Image as ImageIcon,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import ImageFileInput from './ImageFileInput';
import { formatVND } from '../components/AccountCard';
import './AdminCategories.css';

export default function AdminCategories({ categories, onUpdateCategories, showToast, onExitAdmin }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [activeUploadId, setActiveUploadId] = useState(null);
  const [tempImages, setTempImages] = useState({});

  const initialForm = {
    game: 'freefire',
    name: '',
    tag: 'FREE FIRE',
    description: '',
    minPrice: 0,
    maxPrice: 2000000,
    icon: '🔥',
    image: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      ...initialForm,
      name: 'THUÊ ACC DƯỚI 1M',
      description: 'Mô tả khoảng giá'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      ...cat,
      image: cat.image || ''
    });
    setModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }

    if (editingCat) {
      const updated = categories.map(c => (c.id === editingCat.id ? { ...formData, id: c.id } : c));
      onUpdateCategories(updated);
      showToast(`Đã cập nhật danh mục "${formData.name}" thành công!`);
    } else {
      const newCat = {
        ...formData,
        id: `${formData.game}-${Date.now()}`,
        order: categories.length + 1
      };
      onUpdateCategories([...categories, newCat]);
      showToast(`Đã thêm danh mục mới "${newCat.name}" thành công!`);
    }

    setModalOpen(false);
  };

  const handleDelete = (cat) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${cat.name}"?`)) {
      const updated = categories.filter(c => c.id !== cat.id);
      onUpdateCategories(updated);
      showToast('Đã xóa danh mục thành công!');
    }
  };

  // Quick image change directly on card
  const handleQuickImageChange = (catId, newImage) => {
    setTempImages(prev => ({
      ...prev,
      [catId]: newImage
    }));
  };

  const handleSaveQuickImage = (catId) => {
    const newImage = tempImages[catId];
    if (!newImage) {
      alert('Vui lòng chọn ảnh trước khi lưu!');
      return;
    }

    const updated = categories.map(c => {
      if (c.id === catId) {
        return { ...c, image: newImage };
      }
      return c;
    });

    onUpdateCategories(updated);
    showToast('Đã cập nhật ảnh danh mục thành công! Ảnh mới đã hiển thị trên trang chủ.');
    setActiveUploadId(null);
  };

  const ffCats = categories.filter(c => c.game === 'freefire');
  const lqCats = categories.filter(c => c.game === 'lienquan');
  const otherCats = categories.filter(c => c.game !== 'freefire' && c.game !== 'lienquan');

  const renderCategoryCard = (cat) => {
    const isUploading = activeUploadId === cat.id;
    const currentImg = tempImages[cat.id] !== undefined ? tempImages[cat.id] : (cat.image || '');

    return (
      <div key={cat.id} className="cat-item-card">
        {/* Category Image Live Preview */}
        <div className="cat-image-preview-wrap">
          {currentImg ? (
            <img 
              src={currentImg} 
              alt={cat.name} 
              className="cat-preview-img" 
              onError={(e) => {
                e.target.src = 'https://shoptyseisei.net/uploads/03-09-2026/4a880721-608d-4cd0-af80-103f8bd1764b.jpg';
              }}
            />
          ) : (
            <div className="cat-no-image-placeholder">
              <ImageIcon size={28} />
              <span>Chưa có ảnh danh mục</span>
            </div>
          )}
          <span className="cat-image-badge-tag">
            {cat.tag || (cat.game === 'freefire' ? 'FREE FIRE' : 'LIÊN QUÂN')}
          </span>
        </div>

        {/* Card Body */}
        <div className="cat-body-content">
          <h4 className="cat-name-heading">{cat.name}</h4>

          <div className="cat-price-info">
            <span>Khoảng giá:</span>
            <strong>
              {formatVND(cat.minPrice)} – {cat.maxPrice > 100000000 ? 'Không giới hạn' : formatVND(cat.maxPrice)}
            </strong>
          </div>

          {/* Quick Image Uploader Section */}
          <div className="cat-quick-upload-panel">
            {!isUploading ? (
              <button 
                type="button" 
                className="btn-gaming-outline btn-sm w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setActiveUploadId(cat.id);
                  setTempImages(prev => ({ ...prev, [cat.id]: cat.image || '' }));
                }}
              >
                <ImageIcon size={14} />
                <span>THAY ĐỔI ẢNH MỤC NÀY</span>
              </button>
            ) : (
              <div className="cat-image-action-box">
                <ImageFileInput 
                  label="Chọn tệp ảnh từ máy tính:"
                  value={currentImg}
                  onChange={(val) => handleQuickImageChange(cat.id, val)}
                  aspectRatio="card"
                  maxWidth={800}
                  maxHeight={500}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    type="button" 
                    className="btn-save-cat-img flex-1"
                    onClick={() => handleSaveQuickImage(cat.id)}
                  >
                    <Check size={14} />
                    <span>LƯU ẢNH MỚI</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-gaming-outline btn-sm"
                    onClick={() => {
                      setActiveUploadId(null);
                      setTempImages(prev => {
                        const copy = { ...prev };
                        delete copy[cat.id];
                        return copy;
                      });
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="cat-card-actions">
            <button 
              type="button" 
              className="btn-cat-edit" 
              onClick={() => handleOpenEdit(cat)}
            >
              <Edit3 size={14} />
              <span>Sửa Thông Tin</span>
            </button>
            <button 
              type="button" 
              className="btn-cat-delete" 
              onClick={() => handleDelete(cat)}
              title="Xóa danh mục này"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-categories-view">
      {/* Top Banner Control Header */}
      <div className="admin-controls-card">
        <div>
          <h3>QUẢN LÝ DANH MỤC & ẢNH ĐẠI DIỆN MỤC GAME</h3>
          <p className="text-dim text-sm">
            Thay đổi ảnh hiển thị, tiêu đề và khoảng giá cho các ô danh mục trên trang chủ (Dưới 2M, 2M-7M, Siêu Phẩm, Liên Quân...)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-gaming-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>THÊM DANH MỤC MỚI</span>
          </button>
          {onExitAdmin && (
            <button className="btn-gaming-success" onClick={onExitAdmin}>
              <ExternalLink size={16} />
              <span>XEM TRANG CHỦ</span>
            </button>
          )}
        </div>
      </div>

      {/* Free Fire Section (4 Categories from screenshot) */}
      <div className="cat-group-section">
        <div className="cat-group-header">
          <Flame size={20} className="text-fire" />
          <h4>CÁC MỤC DANH MỤC FREE FIRE TRÊN TRANG CHỦ</h4>
          <span className="badge-gaming badge-fire">{ffCats.length} MỤC</span>
        </div>

        <div className="cat-grid">
          {ffCats.map(renderCategoryCard)}
        </div>
      </div>

      {/* Liên Quân Section */}
      <div className="cat-group-section">
        <div className="cat-group-header">
          <Trophy size={20} className="text-cyan" />
          <h4>MỤC DANH MỤC LIÊN QUÂN MOBILE</h4>
          <span className="badge-gaming badge-cyan">{lqCats.length} MỤC</span>
        </div>

        <div className="cat-grid">
          {lqCats.map(renderCategoryCard)}
        </div>
      </div>

      {/* Other Categories if any */}
      {otherCats.length > 0 && (
        <div className="cat-group-section">
          <div className="cat-group-header">
            <FolderTree size={20} className="text-gold" />
            <h4>CÁC GAME KHÁC</h4>
          </div>

          <div className="cat-grid">
            {otherCats.map(renderCategoryCard)}
          </div>
        </div>
      )}

      {/* Modal Add / Edit Category */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container cat-modal-form" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <h3>{editingCat ? `CHỈNH SỬA: ${editingCat.name}` : 'THÊM MỚI DANH MỤC'}</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="admin-form-body p-4">
              <div className="form-grid">
                <div className="form-group">
                  <label className="text-sm font-bold text-slate-300">Thuộc Game:</label>
                  <select 
                    value={formData.game} 
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      game: e.target.value,
                      tag: e.target.value === 'freefire' ? 'FREE FIRE' : 'LIÊN QUÂN'
                    })}
                    className="admin-input"
                  >
                    <option value="freefire">🔥 Free Fire</option>
                    <option value="lienquan">⚔️ Liên Quân Mobile</option>
                    <option value="other">🎮 Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="text-sm font-bold text-slate-300">Tag Huy Hiệu:</label>
                  <input 
                    type="text" 
                    value={formData.tag || ''} 
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="VD: FREE FIRE, VIP..."
                    className="admin-input"
                  />
                </div>

                <div className="form-group full-col">
                  <label className="text-sm font-bold text-slate-300">Tên Danh Mục Hiển Thị:</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="VD: THUÊ ACC DƯỚI 2M, THUÊ ACC FF 2M ĐẾN 7M..."
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label className="text-sm font-bold text-slate-300">Giá Tối Thiểu (VNĐ):</label>
                  <input 
                    type="number" 
                    value={formData.minPrice} 
                    onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label className="text-sm font-bold text-slate-300">Giá Tối Đa (VNĐ):</label>
                  <input 
                    type="number" 
                    value={formData.maxPrice} 
                    onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group full-col">
                  <ImageFileInput 
                    label="Ảnh Bìa / Thumbnail Danh Mục (Tải từ máy tính hoặc dán link):"
                    value={formData.image || ''} 
                    onChange={(val) => setFormData({ ...formData, image: val })}
                    aspectRatio="card"
                    maxWidth={900}
                    maxHeight={600}
                  />
                </div>
              </div>

              <div className="admin-form-footer flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-700">
                <button type="button" className="btn-gaming-outline" onClick={() => setModalOpen(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-gaming-primary">
                  <Save size={16} />
                  <span>{editingCat ? 'LƯU THAY ĐỔI' : 'TẠO DANH MỤC'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
