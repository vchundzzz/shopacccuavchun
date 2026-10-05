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
  ExternalLink,
  Bell,
  Save,
  Cloud
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminAccounts from './AdminAccounts';
import AdminBanners from './AdminBanners';
import AdminCategories from './AdminCategories';
import AdminSettings from './AdminSettings';
import AdminAnnouncement from './AdminAnnouncement';
import AdminCloudDB from './AdminCloudDB';
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
  onLogout,
  syncError,
  onDismissSyncError
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(() => storage.getAdminCredentials().username);
  const [adminPass, setAdminPass] = useState(() => storage.getAdminCredentials().password);
  const [storageInfo, setStorageInfo] = useState(() => storage.getStorageDiagnostics());

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

  const handleSaveToDisk = async () => {
    try {
      showToast('⏳ Đang đồng bộ dữ liệu lên đám mây...');
      const res = await storage.persistDataToDisk();
      setStorageInfo(storage.getStorageDiagnostics());

      if (res && res.cloud?.success) {
        showToast('✅ Đã đồng bộ lên Cloud Database! Mọi khách truy cập sẽ thấy ngay.');
        onDismissSyncError?.();
      } else if (res && res.disk?.success) {
        showToast('✅ Đã lưu vào file mã nguồn (src/data/db.json).');
      } else {
        showToast('⚠️ Chỉ lưu được trên máy này. ' + (res?.cloud?.message || 'Chưa cấu hình Cloud Database.'));
      }
    } catch (e) {
      showToast('⚠️ Đã lưu cục bộ nhưng đồng bộ đám mây bị lỗi.');
    }
  };

  // Cảnh báo dung lượng localStorage - nguyên nhân khiến dữ liệu "tự quay về" sau khi F5
  const isStorageCritical = storageInfo.quotaWarning;

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle size={18} className="text-green" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LỖI ĐỒNG BỘ - hiển thị thay vì nuốt im lặng */}
      {syncError && (
        <div className="admin-sync-error" role="alert">
          <AlertTriangle size={18} />
          <span>{syncError}</span>
          <button type="button" onClick={onDismissSyncError} title="Đóng">
            <X size={16} />
          </button>
        </div>
      )}

      {/* CẢNH BÁO DUNG LƯỢNG */}
      {isStorageCritical && (
        <div className="admin-sync-error admin-storage-warning" role="alert">
          <AlertTriangle size={18} />
          <span>
            Dung lượng trình duyệt đang dùng {storageInfo.usedMB}MB / 5MB ({storageInfo.percent}%).
            Hãy dùng ảnh nhỏ hơn để thêm/sửa/xóa được lưu vĩnh viễn.
          </span>
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
            className={`admin-nav-item ${activeAdminTab === 'announcement' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('announcement')}
          >
            <Bell size={18} />
            <span>Quản Lý Thông Báo</span>
            <span className="nav-badge" style={{ background: '#ef4444', color: '#fff' }}>POPUP</span>
          </button>

          <button 
            className={`admin-nav-item ${activeAdminTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('settings')}
          >
            <SettingsIcon size={18} />
            <span>Cấu Hình Shop & Logo</span>
          </button>

          <button 
            className={`admin-nav-item ${activeAdminTab === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('cloud')}
          >
            <Cloud size={18} />
            <span>Database Đám Mây</span>
            <span className="nav-badge" style={{ background: '#06b6d4', color: '#fff' }}>ONLINE</span>
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
              {activeAdminTab === 'announcement' && 'Quản Lý Thông Báo Popup Trang Chủ'}
              {activeAdminTab === 'settings' && 'Cấu Hình Shop, Thương Hiệu & Logo'}
              {activeAdminTab === 'cloud' && 'Cấu Hình Cơ Sở Dữ Liệu Đám Mây (Cloud Database)'}
            </strong>
          </div>

          <div className="admin-header-actions">
            <button 
              className="btn-gaming-primary btn-sm" 
              onClick={handleSaveToDisk} 
              title="Lưu tất cả dữ liệu (Zalo, acc, banner, popup) trực tiếp vào file mã nguồn để khi gửi code cho bạn bè họ sẽ thấy đầy đủ thông tin mới nhất"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderColor: '#10b981' }}
            >
              <Save size={14} />
              <span>Lưu Ra File Cho Bạn Bè</span>
            </button>
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

          {activeAdminTab === 'announcement' && (
            <AdminAnnouncement 
              shopConfig={shopConfig} 
              onUpdateShopConfig={onUpdateShopConfig}
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

          {activeAdminTab === 'cloud' && (
            <AdminCloudDB 
              shopConfig={shopConfig} 
              onUpdateShopConfig={onUpdateShopConfig}
              showToast={showToast}
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

