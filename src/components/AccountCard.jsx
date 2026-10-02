import React from 'react';
import { 
  Flame, 
  Crown, 
  Eye, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  Crosshair,
  ShieldAlert,
  MessageCircle
} from 'lucide-react';
import './AccountCard.css';

export const formatVND = (num) => {
  if (!num) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(num)
    .replace('₫', 'đ');
};

export default function AccountCard({ account, onViewDetails, onBuyNow }) {
  const isFF = account.game === 'freefire';
  const isLQ = account.game === 'lienquan';
  const isSold = account.status === 'sold';

  // Calculate discount percentage if original price exists
  const discountPercent = account.originalPrice && account.originalPrice > account.price
    ? Math.round(((account.originalPrice - account.price) / account.originalPrice) * 100)
    : 0;

  return (
    <div className={`account-card ${isSold ? 'is-sold' : ''} ${account.isVip ? 'is-vip' : ''}`}>
      {/* Thumbnail & Badges */}
      <div className="card-thumb-wrap" onClick={() => onViewDetails(account)}>
        <img 
          src={account.thumbnail} 
          alt={account.title} 
          className="card-thumb-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg';
          }}
        />
        <div className="card-thumb-overlay">
          <button className="quick-view-hover-btn">
            <Eye size={16} />
            <span>XEM NHANH</span>
          </button>
        </div>

        {/* Top Badges */}
        <div className="card-badge-top-left">
          <span className={`card-badge-status ${isSold ? 'status-sold' : 'status-available'}`}>
            {isSold ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
            {isSold ? 'ĐÃ BÁN' : 'CÒN HÀNG'}
          </span>

          {account.isVip && (
            <span className="card-badge-vip">
              <Crown size={12} />
              VIP
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="card-discount-badge">
            -{discountPercent}%
          </div>
        )}

        <div className="card-game-tag">
          {isFF ? '🔥 FREE FIRE' : (isFCM ? '⚽ FC MOBILE' : '⚔️ LIÊN QUÂN')}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Code & Title */}
        <div className="card-header-info">
          <span className="card-acc-code">{account.code || account.id}</span>
          <span className="card-views-count"><Eye size={13} /> {account.views || 120}</span>
        </div>

        <h3 className="card-title" onClick={() => onViewDetails(account)} title={account.title}>
          {account.title}
        </h3>

        {/* Specs Grid */}
        <div className="card-specs-grid">
          <div className="spec-item">
            <span className="spec-label">Rank:</span>
            <span className="spec-value rank-highlight">
              <Trophy size={13} className="spec-icon" />
              {account.rank || 'Tự do'}
            </span>
          </div>

          <div className="spec-item">
            <span className="spec-label">Cấp độ:</span>
            <span className="spec-value">Lv {account.level || 30}</span>
          </div>

          {isLQ && (
            <>
              <div className="spec-item">
                <span className="spec-label">Trang phục:</span>
                <span className="spec-value">{account.skins || 150}+ skin</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Tướng:</span>
                <span className="spec-value">{account.characters || 'Full tướng'}</span>
              </div>
            </>
          )}

          {isFF && (
            <>
              <div className="spec-item">
                <span className="spec-label">Skin súng:</span>
                <span className="spec-value truncate">{account.gunSkins || 'AK Rồng, MP40'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Đồ hiếm:</span>
                <span className="spec-value text-red truncate">{account.rareItems || 'Đồ cổ S1-S2'}</span>
              </div>
            </>
          )}


        </div>

        {/* Price & Action */}
        <div className="card-footer">
          <div className="card-price-box">
            <div className="current-price">
              {formatVND(account.price)}
            </div>
            {account.originalPrice && account.originalPrice > account.price && (
              <div className="original-price">
                {formatVND(account.originalPrice)}
              </div>
            )}
          </div>

          <div className="card-actions-btn-group">
            <button 
              className="card-btn-view"
              onClick={() => onViewDetails(account)}
            >
              <Eye size={14} />
              <span>CHI TIẾT</span>
            </button>

            {!isSold && (
              <button 
                className="card-btn-buy"
                onClick={() => onBuyNow(account)}
                title="Thuê ngay qua Zalo"
              >
                <MessageCircle size={14} />
                <span>THUÊ QUA ZALO</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
