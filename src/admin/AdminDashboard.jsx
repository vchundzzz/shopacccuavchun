import React from 'react';
import { 
  Users, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  FolderTree, 
  Image, 
  DollarSign, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Bell, 
  Cloud,
  Sparkles,
  Zap,
  ShoppingBag,
  ExternalLink,
  Crown
} from 'lucide-react';
import { formatVND } from '../components/AccountCard';
import './AdminDashboard.css';

export default function AdminDashboard({ accounts, banners, categories, onNavigateTab }) {
  // Statistics calculations
  const totalAccounts = accounts.length;
  const ffAccounts = accounts.filter(a => a.game === 'freefire').length;
  const lqAccounts = accounts.filter(a => a.game === 'lienquan').length;
  const availableAccounts = accounts.filter(a => a.status === 'available').length;
  const soldAccounts = accounts.filter(a => a.status === 'sold').length;
  
  const totalCategories = categories.length;
  const activeBanners = banners.filter(b => b.active).length;

  const totalSoldValue = accounts
    .filter(a => a.status === 'sold')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const totalInventoryValue = accounts
    .filter(a => a.status === 'available')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const ffPercent = totalAccounts > 0 ? Math.round((ffAccounts / totalAccounts) * 100) : 0;
  const lqPercent = totalAccounts > 0 ? Math.round((lqAccounts / totalAccounts) * 100) : 0;
  const soldPercent = totalAccounts > 0 ? Math.round((soldAccounts / totalAccounts) * 100) : 0;
  const availablePercent = totalAccounts > 0 ? Math.round((availableAccounts / totalAccounts) * 100) : 0;

  return (
    <div className="admin-dashboard-view">
      {/* Top Welcome Hero Banner */}
      <div className="admin-welcome-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <Sparkles size={14} />
            <span>TRUNG TÂM ĐIỀU HÀNH SHOP ACC</span>
          </div>
          <h2>BẢNG ĐIỀU KHIỂN & THỐNG KÊ DOANH THU</h2>
          <p>Quản lý tập trung sản phẩm Free Fire & Liên Quân Mobile • Tự động đồng bộ đa thiết bị thời gian thực</p>
        </div>
        <div className="quick-actions-bar">
          <button 
            className="btn-dash-action btn-dash-add" 
            onClick={() => onNavigateTab('accounts')}
          >
            <Plus size={16} />
            <span>Thêm Acc Mới</span>
          </button>
          <button 
            className="btn-dash-action btn-dash-popup" 
            onClick={() => onNavigateTab('announcement')}
          >
            <Bell size={16} />
            <span>Sửa Popup Zalo</span>
          </button>
          <button 
            className="btn-dash-action btn-dash-cloud" 
            onClick={() => onNavigateTab('cloud')}
          >
            <Cloud size={16} />
            <span>Cloud Database</span>
          </button>
        </div>
      </div>

      {/* Financial Highlight Cards */}
      <div className="dashboard-financial-grid">
        <div className="finance-card revenue-stat-card">
          <div className="finance-icon-wrap bg-gold-glow">
            <TrendingUp size={24} />
          </div>
          <div className="finance-info">
            <span className="finance-label">DOANH THU ĐÃ BÁN RA</span>
            <div className="finance-value text-gold">{formatVND(totalSoldValue)}</div>
            <div className="finance-sub">
              <span>Đã thanh toán qua {soldAccounts} tài khoản ({soldPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="finance-card inventory-stat-card">
          <div className="finance-icon-wrap bg-green-glow">
            <ShoppingBag size={24} />
          </div>
          <div className="finance-info">
            <span className="finance-label">TỔNG GIÁ TRỊ KHO ĐANG BÁN</span>
            <div className="finance-value text-emerald">{formatVND(totalInventoryValue)}</div>
            <div className="finance-sub">
              <span>Sẵn sàng giao dịch {availableAccounts} tài khoản ({availablePercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="dashboard-stats-grid">
        {/* Total Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-blue">
              <Users size={20} />
            </div>
            <span className="stat-badge badge-blue">KHO HÀNG</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">TỔNG SỐ TÀI KHOẢN</span>
            <span className="stat-num">{totalAccounts}</span>
            <span className="stat-sub">Tất cả tài khoản trong hệ thống</span>
          </div>
        </div>

        {/* Free Fire Accounts */}
        <div className="stat-card card-ff" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-fire">
              <Flame size={20} />
            </div>
            <span className="stat-badge badge-fire">{ffPercent}% KHO</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">FREE FIRE (CHỦ LỰC)</span>
            <span className="stat-num text-fire">{ffAccounts}</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill bg-fire-bar" style={{ width: `${ffPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Liên Quân Accounts */}
        <div className="stat-card card-lq" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-cyan">
              <Trophy size={20} />
            </div>
            <span className="stat-badge badge-cyan">{lqPercent}% KHO</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">LIÊN QUÂN (PHỤ)</span>
            <span className="stat-num text-cyan">{lqAccounts}</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill bg-cyan-bar" style={{ width: `${lqPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Available Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-green">
              <CheckCircle2 size={20} />
            </div>
            <span className="stat-badge badge-green">CÒN HÀNG</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">ĐANG BÁN</span>
            <span className="stat-num text-green">{availableAccounts}</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill bg-green-bar" style={{ width: `${availablePercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Sold Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-red">
              <XCircle size={20} />
            </div>
            <span className="stat-badge badge-red">ĐÃ BÁN</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">ĐÃ BÁN THÀNH CÔNG</span>
            <span className="stat-num text-red">{soldAccounts}</span>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill bg-red-bar" style={{ width: `${soldPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="stat-card" onClick={() => onNavigateTab('categories')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-purple">
              <FolderTree size={20} />
            </div>
            <span className="stat-badge badge-purple">PHÂN LOẠI</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">SỐ LƯỢNG DANH MỤC</span>
            <span className="stat-num">{totalCategories}</span>
            <span className="stat-sub">Khoảng giá & danh mục game</span>
          </div>
        </div>

        {/* Banners */}
        <div className="stat-card" onClick={() => onNavigateTab('banners')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-amber">
              <Image size={20} />
            </div>
            <span className="stat-badge badge-amber">TRANG CHỦ</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">BANNER HOẠT ĐỘNG</span>
            <span className="stat-num text-gold">{activeBanners} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ {banners.length}</span></span>
            <span className="stat-sub">Slider quảng cáo toàn trang</span>
          </div>
        </div>

        {/* Cloud Status */}
        <div className="stat-card" onClick={() => onNavigateTab('cloud')}>
          <div className="stat-card-header">
            <div className="stat-icon-wrap bg-cyan">
              <Cloud size={20} />
            </div>
            <span className="stat-badge badge-cyan">ONLINE</span>
          </div>
          <div className="stat-info">
            <span className="stat-title">DATABASE ĐÁM MÂY</span>
            <span className="stat-num text-cyan" style={{ fontSize: '1.25rem' }}>Đã Kết Nối</span>
            <span className="stat-sub">Realtime Firebase Cloud DB</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections Grid */}
      <div className="dashboard-sections-grid">
        {/* Mini Accounts Table */}
        <div className="dashboard-box recent-accounts-box">
          <div className="box-header">
            <div className="box-title-wrap">
              <Zap size={18} className="text-fire" />
              <h3>TÀI KHOẢN MỚI CẬP NHẬT GẦN ĐÂY</h3>
            </div>
            <button className="view-all-btn" onClick={() => onNavigateTab('accounts')}>
              <span>Xem tất cả ({accounts.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mini-accounts-table">
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Mã Acc</th>
                  <th>Tên & Game</th>
                  <th>Giá Bán</th>
                  <th>Rank</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      Chưa có tài khoản nào trong kho. Bấm <strong>"+ Thêm Acc Mới"</strong> để bắt đầu.
                    </td>
                  </tr>
                ) : (
                  accounts.slice(0, 6).map((acc) => (
                    <tr key={acc.id || acc.code}>
                      <td>
                        <img 
                          src={acc.thumbnail} 
                          alt="" 
                          className="mini-table-thumb"
                          onError={(e) => {
                            e.target.src = 'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg';
                          }}
                        />
                      </td>
                      <td className="font-bold text-fire">
                        {acc.code || acc.id}
                        {acc.isVip && <Crown size={12} className="text-gold" style={{ marginLeft: 4, display: 'inline' }} />}
                      </td>
                      <td>
                        <div className="mini-acc-title" title={acc.title}>
                          <strong>{acc.title}</strong>
                          <span className={`mini-game-tag ${acc.game === 'freefire' ? 'tag-ff' : 'tag-lq'}`}>
                            {acc.game === 'freefire' ? '🔥 Free Fire' : '⚔️ Liên Quân'}
                          </span>
                        </div>
                      </td>
                      <td className="text-gold font-bold">{formatVND(acc.price)}</td>
                      <td><span className="rank-pill">{acc.rank}</span></td>
                      <td>
                        <span className={`badge-status-pill ${acc.status === 'sold' ? 'pill-sold' : 'pill-available'}`}>
                          {acc.status === 'sold' ? 'Đã bán' : 'Còn hàng'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Operational Guide */}
        <div className="dashboard-box guide-box">
          <div className="box-header">
            <div className="box-title-wrap">
              <ShieldCheck size={18} className="text-cyan" />
              <h3>HƯỚNG DẪN QUẢN TRỊ SHOP</h3>
            </div>
          </div>
          <div className="guide-content">
            <div className="guide-card">
              <div className="guide-step-num">01</div>
              <div className="guide-text">
                <strong>Thêm tài khoản mới</strong>
                <p>Vào tab <strong>Quản Lý Tài Khoản</strong>, bấm nút <strong>+ Thêm Acc Mới</strong> để tải ảnh thumbnail, thư viện ảnh và nhập giá bán, rank, trang bị.</p>
              </div>
            </div>

            <div className="guide-card">
              <div className="guide-step-num">02</div>
              <div className="guide-text">
                <strong>Chuyển trạng thái khi có khách mua</strong>
                <p>Khi khách chốt qua Zalo, chỉ cần bấm vào nút <strong>Còn hàng / Đã bán</strong> trên danh sách để hệ thống cập nhật tức thì.</p>
              </div>
            </div>

            <div className="guide-card">
              <div className="guide-step-num">03</div>
              <div className="guide-text">
                <strong>Chỉnh sửa Popup Zalo & Banner</strong>
                <p>Thay đổi link Zalo, SĐT liên hệ và thông báo SweetAlert bật ra trên trang chủ tại tab <strong>Quản Lý Thông Báo</strong>.</p>
              </div>
            </div>

            <div className="guide-card">
              <div className="guide-step-num">04</div>
              <div className="guide-text">
                <strong>Đồng bộ Firebase Cloud DB</strong>
                <p>Mọi chỉnh sửa của bạn được tự động đồng bộ lên máy chủ đám mây, khách truy cập ở bất kỳ đâu cũng sẽ thấy thông tin mới nhất.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
