import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Save, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  Layers,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import ImageFileInput from './ImageFileInput';
import './AdminBanners.css';

export default function AdminBanners({ shopConfig, onUpdateShopConfig, categories = [], onUpdateCategories, showToast, onExitAdmin }) {
  const [formData, setFormData] = useState({
    mainBanner: shopConfig?.mainBanner || '',
    supportCards: shopConfig?.supportCards || [],
    gameHeaders: shopConfig?.gameHeaders || {}
  });

  const [categoryList, setCategoryList] = useState(categories);

  const handleCatImageChange = (catId, newImage) => {
    const updated = categoryList.map(c => c.id === catId ? { ...c, image: newImage } : c);
    setCategoryList(updated);
    if (onUpdateCategories) {
      onUpdateCategories(updated);
    }
  };

  const handleSupportCardChange = (index, field, value) => {
    const updatedCards = [...formData.supportCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setFormData({
      ...formData,
      supportCards: updatedCards
    });
  };

  const handleGameHeaderChange = (game, field, value) => {
    setFormData({
      ...formData,
      gameHeaders: {
        ...formData.gameHeaders,
        [game]: {
          ...formData.gameHeaders?.[game],
          [field]: value
        }
      }
    });
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    onUpdateShopConfig(formData);
    if (onUpdateCategories) {
      onUpdateCategories(categoryList);
    }
    showToast('Đã lưu thành công! Toàn bộ banner và ảnh danh mục đã được cập nhật.');
  };

  const handleSaveAndExit = (e) => {
    if (e) e.preventDefault();
    onUpdateShopConfig(formData);
    if (onUpdateCategories) {
      onUpdateCategories(categoryList);
    }
    showToast('Đã lưu thành công! Đang chuyển sang trang chủ...');
    if (onExitAdmin) {
      setTimeout(() => onExitAdmin(), 500);
    }
  };

  return (
    <div className="admin-banners-view">
      {/* Top Header Actions */}
      <div className="banners-view-header">
        <div>
          <h2>QUẢN LÝ BANNER TOÀN TRANG</h2>
          <p>Tải ảnh trực tiếp từ máy tính cho banner chính, 4 thẻ hỗ trợ và banner các mục game</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" className="btn-gaming-primary" onClick={handleSaveAll}>
            <Save size={18} />
            <span>LƯU TẤT CẢ BANNER</span>
          </button>
          {onExitAdmin && (
            <button type="button" className="btn-gaming-success" onClick={handleSaveAndExit}>
              <ExternalLink size={18} />
              <span>LƯU & XEM SANG TRANG CHỦ</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="banners-form-container">
        {/* 1. TOP MAIN BANNER */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <ImageIcon size={18} className="text-primary" />
            <h3>1. BANNER CHÍNH TRANG CHỦ (TOP BANNER)</h3>
          </div>

          <div className="mb-4">
            <ImageFileInput 
              label="Chọn tệp ảnh banner chính từ thiết bị:"
              value={formData.mainBanner}
              onChange={(val) => setFormData({ ...formData, mainBanner: val })}
              aspectRatio="banner"
              maxWidth={1600}
              maxHeight={800}
            />
          </div>

          <div className="card-quick-save-bar">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu Banner Này</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. 4 SUPPORT CARDS */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <PhoneCall size={18} className="text-cyan" />
            <h3>2. BỐN THẺ BANNER HỖ TRỢ & TOPUP NHANH</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.supportCards.map((card, idx) => (
              <div key={card.id || idx} className="support-edit-item-box">
                <span className="card-idx-badge">Thẻ #{idx + 1}: {card.title}</span>

                <div className="form-group mb-2">
                  <label>Tiêu đề thẻ:</label>
                  <input 
                    type="text" 
                    value={card.title}
                    onChange={(e) => handleSupportCardChange(idx, 'title', e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group mb-2">
                  <ImageFileInput 
                    label="Tệp ảnh banner thẻ:"
                    value={card.image}
                    onChange={(val) => handleSupportCardChange(idx, 'image', val)}
                    aspectRatio="square"
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Link đích Zalo / Website:</label>
                  <input 
                    type="text" 
                    value={card.link}
                    onChange={(e) => handleSupportCardChange(idx, 'link', e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="card-quick-save-bar">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu 4 Thẻ Hỗ Trợ</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. GAME HEADERS BANNERS */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <ImageIcon size={18} className="text-fire" />
            <h3>3. BANNER TIÊU ĐỀ CÁC MỤC GAME (FREE FIRE & LIÊN QUÂN)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Fire */}
            <div className="support-edit-item-box">
              <span className="card-idx-badge font-bold text-red-500">🔥 Mục Free Fire</span>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Tiêu Đề Game:"
                  value={formData.gameHeaders?.freefire?.banner || ''}
                  onChange={(val) => handleGameHeaderChange('freefire', 'banner', val)}
                  aspectRatio="wide"
                />
              </div>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Support Zalo:"
                  value={formData.gameHeaders?.freefire?.supportBanner || ''}
                  onChange={(val) => handleGameHeaderChange('freefire', 'supportBanner', val)}
                  aspectRatio="square"
                />
              </div>
              <div className="form-group mb-2">
                <label>Link Zalo Support:</label>
                <input 
                  type="text" 
                  value={formData.gameHeaders?.freefire?.supportLink || ''}
                  onChange={(e) => handleGameHeaderChange('freefire', 'supportLink', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            {/* Liên Quân */}
            <div className="support-edit-item-box">
              <span className="card-idx-badge font-bold text-cyan-500">⚔️ Mục Liên Quân (Cực Phẩm)</span>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Tiêu Đề Game:"
                  value={formData.gameHeaders?.lienquan?.banner || ''}
                  onChange={(val) => handleGameHeaderChange('lienquan', 'banner', val)}
                  aspectRatio="wide"
                />
              </div>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Support Zalo:"
                  value={formData.gameHeaders?.lienquan?.supportBanner || ''}
                  onChange={(val) => handleGameHeaderChange('lienquan', 'supportBanner', val)}
                  aspectRatio="square"
                />
              </div>
              <div className="form-group mb-2">
                <label>Link Zalo Support:</label>
                <input 
                  type="text" 
                  value={formData.gameHeaders?.lienquan?.supportLink || ''}
                  onChange={(e) => handleGameHeaderChange('lienquan', 'supportLink', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="card-quick-save-bar">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu Banner Các Mục Game</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. ẢNH ĐẠI DIỆN CÁC MỤC DANH MỤC TRÊN TRANG CHỦ (FREE FIRE & LIÊN QUÂN) */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <Layers size={18} className="text-primary" />
            <h3>4. ẢNH ĐẠI DIỆN CÁC MỤC DANH MỤC TRÊN TRANG CHỦ (FREE FIRE & LIÊN QUÂN)</h3>
          </div>
          <p className="text-dim text-sm mb-4">
            Thay đổi ảnh hiển thị cho từng ô danh mục trên trang chủ: THUÊ ACC DƯỚI 2M, 2M-7M, 7M-15M, SIÊU PHẨM & LIÊN QUÂN CỰC PHẨM. Bạn có thể tải ảnh trực tiếp từ máy tính.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryList.map((cat) => (
              <div key={cat.id} className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl flex flex-col gap-2">
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>{cat.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 font-extrabold">
                    {cat.tag || (cat.game === 'freefire' ? 'FREE FIRE' : 'LIÊN QUÂN')}
                  </span>
                </div>
                <ImageFileInput 
                  label="Chọn ảnh từ máy tính:"
                  value={cat.image || ''}
                  onChange={(val) => handleCatImageChange(cat.id, val)}
                  aspectRatio="card"
                  maxWidth={800}
                  maxHeight={500}
                />
              </div>
            ))}
          </div>

          <div className="card-quick-save-bar mt-4">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu Ảnh Các Mục Danh Mục</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* Sticky Floating Bottom Action Bar */}
        <div className="admin-floating-bottom-bar">
          <div className="floating-inner flex items-center justify-between w-full flex-wrap gap-2">
            <span className="floating-hint font-medium text-slate-300">
              💡 Bấm nút lưu bên dưới để cập nhật ngay lập tức sang trang cửa hàng:
            </span>
            <div className="flex gap-2">
              <button type="button" className="btn-gaming-primary" onClick={handleSaveAll}>
                <Save size={18} />
                <span>LƯU TẤT CẢ BANNER</span>
              </button>
              {onExitAdmin && (
                <button type="button" className="btn-gaming-success" onClick={handleSaveAndExit}>
                  <ExternalLink size={18} />
                  <span>LƯU & XEM SANG TRANG CHỦ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
