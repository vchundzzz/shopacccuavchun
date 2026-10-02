import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Image, 
  PhoneCall, 
  Bell, 
  Share2, 
  CheckCircle,
  AlertTriangle,
  Eye,
  ExternalLink
} from 'lucide-react';
import ImageFileInput from './ImageFileInput';
import './AdminSettings.css';

export default function AdminSettings({ shopConfig, onUpdateShopConfig, showToast, onExitAdmin }) {
  const [formData, setFormData] = useState({
    shopName: shopConfig?.shopName || '',
    siteTitle: shopConfig?.siteTitle || '',
    tagline: shopConfig?.tagline || '',
    blackLogo: shopConfig?.blackLogo || '',
    whiteLogo: shopConfig?.whiteLogo || '',
    avatar: shopConfig?.avatar || '',
    hotline: shopConfig?.hotline || '',
    zaloFF: shopConfig?.zaloFF || '',
    zaloFCM: shopConfig?.zaloFCM || '',
    zaloLQ: shopConfig?.zaloLQ || '',
    facebookLink: shopConfig?.facebookLink || '',
    workingHours: shopConfig?.workingHours || '24/7',
    popupAnnouncement: {
      enabled: shopConfig?.popupAnnouncement?.enabled ?? true,
      headerTitle: shopConfig?.popupAnnouncement?.headerTitle || 'Thông Báo Mới',
      title: shopConfig?.popupAnnouncement?.title || 'SHOWROOM SHOW ACC',
      subtitle: shopConfig?.popupAnnouncement?.subtitle || 'ZALO HỖ TRỢ MỌI VẤN ĐỀ',
      ffZalo: shopConfig?.popupAnnouncement?.ffZalo || shopConfig?.zaloFF || '0868994712',
      fcmZalo: shopConfig?.popupAnnouncement?.fcmZalo || shopConfig?.zaloFCM || '0963566724',
      lqZalo: shopConfig?.popupAnnouncement?.lqZalo || shopConfig?.zaloLQ || '0977296049',
      note: shopConfig?.popupAnnouncement?.note || 'LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!',
      footerAlert: shopConfig?.popupAnnouncement?.footerAlert || 'THUÊ ACC FF VUI LÒNG NHẮN ZALO',
      buttonText: shopConfig?.popupAnnouncement?.buttonText || 'Tôi Đã Hiểu'
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'zaloFF') {
        const clean = value.replace(/\s+/g, '');
        next.supportCards = (prev.supportCards || []).map(c => 
          (c.id === 'sp-ff' || c.id === 'sp-rent') ? { ...c, link: `https://zalo.me/${clean}` } : c
        );
        next.gameHeaders = {
          ...prev.gameHeaders,
          freefire: {
            ...prev.gameHeaders?.freefire,
            supportLink: `https://zalo.me/${clean}`
          }
        };
        next.popupAnnouncement = {
          ...prev.popupAnnouncement,
          ffZalo: value
        };
      }
      if (field === 'zaloLQ') {
        const clean = value.replace(/\s+/g, '');
        next.supportCards = (prev.supportCards || []).map(c => 
          c.id === 'sp-lq' ? { ...c, link: `https://zalo.me/${clean}` } : c
        );
        next.gameHeaders = {
          ...prev.gameHeaders,
          lienquan: {
            ...prev.gameHeaders?.lienquan,
            supportLink: `https://zalo.me/${clean}`
          }
        };
        next.popupAnnouncement = {
          ...prev.popupAnnouncement,
          lqZalo: value
        };
      }
      return next;
    });
  };

  const handlePopupChange = (field, value) => {
    setFormData(prev => {
      const next = {
        ...prev,
        popupAnnouncement: {
          ...prev.popupAnnouncement,
          [field]: value
        }
      };
      if (field === 'ffZalo') {
        next.zaloFF = value;
      }
      if (field === 'lqZalo') {
        next.zaloLQ = value;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onUpdateShopConfig(formData);
    showToast('Đã lưu cấu hình thành công! Dữ liệu đã được lưu vĩnh viễn vào hệ thống.');
  };

  const handleSaveAndExit = (e) => {
    if (e) e.preventDefault();
    onUpdateShopConfig(formData);
    showToast('Đã lưu thành công! Đang chuyển sang trang chủ shop...');
    if (onExitAdmin) {
      setTimeout(() => onExitAdmin(), 500);
    }
  };

  return (
    <div className="admin-settings-view">
      {/* Top Header Actions */}
      <div className="settings-view-header">
        <div>
          <h2>CẤU HÌNH THƯƠNG HIỆU & POPUP</h2>
          <p>Tùy chỉnh thông tin website, logo đen/trắng, hotline, các số Zalo hỗ trợ và popup thông báo</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" className="btn-gaming-primary" onClick={handleSubmit}>
            <Save size={18} />
            <span>LƯU CẤU HÌNH</span>
          </button>
          {onExitAdmin && (
            <button type="button" className="btn-gaming-success" onClick={handleSaveAndExit}>
              <ExternalLink size={18} />
              <span>LƯU & XEM SANG TRANG CHỦ</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form-layout">
        {/* 1. THÔNG TIN CƠ BẢN */}
        <div className="settings-card">
          <div className="card-header-badge">
            <Settings size={18} className="text-primary" />
            <h3>1. THÔNG TIN CHUNG WEBSITE</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label>Tên Shop:</label>
              <input 
                type="text" 
                value={formData.shopName}
                onChange={(e) => handleChange('shopName', e.target.value)}
                className="admin-input"
                placeholder="SHOPTYSEISEI.NET"
                required
              />
            </div>

            <div className="form-group">
              <label>Tiêu đề Trang Web (Title):</label>
              <input 
                type="text" 
                value={formData.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                className="admin-input"
                placeholder="SHOWROOM CHO THUÊ ACC GAME"
                required
              />
            </div>

            <div className="form-group">
              <label>Khẩu hiệu (Tagline):</label>
              <input 
                type="text" 
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="admin-input"
                placeholder="SHOWROOM CHO THUÊ ACC GAME UY TÍN HÀNG ĐẦU"
              />
            </div>
          </div>

          <div className="card-quick-save-bar flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSubmit}>
              <Save size={14} />
              <span>Lưu Thông Tin Chung</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. LOGO & AVATAR */}
        <div className="settings-card">
          <div className="card-header-badge">
            <Image size={18} className="text-gold" />
            <h3>2. LOGO VÀ AVATAR SHOP</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* White Logo (Light theme) */}
            <div className="settings-img-item">
              <ImageFileInput 
                label="Logo nền sáng (White Logo):"
                value={formData.whiteLogo}
                onChange={(val) => handleChange('whiteLogo', val)}
                aspectRatio="square"
                maxWidth={600}
                maxHeight={200}
              />
            </div>

            {/* Black Logo (Dark theme) */}
            <div className="settings-img-item">
              <ImageFileInput 
                label="Logo nền tối (Black Logo):"
                value={formData.blackLogo}
                onChange={(val) => handleChange('blackLogo', val)}
                aspectRatio="square"
                maxWidth={600}
                maxHeight={200}
              />
            </div>

            {/* Avatar */}
            <div className="settings-img-item">
              <ImageFileInput 
                label="Avatar thương hiệu shop:"
                value={formData.avatar}
                onChange={(val) => handleChange('avatar', val)}
                aspectRatio="square"
                maxWidth={400}
                maxHeight={400}
              />
            </div>
          </div>

          <div className="card-quick-save-bar flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSubmit}>
              <Save size={14} />
              <span>Lưu Logo & Avatar</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. HOTLINE & ZALO THEO TỪNG GAME */}
        <div className="settings-card">
          <div className="card-header-badge">
            <PhoneCall size={18} className="text-cyan" />
            <h3>3. SỐ ĐIỆN THOẠI & ZALO TỪNG GAME</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-group">
              <label>Hotline chung:</label>
              <input 
                type="text" 
                value={formData.hotline}
                onChange={(e) => handleChange('hotline', e.target.value)}
                className="admin-input"
                placeholder="0868994712"
              />
            </div>

            <div className="form-group">
              <label>Zalo Free Fire (FF):</label>
              <input 
                type="text" 
                value={formData.zaloFF}
                onChange={(e) => handleChange('zaloFF', e.target.value)}
                className="admin-input"
                placeholder="0868994712"
              />
            </div>


            <div className="form-group">
              <label>Zalo Liên Quân (LQ):</label>
              <input 
                type="text" 
                value={formData.zaloLQ}
                onChange={(e) => handleChange('zaloLQ', e.target.value)}
                className="admin-input"
                placeholder="0977296049"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="form-group">
              <label>Link Facebook chính chủ:</label>
              <input 
                type="url" 
                value={formData.facebookLink}
                onChange={(e) => handleChange('facebookLink', e.target.value)}
                className="admin-input"
                placeholder="https://www.facebook.com/tyseiseiff/"
              />
            </div>

            <div className="form-group">
              <label>Thời gian phục vụ:</label>
              <input 
                type="text" 
                value={formData.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                className="admin-input"
                placeholder="24/7"
              />
            </div>
          </div>

          <div className="card-quick-save-bar flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSubmit}>
              <Save size={14} />
              <span>Lưu Số Điện Thoại & Zalo</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. POPUP THÔNG BÁO TỰ ĐỘNG KHI VÀO WEB */}
        <div className="settings-card">
          <div className="card-header-badge">
            <Bell size={18} className="text-fire" />
            <h3>4. POPUP THÔNG BÁO MỞ RA KHI KHÁCH VÀO WEB</h3>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
              <input 
                type="checkbox" 
                checked={formData.popupAnnouncement?.enabled ?? true}
                onChange={(e) => handlePopupChange('enabled', e.target.checked)}
                className="w-5 h-5 accent-red-600 rounded"
              />
              <span>BẬT POPUP THÔNG BÁO TỰ ĐỘNG</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="form-group">
              <label>Dòng tiêu đề nhỏ (Thông báo mới):</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.headerTitle || ''}
                onChange={(e) => handlePopupChange('headerTitle', e.target.value)}
                className="admin-input"
                placeholder="Thông Báo Mới"
              />
            </div>

            <div className="form-group">
              <label>Tiêu đề Popup chính:</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.title || ''}
                onChange={(e) => handlePopupChange('title', e.target.value)}
                className="admin-input font-bold"
                placeholder="SHOWROOM SHOW ACC"
              />
            </div>

            <div className="form-group">
              <label>Tiêu đề phụ Popup:</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.subtitle || ''}
                onChange={(e) => handlePopupChange('subtitle', e.target.value)}
                className="admin-input text-blue"
                placeholder="ZALO HỖ TRỢ MỌI VẤN ĐỀ"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="form-group">
              <label>Số Zalo Free Fire (Zalo FF):</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.ffZalo || ''}
                onChange={(e) => handlePopupChange('ffZalo', e.target.value)}
                className="admin-input"
                placeholder="0868994712"
              />
            </div>

            <div className="form-group">
              <label>Số Zalo Liên Quân (Zalo LQ):</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.lqZalo || ''}
                onChange={(e) => handlePopupChange('lqZalo', e.target.value)}
                className="admin-input"
                placeholder="0977296049"
              />
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Nội dung Lưu Ý (cảnh báo quay video khi nhận acc):</label>
            <textarea 
              rows={3}
              value={formData.popupAnnouncement?.note || ''}
              onChange={(e) => handlePopupChange('note', e.target.value)}
              className="admin-input"
              placeholder="LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="form-group">
              <label>Dòng thông báo cuối popup (chữ đỏ gạch chân):</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.footerAlert || ''}
                onChange={(e) => handlePopupChange('footerAlert', e.target.value)}
                className="admin-input text-red-500 font-bold"
                placeholder="THUÊ ACC FF VUI LÒNG NHẮN ZALO"
              />
            </div>

            <div className="form-group">
              <label>Chữ trên nút xác nhận đóng:</label>
              <input 
                type="text" 
                value={formData.popupAnnouncement?.buttonText || ''}
                onChange={(e) => handlePopupChange('buttonText', e.target.value)}
                className="admin-input font-bold"
                placeholder="Tôi Đã Hiểu"
              />
            </div>
          </div>

          <div className="card-quick-save-bar flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSubmit}>
              <Save size={14} />
              <span>Lưu Cấu Hình Popup</span>
            </button>
            {onExitAdmin && (
              <button type="button" className="btn-gaming-success btn-sm" onClick={handleSaveAndExit}>
                <ExternalLink size={14} />
                <span>Lưu & Mở Trang Shop</span>
              </button>
            )}
          </div>
        </div>

        {/* Sticky Floating Bottom Bar */}
        <div className="admin-floating-bottom-bar">
          <div className="floating-inner flex items-center justify-between w-full flex-wrap gap-2">
            <span className="floating-hint font-medium text-slate-300">
              💡 Bấm nút lưu bên dưới để cập nhật ngay lập tức sang trang cửa hàng:
            </span>
            <div className="flex gap-2">
              <button type="button" className="btn-gaming-primary" onClick={handleSubmit}>
                <Save size={18} />
                <span>LƯU CẤU HÌNH</span>
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
