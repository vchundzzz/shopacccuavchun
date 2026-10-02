import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  Flame, 
  Trophy, 
  Crown, 
  Maximize2, 
  X,
  Star,
  Info,
  Images as ImageIcon
} from 'lucide-react';
import { formatVND } from './AccountCard';
import './AccountDetailPage.css';

export default function AccountDetailPage({ 
  account, 
  categories = [], 
  shopConfig = {}, 
  onBack, 
  onBuyNow 
}) {
  if (!account) return null;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  const isLQ = account.game === 'lienquan';
  const targetZalo = isLQ 
    ? (shopConfig.zaloLQ || '0977296049') 
    : (shopConfig.zaloFF || '0868994712');

  const isSold = account.status === 'sold';
  const category = categories.find(c => c.id === account.categoryId);
  const categoryName = category ? category.name : (isLQ ? 'NICK LIÊN QUÂN CỰC PHẨM' : 'ACC FREE FIRE VIP');

  // Build images list (filter out empty/undefined)
  const rawGallery = Array.isArray(account.gallery) ? account.gallery : [];
  const validGallery = rawGallery.filter(url => url && typeof url === 'string' && url.trim().length > 0);
  
  const images = validGallery.length > 0 
    ? validGallery 
    : (account.thumbnail ? [account.thumbnail] : []);

  const mainImage = account.thumbnail || images[0] || '/images/banner-shopvanchung.png';

  const defaultMsg = `Chào Shop, tôi muốn thuê tài khoản mã [${account.code || account.id}] giá ${formatVND(account.price)}. Vui lòng hỗ trợ giao dịch giúp tôi!`;
  const zaloDirectLink = `https://zalo.me/${targetZalo}?text=${encodeURIComponent(defaultMsg)}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(account.code || account.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyZalo = () => {
    navigator.clipboard.writeText(targetZalo);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 2000);
  };

  return (
    <div className="account-detail-page-wrapper">
      {/* 1. Breadcrumb & Back Navigation */}
      <div className="account-detail-breadcrumb flex items-center justify-between mb-4 flex-wrap gap-2">
        <button 
          className="btn-back-showroom flex items-center gap-2 text-primary font-bold hover:underline"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          <span>Quay lại Showroom</span>
        </button>

        <div className="detail-breadcrumb-path text-sm text-slate-500">
          <span>Trang Chủ</span> / <span>{categoryName}</span> / <strong>Mã: #{account.code || account.id}</strong>
        </div>
      </div>

      {/* 2. Main Account Detail Shell */}
      <section className="account-detail">
        <div className="account-detail-shell">
          {/* Media Column (Left) */}
          <div className="account-detail-media" onClick={() => setLightboxImg(mainImage)} title="Nhấn để phóng to ảnh">
            <img 
              src={mainImage} 
              alt={account.title || account.code} 
              loading="eager"
            />
            <div className="media-zoom-hint">
              <Maximize2 size={16} />
              <span>Phóng to ảnh</span>
            </div>
          </div>

          {/* Summary Info Column (Right) */}
          <div className="account-detail-summary">
            {/* Account Code Badge with Copy Action */}
            <div 
              className="account-detail-code copy cursor-pointer" 
              onClick={handleCopyCode}
              title="Nhấn để sao chép mã tài khoản"
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedCode ? 'Đã sao chép mã!' : `Mã số: ${account.code || account.id}`}</span>
            </div>

            {/* Price Box */}
            <div className="account-detail-price">
              {formatVND(account.price)}
              {account.originalPrice && account.originalPrice > account.price && (
                <span className="account-detail-original-price">
                  {formatVND(account.originalPrice)}
                </span>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="account-detail-quick">
              <div className="account-detail-stat">
                <span>Mã tài khoản</span>
                <strong>#{account.code || account.id}</strong>
              </div>
              <div className="account-detail-stat">
                <span>Danh mục</span>
                <strong>{categoryName}</strong>
              </div>
            </div>

            {/* Tags Grid */}
            <div className="account-detail-tags">
              <div className="account-detail-tag">
                <Star size={14} className="tag-icon text-amber-500" />
                <span>LH ZALO ĐỂ THUÊ 99 NĂM</span>
              </div>
              <div className="account-detail-tag">
                <ShieldCheck size={14} className="tag-icon text-green-500" />
                <span>BẢO HÀNH TRỌN ĐỜI</span>
              </div>
              {account.rank && (
                <div className="account-detail-tag">
                  <Trophy size={14} className="tag-icon text-primary" />
                  <span>Rank: <strong>{account.rank}</strong></span>
                </div>
              )}
              {account.level && (
                <div className="account-detail-tag">
                  <span>Cấp độ: <strong>Lv {account.level}</strong></span>
                </div>
              )}
              {account.gunSkins && (
                <div className="account-detail-tag full-width">
                  <span>Skin nổi bật: <strong>{account.gunSkins}</strong></span>
                </div>
              )}
              {account.rareItems && (
                <div className="account-detail-tag full-width">
                  <span>Đồ hiếm: <strong>{account.rareItems}</strong></span>
                </div>
              )}
              {account.characters && (
                <div className="account-detail-tag full-width">
                  <span>Tướng / Cầu thủ: <strong>{account.characters}</strong></span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="account-detail-actions">
              {/* Direct Zalo Chat Button */}
              <a 
                href={zaloDirectLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="account-detail-btn account-detail-zalo"
              >
                <img 
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" 
                  alt="Zalo" 
                  className="zalo-logo" 
                />
                <span>Liên hệ Zalo: {targetZalo}</span>
              </a>

              {/* Direct Buy/Rent Button */}
              {!isSold ? (
                <button 
                  className="account-detail-btn account-detail-buy"
                  onClick={() => onBuyNow(account)}
                >
                  <Flame size={18} />
                  <span>THUÊ NGAY QUA ZALO</span>
                </button>
              ) : (
                <div className="account-detail-sold-notice">
                  🔴 TÀI KHOẢN NÀY ĐÃ ĐƯỢC THUÊ / BÁN
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Chi tiết sản phẩm Section */}
        <div className="account-section mt-4">
          <div className="account-section-head flex items-center gap-2">
            <Info size={18} className="text-primary" />
            <span>Chi tiết sản phẩm</span>
          </div>
          <div className="account-section-body">
            <div className="detail-specs-summary-grid">
              <div className="spec-row-item">
                <span className="label">Loại Game:</span>
                <span className="val font-bold uppercase text-primary">
                  {isLQ ? 'Liên Quân Mobile' : 'Free Fire'}
                </span>
              </div>
              <div className="spec-row-item">
                <span className="label">Tình trạng:</span>
                <span className="val text-green-600 font-bold">
                  {isSold ? 'Đã bán' : 'Còn hàng (Giao dịch ngay)'}
                </span>
              </div>
              <div className="spec-row-item">
                <span className="label">Độ bảo mật:</span>
                <span className="val text-green-600 font-bold">
                  100% Thông tin trắng - Đổi mật khẩu ngay
                </span>
              </div>
              {account.skins > 0 && (
                <div className="spec-row-item">
                  <span className="label">Trang phục:</span>
                  <span className="val">{account.skins} Skin</span>
                </div>
              )}
            </div>

            {account.description && (
              <div className="account-detail-description mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Mô tả từ shop:</h4>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {account.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Hình ảnh sản phẩm Section (Full Image Gallery Stack) */}
        {images.length > 0 && (
          <div className="account-section mt-4">
            <div className="account-section-head flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-primary" />
                <span>Hình ảnh sản phẩm ({images.length} ảnh)</span>
              </div>
              <span className="text-xs text-slate-400">Bấm vào ảnh để phóng to</span>
            </div>
            <div className="account-section-body account-gallery">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="gallery-item-wrap cursor-pointer"
                  onClick={() => setLightboxImg(img)}
                  title={`Xem ảnh ${idx + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`${account.code || account.id} - ảnh ${idx + 1}`} 
                    loading="lazy" 
                  />
                  <span className="gallery-img-badge">Ảnh #{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. Lightbox Modal Preview */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button 
            className="lightbox-close" 
            onClick={() => setLightboxImg(null)}
            aria-label="Đóng xem ảnh"
          >
            <X size={32} />
          </button>
          <img 
            src={lightboxImg} 
            alt="Phóng to ảnh tài khoản" 
            className="lightbox-image" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
