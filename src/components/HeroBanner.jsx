import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import './HeroBanner.css';

export default function HeroBanner({ banners, onBannerClick }) {
  const activeBanners = banners?.filter(b => b.active) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section className="hero-banner-section">
      <div className="container">
        <div className="hero-carousel-wrapper">
          {/* Main Slide */}
          <div 
            className="hero-slide"
            style={{ backgroundImage: `url(${current.image})` }}
          >
            <div className="hero-slide-overlay"></div>

            <div className="hero-slide-content">
              {/* Badges */}
              <div className="hero-badge-row">
                {current.tag && (
                  <span className="badge-gaming badge-fire">
                    <Flame size={14} />
                    {current.tag}
                  </span>
                )}
                {current.badge && (
                  <span className="badge-gaming badge-vip">
                    <Sparkles size={14} />
                    {current.badge}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h1 className="hero-slide-title">
                {current.title}
              </h1>

              <p className="hero-slide-subtitle">
                {current.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="hero-action-row">
                <button 
                  className="btn-gaming-primary hero-cta-btn"
                  onClick={() => onBannerClick(current.link || current.id)}
                >
                  <span>{current.buttonText || 'XEM CHI TIẾT'}</span>
                  <ArrowRight size={18} />
                </button>

                <div className="hero-security-note">
                  <ShieldAlert size={16} className="text-fire" />
                  <span>Cam kết đổi trả 100% nếu có lỗi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {activeBanners.length > 1 && (
            <>
              <button className="carousel-control prev" onClick={handlePrev} aria-label="Previous Banner">
                <ChevronLeft size={24} />
              </button>
              <button className="carousel-control next" onClick={handleNext} aria-label="Next Banner">
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className="carousel-indicators">
                {activeBanners.map((b, idx) => (
                  <button
                    key={b.id || idx}
                    className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
