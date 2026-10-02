import React, { useState, useMemo } from 'react';
import './CategoryShowroom.css';

export default function CategoryShowroom({
  currentCategory,
  activeTab,
  accounts = [],
  shopConfig = {},
  onBack,
  onViewDetails,
  onBuyNow
}) {
  // Filters state exactly matching shoptyseisei
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');

  // Determine page title
  const titleName = currentCategory 
    ? currentCategory.name 
    : (activeTab === 'freefire' ? 'ACC FREE FIRE VIP PRO' : 
       activeTab === 'lienquan' ? 'NICK LIÊN QUÂN CỰC PHẨM' : 'SHOWROOM TÀI KHOẢN');

  // Format account code badge (e.g. 87898 -> MS 87898)
  const formatDisplayCode = (rawCode) => {
    if (!rawCode) return 'MS 99999';
    let clean = rawCode.toString().replace('#', '').trim();
    // remove leading FF or LQ prefix if present to match shoptyseisei numbering
    clean = clean.replace(/^(FF|LQ)-?/i, '');
    if (clean.toLowerCase().startsWith('ms')) {
      return clean.toUpperCase();
    }
    return `MS ${clean}`;
  };

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      if (acc.hidden) return false;
      if (acc.game === 'fcmobile') return false;

      // Filter by category or activeTab
      if (currentCategory) {
        if (acc.categoryId && acc.categoryId !== currentCategory.id) {
          // If category has minPrice/maxPrice, also match by price range if categoryId not strictly tied
          const p = Number(acc.price) || 0;
          const min = currentCategory.minPrice || 0;
          const max = currentCategory.maxPrice || 999999999;
          const matchPrice = p >= min && p <= max;
          const matchGame = acc.game === currentCategory.game;
          if (!(matchPrice && matchGame)) {
            return false;
          }
        }
      } else if (activeTab === 'freefire' && acc.game !== 'freefire') {
        return false;
      } else if (activeTab === 'lienquan' && acc.game !== 'lienquan') {
        return false;
      }

      // Filter by price range select
      const price = Number(acc.price) || 0;
      if (priceRange === '0-100000' && price > 100000) return false;
      if (priceRange === '100000-200000' && (price < 100000 || price > 200000)) return false;
      if (priceRange === '200000-500000' && (price < 200000 || price > 500000)) return false;
      if (priceRange === '500000-1000000' && (price < 500000 || price > 1000000)) return false;
      if (priceRange === '1000000-0' && price < 1000000) return false;

      // Filter by search text
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const code = (acc.code || '').toLowerCase();
        const id = (acc.id || '').toLowerCase();
        const title = (acc.title || '').toLowerCase();
        const outfits = (acc.outfits || '').toLowerCase();
        const gunSkins = (acc.gunSkins || '').toLowerCase();
        const rareItems = (acc.rareItems || '').toLowerCase();
        
        const match = code.includes(q) || 
                      id.includes(q) || 
                      title.includes(q) || 
                      outfits.includes(q) || 
                      gunSkins.includes(q) || 
                      rareItems.includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'created_at_desc') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'created_at_asc') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);

      // Default order: available first
      if (a.status === 'sold' && b.status !== 'sold') return 1;
      if (b.status === 'sold' && a.status !== 'sold') return -1;
      return 0;
    });
  }, [accounts, currentCategory, activeTab, priceRange, sortBy, search]);

  const handleReset = () => {
    setPriceRange('');
    setSortBy('');
    setSearch('');
  };

  const noticeText = shopConfig.categoryNotice || 
    'lưu ý: bạn không thể thuê acc free fire bằng tiền trên shop. acc free fire chỉ có thể mua qua zalo. nếu bạn dùng card hoặc đã nạp tiền vào shop vui lòng liên hệ admin để được hỗ trợ';

  return (
    <div className="category-showroom-wrapper py-4">
      {/* 0. Breadcrumb Navigation */}
      <div className="catalog-breadcrumb">
        <button 
          type="button"
          className="btn-back-home"
          onClick={onBack}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Quay lại Showroom</span>
        </button>

        <div className="catalog-badge-path">
          <span>Trang Chủ</span> / <strong>{titleName}</strong>
        </div>
      </div>

      {/* 1. Account Hero Header */}
      <div className="account-hero">
        <span className="account-eyebrow">
          <i className="fa-solid fa-store"></i> Showroom tài khoản
        </span>
        <h1 className="account-title">{titleName}</h1>
        <p className="account-notice">
          Website hiện chỉ trưng bày sản phẩm. Vui lòng liên hệ admin qua Zalo để được tư vấn.
        </p>
      </div>

      {/* 2. Notice / Description Box (Matching shoptyseisei) */}
      <div className="account-description">
        <h2>
          <strong>
            <span>{noticeText}</span>
          </strong>
        </h2>
      </div>

      {/* 3. Filter Form (Matching shoptyseisei) */}
      <form 
        className="account-filter"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="account-filter-grid">
          <div className="filter-group">
            <label className="form-label">Mức Giá</label>
            <select 
              className="form-control" 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Tất cả mức giá</option>
              <option value="0-100000">Dưới 100.000đ</option>
              <option value="100000-200000">100.000đ - 200.000đ</option>
              <option value="200000-500000">200.000đ - 500.000đ</option>
              <option value="500000-1000000">500.000đ - 1.000.000đ</option>
              <option value="1000000-0">Trên 1.000.000đ</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Sắp Xếp</label>
            <select 
              className="form-control" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Mặc định</option>
              <option value="created_at_desc">Mới nhất</option>
              <option value="created_at_asc">Cũ nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Tìm Kiếm</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nhập mã acc, tên acc, trang phục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="account-filter-actions">
            <button 
              type="button" 
              className="account-filter-btn is-submit"
              onClick={() => {}}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Lọc</span>
            </button>
            <button 
              type="button" 
              className="account-filter-btn is-reset"
              onClick={handleReset}
            >
              <i className="fa-solid fa-rotate-left"></i>
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </form>

      {/* 4. Accounts Grid (Matching shoptyseisei) */}
      {filteredAccounts.length > 0 ? (
        <div className="account-grid">
          {filteredAccounts.map(acc => (
            <article key={acc.id} className="account-card">
              <div 
                className="account-card-media"
                onClick={() => onViewDetails(acc)}
                title="Nhấn để xem chi tiết tài khoản"
              >
                <img 
                  src={acc.thumbnail || 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a87a4713_1790614151.jpg'} 
                  alt={acc.code || acc.id} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://pub-49db8d8cc54b4abc84b979c54f4fdd5b.r2.dev/items/2026/09/28/img_6aba9a87a4713_1790614151.jpg';
                  }}
                />
                <span className="account-code">
                  {formatDisplayCode(acc.code || acc.id)}
                </span>
              </div>

              <div className="account-card-body">
                <div className="account-tags">
                  <span className="account-tag">
                    <i className="fa-solid fa-circle-check me-1"></i>
                    {acc.tag || 'LH ZALO ĐỂ THUÊ 99 NĂM'}
                  </span>
                </div>

                <div className="account-price">
                  {new Intl.NumberFormat('vi-VN').format(acc.price)} ₫
                </div>

                <div className="account-actions">
                  <button 
                    type="button"
                    className="account-action-btn account-action-detail is-wide"
                    onClick={() => onViewDetails(acc)}
                  >
                    <i className="fa-solid fa-eye"></i>
                    <span>Xem chi tiết</span>
                  </button>

                  <button 
                    type="button"
                    className="account-action-btn account-action-zalo"
                    onClick={() => onBuyNow(acc)}
                    title="Liên hệ Zalo giao dịch trực tiếp"
                  >
                    <img 
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" 
                      alt="Zalo" 
                      className="zalo-logo" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span>Zalo</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="account-empty">
          <i className="fa-solid fa-box-open text-3xl mb-2 text-slate-400"></i>
          <p>Hiện không tìm thấy tài khoản nào phù hợp với bộ lọc trong danh mục này.</p>
        </div>
      )}
    </div>
  );
}
