import React, { useState } from 'react';
import { 
  Bell, 
  Save, 
  Eye, 
  ExternalLink, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Info,
  X
} from 'lucide-react';
import AnnouncementModal from '../components/AnnouncementModal';
import './AdminAnnouncement.css';

export default function AdminAnnouncement({ shopConfig, onUpdateShopConfig, showToast, onExitAdmin }) {
  const defaultAnnouncement = {
    enabled: true,
    headerTitle: 'Thông Báo Mới',
    title: 'SHOWROOM SHOW ACC',
    subtitle: 'ZALO HỖ TRỢ MỌI VẤN ĐỀ',
    ffLabel: 'ZALO FF:',
    ffZalo: shopConfig?.zaloFF || '0868994712',
    lqLabel: 'ZALO LQ:',
    lqZalo: shopConfig?.zaloLQ || '0977296049',
    fcmLabel: 'ZALO FC:',
    fcmZalo: shopConfig?.zaloFCM || '0963566724',
    showFcmZalo: false,
    note: 'LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!',
    footerAlert: 'THUÊ ACC FF VUI LÒNG NHẮN ZALO',
    buttonText: 'Tôi Đã Hiểu'
  };

  const [announcement, setAnnouncement] = useState(() => ({
    ...defaultAnnouncement,
    ...(shopConfig?.popupAnnouncement || {})
  }));

  const [showRealModalPreview, setShowRealModalPreview] = useState(false);

  const handleChange = (field, value) => {
    setAnnouncement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const ffNum = (announcement.ffZalo || shopConfig.zaloFF || '').replace(/\s+/g, '');
    const lqNum = (announcement.lqZalo || shopConfig.zaloLQ || '').replace(/\s+/g, '');

    const updated = {
      ...shopConfig,
      zaloFF: announcement.ffZalo || shopConfig.zaloFF,
      zaloLQ: announcement.lqZalo || shopConfig.zaloLQ,
      supportCards: (shopConfig.supportCards || []).map(c => {
        if (c.id === 'sp-ff' || c.id === 'sp-rent') return { ...c, link: `https://zalo.me/${ffNum}` };
        if (c.id === 'sp-lq') return { ...c, link: `https://zalo.me/${lqNum}` };
        return c;
      }),
      gameHeaders: {
        ...shopConfig.gameHeaders,
        freefire: {
          ...shopConfig.gameHeaders?.freefire,
          supportLink: `https://zalo.me/${ffNum}`
        },
        lienquan: {
          ...shopConfig.gameHeaders?.lienquan,
          supportLink: `https://zalo.me/${lqNum}`
        }
      },
      popupAnnouncement: announcement
    };
    onUpdateShopConfig(updated);
    showToast('Đã lưu cấu hình thông báo & đồng bộ số Zalo toàn trang web thành công!');
  };

  const handleSaveAndExit = (e) => {
    if (e) e.preventDefault();
    const ffNum = (announcement.ffZalo || shopConfig.zaloFF || '').replace(/\s+/g, '');
    const lqNum = (announcement.lqZalo || shopConfig.zaloLQ || '').replace(/\s+/g, '');

    const updated = {
      ...shopConfig,
      zaloFF: announcement.ffZalo || shopConfig.zaloFF,
      zaloLQ: announcement.lqZalo || shopConfig.zaloLQ,
      supportCards: (shopConfig.supportCards || []).map(c => {
        if (c.id === 'sp-ff' || c.id === 'sp-rent') return { ...c, link: `https://zalo.me/${ffNum}` };
        if (c.id === 'sp-lq') return { ...c, link: `https://zalo.me/${lqNum}` };
        return c;
      }),
      gameHeaders: {
        ...shopConfig.gameHeaders,
        freefire: {
          ...shopConfig.gameHeaders?.freefire,
          supportLink: `https://zalo.me/${ffNum}`
        },
        lienquan: {
          ...shopConfig.gameHeaders?.lienquan,
          supportLink: `https://zalo.me/${lqNum}`
        }
      },
      popupAnnouncement: announcement
    };
    onUpdateShopConfig(updated);
    sessionStorage.removeItem('announcement_closed');
    showToast('Đã lưu thành công! Đang chuyển ra trang chủ để xem popup...');
    if (onExitAdmin) {
      setTimeout(() => onExitAdmin(), 400);
    }
  };

  const handleResetDefault = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại nội dung thông báo về mẫu mặc định ban đầu của shop?')) {
      setAnnouncement(defaultAnnouncement);
      showToast('Đã hoàn tác về mẫu thông báo mặc định. Nhớ nhấn "Lưu Thay Đổi" để cập nhật!');
    }
  };

  return (
    <div className="admin-announcement-view">
      {/* Top Header Card */}
      <div className="announcement-header-card">
        <div className="header-info">
          <div className="flex items-center gap-2">
            <div className="header-icon-box">
              <Bell className="bell-shake" size={24} />
            </div>
            <div>
              <h2>QUẢN LÝ THÔNG BÁO POPUP TRANG CHỦ</h2>
              <p>Tùy chỉnh nội dung bảng thông báo SweetAlert tự động bật lên khi khách hàng mở website</p>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="btn-gaming-outline btn-test-modal" 
            onClick={() => setShowRealModalPreview(true)}
            title="Mở popup thật toàn màn hình để kiểm tra trải nghiệm"
          >
            <Eye size={17} />
            <span>Xem Thử Popup Thực Tế</span>
          </button>

          <button 
            type="button" 
            className="btn-gaming-primary" 
            onClick={handleSave}
            title="Lưu tất cả thay đổi"
          >
            <Save size={17} />
            <span>LƯU THAY ĐỔI</span>
          </button>

          {onExitAdmin && (
            <button 
              type="button" 
              className="btn-gaming-success" 
              onClick={handleSaveAndExit}
              title="Lưu và mở trang chủ xem kết quả ngay"
            >
              <ExternalLink size={17} />
              <span>LƯU & XEM TRANG CHỦ</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Content: Left Edit Form, Right Live Preview */}
      <div className="announcement-content-grid">
        {/* LEFT COLUMN: EDIT FORM */}
        <div className="announcement-form-col">
          {/* 1. Trạng Thái Bật / Tắt */}
          <div className="admin-card toggle-card">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="card-sub-label">Trạng thái thông báo:</span>
                <h4 className="card-toggle-title">BẬT / TẮT POPUP KHI KHÁCH VÀO SHOP</h4>
                <p className="card-hint">
                  {announcement.enabled 
                    ? '🟢 Popup ĐANG BẬT: Khách vào trang web sẽ nhìn thấy ngay thông báo này.' 
                    : '⚪ Popup ĐANG TẮT: Tạm thời không hiển thị popup khi khách truy cập.'}
                </p>
              </div>

              <button 
                type="button"
                className={`toggle-switch-btn ${announcement.enabled ? 'active' : ''}`}
                onClick={() => handleChange('enabled', !announcement.enabled)}
              >
                {announcement.enabled ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>ĐANG BẬT</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={18} />
                    <span>ĐÃ TẮT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Tiêu Đề Thông Báo */}
          <div className="admin-card">
            <div className="card-title-row">
              <Sparkles size={18} className="text-fire" />
              <h3>1. TIÊU ĐỀ THÔNG BÁO</h3>
            </div>

            <div className="form-group mb-3">
              <label>Dòng tiêu đề nhỏ trên cùng (cạnh 2 chuông):</label>
              <input 
                type="text" 
                value={announcement.headerTitle || ''} 
                onChange={(e) => handleChange('headerTitle', e.target.value)}
                placeholder="Thông Báo Mới"
                className="admin-input"
              />
              <span className="input-hint">Mặc định: Thông Báo Mới</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group">
                <label>Tiêu đề chính in đậm (Nổi bật nhất):</label>
                <input 
                  type="text" 
                  value={announcement.title || ''} 
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="SHOWROOM SHOW ACC"
                  className="admin-input font-bold"
                />
              </div>

              <div className="form-group">
                <label>Dòng phụ màu xanh (Dưới tiêu đề chính):</label>
                <input 
                  type="text" 
                  value={announcement.subtitle || ''} 
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="ZALO HỖ TRỢ MỌI VẤN ĐỀ"
                  className="admin-input text-blue"
                />
              </div>
            </div>
          </div>

          {/* 3. Số Zalo Hỗ Trợ */}
          <div className="admin-card">
            <div className="card-title-row">
              <MessageSquare size={18} className="text-blue" />
              <h3>2. SỐ ĐIỆN THOẠI ZALO HỖ TRỢ TRONG POPUP</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group">
                <label>Zalo Free Fire (Số điện thoại / Link):</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">ZALO FF:</span>
                  <input 
                    type="text" 
                    value={announcement.ffZalo || ''} 
                    onChange={(e) => handleChange('ffZalo', e.target.value)}
                    placeholder="0868994712"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Zalo Liên Quân (Số điện thoại / Link):</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">ZALO LQ:</span>
                  <input 
                    type="text" 
                    value={announcement.lqZalo || ''} 
                    onChange={(e) => handleChange('lqZalo', e.target.value)}
                    placeholder="0977296049"
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            {/* Tùy chọn hiển thị thêm Zalo thứ 3 */}
            <div className="mt-3 pt-3 border-t border-slate-700/60">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-300 mb-2">
                <input 
                  type="checkbox" 
                  checked={!!announcement.showFcmZalo} 
                  onChange={(e) => handleChange('showFcmZalo', e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                <span>Hiện thêm Zalo thứ 3 (Ví dụ: Zalo FC Mobile hoặc Zalo Phụ)</span>
              </label>

              {announcement.showFcmZalo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 pl-6">
                  <div className="form-group">
                    <label>Nhãn hiển thị:</label>
                    <input 
                      type="text" 
                      value={announcement.fcmLabel || 'ZALO FC:'} 
                      onChange={(e) => handleChange('fcmLabel', e.target.value)}
                      placeholder="ZALO FC:"
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại Zalo:</label>
                    <input 
                      type="text" 
                      value={announcement.fcmZalo || ''} 
                      onChange={(e) => handleChange('fcmZalo', e.target.value)}
                      placeholder="0963566724"
                      className="admin-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Khung Cảnh Báo Lưu Ý & Dòng Đỏ Cuối */}
          <div className="admin-card">
            <div className="card-title-row">
              <AlertTriangle size={18} className="text-yellow-400" />
              <h3>3. NỘI DUNG LƯU Ý (KHUNG CẢNH BÁO QUAY VIDEO)</h3>
            </div>

            <div className="form-group mb-4">
              <label>Nội dung dặn dò khách quay video khi mua tài khoản:</label>
              <textarea 
                rows={4} 
                value={announcement.note || ''} 
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!"
                className="admin-input note-textarea"
              />
              <span className="input-hint">Đoạn lưu ý này sẽ nằm trong khung nền vàng nổi bật có icon cảnh báo ⚠️</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group">
                <label>Dòng thông báo màu đỏ (Gạch chân):</label>
                <input 
                  type="text" 
                  value={announcement.footerAlert || ''} 
                  onChange={(e) => handleChange('footerAlert', e.target.value)}
                  placeholder="THUÊ ACC FF VUI LÒNG NHẮN ZALO"
                  className="admin-input text-red-500 font-bold"
                />
              </div>

              <div className="form-group">
                <label>Chữ trên nút xác nhận đóng:</label>
                <input 
                  type="text" 
                  value={announcement.buttonText || ''} 
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                  placeholder="Tôi Đã Hiểu"
                  className="admin-input font-bold"
                />
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 pb-6 flex-wrap">
            <button 
              type="button" 
              className="btn-gaming-reset" 
              onClick={handleResetDefault}
              title="Khôi phục lại nội dung gốc mặc định"
            >
              <RotateCcw size={16} />
              <span>Khôi Phục Mẫu Gốc</span>
            </button>

            <div className="flex items-center gap-2">
              <button 
                type="button" 
                className="btn-gaming-primary" 
                onClick={handleSave}
              >
                <Save size={18} />
                <span>LƯU CẤU HÌNH</span>
              </button>

              {onExitAdmin && (
                <button 
                  type="button" 
                  className="btn-gaming-success" 
                  onClick={handleSaveAndExit}
                >
                  <ExternalLink size={18} />
                  <span>LƯU & XEM TRANG SHOP</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME VISUAL PREVIEW */}
        <div className="announcement-preview-col">
          <div className="preview-sticky-wrap">
            <div className="preview-header-bar">
              <div className="flex items-center gap-2">
                <span className="live-dot"></span>
                <span className="preview-title">XEM TRƯỚC TRỰC QUAN (LIVE PREVIEW)</span>
              </div>
              <span className="preview-badge">Y Hệt Giao Diện Khách Xem</span>
            </div>

            <div className="preview-canvas-box">
              {/* Simulated SweetAlert Popup Box */}
              <div className="preview-swal-modal">
                <button className="preview-close-btn" type="button" title="Nút đóng">
                  <X size={18} />
                </button>

                <div className="preview-swal-header">
                  <Bell size={20} className="text-primary bell-anim" />
                  <h3 className="preview-swal-title">{announcement.headerTitle || 'Thông Báo Mới'}</h3>
                  <Bell size={20} className="text-primary bell-anim" />
                </div>

                <div className="preview-swal-body">
                  <div className="preview-highlight-title">
                    {announcement.title || 'SHOWROOM SHOW ACC'}
                  </div>

                  <div className="preview-sub-title">
                    {announcement.subtitle || 'ZALO HỖ TRỢ MỌI VẤN ĐỀ'}
                  </div>

                  <div className="preview-contact-box">
                    <div className="preview-contact-line">
                      <span className="contact-label">{announcement.ffLabel || 'ZALO FF:'}</span>
                      <span className="contact-link">{announcement.ffZalo || '0868994712'}</span>
                    </div>

                    {announcement.showFcmZalo && (
                      <div className="preview-contact-line">
                        <span className="contact-label">{announcement.fcmLabel || 'ZALO FC:'}</span>
                        <span className="contact-link">{announcement.fcmZalo || '0963566724'}</span>
                      </div>
                    )}

                    <div className="preview-contact-line">
                      <span className="contact-label">{announcement.lqLabel || 'ZALO LQ:'}</span>
                      <span className="contact-link">{announcement.lqZalo || '0977296049'}</span>
                    </div>
                  </div>

                  <div className="preview-warning-box">
                    <AlertTriangle size={18} className="warning-icon flex-shrink-0" />
                    <p>
                      {announcement.note || 'LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!'}
                    </p>
                  </div>

                  <div className="preview-rent-notice">
                    <u>{announcement.footerAlert || 'THUÊ ACC FF VUI LÒNG NHẮN ZALO'}</u>
                  </div>
                </div>

                <div className="preview-swal-footer">
                  <button 
                    type="button" 
                    className="btn-preview-confirm"
                    onClick={() => setShowRealModalPreview(true)}
                  >
                    {announcement.buttonText || 'Tôi Đã Hiểu'}
                  </button>
                </div>
              </div>
            </div>

            <div className="preview-tip-box">
              <Info size={16} className="text-blue" />
              <span>
                Nội dung bên trên sẽ tự động cập nhật ngay khi bạn sửa chữ ở form bên trái. Bấm <strong>Lưu Cấu Hình</strong> để áp dụng lên web.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Full Screen Interactive Modal Preview */}
      {showRealModalPreview && (
        <AnnouncementModal 
          shopConfig={{
            ...shopConfig,
            popupAnnouncement: {
              ...announcement,
              enabled: true
            }
          }}
          isOpen={true}
          onClose={() => setShowRealModalPreview(false)}
        />
      )}
    </div>
  );
}
