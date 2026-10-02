import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  DollarSign, 
  Trophy, 
  CheckCircle2, 
  ArrowUpDown 
} from 'lucide-react';
import './FilterSection.css';

export default function FilterSection({
  filters,
  setFilters,
  onResetFilters,
  game = 'all',
  totalResults = 0
}) {
  return (
    <div className="filter-section-panel">
      {/* Top Filter Bar */}
      <div className="filter-header-bar">
        <div className="filter-heading">
          <Filter size={18} className="text-primary" />
          <span>BỘ LỌC TÀI KHOẢN</span>
          <span className="results-count">({totalResults} tài khoản)</span>
        </div>

        <button className="reset-filter-btn" onClick={onResetFilters}>
          <RotateCcw size={14} />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Filter Controls Grid */}
      <div className="filter-controls-grid">
        {/* Game Filter */}
        <div className="filter-control-item">
          <label className="filter-label">
            <span>Game:</span>
          </label>
          <select 
            value={filters.game || 'all'} 
            onChange={(e) => setFilters({ ...filters, game: e.target.value })}
            className="filter-select"
          >
            <option value="all">Tất cả game</option>
            <option value="freefire">🔥 Free Fire</option>
            <option value="lienquan">⚔️ Liên Quân (Cực Phẩm)</option>
          </select>
        </div>

        {/* Price Bracket */}
        <div className="filter-control-item">
          <label className="filter-label">
            <DollarSign size={14} className="text-primary" />
            <span>Mức Giá:</span>
          </label>
          <select 
            value={filters.priceRange} 
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="filter-select"
          >
            <option value="all">Tất cả mức giá</option>
            <option value="under-1m">Dưới 1 Triệu (&lt; 1M)</option>
            <option value="1m-3m">1 Triệu – 3 Triệu</option>
            <option value="3m-7m">3 Triệu – 7 Triệu</option>
            <option value="7m-15m">7 Triệu – 15 Triệu</option>
            <option value="super-vip">Acc Siêu VIP (&gt; 15M)</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-control-item">
          <label className="filter-label">
            <CheckCircle2 size={14} className="text-primary" />
            <span>Trạng Thái:</span>
          </label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">🟢 Còn hàng</option>
            <option value="sold">🔴 Đã bán</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="filter-control-item">
          <label className="filter-label">
            <ArrowUpDown size={14} className="text-primary" />
            <span>Sắp Xếp:</span>
          </label>
          <select 
            value={filters.sort} 
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="filter-select"
          >
            <option value="featured">Nổi bật nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="newest">Mới cập nhật</option>
          </select>
        </div>
      </div>
    </div>
  );
}
