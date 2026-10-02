import React from 'react';
import './HomeBanners.css';

export default function HomeBanners({ shopConfig, onSelectGame }) {
  const supportCards = shopConfig.supportCards || [];

  return (
    <section className="home-top-section">
      {/* 1. Main Banner Card with 4 Support Links */}
      <div className="main-banner-card bg-white border border-primary p-3 rounded-lg shadow-sm dark:bg-slate-800">
        <div className="main-banner-img-wrap">
          <img 
            src={shopConfig.mainBanner || "https://shoptyseisei.net/uploads/03-09-2026/ee76f8d7-7306-4d6c-9a8b-7f0b60703bea.jpg"} 
            alt="Main Banner" 
            className="w-full rounded-md object-cover"
          />
        </div>

        {/* 4 Quick Support Cards Grid */}
        <div className="support-cards-grid mt-3">
          {supportCards.map((card) => {
            let directLink = card.link;
            if (card.id === 'sp-ff' || card.id === 'sp-rent') {
              const ffNum = (shopConfig.zaloFF || '0868994712').replace(/\s+/g, '');
              directLink = `https://zalo.me/${ffNum}`;
            } else if (card.id === 'sp-lq') {
              const lqNum = (shopConfig.zaloLQ || '0977296049').replace(/\s+/g, '');
              directLink = `https://zalo.me/${lqNum}`;
            }
            return (
              <a 
                key={card.id}
                href={directLink}
                target="_blank"
                rel="noopener noreferrer"
                className="support-card-item"
                title={card.title}
              >
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="support-card-img"
                />
              </a>
            );
          })}
        </div>
      </div>

      {/* 2. "Bạn muốn mua acc game gì?" Section */}
      <div className="home-featured-shortcuts">
        <div className="home-featured-shortcuts__panel">
          <p className="home-featured-shortcuts__title">
            Bạn muốn mua acc game gì?
          </p>

          <div className="home-featured-shortcuts__items">
            {/* Free Fire */}
            <a 
              href="#freefire" 
              className="home-featured-shortcuts__item"
              onClick={(e) => {
                e.preventDefault();
                onSelectGame('freefire');
                const el = document.getElementById('freefire');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="home-featured-shortcuts__icon">
                <img 
                  src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/icon.png" 
                  alt="Free Fire" 
                  loading="lazy" 
                />
                <span className="home-featured-shortcuts__hot">HOT</span>
              </div>
              <span className="home-featured-shortcuts__label">Free Fire</span>
            </a>


            {/* Liên Quân */}
            <a 
              href="#lienquan" 
              className="home-featured-shortcuts__item"
              onClick={(e) => {
                e.preventDefault();
                onSelectGame('lienquan');
                const el = document.getElementById('lienquan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="home-featured-shortcuts__icon">
                <img 
                  src="https://cdn-gop.garenanow.com/gop/app/0000/100/054/icon.png" 
                  alt="Liên Quân" 
                  loading="lazy" 
                />
              </div>
              <span className="home-featured-shortcuts__label">Liên Quân</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
