import React from 'react';
import './HomeBanners.css';

const DEFAULT_MAIN_BANNER = '/images/banners/main-banner.jpg';

const DEFAULT_SUPPORT_CARDS = [
  {
    id: 'sp-ff',
    title: 'Support Free Fire (0868 994 712)',
    image: '/images/banners/sp-ff.jpg',
    link: 'https://zalo.me/0868994712',
    badge: 'Zalo FF'
  },
  {
    id: 'sp-topup',
    title: 'Support và thu acc KC - QH - SÒ (0359 637 777)',
    image: '/images/banners/sp-topup.jpg',
    link: 'https://zalo.me/0359637777',
    badge: 'Topup'
  },
  {
    id: 'sp-fcm',
    title: 'Support FC Mobile (0963 566 724)',
    image: '/images/banners/sp-fcm.jpg',
    link: 'https://zalo.me/0963566724',
    badge: 'Zalo FCM'
  },
  {
    id: 'sp-lq',
    title: 'Thu acc và support Liên Quân (0977 296 049)',
    image: '/images/banners/sp-lq.jpg',
    link: 'https://zalo.me/0977296049',
    badge: 'Zalo LQ'
  }
];

export default function HomeBanners({ shopConfig = {}, onSelectGame }) {
  const supportCards = (shopConfig.supportCards && Array.isArray(shopConfig.supportCards) && shopConfig.supportCards.length >= 4)
    ? shopConfig.supportCards
    : DEFAULT_SUPPORT_CARDS;

  const mainBannerSrc = (!shopConfig?.mainBanner || shopConfig.mainBanner.includes('shoptyseisei.net/uploads'))
    ? DEFAULT_MAIN_BANNER
    : shopConfig.mainBanner;

  return (
    <section className="home-top-section">
      {/* 1. Main Banner Card with 4 Support Links */}
      <div className="main-banner-card">
        <div className="main-banner-img-wrap">
          <img 
            src={mainBannerSrc} 
            alt="Main Banner - Shop Ty" 
            className="main-banner-img"
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_MAIN_BANNER;
            }}
          />
        </div>

        {/* 4 Quick Support Cards Grid (2x2) */}
        <div className="support-cards-grid">
          {supportCards.map((card, idx) => {
            const fallback = DEFAULT_SUPPORT_CARDS[idx] || DEFAULT_SUPPORT_CARDS[0];
            let directLink = card.link || fallback.link;

            if (card.id === 'sp-ff' || card.id === 'sp-rent') {
              const ffNum = (shopConfig.zaloFF || '0868994712').replace(/\s+/g, '');
              directLink = `https://zalo.me/${ffNum}`;
            } else if (card.id === 'sp-fcm') {
              const fcmNum = (shopConfig.zaloFCM || '0963566724').replace(/\s+/g, '');
              directLink = `https://zalo.me/${fcmNum}`;
            } else if (card.id === 'sp-lq') {
              const lqNum = (shopConfig.zaloLQ || '0977296049').replace(/\s+/g, '');
              directLink = `https://zalo.me/${lqNum}`;
            } else if (card.id === 'sp-topup') {
              const topupNum = (shopConfig.hotline || '0359637777').replace(/\s+/g, '');
              directLink = card.link || `https://zalo.me/${topupNum}`;
            }

            const cardImg = (!card.image || card.image.includes('shoptyseisei.net/uploads'))
              ? fallback.image
              : card.image;

            return (
              <a 
                key={card.id || idx}
                href={directLink}
                target="_blank"
                rel="noopener noreferrer"
                className="support-card-item"
                title={card.title || fallback.title}
              >
                <img 
                  src={cardImg} 
                  alt={card.title || fallback.title} 
                  className="support-card-img"
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallback.image;
                  }}
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
