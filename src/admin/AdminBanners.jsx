import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Save, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  Layers,
  PhoneCall,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import ImageFileInput from './ImageFileInput';
import './AdminBanners.css';

export default function AdminBanners({ 
  banners = [], 
  onUpdateBanners, 
  shopConfig, 
  onUpdateShopConfig, 
  categories = [], 
  onUpdateCategories, 
  showToast, 
  onExitAdmin 
}) {
  const [formData, setFormData] = useState({
    mainBanner: shopConfig?.mainBanner || '',
    supportCards: shopConfig?.supportCards || [],
    gameHeaders: shopConfig?.gameHeaders || {}
  });

  const [categoryList, setCategoryList] = useState(categories);

  // Modal State for Slider Banners
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    image: '',
    link: '',
    active: true,
    order: 0
  });

  // --- SLIDER BANNER CRUD ---
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: `Banner Quảng Cáo #${banners.length + 1}`,
      image: '',
      link: '',
      active: true,
      order: banners.length + 1
    });
    setBannerModalOpen(true);
  };

  const handleOpenEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || '',
      image: banner.image || '',
      link: banner.link || '',
      active: banner.active !== false,
      order: banner.order || 0
    });
    setBannerModalOpen(true);
  };

  const handleSaveBannerModal = (e) => {
    e.preventDefault();
    if (!bannerForm.image) {
      alert('Vui lòng chọn hoặc tải ảnh cho banner!');
      return;
    }

    if (editingBanner) {
      const updated = banners.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } : b);
      if (onUpdateBanners) onUpdateBanners(updated);
      if (editingBanner.id === 'bn-main' || banners[0]?.id === editingBanner.id) {
        const nextCfg = { ...formData, mainBanner: bannerForm.image };
        setFormData(nextCfg);
        if (onUpdateShopConfig) onUpdateShopConfig(nextCfg);
      }
      showToast('Đã cập nhật banner quảng cáo thành công!');
    } else {
      const newBanner = {
        ...bannerForm,
        id: `banner_${Date.now()}`,
        order: banners.length + 1
      };
      const updated = [...banners, newBanner];
      if (onUpdateBanners) onUpdateBanners(updated);
      showToast('Đã thêm mới banner quảng cáo thành công!');
    }

    setBannerModalOpen(false);
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Bạn có chắc muốn xóa banner này?')) {
      const updated = banners.filter(b => b.id !== bannerId);
      if (onUpdateBanners) onUpdateBanners(updated);
      showToast('Đã xóa banner thành công!');
    }
  };

  const handleToggleBannerActive = (bannerId) => {
    const updated = banners.map(b => b.id === bannerId ? { ...b, active: !b.active } : b);
    if (onUpdateBanners) onUpdateBanners(updated);
    showToast('Đã thay đổi trạng thái hiển thị banner!');
  };

  const handleMoveBanner = (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;
    const updated = newBanners.map((b, i) => ({ ...b, order: i + 1 }));
    if (onUpdateBanners) onUpdateBanners(updated);
    showToast('Đã thay đổi thứ tự banner!');
  };

  // --- CATEGORIES & SHOP CONFIG ---
  const handleCatImageChange = (catId, newImage) => {
    const updated = categoryList.map(c => c.id === catId ? { ...c, image: newImage } : c);
    setCategoryList(updated);
    if (onUpdateCategories) {
      onUpdateCategories(updated);
    }
  };

  const handleSupportCardChange = (index, field, value) => {
    const updatedCards = [...formData.supportCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setFormData({
      ...formData,
      supportCards: updatedCards
    });
  };

  const handleGameHeaderChange = (game, field, value) => {
    setFormData({
      ...formData,
      gameHeaders: {
        ...formData.gameHeaders,
        [game]: {
          ...formData.gameHeaders?.[game],
          [field]: value
        }
      }
    });
  };

  const handleMainBannerChange = (val) => {
    const nextCfg = { ...formData, mainBanner: val };
    setFormData(nextCfg);
    if (onUpdateShopConfig) onUpdateShopConfig(nextCfg);
    if (banners.length > 0) {
      const updated = banners.map((b, idx) => idx === 0 ? { ...b, image: val } : b);
      if (onUpdateBanners) onUpdateBanners(updated);
    }
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    let currentBanners = banners;
    if (formData.mainBanner && banners.length > 0 && banners[0].image !== formData.mainBanner) {
      currentBanners = banners.map((b, idx) => idx === 0 ? { ...b, image: formData.mainBanner } : b);
    }
    if (onUpdateBanners) onUpdateBanners(currentBanners);
    if (onUpdateShopConfig) onUpdateShopConfig(formData);
    if (onUpdateCategories) onUpdateCategories(categoryList);
    showToast('Đã lưu thành công! Toàn bộ banner và cấu hình đã được cập nhật.');
  };

  const handleSaveAndExit = (e) => {
    if (e) e.preventDefault();
    let currentBanners = banners;
    if (formData.mainBanner && banners.length > 0 && banners[0].image !== formData.mainBanner) {
      currentBanners = banners.map((b, idx) => idx === 0 ? { ...b, image: formData.mainBanner } : b);
    }
    if (onUpdateBanners) onUpdateBanners(currentBanners);
    if (onUpdateShopConfig) onUpdateShopConfig(formData);
    if (onUpdateCategories) onUpdateCategories(categoryList);
    showToast('Đã lưu thành công! Đang chuyển sang trang chủ...');
    if (onExitAdmin) {
      setTimeout(() => onExitAdmin(), 400);
    }
  };

  return (
    <div className="admin-banners-view">
      {/* Top Header Actions */}
      <div className="banners-view-header">
        <div>
          <h2>QUẢN LÝ BANNER & HÌNH ẢNH TOÀN TRANG</h2>
          <p>Thêm / sửa banner quảng cáo slider trang chủ, banner chính, 4 thẻ hỗ trợ và ảnh danh mục</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" className="btn-gaming-primary" onClick={handleSaveAll}>
            <Save size={18} />
            <span>LƯU TẤT CẢ BANNER</span>
          </button>
          {onExitAdmin && (
            <button type="button" className="btn-gaming-success" onClick={handleSaveAndExit}>
              <ExternalLink size={18} />
              <span>XEM TRANG SHOP</span>
            </button>
          )}
        </div>
      </div>

      <div className="banners-form-container">
        {/* ================= 1. SLIDER / CAROUSEL BANNERS ================= */}
        <div className="banner-config-card">
          <div className="card-header-badge flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h3>1. SLIDER BANNER QUẢNG CÁO ĐẦU TRANG CHỦ</h3>
              <span className="nav-badge">{banners.length} banner</span>
            </div>
            <button 
              type="button" 
              className="btn-sm btn-primary"
              onClick={handleOpenAddBanner}
            >
              <Plus size={16} />
              <span>+ THÊM BANNER MỚI</span>
            </button>
          </div>

          <p className="card-desc">
            Các banner dạng trượt lướt (Slider/Carousel) xuất hiện trên đỉnh trang chủ. Bạn có thể thêm không giới hạn banner, gắn link chuyển hướng hoặc bật/tắt hiển thị.
          </p>

          {banners.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
              <ImageIcon size={36} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 font-semibold mb-3">Chưa có banner slider nào được tạo</p>
              <button type="button" className="btn-sm btn-primary" onClick={handleOpenAddBanner}>
                <Plus size={16} />
                <span>Thêm banner đầu tiên ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b, idx) => (
                <div key={b.id || idx} className="support-edit-item-box bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  {/* Banner Image Preview */}
                  <div className="relative w-full h-36 bg-slate-100 overflow-hidden border-b border-slate-200">
                    {b.image ? (
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Chưa có ảnh</div>
                    )}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold ${b.active !== false ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'}`}>
                      {b.active !== false ? 'Đang hiện' : 'Đã ẩn'}
                    </span>
                  </div>

                  {/* Banner Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1 truncate">{b.title || `Banner #${idx + 1}`}</h4>
                      <p className="text-xs text-slate-500 truncate mb-3">Link: {b.link || 'Không có link (chỉ xem ảnh)'}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <button 
                          type="button" 
                          className="btn-acc-edit text-xs" 
                          onClick={() => handleOpenEditBanner(b)}
                          title="Chỉnh sửa banner"
                        >
                          <Edit3 size={13} /> Sửa
                        </button>
                        <button 
                          type="button" 
                          className={`text-xs px-2 py-1 rounded border font-semibold ${b.active !== false ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'}`}
                          onClick={() => handleToggleBannerActive(b.id)}
                          title="Bật/Tắt hiển thị"
                        >
                          {b.active !== false ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          type="button" 
                          className="text-xs px-1.5 py-1 rounded border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30" 
                          onClick={() => handleMoveBanner(idx, 'up')}
                          disabled={idx === 0}
                          title="Chuyển lên trước"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button 
                          type="button" 
                          className="text-xs px-1.5 py-1 rounded border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30" 
                          onClick={() => handleMoveBanner(idx, 'down')}
                          disabled={idx === banners.length - 1}
                          title="Chuyển xuống sau"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button 
                          type="button" 
                          className="btn-acc-delete text-xs" 
                          onClick={() => handleDeleteBanner(b.id)}
                          title="Xóa banner này"
                        >
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= 2. TOP MAIN BANNER ================= */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <ImageIcon size={20} className="text-indigo-600" />
            <h3>2. BANNER CHÍNH TRANG CHỦ (MAIN STATIC BANNER)</h3>
          </div>

          <div className="mb-4">
            <ImageFileInput 
              label="Chọn tệp ảnh banner chính từ thiết bị:"
              value={formData.mainBanner}
              onChange={handleMainBannerChange}
              aspectRatio="banner"
              maxWidth={1600}
              maxHeight={800}
            />
          </div>

          <div className="card-quick-save-bar">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu Banner Này</span>
            </button>
          </div>
        </div>

        {/* ================= 3. 4 SUPPORT CARDS ================= */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <PhoneCall size={20} className="text-cyan-600" />
            <h3>3. BỐN THẺ BANNER HỖ TRỢ & TOPUP NHANH</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.supportCards.map((card, idx) => (
              <div key={card.id || idx} className="support-edit-item-box bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="card-idx-badge mb-2">Thẻ #{idx + 1}: {card.title}</span>

                <div className="form-group mb-2">
                  <label className="text-xs font-bold text-slate-700">Tiêu đề thẻ:</label>
                  <input 
                    type="text" 
                    value={card.title}
                    onChange={(e) => handleSupportCardChange(idx, 'title', e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group mb-2">
                  <ImageFileInput 
                    label="Tệp ảnh banner thẻ:"
                    value={card.image}
                    onChange={(val) => handleSupportCardChange(idx, 'image', val)}
                    aspectRatio="square"
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="text-xs font-bold text-slate-700">Link đích Zalo / Website:</label>
                  <input 
                    type="text" 
                    value={card.link}
                    onChange={(e) => handleSupportCardChange(idx, 'link', e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="card-quick-save-bar">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu 4 Thẻ Hỗ Trợ</span>
            </button>
          </div>
        </div>

        {/* ================= 4. GAME HEADERS BANNERS ================= */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <ImageIcon size={20} className="text-orange-500" />
            <h3>4. BANNER TIÊU ĐỀ CÁC MỤC GAME (FREE FIRE & LIÊN QUÂN)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Fire */}
            <div className="support-edit-item-box bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="card-idx-badge font-bold text-orange-600 bg-orange-50 border border-orange-200 mb-2">🔥 Mục Free Fire</span>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Tiêu Đề Game:"
                  value={formData.gameHeaders?.freefire?.banner || ''}
                  onChange={(val) => handleGameHeaderChange('freefire', 'banner', val)}
                  aspectRatio="wide"
                />
              </div>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Support Zalo:"
                  value={formData.gameHeaders?.freefire?.supportBanner || ''}
                  onChange={(val) => handleGameHeaderChange('freefire', 'supportBanner', val)}
                  aspectRatio="square"
                />
              </div>
              <div className="form-group mb-2">
                <label className="text-xs font-bold text-slate-700">Link Zalo Support:</label>
                <input 
                  type="text" 
                  value={formData.gameHeaders?.freefire?.supportLink || ''}
                  onChange={(e) => handleGameHeaderChange('freefire', 'supportLink', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            {/* Liên Quân */}
            <div className="support-edit-item-box bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="card-idx-badge font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 mb-2">⚔️ Mục Liên Quân (Cực Phẩm)</span>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Tiêu Đề Game:"
                  value={formData.gameHeaders?.lienquan?.banner || ''}
                  onChange={(val) => handleGameHeaderChange('lienquan', 'banner', val)}
                  aspectRatio="wide"
                />
              </div>
              <div className="form-group mb-3">
                <ImageFileInput 
                  label="Banner Support Zalo:"
                  value={formData.gameHeaders?.lienquan?.supportBanner || ''}
                  onChange={(val) => handleGameHeaderChange('lienquan', 'supportBanner', val)}
                  aspectRatio="square"
                />
              </div>
              <div className="form-group mb-2">
                <label className="text-xs font-bold text-slate-700">Link Zalo Support:</label>
                <input 
                  type="text" 
                  value={formData.gameHeaders?.lienquan?.supportLink || ''}
                  onChange={(e) => handleGameHeaderChange('lienquan', 'supportLink', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="card-quick-save-bar">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu Banner Các Mục Game</span>
            </button>
          </div>
        </div>

        {/* ================= 5. COMPACT CATEGORY IMAGE PICKER ================= */}
        <div className="banner-config-card">
          <div className="card-header-badge">
            <Layers size={20} className="text-indigo-600" />
            <h3>5. ẢNH ĐẠI DIỆN CÁC MỤC DANH MỤC TRÊN TRANG CHỦ</h3>
          </div>
          <p className="card-desc">
            Thay đổi ảnh hiển thị cho từng ô danh mục (Dưới 2M, 2M-7M, Siêu Phẩm...). Thiết kế gọn gàng, tải ảnh từ máy tính.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryList.map((cat) => (
              <div key={cat.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col gap-2">
                <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-extrabold">
                    {cat.tag || (cat.game === 'freefire' ? 'FF' : 'LQ')}
                  </span>
                </div>
                <ImageFileInput 
                  label="Chọn ảnh:"
                  value={cat.image || ''}
                  onChange={(val) => handleCatImageChange(cat.id, val)}
                  aspectRatio="wide"
                  maxWidth={600}
                  maxHeight={350}
                />
              </div>
            ))}
          </div>

          <div className="card-quick-save-bar mt-4">
            <button type="button" className="btn-gaming-primary btn-sm" onClick={handleSaveAll}>
              <Save size={14} />
              <span>Lưu Ảnh Danh Mục</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Slider Banner */}
      {bannerModalOpen && (
        <div className="modal-overlay" onClick={() => setBannerModalOpen(false)}>
          <div className="modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <h3>{editingBanner ? 'CHỈNH SỬA BANNER SLIDER' : 'THÊM BANNER SLIDER MỚI'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setBannerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBannerModal} className="admin-form-body">
              <div className="form-group mb-4">
                <label>Tiêu đề banner (hiển thị / ghi chú):</label>
                <input 
                  type="text" 
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="admin-input"
                  placeholder="Ví dụ: ĐẠI HỘI SALE ACC FF VIP..."
                  required
                />
              </div>

              <div className="form-group mb-4">
                <ImageFileInput 
                  label="Chọn tệp ảnh banner từ máy tính (tỷ lệ rộng / slider):"
                  value={bannerForm.image}
                  onChange={(val) => setBannerForm({ ...bannerForm, image: val })}
                  aspectRatio="banner"
                  maxWidth={1600}
                  maxHeight={800}
                />
                <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 font-semibold">Hoặc chọn mẫu:</span>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold px-2 py-1 rounded border border-indigo-200"
                    onClick={() => setBannerForm({ ...bannerForm, image: '/images/banner-shopvanchung.png' })}
                  >
                    Dùng Banner Chuẩn SHOPVANCHUNG
                  </button>
                </div>
                <div className="mt-2">
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">Hoặc dán trực tiếp link URL ảnh:</label>
                  <input 
                    type="url" 
                    value={bannerForm.image?.startsWith('data:') ? '' : bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    className="admin-input text-xs"
                    placeholder="https://... (nếu có sẵn link ảnh online)"
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Đường link khi click vào banner (Tùy chọn):</label>
                <input 
                  type="text" 
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                  className="admin-input"
                  placeholder="Ví dụ: #/tai-khoan/ff-sieu-pham hoặc https://zalo.me/..."
                />
              </div>

              <div className="form-checkboxes-row mb-4">
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                  />
                  <span>Bật hiển thị banner này trên trang chủ</span>
                </label>
              </div>

              <div className="admin-form-footer">
                <button type="button" className="btn-secondary" onClick={() => setBannerModalOpen(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-primary">
                  {editingBanner ? 'Cập Nhật Banner' : 'Lưu & Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
