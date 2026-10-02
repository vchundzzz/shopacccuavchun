import React from 'react';
import { 
  Home, 
  Flame, 
  Trophy, 
  Crown, 
  MessageCircle, 
  Moon, 
  Sun, 
  Palette 
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ 
  shopConfig = {}, 
  activeTab, 
  setActiveTab, 
  isDark,
  onToggleDark,
  isGrayscale,
  onToggleGrayscale
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Left Side: Shop Brand & Logo */}
        <div className="header-left">
          <div 
            className={`header-logo ${isDark ? 'logo-theme-dark' : 'logo-theme-light'}`} 
            onClick={() => handleNav('home')} 
            title="Về Trang Chủ"
          >
            <img 
              src={(isDark ? (shopConfig.whiteLogo || shopConfig.blackLogo) : (shopConfig.blackLogo || shopConfig.whiteLogo)) || "/images/logo-shopvanchung.png"} 
              alt={shopConfig.shopName || 'SHOPVANCHUNG'} 
            />
          </div>
        </div>

        {/* Center: Game Catalogs & Direct Navigation Menu */}
        <nav className="header-main-nav hidden md:flex">
          <ul className="main-nav-list">
            {/* Trang Chủ */}
            <li className="main-nav-item">
              <button 
                className={`main-nav-link ${activeTab === 'home' ? 'is-active text-primary' : ''}`}
                onClick={() => handleNav('home')}
              >
                <Home size={18} className="nav-icon" />
                <span>Trang Chủ</span>
              </button>
            </li>

            {/* Free Fire */}
            <li className="main-nav-item">
              <button 
                className={`main-nav-link ${activeTab === 'freefire' ? 'is-active text-primary' : ''}`}
                onClick={() => handleNav('freefire')}
              >
                <Flame size={18} className="nav-icon text-red-500" />
                <span>Free Fire</span>
              </button>
            </li>


            {/* Liên Quân */}
            <li className="main-nav-item">
              <button 
                className={`main-nav-link ${activeTab === 'lienquan' ? 'is-active text-primary' : ''}`}
                onClick={() => handleNav('lienquan')}
              >
                <Crown size={18} className="nav-icon text-yellow-500" />
                <span>Liên Quân VIP</span>
              </button>
            </li>

            {/* Chat Zalo Trực Tiếp */}
            <li className="main-nav-item">
              <a 
                href={`https://zalo.me/${shopConfig.zaloFF || '0868994712'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="main-nav-link"
              >
                <MessageCircle size={18} className="nav-icon text-blue-500" />
                <span>Chat Zalo</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Tools: Dark/Light, Grayscale & Hotline Zalo Pill */}
        <div className="header-right-tools">
          {/* Dark / Light Mode Toggle */}
          <button 
            className="tool-circle-btn" 
            onClick={onToggleDark} 
            title={isDark ? 'Chế độ Sáng' : 'Chế độ Tối'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Grayscale Toggle */}
          <button 
            className={`tool-circle-btn ${isGrayscale ? 'active' : ''}`}
            onClick={onToggleGrayscale}
            title="Chuyển chế độ trắng đen"
          >
            <Palette size={18} />
          </button>

          {/* Direct Zalo Hotline Pill */}
          <a 
            href={`https://zalo.me/${shopConfig.zaloFF || '0868994712'}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="navbar-zalo-pill"
            title="Chat ngay qua Zalo"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:inline">Zalo: {shopConfig.zaloFF || '0868994712'}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
