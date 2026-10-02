import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import './BuyZaloModal.css';

export default function BuyZaloModal({ account, shopConfig = {}, onClose }) {
  if (!account) return null;

  const isLQ = account.game === 'lienquan';
  const targetZalo = isLQ 
    ? (shopConfig.zaloLQ || '0977296049') 
    : (shopConfig.zaloFF || '0868994712');

  const [copiedZalo, setCopiedZalo] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const formattedPrice = new Intl.NumberFormat('vi-VN').format(account.price) + ' ₫';
  const codeText = account.code ? account.code.replace('#', '') : account.id;

  const defaultMessage = `Chào Shop, tôi muốn thuê tài khoản mã [#${codeText}] giá ${formattedPrice}. Vui lòng hỗ trợ giao dịch giúp tôi!`;
  const zaloDirectLink = `https://zalo.me/${targetZalo}?text=${encodeURIComponent(defaultMessage)}`;

  const handleCopyZalo = () => {
    navigator.clipboard.writeText(targetZalo);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="zalo-modal-overlay" onClick={onClose}>
      <div className="zalo-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="zalo-modal-header">
          <div className="zalo-header-left">
            <div className="zalo-header-icon">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 className="zalo-header-title">HƯỚNG DẪN THUÊ ACC QUA ZALO</h3>
              <p className="zalo-header-subtitle">Giao dịch an toàn 100% qua Zalo chính chủ của shop</p>
            </div>
          </div>
          <button 
            type="button" 
            className="zalo-modal-close-btn" 
            onClick={onClose} 
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="zalo-modal-body">
          {/* Account Summary Mini Card */}
          <div className="zalo-acc-summary">
            <img 
              src={account.thumbnail || 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a87a4713_1790614151.jpg'} 
              alt={account.title || account.code} 
              className="zalo-summary-thumb" 
            />
            <div className="zalo-summary-info">
              <span className="zalo-summary-code-badge">MS #{codeText}</span>
              <h4 className="zalo-summary-title">{account.title || `Tài khoản mã #${codeText}`}</h4>
              <div className="zalo-summary-price">{formattedPrice}</div>
            </div>
          </div>

          {/* Quick Action Steps */}
          <div className="zalo-steps-list">
            <div className="zalo-step-item">
              <div className="zalo-step-badge">1</div>
              <div className="zalo-step-content">
                <strong>Nhấn nút mở Zalo bên dưới:</strong>
                <p>Hệ thống tự động soạn sẵn mã tài khoản <strong>#{codeText}</strong> kèm mức giá thuê.</p>
              </div>
            </div>

            <div className="zalo-step-item">
              <div className="zalo-step-badge">2</div>
              <div className="zalo-step-content">
                <strong>Nhận tài khoản và kiểm tra:</strong>
                <p>Admin gửi ảnh, video kiểm tra, bàn giao thông tin đăng nhập và bảo hành trọn đời.</p>
              </div>
            </div>
          </div>

          {/* Contact Hotline / Zalo Box */}
          <div className="zalo-contact-highlight">
            <div className="zalo-number-meta">
              <span className="zalo-label">Zalo Hỗ Trợ ({isLQ ? 'Liên Quân' : 'Free Fire'}):</span>
              <span className="zalo-phone-val">{targetZalo}</span>
            </div>
            <button 
              type="button" 
              className="btn-copy-chip" 
              onClick={handleCopyZalo}
            >
              {copiedZalo ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedZalo ? 'Đã sao chép SĐT' : 'Sao chép SĐT'}</span>
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="zalo-modal-actions">
            <a 
              href={zaloDirectLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-chat-zalo-big"
            >
              <img 
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" 
                alt="Zalo" 
                className="zalo-logo" 
              />
              <span>MỞ ZALO NHẮN TIN THUÊ NGAY</span>
              <ExternalLink size={18} />
            </a>

            <button 
              type="button" 
              className="btn-copy-code-alt" 
              onClick={handleCopyCode}
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedCode ? 'Đã sao chép mã acc!' : `Sao chép mã tài khoản: #${codeText}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
