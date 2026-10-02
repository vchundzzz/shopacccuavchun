import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HomeBanners.css';

export default function HomeBanners({ shopConfig, banners = [], onSelectGame, onNavigate }) {
  const supportCards = shopConfig.supportCards || [];

  // Filter active banners with valid images
  const activeBanners = (banners || []).filter(b => b.active !== false && b.image);
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  // Auto slide timer
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  // Keep index in range if banners length changes
  useEffect(() => {
    if (currentSlide >= activeBanners.length && activeBanners.length > 0) {
      setCurrentSlide(0);
    }
  }, [activeBanners.length, currentSlide]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  };

  const handleBannerClick = (b) => {
    if (!b?.link) return;
    const link = b.link.trim();
    if (link.startsWith('#')) {
      if (link === '#freefire' || link === '#lienquan') {
        const game = link.replace('#', '');
        if (onSelectGame) onSelectGame(game);
        const el = document.getElementById(game);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = link;
      }
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      window.location.hash = link.startsWith('/') ? `#${link}` : `#/${link}`;
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Fallback single banner image
  const fallbackImage = shopConfig.mainBanner || "/images/banner-shopvanchung.png";

  return (
    <section className="home-top-section">
      {/* 1. Main Banner Card with Slider or Static Image + 4 Support Links */}
      <div className="main-banner-card bg-white border border-primary p-3 rounded-lg shadow-sm dark:bg-slate-800">
        
        {/* Banner Carousel Display */}
        {activeBanners.length > 0 ? (
          <div 
            className="home-slider-container relative rounded-lg overflow-hidden select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="home-slider-track flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {activeBanners.map((b, idx) => (
                <div 
                  key={b.id || idx}
                  className="home-slider-slide min-w-full cursor-pointer relative"
                  onClick={() => handleBannerClick(b)}
                >
                  <img 
                    src={b.image} 
                    alt={b.title || `Banner ${idx + 1}`} 
                    className="w-full h-auto object-cover rounded-md block aspect-[16/6] md:aspect-[16/5]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  {b.title && (
                    <div className="home-slider-caption absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                      <p className="text-xs md:text-sm font-bold truncate drop-shadow">{b.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            {activeBanners.length > 1 && (
              <>
                <button 
                  type="button" 
                  className="home-slider-nav home-slider-prev"
                  onClick={handlePrev}
                  aria-label="Banner trước"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  type="button" 
                  className="home-slider-nav home-slider-next"
                  onClick={handleNext}
                  aria-label="Banner tiếp theo"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Dot Indicators */}
                <div className="home-slider-dots">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`home-slider-dot ${idx === currentSlide ? 'is-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      aria-label={`Chuyển tới banner ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="main-banner-img-wrap">
            <img 
              src={fallbackImage} 
              alt="Main Banner" 
              className="w-full rounded-md object-cover aspect-[16/6] md:aspect-[16/5]"
            />
          </div>
        )}

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
