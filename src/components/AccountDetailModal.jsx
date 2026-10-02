import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Trophy, 
  Crown, 
  ShieldCheck, 
  Maximize2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Crosshair,
  User,
  Shirt,
  Calendar,
  Layers,
  PhoneCall,
  Check,
  MessageCircle
} from 'lucide-react';
import { formatVND } from './AccountCard';
import './AccountDetailModal.css';

export default function AccountDetailModal({ account, shopConfig = {}, onClose, onBuyNow }) {
  if (!account) return null;

  const isFF = account.game === 'freefire';
  const isLQ = account.game === 'lienquan';
  const isSold = account.status === 'sold';
  
  // Game appropriate Zalo contact (Liên Quân or Free Fire)
  const targetZalo = isLQ 
    ? (shopConfig.zaloLQ || '0977296049') 
    : (shopConfig.zaloFF || '0868994712');

  // Gallery images list
  const images = account.gallery && account.gallery.length > 0 
    ? account.gallery 
    : [account.thumbnail];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(account.code || account.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container detail-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="detail-modal-header">
          <div className="header-tags">
            <span className="badge-tag">
              {isFF ? '🔥 FREE FIRE' : '⚔️ LIÊN QUÂN'}
            </span>
            <span className={`badge-tag ${isSold ? 'tag-sold' : 'tag-available'}`}>
              {isSold ? 'ĐÃ BÁN' : 'CÒN HÀNG'}
            </span>
            {account.isVip && (
              <span className="badge-tag tag-vip">
                <Crown size={13} />
                SIÊU PHẨM VIP
              </span>
            )}
            <span className="detail-acc-code" onClick={handleCopyCode} title="Bấm để sao chép mã">
              Mã: <strong>{account.code || account.id}</strong>
              {copiedCode ? <Check size={14} className="text-green" /> : <Layers size={14} />}
            </span>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={22} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="detail-modal-body">
          {/* Left Column: Image Gallery */}
          <div className="detail-gallery-column">
            {/* Main Active Image with Zoom Trigger */}
            <div className="main-image-wrap" onClick={() => setLightboxOpen(true)}>
              <img 
                src={images[activeImageIndex]} 
                alt={`${account.title} - Ảnh ${activeImageIndex + 1}`} 
                className="main-gallery-img"
              />
              <div className="image-zoom-indicator">
                <Maximize2 size={16} />
                <span>Phóng to ảnh</span>
              </div>

              {images.length > 1 && (
                <>
                  <button className="gallery-arrow-btn arrow-prev" onClick={handlePrevImage}>
                    <ChevronLeft size={20} />
                  </button>
                  <button className="gallery-arrow-btn arrow-next" onClick={handleNextImage}>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="gallery-thumbnail-strip">
                {images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumb-strip-item ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Specs */}
          <div className="detail-info-column">
            <h1 className="detail-title">{account.title}</h1>

            <div className="detail-price-section">
              <div className="price-tag-wrap">
                <span className="label-sub">Giá bán ưu đãi:</span>
                <span className="detail-current-price">{formatVND(account.price)}</span>
                {account.originalPrice && account.originalPrice > account.price && (
                  <span className="detail-original-price">{formatVND(account.originalPrice)}</span>
                )}
              </div>
            </div>

            {/* Specs Table */}
            <div className="detail-specs-box">
              <h4 className="specs-box-title">THÔNG TIN TÀI KHOẢN</h4>
              <div className="specs-list">
                <div className="spec-row">
                  <span className="s-label"><Trophy size={14} /> Rank hiện tại:</span>
                  <span className="s-value font-bold text-primary">{account.rank || 'Tự do'}</span>
                </div>

                <div className="spec-row">
                  <span className="s-label"><User size={14} /> Cấp độ:</span>
                  <span className="s-value">Lv {account.level || 30}</span>
                </div>

                {isLQ && (
                  <>
                    <div className="spec-row">
                      <span className="s-label"><Shirt size={14} /> Kho Trang phục:</span>
                      <span className="s-value font-bold">{account.skins || 150}+ Skin VIP</span>
                    </div>
                    <div className="spec-row">
                      <span className="s-label"><User size={14} /> Tướng sở hữu:</span>
                      <span className="s-value font-bold">{account.characters || 'Full tướng'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="s-label"><Crosshair size={14} /> Skin Nổi Bật:</span>
                      <span className="s-value">{account.gunSkins || 'Raz Muay Thái, Nakroth Quán Quân, Tulen Kiếm Tiên'}</span>
                    </div>
                  </>
                )}

                {isFF && (
                  <>
                    <div className="spec-row">
                      <span className="s-label"><Crosshair size={14} /> Skin Súng Nâng Cấp:</span>
                      <span className="s-value">{account.gunSkins || 'AK Rồng, MP40 Mãng Xà'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="s-label"><Shirt size={14} /> Trang phục & Đồ cổ:</span>
                      <span className="s-value">{account.outfits || 'Set Quỷ Dạ Xoa, HipHop S2'}</span>
                    </div>
                  </>
                )}



                <div className="spec-row">
                  <span className="s-label"><ShieldCheck size={14} /> Tình trạng bảo mật:</span>
                  <span className="s-value text-green font-bold">100% Thông tin trắng - Đổi mật khẩu ngay</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {account.description && (
              <div className="detail-desc-box">
                <span className="desc-title">Mô tả chi tiết:</span>
                <p>{account.description}</p>
              </div>
            )}

            {/* Action CTAs */}
            <div className="detail-cta-bar">
              <a 
                href={`https://zalo.me/${targetZalo}?text=${encodeURIComponent(`Chào Shop, tôi muốn thuê acc mã [${account.code || account.id}] giá ${formatVND(account.price)}`)}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-detail-zalo"
              >
                <PhoneCall size={18} />
                <span>LIÊN HỆ ZALO GIAO DỊCH: {targetZalo}</span>
              </a>

              {!isSold && (
                <button 
                  className="btn-detail-buy"
                  onClick={() => onBuyNow(account)}
                >
                  <MessageCircle size={18} />
                  <span>THUÊ NGAY QUA ZALO</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Preview */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={28} />
          </button>
          <img 
            src={images[activeImageIndex]} 
            alt="Enlarged" 
            className="lightbox-image" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
