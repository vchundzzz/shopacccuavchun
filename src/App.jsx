import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HomeBanners from './components/HomeBanners';
import GameSections from './components/GameSections';
import AccountCard from './components/AccountCard';
import AccountDetailPage from './components/AccountDetailPage';
import BuyZaloModal from './components/BuyZaloModal';
import AnnouncementModal from './components/AnnouncementModal';
import FloatingWidgets from './components/FloatingWidgets';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import FilterSection from './components/FilterSection';
import CategoryShowroom from './components/CategoryShowroom';
import BubbleEffect from './components/BubbleEffect';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import { storage } from './services/storage';
import { ArrowLeft, Gamepad2, Sparkles, Trophy, Flame } from 'lucide-react';
import './App.css';

export default function App() {
  // App Data State (synced with storage)
  const [shopConfig, setShopConfig] = useState(() => storage.getShopConfig());
  const [accounts, setAccounts] = useState(() => storage.getAccounts());
  const [banners, setBanners] = useState(() => storage.getBanners());
  const [categories, setCategories] = useState(() => storage.getCategories());

  // Dedicated Admin Route & Authentication
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.hash === '#admin' || window.location.hash.startsWith('#/admin') || window.location.pathname === '/admin';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return storage.isAdminLoggedIn();
  });

  // UI Navigation State for Storefront
  const [activeTab, setActiveTab] = useState('home'); // home | category | freefire | lienquan | account-detail
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // Modals state
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(() => {
    return !sessionStorage.getItem('announcement_closed');
  });

  // Selected Account for Modals
  const [buyingAccount, setBuyingAccount] = useState(null);

  // Theme Toggles (Dark / Light & Grayscale)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isGrayscale, setIsGrayscale] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (isGrayscale) {
      document.body.classList.add('grayscale-mode');
    } else {
      document.body.classList.remove('grayscale-mode');
    }
  }, [isGrayscale]);

  // Load latest data from Cloud Database on startup & window focus (auto-sync for all visitors)
  useEffect(() => {
    const syncData = () => {
      storage.fetchFromCloud().then(cloudData => {
        if (cloudData) {
          if (cloudData.shopConfig) setShopConfig(cloudData.shopConfig);
          if (Array.isArray(cloudData.accounts)) setAccounts(cloudData.accounts);
          if (Array.isArray(cloudData.banners)) setBanners(cloudData.banners);
          if (Array.isArray(cloudData.categories)) setCategories(cloudData.categories);
        }
      });
    };
    syncData();
    window.addEventListener('focus', syncData);
    return () => window.removeEventListener('focus', syncData);
  }, []);

  // Listen to hash change (e.g. when typing #admin or navigating to #/tai-khoan/:id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      const isAdm = hash === '#admin' || hash.startsWith('#/admin') || window.location.pathname === '/admin';
      setIsAdminRoute(isAdm);
      if (isAdm) {
        setIsAdminAuthenticated(storage.isAdminLoggedIn());
        return;
      }
      
      // Direct category or product detail link matching shoptyseisei
      if (hash.startsWith('#/tai-khoan/') || hash.startsWith('#/thong-tin/') || hash.startsWith('#/acc/')) {
        const parts = hash.split('/');
        const idOrCode = parts[2];
        if (idOrCode) {
          const isCat = categories.some(c => c.id === idOrCode);
          if (isCat || idOrCode.startsWith('ff-') || idOrCode.startsWith('lq-') || idOrCode.includes('duoi')) {
            setSelectedCategoryId(idOrCode);
            setActiveTab('category');
          } else {
            setSelectedAccountId(idOrCode);
            setActiveTab('account-detail');
          }
        }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Filter State for catalog view
  const defaultFilters = {
    game: 'all',
    priceRange: 'all',
    status: 'all',
    sort: 'featured'
  };
  const [filters, setFilters] = useState(defaultFilters);

  // Handlers for data updates
  const handleUpdateAccounts = (newAccounts) => {
    setAccounts(newAccounts);
    storage.saveAccounts(newAccounts);
  };

  const handleUpdateBanners = (newBanners) => {
    setBanners(newBanners);
    storage.saveBanners(newBanners);
  };

  const handleUpdateCategories = (newCategories) => {
    setCategories(newCategories);
    storage.saveCategories(newCategories);
  };

  const handleUpdateShopConfig = (newCfg) => {
    const merged = { ...shopConfig, ...newCfg };
    setShopConfig(merged);
    storage.saveShopConfig(merged);
  };

  const handleResetData = () => {
    const fresh = storage.resetToDefault();
    setAccounts(fresh.accounts);
    setBanners(fresh.banners);
    setCategories(fresh.categories);
    setShopConfig(fresh.shopConfig);
  };

  // Close announcement popup
  const handleCloseAnnouncement = () => {
    setIsAnnouncementOpen(false);
    sessionStorage.setItem('announcement_closed', 'true');
  };

  // Select category from GameSections
  const handleSelectCategory = (catId) => {
    setSelectedCategoryId(catId);
    setActiveTab('category');
    window.location.hash = `#/tai-khoan/${catId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // View details -> Opens dedicated product detail page like shoptyseisei.net/tai-khoan/thong-tin/...
  const handleViewDetails = (acc) => {
    const code = acc.code ? acc.code.replace('#', '') : acc.id;
    setSelectedAccountId(code);
    setActiveTab('account-detail');
    window.location.hash = `#/tai-khoan/${code}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, views: (a.views || 0) + 1 } : a));
  };

  // Buy now -> Direct push to Zalo + Open guidance modal
  const handleBuyNow = (acc) => {
    const isLQ = acc.game === 'lienquan';
    const targetZalo = isLQ 
      ? (shopConfig.zaloLQ || '0977296049') 
      : (shopConfig.zaloFF || '0868994712');

    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(acc.price);
    const msg = `Chào Shop, tôi muốn thuê tài khoản mã [${acc.code || acc.id}] giá ${formattedPrice}. Vui lòng hỗ trợ giao dịch giúp tôi!`;
    const zaloDirectLink = `https://zalo.me/${targetZalo}?text=${encodeURIComponent(msg)}`;

    try {
      window.open(zaloDirectLink, '_blank');
    } catch (e) {
      console.error('Error opening Zalo directly:', e);
    }
    setBuyingAccount(acc);
  };

  // Resolve the currently viewed account from state & storage
  const viewedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    const clean = selectedAccountId.toString().replace('#', '').toLowerCase();
    return accounts.find(a => 
      a.id.toString() === selectedAccountId ||
      (a.code && a.code.replace('#', '').toLowerCase() === clean) ||
      (a.id && a.id.toString().toLowerCase() === clean)
    ) || null;
  }, [selectedAccountId, accounts]);

  // Filtered accounts for category or game catalog
  const currentCategory = useMemo(() => {
    if (activeTab === 'category' && selectedCategoryId) {
      return categories.find(c => c.id === selectedCategoryId) || null;
    }
    return null;
  }, [activeTab, selectedCategoryId, categories]);

  const catalogAccounts = useMemo(() => {
    return accounts.filter(acc => {
      if (acc.hidden) return false;
      if (acc.game === 'fcmobile') return false; // Exclude FC Mobile

      // Filter by active category
      if (activeTab === 'category' && selectedCategoryId) {
        if (acc.categoryId !== selectedCategoryId) return false;
      }

      // Filter by game tab
      if (activeTab === 'freefire' && acc.game !== 'freefire') return false;
      if (activeTab === 'lienquan' && acc.game !== 'lienquan') return false;

      // Filter by game dropdown in filters
      if (filters.game !== 'all' && acc.game !== filters.game) return false;

      // Filter by status
      if (filters.status !== 'all' && acc.status !== filters.status) return false;

      // Filter by price range
      const p = Number(acc.price) || 0;
      if (filters.priceRange === 'under-1m' && p >= 1000000) return false;
      if (filters.priceRange === '1m-3m' && (p < 1000000 || p >= 3000000)) return false;
      if (filters.priceRange === '3m-7m' && (p < 3000000 || p >= 7000000)) return false;
      if (filters.priceRange === '7m-15m' && (p < 7000000 || p >= 15000000)) return false;
      if (filters.priceRange === 'super-vip' && p < 15000000) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      if (filters.sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      
      // Default: available first, then VIP
      if (a.status === 'sold' && b.status !== 'sold') return 1;
      if (b.status === 'sold' && a.status !== 'sold') return -1;
      return (b.isVip ? 1 : 0) - (a.isVip ? 1 : 0);
    });
  }, [accounts, activeTab, selectedCategoryId, filters]);

  // If user navigates to the dedicated Admin route (#admin)
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin 
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToShop={() => {
            if (window.location.pathname === '/admin') {
              window.history.pushState(null, '', '/');
            }
            window.location.hash = '';
            setIsAdminRoute(false);
          }}
        />
      );
    }

    return (
      <AdminLayout 
        accounts={accounts}
        banners={banners}
        categories={categories}
        shopConfig={shopConfig}
        onUpdateAccounts={handleUpdateAccounts}
        onUpdateBanners={handleUpdateBanners}
        onUpdateCategories={handleUpdateCategories}
        onUpdateShopConfig={handleUpdateShopConfig}
        onResetData={handleResetData}
        onExitAdmin={() => {
          if (window.location.pathname === '/admin') {
            window.history.pushState(null, '', '/');
          }
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
        onLogout={() => {
          storage.logoutAdmin();
          setIsAdminAuthenticated(false);
          if (window.location.pathname === '/admin') {
            window.history.pushState(null, '', '/');
          }
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="app-wrapper">
      {/* Floating Soap Bubbles Effect */}
      <BubbleEffect count={24} />

      {/* 1. Main Content Wrapper */}
      <div className="layout-content-wrapper">
        {/* Floating Top Navbar Header */}
        <Navbar 
          shopConfig={shopConfig}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedAccountId(null);
            if (tab === 'home') {
              setSelectedCategoryId(null);
              window.location.hash = '';
            }
          }}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          isGrayscale={isGrayscale}
          onToggleGrayscale={() => setIsGrayscale(!isGrayscale)}
        />

        {/* Content Container */}
        <main className="site-container">
          {/* VIEW A: TRANG CHỦ SHOWROOM */}
          {activeTab === 'home' && (
            <>
              {/* Home Banners (Top Banner + 4 Support Cards + Quick Game Picker) */}
              <HomeBanners 
                shopConfig={shopConfig}
                onSelectGame={(game) => {
                  const el = document.getElementById(game);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Game Sections (Free Fire, FC Mobile, and Liên Quân with ONLY "NICK LIÊN QUÂN CỰC PHẨM") */}
              <GameSections 
                shopConfig={shopConfig}
                categories={categories}
                accounts={accounts}
                onSelectCategory={handleSelectCategory}
              />
            </>
          )}

          {/* VIEW B: DANH MỤC ACC (Category or Game catalog view) - CHUẨN SHOWROOM SHOPTYSEISEI */}
          {(activeTab === 'category' || activeTab === 'freefire' || activeTab === 'lienquan') && (
            <CategoryShowroom 
              currentCategory={currentCategory}
              activeTab={activeTab}
              accounts={accounts}
              shopConfig={shopConfig}
              onBack={() => {
                setActiveTab('home');
                setSelectedCategoryId(null);
                window.location.hash = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewDetails={handleViewDetails}
              onBuyNow={handleBuyNow}
            />
          )}

          {/* VIEW C: TRANG CHI TIẾT TÀI KHOẢN (CHUẨN SHOPTYSEISEI /tai-khoan/thong-tin/...) */}
          {activeTab === 'account-detail' && (
            viewedAccount ? (
              <AccountDetailPage 
                account={viewedAccount}
                categories={categories}
                shopConfig={shopConfig}
                onBack={() => {
                  if (selectedCategoryId) {
                    setActiveTab('category');
                    window.location.hash = `#/tai-khoan/${selectedCategoryId}`;
                  } else {
                    setActiveTab('home');
                    window.location.hash = '';
                  }
                  setSelectedAccountId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBuyNow={handleBuyNow}
              />
            ) : (
              <div className="py-16 text-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  Không tìm thấy tài khoản hoặc tài khoản đã ngừng bán
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Mã tài khoản bạn đang tìm không tồn tại hoặc đã được xóa khỏi hệ thống.
                </p>
                <button 
                  className="btn-gaming-primary"
                  onClick={() => {
                    setActiveTab('home');
                    setSelectedAccountId(null);
                    window.location.hash = '';
                  }}
                >
                  Quay lại Showroom
                </button>
              </div>
            )
          )}
        </main>

        {/* Footer */}
        <Footer 
          shopConfig={shopConfig}
          onSecretAdminTrigger={() => {
            window.location.hash = '#admin';
            setIsAdminRoute(true);
          }}
        />
      </div>

      {/* 3. Mobile Bottom Sticky Navigation */}
      <MobileNav 
        shopConfig={shopConfig}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedAccountId(null);
          if (tab === 'home') {
            setSelectedCategoryId(null);
            window.location.hash = '';
          }
        }}
      />

      {/* 4. Floating Contact Widgets (Zalo, Facebook, Back-To-Top) */}
      <FloatingWidgets shopConfig={shopConfig} />

      {/* 5. Modals */}
      {/* A. SweetAlert-style Announcement Modal */}
      {shopConfig.popupAnnouncement?.enabled !== false && (
        <AnnouncementModal 
          shopConfig={shopConfig}
          isOpen={isAnnouncementOpen}
          onClose={handleCloseAnnouncement}
        />
      )}


      {/* C. Buy / Rent via Direct Zalo Modal */}
      {buyingAccount && (
        <BuyZaloModal 
          account={buyingAccount}
          shopConfig={shopConfig}
          onClose={() => setBuyingAccount(null)}
        />
      )}
    </div>
  );
}
