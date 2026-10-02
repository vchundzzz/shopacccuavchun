import React from 'react';
import { Bell, X, PhoneCall, AlertTriangle } from 'lucide-react';
import './AnnouncementModal.css';

export default function AnnouncementModal({ shopConfig, isOpen, onClose }) {
  if (!isOpen) return null;

  const announcement = shopConfig.popupAnnouncement || {};

  return (
    <div className="swal-overlay" onClick={onClose}>
      <div className="swal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="swal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="swal-header">
          <Bell size={22} className="text-primary bell-anim" />
          <h3 className="swal-title">Thông Báo Mới</h3>
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
              <span className="contact-label">ZALO FF:</span>
              <a 
                href={`https://zalo.me/${announcement.ffZalo || shopConfig.zaloFF}`} 
                target="_blank" 
                rel="noreferrer"
                className="contact-link"
              >
                {announcement.ffZalo || shopConfig.zaloFF}
              </a>
            </div>


            <div className="swal-contact-line">
              <span className="contact-label">ZALO LQ:</span>
              <a 
                href={`https://zalo.me/${announcement.lqZalo || shopConfig.zaloLQ}`} 
                target="_blank" 
                rel="noreferrer"
                className="contact-link"
              >
                {announcement.lqZalo || shopConfig.zaloLQ}
              </a>
            </div>
          </div>

          <div className="swal-warning-box">
            <AlertTriangle size={20} className="warning-icon" />
            <p>
              {announcement.note || 'LƯU Ý: AE MUA ACC FC TTT HAY ACC REG NHỚ QUAY VIDEO TỪ LÚC MUA ACC ĐẾN LÚC ĐĂNG NHẬP RỒI VÔ GAME NẾU KHÔNG CÓ VIDEO BÊN TY KHÔNG HỖ TRỢ ĐƯỢC NHA AE CHÚ Ý!!!'}
            </p>
          </div>

          <div className="swal-rent-notice">
            <u>{announcement.footerAlert || 'THUÊ ACC FF VUI LÒNG NHẮN ZALO'}</u>
          </div>
        </div>

        <div className="swal-footer">
          <button className="btn-swal-confirm" onClick={onClose}>
            Tôi Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
