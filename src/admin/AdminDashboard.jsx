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
  ShieldCheck
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

  return (
    <div className="admin-dashboard-view">
      {/* Top Welcome Card */}
      <div className="admin-welcome-banner">
        <div>
          <h2>CHÀO MỪNG BẠN ĐẾN VỚI TRANG QUẢN TRỊ SHOP ACC</h2>
          <p>Hệ thống quản lý sản phẩm Free Fire & Liên Quân Mobile - Cập nhật tức thì dữ liệu lên website</p>
        </div>
        <div className="quick-add-group flex items-center gap-2 flex-wrap">
          <button className="btn-gaming-primary" onClick={() => onNavigateTab('accounts')}>
            <Plus size={16} />
            <span>Thêm Acc Mới</span>
          </button>
          <button className="btn-gaming-outline" onClick={() => onNavigateTab('categories')}>
            <FolderTree size={16} />
            <span>Đổi Ảnh Các Mục Game</span>
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="dashboard-stats-grid">
        {/* Total Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-icon-wrap bg-blue">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">TỔNG SỐ ACC TRONG KHO</span>
            <span className="stat-num">{totalAccounts}</span>
            <span className="stat-sub">Tất cả tài khoản</span>
          </div>
        </div>

        {/* Free Fire Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-icon-wrap bg-fire">
            <Flame size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">ACC FREE FIRE (CHỦ LỰC)</span>
            <span className="stat-num text-fire">{ffAccounts}</span>
            <span className="stat-sub">Chiếm {totalAccounts ? Math.round((ffAccounts/totalAccounts)*100) : 0}% kho đồ</span>
          </div>
        </div>

        {/* Liên Quân Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-icon-wrap bg-cyan">
            <Trophy size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">ACC LIÊN QUÂN (PHỤ)</span>
            <span className="stat-num text-cyan">{lqAccounts}</span>
            <span className="stat-sub">Chiếm {totalAccounts ? Math.round((lqAccounts/totalAccounts)*100) : 0}% kho đồ</span>
          </div>
        </div>

        {/* Available Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-icon-wrap bg-green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">ACC ĐANG BÁN</span>
            <span className="stat-num text-green">{availableAccounts}</span>
            <span className="stat-sub">Sẵn sàng giao dịch</span>
          </div>
        </div>

        {/* Sold Accounts */}
        <div className="stat-card" onClick={() => onNavigateTab('accounts')}>
          <div className="stat-icon-wrap bg-red">
            <XCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">ACC ĐÃ BÁN</span>
            <span className="stat-num text-red">{soldAccounts}</span>
            <span className="stat-sub">Giao dịch thành công</span>
          </div>
        </div>

        {/* Categories */}
        <div className="stat-card" onClick={() => onNavigateTab('categories')}>
          <div className="stat-icon-wrap bg-purple">
            <FolderTree size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">SỐ LƯỢNG DANH MỤC</span>
            <span className="stat-num">{totalCategories}</span>
            <span className="stat-sub">Khoảng giá & loại game</span>
          </div>
        </div>

        {/* Banners */}
        <div className="stat-card" onClick={() => onNavigateTab('banners')}>
          <div className="stat-icon-wrap bg-amber">
            <Image size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">BANNER ĐANG SỬ DỤNG</span>
            <span className="stat-num text-gold">{activeBanners} / {banners.length}</span>
            <span className="stat-sub">Hiển thị slider trang chủ</span>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="stat-card revenue-card">
          <div className="stat-icon-wrap bg-gold">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-title">DOANH THU ĐÃ BÁN</span>
            <span className="stat-num text-gold">{formatVND(totalSoldValue)}</span>
            <span className="stat-sub">Giá trị kho còn lại: {formatVND(totalInventoryValue)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action & Recent Accounts Table */}
      <div className="dashboard-sections-grid">
        <div className="dashboard-box">
          <div className="box-header">
            <h3>TÀI KHOẢN MỚI CẬP NHẬT</h3>
            <button className="view-all-btn" onClick={() => onNavigateTab('accounts')}>
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mini-accounts-table">
            <table>
              <thead>
                <tr>
                  <th>Mã Acc</th>
                  <th>Game</th>
                  <th>Giá</th>
                  <th>Rank</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {accounts.slice(0, 6).map((acc) => (
                  <tr key={acc.id || acc.code}>
                    <td className="font-bold text-fire">{acc.code || acc.id}</td>
                    <td>{acc.game === 'freefire' ? '🔥 Free Fire' : '⚔️ Liên Quân'}</td>
                    <td className="text-gold font-bold">{formatVND(acc.price)}</td>
                    <td>{acc.rank}</td>
                    <td>
                      <span className={`badge-gaming ${acc.status === 'sold' ? 'badge-red' : 'badge-green'}`}>
                        {acc.status === 'sold' ? 'Đã bán' : 'Còn hàng'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guide / Status Box */}
        <div className="dashboard-box guide-box">
          <div className="box-header">
            <h3>HƯỚNG DẪN DÀNH CHO ADMIN</h3>
          </div>
          <div className="guide-content">
            <div className="guide-tip">
              <strong>1. Thêm acc mới:</strong>
              <p>Vào tab <strong>Quản Lý Tài Khoản</strong>, bấm nút <strong>+ Thêm Acc Mới</strong> để tải lên ảnh và nhập giá, rank, số lượng skin.</p>
            </div>
            <div className="guide-tip">
              <strong>2. Đổi trạng thái Đã bán:</strong>
              <p>Chỉ cần nhấn nút bật/tắt trạng thái cạnh mỗi acc để chuyển sang <strong>Đã bán</strong> khi có khách thanh toán qua Zalo.</p>
            </div>
            <div className="guide-tip">
              <strong>3. Quản lý Slider Banner:</strong>
              <p>Vào tab <strong>Quản Lý Banners</strong> để thay đổi hình ảnh khuyến mãi lớn ngoài trang chủ.</p>
            </div>
            <div className="guide-tip">
              <strong>4. Hotline & Zalo:</strong>
              <p>Mọi giao dịch từ khách hàng sẽ kết nối thẳng đến số Zalo <code>0362481351</code> của bạn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
