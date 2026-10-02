import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  FolderTree, 
  LogOut, 
  RotateCcw, 
  Flame, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  KeyRound,
  Lock,
  X,
  ExternalLink
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminAccounts from './AdminAccounts';
import AdminBanners from './AdminBanners';
import AdminCategories from './AdminCategories';
import AdminSettings from './AdminSettings';
import { storage } from '../services/storage';
import { Settings as SettingsIcon } from 'lucide-react';
import './AdminLayout.css';


export default function AdminLayout({ 
  accounts, 
  banners, 
  categories, 
  shopConfig,
  onUpdateAccounts, 
  onUpdateBanners, 
  onUpdateCategories,
  onUpdateShopConfig,
  onResetData,
  onExitAdmin,
  onLogout
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(() => storage.getAdminCredentials().username);
  const [adminPass, setAdminPass] = useState(() => storage.getAdminCredentials().password);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      alert('Tên đăng nhập và mật khẩu không được để trống!');
      return;
    }
    storage.setAdminCredentials(adminUser.trim(), adminPass.trim());
    showToast('Đã lưu thông tin tài khoản quản trị mới thành công!');
    setChangePassOpen(false);
  };


  const handleResetData = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục toàn bộ dữ liệu mẫu ban đầu? Toàn bộ thay đổi thêm/sửa/xóa sẽ được đặt lại.')) {
      onResetData();
      showToast('Đã khôi phục dữ liệu mẫu thành công!');
    }
  };

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle size={18} className="text-green" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="shop-logo admin-sidebar-logo-brand">
            <div className="admin-logo-img-container">
              <img 
                src={shopConfig?.whiteLogo || shopConfig?.blackLogo || "/images/logo-shopvanchung.png"} 
                alt="Logo Shop" 
                className="admin-logo-img"
              />
            </div>
            <div className="logo-text-wrap">
              <span className="logo-title">QUẢN TRỊ VIÊN</span>
              <span className="logo-subtitle">{shopConfig?.shopName || 'SHOPVANCHUNG'}</span>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <button 
            className={`admin-nav-item ${activeAdminTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Tổng Quan (Dashboard)</span>
          </button>

          <button 
            className={`admin-nav-item ${activeAdminTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('accounts')}
          >
            <Users size={18} />
            <span>Quản Lý Tài Khoản</span>
            <span className="nav-badge">{accounts.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeAdminTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('banners')}
          >
            <Image size={18} />
            <span>Quản Lý Banners</span>
            <span className="nav-badge">{banners.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeAdminTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('categories')}
          >
            <FolderTree size={18} />
            <span>Quản Lý Danh Mục</span>
            <span className="nav-badge">{categories.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeAdminTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('settings')}
          >
            <SettingsIcon size={18} />
            <span>Cấu Hình Shop & Popup</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-reset-btn" onClick={handleResetData} title="Khôi phục lại dữ liệu mẫu">
            <RotateCcw size={15} />
            <span>Khôi Phục Dữ Liệu Gốc</span>
          </button>

          <button className="admin-logout-btn" onClick={onExitAdmin} title="Quay lại giao diện cửa hàng">
            <LogOut size={16} />
            <span>Xem Website Shop</span>
          </button>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-top-header">
          <div className="admin-breadcrumb">
            <span>Hệ Thống Quản Trị</span>
            <span>/</span>
            <strong>
              {activeAdminTab === 'dashboard' && 'Dashboard Thống Kê'}
              {activeAdminTab === 'accounts' && 'Quản Lý Kho Tài Khoản Game'}
              {activeAdminTab === 'banners' && 'Quản Lý Banner Quảng Cáo Toàn Trang'}
              {activeAdminTab === 'categories' && 'Quản Lý Danh Mục & Khoảng Giá'}
              {activeAdminTab === 'settings' && 'Cấu Hình Shop, Thương Hiệu & Popup'}
            </strong>
          </div>

          <div className="admin-header-actions">
            <button className="btn-gaming-success btn-sm" onClick={onExitAdmin} title="Mở trang chủ shop để xem các thay đổi">
              <ExternalLink size={14} />
              <span>Xem Website Shop</span>
            </button>
            <button className="btn-gaming-outline btn-sm" onClick={() => setChangePassOpen(true)}>
              <KeyRound size={14} />
              <span>Đổi Mật Khẩu</span>
            </button>
            <button className="admin-reset-btn btn-sm" onClick={onLogout || onExitAdmin}>
              <LogOut size={14} />
              <span>Đăng Xuất</span>
            </button>
          </div>

        </header>

        {/* Tab Views */}
        <div className="admin-view-content">
          {activeAdminTab === 'dashboard' && (
            <AdminDashboard 
              accounts={accounts} 
              banners={banners} 
              categories={categories}
              onNavigateTab={setActiveAdminTab}
            />
          )}

          {activeAdminTab === 'accounts' && (
            <AdminAccounts 
              accounts={accounts} 
              categories={categories}
              onUpdateAccounts={onUpdateAccounts}
              showToast={showToast}
              onExitAdmin={onExitAdmin}
            />
          )}

          {activeAdminTab === 'banners' && (
            <AdminBanners 
              shopConfig={shopConfig} 
              onUpdateShopConfig={onUpdateShopConfig}
              categories={categories}
              onUpdateCategories={onUpdateCategories}
              showToast={showToast}
              onExitAdmin={onExitAdmin}
            />
          )}

          {activeAdminTab === 'categories' && (
            <AdminCategories 
              categories={categories} 
              onUpdateCategories={onUpdateCategories}
              showToast={showToast}
              onExitAdmin={onExitAdmin}
            />
          )}

          {activeAdminTab === 'settings' && (
            <AdminSettings 
              shopConfig={shopConfig} 
              onUpdateShopConfig={onUpdateShopConfig}
              showToast={showToast}
              onExitAdmin={onExitAdmin}
            />
          )}
        </div>
      </main>

      {/* Modal Change Password */}
      {changePassOpen && (
        <div className="modal-overlay" onClick={() => setChangePassOpen(false)}>
          <div className="modal-container quick-price-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-fire" />
                <h3 className="font-bold">ĐỔI MẬT KHẨU QUẢN TRỊ SHOP</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setChangePassOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSavePassword} className="p-6 flex flex-col gap-4">
              <div>
                <label className="filter-label mb-2">Tên đăng nhập:</label>
                <input 
                  type="text" 
                  value={adminUser} 
                  onChange={(e) => setAdminUser(e.target.value)}
                  required
                  className="admin-input"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="filter-label mb-2">Mật khẩu mới:</label>
                <input 
                  type="text" 
                  value={adminPass} 
                  onChange={(e) => setAdminPass(e.target.value)}
                  required
                  className="admin-input"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" className="btn-gaming-outline" onClick={() => setChangePassOpen(false)}>Hủy</button>
                <button type="submit" className="btn-gaming-primary">Lưu Mật Khẩu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

