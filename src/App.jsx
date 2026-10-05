import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import SwipeBackIndicator from './components/SwipeBackIndicator';
import ClickSparkleEffect from './components/ClickSparkleEffect';
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

  const categoriesRef = useRef(categories);
  const accountsRef = useRef(accounts);
  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);
  useEffect(() => {
    accountsRef.current = accounts;
  }, [accounts]);

  // Facebook-style scroll positions & history stack depth
  const scrollPositionsRef = useRef({});
  const navDepthRef = useRef(0);

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

  // Facebook/iOS style Touch Swipe-Back Gesture State
  const [swipeState, setSwipeState] = useState({
    isActive: false,
    progress: 0,
    deltaX: 0,
    isReady: false
  });
  const touchStartRef = useRef(null);
  const isSwipingRef = useRef(false);

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

  // Thông báo lỗi đồng bộ
  const [syncError, setSyncError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

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

  // Tự chữa dung lượng localStorage khi mở trang
  useEffect(() => {
    let cancelled = false;
    storage.ensureLocalStorageHealthy().then(async (changed) => {
      if (cancelled || !changed) return;

      const fresh = {
        shopConfig: storage.getShopConfig(),
        accounts: storage.getAccounts(),
        banners: storage.getBanners(),
        categories: storage.getCategories()
      };
      setShopConfig(fresh.shopConfig);
      setAccounts(fresh.accounts);
      setBanners(fresh.banners);
      setCategories(fresh.categories);

      await storage.persistDataToDisk(fresh);
    });
    return () => { cancelled = true; };
  }, []);

  // Load latest data from Cloud Database on startup & window focus
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

  // Parse exact route from hash
  const parseRouteFromHash = useCallback((hash) => {
    const h = (hash || window.location.hash || '').trim();
    if (h === '#admin' || h.startsWith('#/admin') || window.location.pathname === '/admin') {
      return { type: 'admin' };
    }
    if (h.startsWith('#/tai-khoan/') || h.startsWith('#/thong-tin/') || h.startsWith('#/acc/')) {
      const parts = h.split('/');
      const idOrCode = parts[2] ? decodeURIComponent(parts[2]).trim() : '';
      if (idOrCode) {
        const cleanLower = idOrCode.toLowerCase().replace('#', '');
        const currentCats = categoriesRef.current || [];
        const currentAccs = accountsRef.current || [];
        
        const isKnownCategory = currentCats.some(c => c.id.toLowerCase() === cleanLower);
        const isKnownAccount = currentAccs.some(a => 
          a.id.toString().toLowerCase() === cleanLower ||
          (a.code && a.code.replace('#', '').toLowerCase() === cleanLower)
        );

        if (isKnownCategory) {
          return { type: 'category', categoryId: idOrCode };
        }
        if (isKnownAccount) {
          return { type: 'account-detail', accountId: idOrCode };
        }
        if (idOrCode.startsWith('ff-') || idOrCode.startsWith('lq-') || idOrCode.includes('duoi') || idOrCode.includes('cuc-pham')) {
          return { type: 'category', categoryId: idOrCode };
        }
        return { type: 'account-detail', accountId: idOrCode };
      }
    }
    if (h === '#/freefire' || h === '#freefire') {
      return { type: 'freefire' };
    }
    if (h === '#/lienquan' || h === '#lienquan') {
      return { type: 'lienquan' };
    }
    return { type: 'home' };
  }, []);

  // Push new history state while saving scroll position
  const navigateHash = useCallback((targetHash, replace = false) => {
    const currentKey = activeTab === 'category' ? `cat:${selectedCategoryId}` :
                       activeTab === 'account-detail' ? `acc:${selectedAccountId}` :
                       activeTab;
    scrollPositionsRef.current[currentKey] = window.scrollY;

    if (replace) {
      window.location.replace(targetHash);
    } else {
      if (window.location.hash !== targetHash) {
        navDepthRef.current += 1;
        window.location.hash = targetHash;
      }
    }
  }, [activeTab, selectedCategoryId, selectedAccountId]);

  // Facebook style back navigation
  const goBack = useCallback(() => {
    const currentKey = activeTab === 'category' ? `cat:${selectedCategoryId}` :
                       activeTab === 'account-detail' ? `acc:${selectedAccountId}` :
                       activeTab;
    scrollPositionsRef.current[currentKey] = window.scrollY;

    if (window.history.length > 1 && navDepthRef.current > 0) {
      navDepthRef.current -= 1;
      window.history.back();
    } else if (window.history.length > 1 && window.location.hash !== '' && window.location.hash !== '#/' && window.location.hash !== '#') {
      window.history.back();
    } else {
      if (activeTab === 'account-detail' && selectedCategoryId) {
        navigateHash(`#/tai-khoan/${selectedCategoryId}`);
      } else {
        navigateHash('#/');
      }
    }
  }, [activeTab, selectedCategoryId, selectedAccountId, navigateHash]);

  // Handle Hash & Popstate changes (Back/Forward buttons & native gestures)
  useEffect(() => {
    const handleNavigationChange = () => {
      const route = parseRouteFromHash(window.location.hash);
      if (route.type === 'admin') {
        setIsAdminRoute(true);
        setIsAdminAuthenticated(storage.isAdminLoggedIn());
        return;
      }

      setIsAdminRoute(false);
      let targetKey = 'home';

      if (route.type === 'category') {
        setSelectedCategoryId(route.categoryId);
        setSelectedAccountId(null);
        setActiveTab('category');
        targetKey = `cat:${route.categoryId}`;
      } else if (route.type === 'account-detail') {
        setSelectedAccountId(route.accountId);
        setActiveTab('account-detail');
        targetKey = `acc:${route.accountId}`;
      } else if (route.type === 'freefire') {
        setSelectedCategoryId(null);
        setSelectedAccountId(null);
        setActiveTab('freefire');
        targetKey = 'freefire';
      } else if (route.type === 'lienquan') {
        setSelectedCategoryId(null);
        setSelectedAccountId(null);
        setActiveTab('lienquan');
        targetKey = 'lienquan';
      } else {
        setSelectedCategoryId(null);
        setSelectedAccountId(null);
        setActiveTab('home');
        targetKey = 'home';
      }

      // Facebook-style restore scroll position
      const savedY = scrollPositionsRef.current[targetKey];
      if (typeof savedY === 'number') {
        setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: 'instant' });
        }, 15);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    handleNavigationChange();
    window.addEventListener('hashchange', handleNavigationChange);
    window.addEventListener('popstate', handleNavigationChange);
    return () => {
      window.removeEventListener('hashchange', handleNavigationChange);
      window.removeEventListener('popstate', handleNavigationChange);
    };
  }, [parseRouteFromHash]);

  // Touch Swipe-Back Gesture listener (Facebook / iOS style swipe right from left edge)
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (activeTab === 'home' && !isAdminRoute) return;

      const touch = e.touches[0];
      if (touch.clientX <= 55) {
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
        isSwipingRef.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isSwipingRef.current || !touchStartRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      if (deltaX < 0) {
        isSwipingRef.current = false;
        setSwipeState({ isActive: false, progress: 0, deltaX: 0, isReady: false });
        return;
      }

      if (Math.abs(deltaY) > deltaX * 0.8 && deltaX < 35) {
        isSwipingRef.current = false;
        setSwipeState({ isActive: false, progress: 0, deltaX: 0, isReady: false });
        return;
      }

      if (deltaX > 8) {
        const progress = Math.min(deltaX / 75, 1);
        const isReady = deltaX >= 65;
        setSwipeState({
          isActive: true,
          progress,
          deltaX,
          isReady
        });
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwipingRef.current || !touchStartRef.current) return;
      const lastX = e.changedTouches?.[0]?.clientX || touchStartRef.current.x;
      const deltaX = lastX - touchStartRef.current.x;

      if (deltaX >= 65) {
        if (navigator.vibrate) {
          try { navigator.vibrate(15); } catch (_) {}
        }
        goBack();
      }

      isSwipingRef.current = false;
      touchStartRef.current = null;
      setSwipeState({ isActive: false, progress: 0, deltaX: 0, isReady: false });
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [activeTab, isAdminRoute, goBack]);

  // Filter State for catalog view
  const defaultFilters = {
    game: 'all',
    priceRange: 'all',
    status: 'all',
    sort: 'featured'
  };
  const [filters, setFilters] = useState(defaultFilters);

  const handleSaveResult = (result, successMsg) => {
    if (result && result.quotaExceeded) {
      setSyncError('Bộ nhớ trình duyệt đã đầy! Dữ liệu chưa được lưu. Hãy dùng ảnh nhỏ hơn hoặc xoá bớt ảnh.');
      return false;
    }
    if (result && result.cloud && result.cloud.success === false && result.disk && result.disk.success === false) {
      setSyncError('Không lưu được lên Cloud Database: ' + (result.cloud.message || 'lỗi không xác định'));
      return false;
    }
    setSyncError(null);
    if (successMsg) setSaveMessage(successMsg);
    return true;
  };

  const handleUpdateAccounts = async (newAccounts) => {
    setAccounts(newAccounts);
    const res = await storage.saveAccounts(newAccounts);
    handleSaveResult(res);
  };

  const handleUpdateBanners = async (newBanners) => {
    setBanners(newBanners);
    const res = await storage.saveBanners(newBanners);
    handleSaveResult(res);
  };

  const handleUpdateCategories = async (newCategories) => {
    setCategories(newCategories);
    const res = await storage.saveCategories(newCategories);
    handleSaveResult(res);
  };

  const handleUpdateShopConfig = async (newCfg) => {
    const merged = { ...shopConfig, ...newCfg };
    setShopConfig(merged);
    const res = await storage.saveShopConfig(merged);
    handleSaveResult(res);
  };

  const handleResetData = () => {
    const fresh = storage.resetToDefault();
    setAccounts(fresh.accounts);
    setBanners(fresh.banners);
    setCategories(fresh.categories);
    setShopConfig(fresh.shopConfig);
  };

  const handleCloseAnnouncement = () => {
    setIsAnnouncementOpen(false);
    sessionStorage.setItem('announcement_closed', 'true');
  };

  const handleSelectCategory = (catId) => {
    navigateHash(`#/tai-khoan/${catId}`);
  };

  const handleViewDetails = (acc) => {
    const code = acc.code ? acc.code.replace('#', '') : acc.id;
    navigateHash(`#/tai-khoan/${code}`);
    setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, views: (a.views || 0) + 1 } : a));
  };

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      navigateHash('#/');
    } else if (tab === 'freefire') {
      navigateHash('#/freefire');
    } else if (tab === 'lienquan') {
      navigateHash('#/lienquan');
    } else {
      setActiveTab(tab);
    }
  };

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

  const viewedAccount = useMemo(() => {
    if (!selectedAccountId) return null;
    const clean = selectedAccountId.toString().replace('#', '').toLowerCase();
    return accounts.find(a => 
      a.id.toString() === selectedAccountId ||
      (a.code && a.code.replace('#', '').toLowerCase() === clean) ||
      (a.id && a.id.toString().toLowerCase() === clean)
    ) || null;
  }, [selectedAccountId, accounts]);

  const currentCategory = useMemo(() => {
    if (activeTab === 'category' && selectedCategoryId) {
      return categories.find(c => c.id === selectedCategoryId) || null;
    }
    return null;
  }, [activeTab, selectedCategoryId, categories]);

  const catalogAccounts = useMemo(() => {
    return accounts.filter(acc => {
      if (acc.hidden) return false;
      if (acc.game === 'fcmobile') return false;

      if (activeTab === 'category' && selectedCategoryId) {
        if (acc.categoryId !== selectedCategoryId) return false;
      }

      if (activeTab === 'freefire' && acc.game !== 'freefire') return false;
      if (activeTab === 'lienquan' && acc.game !== 'lienquan') return false;

      if (filters.game !== 'all' && acc.game !== filters.game) return false;
      if (filters.status !== 'all' && acc.status !== filters.status) return false;

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
        syncError={syncError}
        onDismissSyncError={() => setSyncError(null)}
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
      {/* 1. Floating Soap Bubbles + Magic Cyber Embers Effect */}
      <BubbleEffect count={22} embersCount={18} />

      {/* 2. Interactive Click / Touch Sparkles Effect */}
      <ClickSparkleEffect />

      {/* 3. Floating Swipe-Back Gesture Indicator (Facebook / iOS style) */}
      <SwipeBackIndicator 
        isActive={swipeState.isActive}
        progress={swipeState.progress}
        deltaX={swipeState.deltaX}
        isReady={swipeState.isReady}
      />

      {/* 4. Main Content Wrapper */}
      <div className="layout-content-wrapper">
        {/* Floating Top Navbar Header */}
        <Navbar 
          shopConfig={shopConfig}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
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

          {/* VIEW B: DANH MỤC ACC (Category or Game catalog view) */}
          {(activeTab === 'category' || activeTab === 'freefire' || activeTab === 'lienquan') && (
            <CategoryShowroom 
              currentCategory={currentCategory}
              activeTab={activeTab}
              accounts={accounts}
              shopConfig={shopConfig}
              onBack={goBack}
              onViewDetails={handleViewDetails}
              onBuyNow={handleBuyNow}
            />
          )}

          {/* VIEW C: TRANG CHI TIẾT TÀI KHOẢN */}
          {activeTab === 'account-detail' && (
            viewedAccount ? (
              <AccountDetailPage 
                account={viewedAccount}
                categories={categories}
                shopConfig={shopConfig}
                onBack={goBack}
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
                  onClick={goBack}
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

      {/* 5. Mobile Bottom Sticky Navigation */}
      <MobileNav 
        shopConfig={shopConfig}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* 6. Floating Contact Widgets (Zalo, Facebook, Back-To-Top) */}
      <FloatingWidgets shopConfig={shopConfig} />

      {/* 7. Modals */}
      {/* A. SweetAlert-style Announcement Modal */}
      {shopConfig.popupAnnouncement?.enabled !== false && (
        <AnnouncementModal 
          shopConfig={shopConfig}
          isOpen={isAnnouncementOpen}
          onClose={handleCloseAnnouncement}
        />
      )}

      {/* B. Buy / Rent via Direct Zalo Modal */}
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
