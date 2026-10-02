import React from 'react';
import { Bell, X, PhoneCall, AlertTriangle } from 'lucide-react';
import './AnnouncementModal.css';

export default function AnnouncementModal({ shopConfig, isOpen, onClose }) {
  if (!isOpen) return null;

  const announcement = shopConfig.popupAnnouncement || {};
  const ffZalo = announcement.ffZalo || shopConfig.zaloFF || '0868994712';
  const lqZalo = announcement.lqZalo || shopConfig.zaloLQ || '0977296049';
  const fcmZalo = announcement.fcmZalo || shopConfig.zaloFCM || '0963566724';

  return (
    <div className="swal-overlay" onClick={onClose}>
      <div className="swal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="swal-close-btn" onClick={onClose} aria-label="Đóng thông báo">
          <X size={20} />
        </button>

        <div className="swal-header">
          <Bell size={22} className="text-primary bell-anim" />
          <h3 className="swal-title">{announcement.headerTitle || 'Thông Báo Mới'}</h3>
          <Bell size={22} className="text-primary bell-anim" />
        </div>

        <div className="swal-body">
          <div className="swal-highlight-title">
            {announcement.title || 'SHOWROOM SHOW ACC'}
          </div>

          <div className="swal-sub-title">
            {announcement.subtitle || 'ZALO HỖ TRỢ MỌI VẤN ĐỀ'}
          </div>

          <div className="swal-contact-box">
            <div className="swal-contact-line">
              <span className="contact-label">{announcement.ffLabel || 'ZALO FF:'}</span>
              <a 
                href={`https://zalo.me/${ffZalo.replace(/\s+/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="contact-link"
              >
                {ffZalo}
              </a>
            </div>

            {announcement.showFcmZalo && (
              <div className="swal-contact-line">
                <span className="contact-label">{announcement.fcmLabel || 'ZALO FC:'}</span>
                <a 
                  href={`https://zalo.me/${fcmZalo.replace(/\s+/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="contact-link"
                >
                  {fcmZalo}
                </a>
              </div>
            )}

            <div className="swal-contact-line">
              <span className="contact-label">{announcement.lqLabel || 'ZALO LQ:'}</span>
              <a 
                href={`https://zalo.me/${lqZalo.replace(/\s+/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="contact-link"
              >
                {lqZalo}
              </a>
            </div>
          </div>

          <div className="swal-warning-box">
            <AlertTriangle size={20} className="warning-icon" />
            <p>
              {announcement.note || 'LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN VCHUN KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!'}
            </p>
          </div>

          <div className="swal-rent-notice">
            <u>{announcement.footerAlert || 'THUÊ ACC FF VUI LÒNG NHẮN ZALO'}</u>
          </div>
        </div>

        <div className="swal-footer">
          <button className="btn-swal-confirm" onClick={onClose}>
            {announcement.buttonText || 'Tôi Đã Hiểu'}
          </button>
        </div>
      </div>
    </div>
  );
}
