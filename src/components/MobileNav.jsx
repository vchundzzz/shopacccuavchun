import React from 'react';
import { Home, Flame, Crown, MessageCircle } from 'lucide-react';
import './MobileNav.css';

export default function MobileNav({ 
  shopConfig = {}, 
  activeTab, 
  setActiveTab 
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="mobile-nav-bottom md:hidden" aria-label="Điều hướng trên điện thoại">
      {/* Trang Chủ */}
      <button 
        className={`mobile-nav-bottom__item ${activeTab === 'home' ? 'is-active' : ''}`}
        onClick={() => handleNav('home')}
      >
        <span className="mobile-nav-bottom__icon">
          <Home size={20} />
        </span>
        <span className="mobile-nav-bottom__label">Trang Chủ</span>
      </button>

      {/* Free Fire */}
      <button 
        className={`mobile-nav-bottom__item ${activeTab === 'freefire' ? 'is-active' : ''}`}
        onClick={() => handleNav('freefire')}
      >
        <span className="mobile-nav-bottom__icon">
          <Flame size={20} />
        </span>
        <span className="mobile-nav-bottom__label">Free Fire</span>
      </button>

      {/* Chat Zalo (Nổi bật chính giữa) */}
      <a 
        href={`https://zalo.me/${shopConfig.zaloFF || '0868994712'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-nav-bottom__item mobile-nav-bottom__item--primary"
        title="Chat Zalo ngay"
      >
        <span className="mobile-nav-bottom__icon">
          <MessageCircle size={24} />
        </span>
        <span className="mobile-nav-bottom__label">Chat Zalo</span>
      </a>

      {/* Liên Quân */}
      <button 
        className={`mobile-nav-bottom__item ${activeTab === 'lienquan' ? 'is-active' : ''}`}
        onClick={() => handleNav('lienquan')}
      >
        <span className="mobile-nav-bottom__icon">
          <Crown size={20} />
        </span>
        <span className="mobile-nav-bottom__label">Liên Quân</span>
      </button>
    </nav>
  );
}
