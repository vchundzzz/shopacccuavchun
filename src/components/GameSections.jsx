import React from 'react';
import './GameSections.css';

export default function GameSections({ 
  shopConfig, 
  categories, 
  accounts, 
  onSelectCategory 
}) {
  const gameHeaders = shopConfig.gameHeaders || {};

  // Filter categories by game
  const ffCategories = categories.filter(c => c.game === 'freefire');
  // USER SPECIFICATION: In Liên Quân, only include "NICK LIÊN QUÂN CỰC PHẨM", no random!
  const lqCategories = categories.filter(c => c.game === 'lienquan' && c.id === 'lq-cuc-pham');

  // Count accounts in a category
  const countAccounts = (catId) => {
    return accounts.filter(a => a.categoryId === catId && a.status === 'available' && !a.hidden).length;
  };

  const renderCategoryCard = (category) => {
    const accCount = countAccounts(category.id);

    return (
      <div 
        key={category.id} 
        className="category-showcase-card border border-primary bg-white dark:bg-slate-800"
        onClick={() => onSelectCategory(category.id)}
      >
        <div className="category-card-thumb">
          <img 
            src={category.image} 
            alt={category.name} 
            loading="lazy" 
          />
          <span className="category-stock-badge">
            Còn {accCount} nick
          </span>
        </div>

        <div className="category-card-info">
          <h3 className="category-card-title">
            {category.name}
          </h3>
          <div className="category-card-sub">
            Xem ảnh tại đây
          </div>

          <div className="category-card-btn-wrap">
            <button 
              className="category-view-all-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(category.id);
              }}
            >
              <span>XEM CHI TIẾT</span>
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-sections-container">
      {/* ================= 1. FREE FIRE SECTION ================= */}
      <section id="freefire" className="game-section-item">
        <div className="game-section-head">
          <img 
            src={gameHeaders.freefire?.banner || "https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/07/07/img_6a4c82265ec8e_1783398950.png"} 
            alt="ACC FREE FIRE VIP PRO" 
            className="game-banner-title"
          />

          <a 
            href={`https://zalo.me/${(shopConfig.zaloFF || '0868994712').replace(/\s+/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="game-support-link-btn"
            title="Liên hệ Zalo hỗ trợ Free Fire"
          >
            <img 
              src={gameHeaders.freefire?.supportBanner || "/images/banners/sp-ff.jpg"} 
              alt="Support Free Fire" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/banners/sp-ff.jpg";
              }}
            />
          </a>
        </div>

        <div className="category-grid">
          {ffCategories.map(renderCategoryCard)}
        </div>
      </section>


      {/* ================= 3. LIÊN QUÂN SECTION (ONLY NICK LIÊN QUÂN CỰC PHẨM, NO RANDOM) ================= */}
      <section id="lienquan" className="game-section-item">
        <div className="game-section-head">
          <img 
            src={gameHeaders.lienquan?.banner || "https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/05/07/img_69fc221b2eacc_1778131483.png"} 
            alt="Acc Liên Quân Rẻ Chất" 
            className="game-banner-title"
          />

          <a 
            href={`https://zalo.me/${(shopConfig.zaloLQ || '0977296049').replace(/\s+/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="game-support-link-btn"
            title="Thu acc và support Liên Quân"
          >
            <img 
              src={gameHeaders.lienquan?.supportBanner || "/images/banners/sp-lq.jpg"} 
              alt="Support Liên Quân" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/banners/sp-lq.jpg";
              }}
            />
          </a>
        </div>

        {/* User requirement: ONLY "NICK LIÊN QUÂN CỰC PHẨM", no random */}
        <div className="category-grid lq-single-grid">
          {lqCategories.map(renderCategoryCard)}
        </div>
      </section>
    </div>
  );
}
