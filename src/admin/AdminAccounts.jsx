import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Flame, 
  Trophy, 
  X, 
  Image as ImageIcon,
  Save,
  Layers,
  Crown,
  UploadCloud,
  ExternalLink
} from 'lucide-react';
import ImageFileInput from './ImageFileInput';
import { processMultipleFiles } from '../utils/imageUpload';
import { isSupabaseConfigured, uploadMultipleImagesToSupabase } from '../services/supabaseStorage';
import { storage } from '../services/storage';
import { formatVND } from '../components/AccountCard';
import './AdminAccounts.css';

export default function AdminAccounts({ accounts, categories, onUpdateAccounts, showToast, onExitAdmin }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  // Quick Price Edit Modal
  const [quickPriceAccount, setQuickPriceAccount] = useState(null);
  const [newQuickPrice, setNewQuickPrice] = useState('');

  // Form State
  const initialForm = {
    code: '',
    title: '',
    game: 'freefire',
    categoryId: 'ff-2m-7m',
    price: 1500000,
    originalPrice: 2000000,
    level: 65,
    rank: 'Huyền Thoại',
    skins: 150,
    characters: 'Full nhân vật',
    pets: '18 Pet',
    gunSkins: 'AK Rồng Xanh Lv4, MP40 Mãng Xà Lv5',
    outfits: 'Set Quỷ Dạ Xoa, Áo Mùa 2',
    rareItems: 'Đồ Cổ S1-S2',
    description: 'Tài khoản chính chủ, thông tin trắng sạch 100%, hỗ trợ đổi thông tin bảo mật vĩnh viễn.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'available',
    hidden: false,
    isVip: false,
    isFeatured: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchSearch = 
      (acc.code || acc.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.gunSkins || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchGame = gameFilter === 'all' || acc.game === gameFilter;
    const matchStatus = statusFilter === 'all' || acc.status === statusFilter;

    return matchSearch && matchGame && matchStatus;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setFormData({
      ...initialForm,
      code: `#FF${randomNum}`,
      title: `ACC FF VIP #${randomNum} - AK RỒNG XANH + MP40 MÃNG XÀ`
    });
    setEditingAccount(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setFormData({
      ...acc,
      code: acc.code || acc.id,
      gallery: acc.gallery && acc.gallery.length > 0 ? acc.gallery : [acc.thumbnail]
    });
    setModalOpen(true);
  };

  // Save Account (Add or Edit)
  const handleSaveAccount = (e, andExit = false) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Vui lòng nhập đầy đủ tiêu đề và giá bán!');
      return;
    }

    if (editingAccount) {
      const updated = accounts.map(a => 
        (a.id === editingAccount.id || a.code === editingAccount.code) ? { ...formData, id: a.id } : a
      );
      onUpdateAccounts(updated);
      showToast(`Đã cập nhật thành công tài khoản ${formData.code}!`);
    } else {
      const newAcc = {
        ...formData,
        id: formData.code,
        views: 0,
        createdAt: new Date().toISOString()
      };
      onUpdateAccounts([newAcc, ...accounts]);
      showToast(`Đã thêm mới tài khoản ${newAcc.code}!`);
    }

    setModalOpen(false);
    if (andExit && onExitAdmin) {
      setTimeout(() => onExitAdmin(), 500);
    }
  };

  // Toggle Sold Status
  const handleToggleSold = (acc) => {
    const nextStatus = acc.status === 'sold' ? 'available' : 'sold';
    const updated = accounts.map(a => 
      (a.id === acc.id) ? { ...a, status: nextStatus } : a
    );
    onUpdateAccounts(updated);
    showToast(`Đã chuyển trạng thái acc ${acc.code || acc.id} sang "${nextStatus === 'sold' ? 'Đã bán' : 'Còn hàng'}"`);
  };

  // Toggle Hidden Status
  const handleToggleHidden = (acc) => {
    const nextHidden = !acc.hidden;
    const updated = accounts.map(a => 
      (a.id === acc.id) ? { ...a, hidden: nextHidden } : a
    );
    onUpdateAccounts(updated);
    showToast(`Đã ${nextHidden ? 'ẩn' : 'hiện'} tài khoản ${acc.code || acc.id}`);
  };

  // Delete Account
  const handleDeleteAccount = (acc) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản ${acc.code || acc.id} khỏi hệ thống?`)) {
      const updated = accounts.filter(a => a.id !== acc.id && a.code !== acc.code);
      onUpdateAccounts(updated);
      showToast(`Đã xóa tài khoản ${acc.code || acc.id}`);
    }
  };

  // Delete All Accounts
  const handleDeleteAllAccounts = () => {
    if (accounts.length === 0) {
      alert('Kho tài khoản hiện đang trống!');
      return;
    }
    const confirmed = window.confirm(
      `⚠️ CẢNH BÁO XÓA TẤT CẢ:\n\nBạn có chắc chắn muốn xóa TOÀN BỘ ${accounts.length} tài khoản trong kho?\n\nToàn bộ tài khoản sẽ bị xóa sạch vĩnh viễn cả trên máy và Cloud Database.`
    );
    if (confirmed) {
      onUpdateAccounts([]);
      showToast('Đã xóa sạch toàn bộ tài khoản khỏi hệ thống!');
    }
  };

  // Quick Price Update
  const handleSaveQuickPrice = () => {
    const num = Number(newQuickPrice);
    if (!num || num <= 0) {
      alert('Vui lòng nhập mức giá hợp lệ!');
      return;
    }
    const updated = accounts.map(a => 
      (a.id === quickPriceAccount.id) ? { ...a, price: num } : a
    );
    onUpdateAccounts(updated);
    showToast(`Đã đổi giá ${quickPriceAccount.code} thành ${formatVND(num)}`);
    setQuickPriceAccount(null);
  };

  // Add image to gallery
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData({
      ...formData,
      gallery: [...formData.gallery, newGalleryUrl.trim()]
    });
    setNewGalleryUrl('');
  };

  // Remove image from gallery
  const handleRemoveGalleryImage = (index) => {
    const nextGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: nextGallery });
  };

  const currentCategories = categories.filter(c => c.game === formData.game);

  return (
    <div className="admin-accounts-view">
      {/* Top Controls */}
      <div className="admin-controls-card">
        <div className="controls-left">
          {/* Search */}
          <div className="admin-search-wrap">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã acc, tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Game filter */}
          <select 
            value={gameFilter} 
            onChange={(e) => setGameFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">Tất cả game</option>
            <option value="freefire">🔥 Free Fire</option>
            <option value="lienquan">⚔️ Liên Quân (Cực Phẩm)</option>
          </select>

          {/* Status filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">🟢 Đang bán (Còn hàng)</option>
            <option value="sold">🔴 Đã bán</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button 
            type="button" 
            className="btn-gaming-primary"
            onClick={handleDeleteAllAccounts}
            title="Xóa toàn bộ tất cả tài khoản trong kho một lần bấm"
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
              borderColor: '#f87171',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
            }}
          >
            <Trash2 size={16} />
            <span>XÓA HẾT ACC {accounts.length > 0 ? `(${accounts.length})` : ''}</span>
          </button>
          {onExitAdmin && (
            <button className="btn-gaming-success" onClick={onExitAdmin}>
              <ExternalLink size={16} />
              <span>XEM TRANG CHỦ SHOP</span>
            </button>
          )}
          <button className="btn-gaming-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>THÊM ACC MỚI</span>
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Mã Acc</th>
              <th>Tên Tài Khoản</th>
              <th>Game</th>
              <th>Giá Bán</th>
              <th>Rank & Cấp</th>
              <th>Trạng Thái</th>
              <th>Hiển Thị</th>
              <th className="text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => {
                const isSold = acc.status === 'sold';
                return (
                  <tr key={acc.id || acc.code} className={acc.hidden ? 'row-hidden' : ''}>
                    {/* Thumbnail */}
                    <td>
                      <img 
                        src={acc.thumbnail} 
                        alt="" 
                        className="table-acc-thumb"
                        onError={(e) => {
                          e.target.src = 'https://shoptyseisei.net/uploads/03-09-2026/4bb14574-5f3d-426a-9da7-11f8215e3b11.jpg';
                        }}
                      />
                    </td>

                    {/* Code */}
                    <td className="font-bold text-fire">
                      {acc.code || acc.id}
                      {acc.isVip && <Crown size={13} className="text-gold inline-icon" />}
                    </td>

                    {/* Title */}
                    <td>
                      <div className="table-title-cell" title={acc.title}>
                        <strong>{acc.title}</strong>
                        <small className="text-dim">{acc.gunSkins || acc.characters || ''}</small>
                      </div>
                    </td>

                    {/* Game */}
                    <td>
                      <span className={`badge-gaming ${acc.game === 'freefire' ? 'badge-fire' : 'badge-gold'}`}>
                        {acc.game === 'freefire' ? 'FREE FIRE' : 'LIÊN QUÂN'}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="table-price-cell">
                        <span className="price-num">{formatVND(acc.price)}</span>
                        <button 
                          className="quick-price-btn" 
                          onClick={() => { setQuickPriceAccount(acc); setNewQuickPrice(acc.price); }}
                          title="Đổi nhanh giá"
                        >
                          Đổi giá
                        </button>
                      </div>
                    </td>

                    {/* Rank & Level */}
                    <td>
                      <div>
                        <div className="text-cyan font-bold">{acc.rank}</div>
                        <small className="text-dim">Level {acc.level}</small>
                      </div>
                    </td>

                    {/* Sold Status Toggle */}
                    <td>
                      <button 
                        className={`status-toggle-btn ${isSold ? 'sold' : 'available'}`}
                        onClick={() => handleToggleSold(acc)}
                        title="Bấm để đổi trạng thái Còn hàng / Đã bán"
                      >
                        {isSold ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        <span>{isSold ? 'Đã bán' : 'Còn hàng'}</span>
                      </button>
                    </td>

                    {/* Hidden Toggle */}
                    <td>
                      <button 
                        className={`icon-btn ${acc.hidden ? 'text-dim' : 'text-green'}`}
                        onClick={() => handleToggleHidden(acc)}
                        title={acc.hidden ? 'Đang ẩn - Bấm để hiện' : 'Đang hiện - Bấm để ẩn'}
                      >
                        {acc.hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="table-actions-cell flex gap-2 justify-end">
                        <button 
                          type="button"
                          className="btn-acc-view"
                          onClick={() => {
                            const code = acc.code ? acc.code.replace('#', '') : acc.id;
                            window.location.hash = `#/tai-khoan/${code}`;
                            if (onExitAdmin) onExitAdmin();
                          }}
                          title="Xem trang chi tiết tài khoản này trên website shop"
                        >
                          <ExternalLink size={14} />
                          <span>Xem</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-acc-edit"
                          onClick={() => handleOpenEdit(acc)}
                          title="Chỉnh sửa thông tin tài khoản này"
                        >
                          <Edit3 size={14} />
                          <span>Sửa</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-acc-delete"
                          onClick={() => handleDeleteAccount(acc)}
                          title="Xóa tài khoản này khỏi hệ thống"
                        >
                          <Trash2 size={14} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-8 text-dim">
                  Không tìm thấy tài khoản nào phù hợp với bộ lọc tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Quick Price */}
      {quickPriceAccount && (
        <div className="modal-overlay" onClick={() => setQuickPriceAccount(null)}>
          <div className="modal-container quick-price-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <h3>ĐỔI GIÁ BÁN TÀI KHOẢN {quickPriceAccount.code || quickPriceAccount.id}</h3>
              <button className="modal-close-btn" onClick={() => setQuickPriceAccount(null)}><X size={20} /></button>
            </div>
            <div className="p-6">
              <label className="filter-label mb-2">Nhập giá bán mới (VNĐ):</label>
              <input 
                type="number" 
                value={newQuickPrice}
                onChange={(e) => setNewQuickPrice(e.target.value)}
                className="admin-input mb-4"
                placeholder="Ví dụ: 3500000"
              />
              <div className="flex justify-end gap-3">
                <button className="btn-gaming-outline" onClick={() => setQuickPriceAccount(null)}>Hủy</button>
                <button className="btn-gaming-primary" onClick={handleSaveQuickPrice}>Lưu Giá Mới</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Full Account */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container full-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-modal-header">
              <h3>{editingAccount ? `CHỈNH SỬA TÀI KHOẢN ${formData.code}` : 'THÊM MỚI TÀI KHOẢN GAME'}</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveAccount} className="admin-form-body">
              <div className="form-grid">
                {/* Game */}
                <div className="form-group">
                  <label>Loại Game:</label>
                  <select 
                    value={formData.game}
                    onChange={(e) => {
                      const g = e.target.value;
                      const randomNum = Math.floor(10000 + Math.random() * 90000);
                      const prefix = g === 'lienquan' ? '#LQ' : '#FF';
                      const firstCat = categories.find(c => c.game === g);
                      setFormData({ 
                        ...formData, 
                        game: g,
                        code: `${prefix}${randomNum}`,
                        categoryId: firstCat ? firstCat.id : ''
                      });
                    }}
                    className="admin-input"
                  >
                    <option value="freefire">🔥 Free Fire</option>
                    <option value="lienquan">⚔️ Liên Quân (Nick Cực Phẩm)</option>
                  </select>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label>Mục Danh Mục:</label>
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="admin-input"
                  >
                    {currentCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Code */}
                <div className="form-group">
                  <label>Mã Acc (VD: #FF1025, #LQ999):</label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    className="admin-input"
                  />
                </div>

                {/* Title */}
                <div className="form-group full-col">
                  <label>Tiêu Đề Hiển Thị:</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="VD: NICK LIÊN QUÂN CỰC PHẨM - FULL TƯỚNG + 480 SKIN VIP"
                    className="admin-input"
                  />
                </div>

                {/* Price */}
                <div className="form-group">
                  <label>Giá Bán (VNĐ):</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="admin-input font-bold text-fire"
                  />
                </div>

                {/* Original Price */}
                <div className="form-group">
                  <label>Giá Gốc (Trước khi giảm):</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice || ''} 
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    placeholder="Ví dụ: 3000000"
                    className="admin-input"
                  />
                </div>

                {/* Rank */}
                <div className="form-group">
                  <label>Rank:</label>
                  <input 
                    type="text" 
                    value={formData.rank} 
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="admin-input"
                    placeholder="VD: Thách Đấu, Huyền Thoại..."
                  />
                </div>

                {/* Level */}
                <div className="form-group">
                  <label>Cấp độ (Level):</label>
                  <input 
                    type="number" 
                    value={formData.level} 
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="admin-input"
                  />
                </div>

                {/* Characters / Tướng / Cầu thủ */}
                <div className="form-group">
                  <label>Tướng / Nhân vật / Cầu thủ:</label>
                  <input 
                    type="text" 
                    value={formData.characters} 
                    onChange={(e) => setFormData({ ...formData, characters: e.target.value })}
                    className="admin-input"
                    placeholder="VD: 118/118 Full tướng, OVR 105..."
                  />
                </div>

                {/* Gun skins / Skin Hot */}
                <div className="form-group">
                  <label>Skin Súng / Skin Hot:</label>
                  <input 
                    type="text" 
                    value={formData.gunSkins} 
                    onChange={(e) => setFormData({ ...formData, gunSkins: e.target.value })}
                    className="admin-input"
                    placeholder="VD: Raz Muay Thái, AK Rồng..."
                  />
                </div>

                {/* Thumbnail Image File Picker */}
                <div className="form-group full-col">
                  <ImageFileInput 
                    label="Ảnh Bìa Đại Diện (Thumbnail):"
                    value={formData.thumbnail} 
                    onChange={(val) => setFormData({ ...formData, thumbnail: val })}
                    aspectRatio="card"
                  />
                </div>

                {/* Gallery Images List */}
                <div className="form-group full-col">
                  <label className="font-semibold block mb-1">Album Ảnh Chi Tiết (Nhiều ảnh):</label>
                  
                  {/* File Upload Button for Gallery */}
                  <div className="gallery-upload-controls flex flex-wrap gap-2 mb-3">
                    <label className="btn-gaming-primary cursor-pointer inline-flex items-center gap-2">
                      <UploadCloud size={16} />
                      <span>📁 Chọn tệp ảnh từ máy tính (Có thể chọn nhiều ảnh)</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const files = e.target.files;
                            const cfg = storage.getShopConfig();
                            let newImages = [];
                            if (isSupabaseConfigured(cfg)) {
                              showToast(`⏳ Đang tải ${files.length} ảnh lên Supabase Storage...`);
                              newImages = await uploadMultipleImagesToSupabase(files, 'accounts', cfg);
                            }
                            if (!newImages.length) {
                              newImages = await processMultipleFiles(files);
                            }
                            setFormData(prev => ({
                              ...prev,
                              gallery: [...(prev.gallery || []), ...newImages]
                            }));
                            showToast(`Đã thêm ${newImages.length} ảnh vào album!`);
                          }
                        }}
                      />
                    </label>

                    <div className="flex gap-2 flex-1 min-w-[200px]">
                      <input 
                        type="url" 
                        value={newGalleryUrl} 
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Hoặc dán link ảnh chi tiết vào đây..."
                        className="admin-input flex-1 text-xs"
                      />
                      <button 
                        type="button" 
                        className="btn-gaming-outline text-xs px-3" 
                        onClick={() => {
                          if (newGalleryUrl.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              gallery: [...(prev.gallery || []), newGalleryUrl.trim()]
                            }));
                            setNewGalleryUrl('');
                          }
                        }}
                      >
                        Thêm Link
                      </button>
                    </div>
                  </div>

                  {/* Previews */}
                  <div className="admin-gallery-preview-grid">
                    {formData.gallery && formData.gallery.filter(url => Boolean(url && String(url).trim())).map((url, i) => (
                      <div key={i} className="gallery-preview-item">
                        <img src={url} alt={`Preview ${i}`} />
                        <button 
                          type="button" 
                          className="remove-img-btn" 
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              gallery: prev.gallery.filter((_, idx) => idx !== i)
                            }));
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="form-group full-col">
                  <label>Mô Tả Chi Tiết Tài Khoản:</label>
                  <textarea 
                    rows={3}
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-input"
                  />
                </div>

                {/* Status Options */}
                <div className="form-group full-col flex flex-wrap gap-6 pt-2">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.status === 'sold'} 
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'sold' : 'available' })} 
                    />
                    <span>Đánh dấu ĐÃ BÁN</span>
                  </label>

                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.hidden} 
                      onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })} 
                    />
                    <span>Ẩn tài khoản (Không hiển thị ở ngoài shop)</span>
                  </label>

                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.isVip} 
                      onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })} 
                    />
                    <span>Đánh dấu SIÊU PHẨM VIP</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-footer flex gap-2 justify-end flex-wrap">
                <button type="button" className="btn-gaming-outline" onClick={() => setModalOpen(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-gaming-primary">
                  <Save size={18} />
                  <span>{editingAccount ? 'LƯU THAY ĐỔI' : 'TẠO TÀI KHOẢN'}</span>
                </button>
                {onExitAdmin && (
                  <button 
                    type="button" 
                    className="btn-gaming-success" 
                    onClick={(e) => handleSaveAccount(e, true)}
                  >
                    <ExternalLink size={18} />
                    <span>LƯU & XEM SANG TRANG CHỦ</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
