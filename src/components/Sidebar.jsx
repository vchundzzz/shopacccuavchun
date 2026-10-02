import React from 'react';
import { 
  LayoutDashboard, 
  MessageCircle, 
  LogIn, 
  UserPlus, 
  X,
  CircleDot,
  Circle
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ 
  shopConfig, 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab,
  onOpenAuth
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}

      {/* Sidebar Element */}
      <aside className={`sidebar-wrapper ${isOpen ? 'mobile-open' : ''}`}>
        {/* Logo Segment */}
        <div className="sidebar-logo-segment">
          <div className="sidebar-logo-link" onClick={() => handleNav('home')} title={shopConfig.shopName || 'SHOPVANCHUNG'}>
            <img 
              src={shopConfig.whiteLogo || shopConfig.blackLogo || "/images/logo-shopvanchung.png"} 
              alt={shopConfig.shopName || 'SHOPVANCHUNG'} 
              className="sidebar-logo-img"
            />
          </div>

          <div className="sidebar-collapse-btn hidden xl:flex" title="Thu gọn menu">
            <CircleDot size={20} className="text-slate-700 dark:text-slate-200" />
          </div>

          <button className="sidebar-close-btn xl:hidden" onClick={onClose} title="Đóng menu">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="sidebar-menu-container">
          <div className="sidebar-menu-title">DANH MỤC</div>

          <ul className="sidebar-nav-list">
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                <div className="nav-item-content">
                  <LayoutDashboard size={20} className="nav-icon" />
                  <span>Show Room</span>
                </div>
              </button>
            </li>

            <li>
              <a 
                href={`https://zalo.me/${shopConfig.zaloFF || '0868994712'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-nav-item"
                onClick={onClose}
              >
                <div className="nav-item-content">
                  <MessageCircle size={20} className="nav-icon" />
                  <span>Chat Zalo</span>
                </div>
              </a>
            </li>

            <li>
              <button 
                className="sidebar-nav-item"
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('login');
                  if (onClose) onClose();
                }}
              >
                <div className="nav-item-content">
                  <LogIn size={20} className="nav-icon" />
                  <span>Đăng Nhập</span>
                </div>
              </button>
            </li>

            <li>
              <button 
                className="sidebar-nav-item"
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('register');
                  if (onClose) onClose();
                }}
              >
                <div className="nav-item-content">
                  <UserPlus size={20} className="nav-icon" />
                  <span>Đăng Ký</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
