import React, { useState, useRef, useMemo } from 'react';
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
  ExternalLink,
  Swords,
  Sparkles,
  Shield,
  Tag,
  Dices,
  Percent,
  SlidersHorizontal,
  RefreshCw,
  Star,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import ImageFileInput from './ImageFileInput';
import { processMultipleFiles } from '../utils/imageUpload';
import { isSupabaseConfigured, uploadMultipleImagesToSupabase } from '../services/supabaseStorage';
import { storage } from '../services/storage';
import { formatVND } from '../components/AccountCard';
import './AdminAccounts.css';

const FF_RANKS = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Huyền Thoại', 'Đại Cao Thủ', 'Thách Đấu'];
const LQ_RANKS = ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Chiến Tướng', 'Thách Đấu'];

const QUICK_PRICES = [
  { label: '500k', value: 500000 },
  { label: '1tr', value: 1000000 },
  { label: '1.5tr', value: 1500000 },
  { label: '2tr', value: 2000000 },
  { label: '3tr', value: 3000000 },
  { label: '5tr', value: 5000000 },
  { label: '7tr', value: 7000000 },
  { label: '10tr', value: 10000000 }
];

const FF_TAG_SUGGESTIONS = [
  'AK Rồng Xanh Lv7',
  'MP40 Mãng Xà Lv7',
  'M1014 Long Tộc Lv7',
  'Full Nhân Vật',
  'Set Quỷ Dạ Xoa',
  'Áo Mùa 2',
  'Đồ Cổ S1-S2',
  'Thông Tin Trắng 100%',
  'Giá Học Sinh'
];

const LQ_TAG_SUGGESTIONS = [
  'Full Tướng',
  'Full Ngọc 90',
  'Ngộ Không Nhóc Tì SSS',
  'Tulen Tân Thần Cổ Điển',
  'Raz Muay Thái Siêu Cấp',
  'Lauriel Thứ Nguyên Vệ Thần',
  'Nakroth Lôi Quang Sứ Giả',
  'Chiến Tướng 50 Sao',
  'Thông Tin Trắng'
];

export default function AdminAccounts({ accounts = [], categories = [], onUpdateAccounts, showToast, onExitAdmin }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const overlayMouseDownRef = useRef(false);
  
  // Quick Price Edit Modal
  const [quickPriceAccount, setQuickPriceAccount] = useState(null);
  const [newQuickPrice, setNewQuickPrice] = useState('');

  // Form State
  const initialForm = {
    code: '',
    title: '',
    game: 'freefire',
    categoryId: '',
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
    description: 'Tài khoản chính chủ, thông tin trắng sạch 100%, bảo mật vĩnh viễn, hỗ trợ đổi mật khẩu bảo hành trọn đời.',
    thumbnail: '',
    gallery: [],
    status: 'available',
    hidden: false,
    isVip: false,
    isFeatured: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = accounts.length;
    const ff = accounts.filter(a => a.game === 'freefire').length;
    const lq = accounts.filter(a => a.game === 'lienquan').length;
    const sold = accounts.filter(a => a.status === 'sold').length;
    const available = accounts.filter(a => a.status !== 'sold').length;
    const totalValue = accounts.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    return { total, ff, lq, sold, available, totalValue };
  }, [accounts]);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter(acc => {
        const matchSearch = 
          (acc.code || acc.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (acc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (acc.gunSkins || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (acc.characters || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchGame = gameFilter === 'all' || acc.game === gameFilter;
        const matchStatus = 
          statusFilter === 'all' ? true :
          statusFilter === 'available' ? acc.status !== 'sold' && !acc.hidden :
          statusFilter === 'sold' ? acc.status === 'sold' :
          statusFilter === 'vip' ? acc.isVip :
          statusFilter === 'hidden' ? acc.hidden : true;

        return matchSearch && matchGame && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [accounts, searchTerm, gameFilter, statusFilter, sortBy]);

  // Generate random account code
  const generateRandomCode = (game = formData.game) => {
    const prefix = game === 'lienquan' ? '#LQ' : '#FF';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${randomNum}`;
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const generatedCode = generateRandomCode('freefire');
    const firstCat = categories.find(c => c.game === 'freefire');
    setFormData({
      ...initialForm,
      game: 'freefire',
      code: generatedCode,
      categoryId: firstCat ? firstCat.id : 'ff-2m-7m',
      title: `ACC FF VIP ${generatedCode} - AK RỒNG XANH + MP40 MÃNG XÀ`,
      rank: 'Huyền Thoại',
      thumbnail: '',
      gallery: []
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
      thumbnail: acc.thumbnail || (acc.gallery && acc.gallery[0]) || '',
      gallery: acc.gallery && acc.gallery.length > 0 ? acc.gallery : (acc.thumbnail ? [acc.thumbnail] : [])
    });
    setModalOpen(true);
  };

  // Change Game in Modal
  const handleSelectGame = (targetGame) => {
    const newCode = generateRandomCode(targetGame);
    const cat = categories.find(c => c.game === targetGame);
    const defaultRank = targetGame === 'lienquan' ? 'Cao Thủ' : 'Huyền Thoại';
    const defaultTitle = targetGame === 'lienquan'
      ? `ACC LQ VIP ${newCode} - FULL TƯỚNG + NGỘ KHÔNG NHÓC TÌ SSS`
      : `ACC FF VIP ${newCode} - AK RỒNG XANH + MP40 MÃNG XÀ`;

    setFormData(prev => ({
      ...prev,
      game: targetGame,
      code: newCode,
      categoryId: cat ? cat.id : prev.categoryId,
      rank: defaultRank,
      title: defaultTitle,
      characters: targetGame === 'lienquan' ? 'Full tướng, 150 trang phục' : 'Full nhân vật',
      gunSkins: targetGame === 'lienquan' ? 'Ngọc 90 chuẩn, Trang phục SSS' : 'AK Rồng Xanh Lv4, MP40 Mãng Xà Lv5'
    }));
  };

  // Append Tag Suggestion to Title
  const handleAppendTag = (tag) => {
    setFormData(prev => {
      const current = prev.title || '';
      if (current.includes(tag)) return prev;
      const separator = current.trim() ? ' - ' : '';
      return {
        ...prev,
        title: `${current}${separator}${tag}`
      };
    });
  };

  // Quick Price selection
  const handleSetPrice = (val) => {
    setFormData(prev => ({
      ...prev,
      price: val,
      originalPrice: Math.round(val * 1.25)
    }));
  };

  // Set image as main thumbnail
  const handleSetAsThumbnail = (url) => {
    if (!url) return;
    setFormData(prev => ({
      ...prev,
      thumbnail: url
    }));
    showToast('Đã chọn làm ảnh bìa đại diện chính!');
  };

  // Prevent accidental submit when pressing Enter in inputs
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  // Add detail image URL safely
  const handleAddGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      const url = newGalleryUrl.trim();
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), url],
        thumbnail: prev.thumbnail || url
      }));
      setNewGalleryUrl('');
      showToast('Đã thêm 1 ảnh vào album!');
    }
  };

  // Close modal safely with confirmation
  const handleCloseModal = () => {
    if (window.confirm('Bạn có chắc muốn đóng cửa sổ? Dữ liệu đang nhập sẽ không được lưu.')) {
      setModalOpen(false);
    }
  };

  // Save Account (Add or Edit)
  const handleSaveAccount = (e, andExit = false) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Vui lòng nhập đầy đủ tiêu đề và giá bán!');
      return;
    }

    // Tự động kết nối ảnh bìa và album chi tiết
    const finalThumb = formData.thumbnail || (formData.gallery && formData.gallery[0]) || '';
    const finalGallery = (formData.gallery && formData.gallery.length > 0)
      ? formData.gallery
      : (finalThumb ? [finalThumb] : []);

    const accountData = {
      ...formData,
      code: (formData.code || generateRandomCode(formData.game)).trim().toUpperCase(),
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.price) || 0,
      level: Number(formData.level) || 0,
      skins: Number(formData.skins) || 0,
      thumbnail: finalThumb,
      gallery: finalGallery
    };

    if (editingAccount) {
      const updated = accounts.map(a => 
        (a.id === editingAccount.id || a.code === editingAccount.code) 
          ? { ...accountData, id: a.id } 
          : a
      );
      onUpdateAccounts(updated);
      showToast(`Đã cập nhật thành công tài khoản ${accountData.code}!`);
    } else {
      const newAcc = {
        ...accountData,
        id: accountData.code,
        views: 0,
        createdAt: new Date().toISOString()
      };
      onUpdateAccounts([newAcc, ...accounts]);
      showToast(`Đã thêm mới tài khoản ${newAcc.code} thành công!`);
    }

    setModalOpen(false);
    if (andExit) {
      window.open(`/#/tai-khoan/${encodeURIComponent(accountData.code)}`, '_blank');
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

  // Toggle VIP Status
  const handleToggleVip = (acc) => {
    const nextVip = !acc.isVip;
    const updated = accounts.map(a => 
      (a.id === acc.id) ? { ...a, isVip: nextVip } : a
    );
    onUpdateAccounts(updated);
    showToast(`Đã ${nextVip ? 'gắn huy hiệu' : 'bỏ'} Siêu phẩm VIP cho ${acc.code || acc.id}`);
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
      `⚠️ CẢNH BÁO XÓA TẤT CẢ:\n\nBạn có chắc chắn muốn xóa TOÀN BỘ ${accounts.length} tài khoản trong kho?\n\nToàn bộ tài khoản sẽ bị xóa sạch cả trên máy và Cloud Database.`
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

  // Calculate discount percentage
  const discountPercent = formData.originalPrice && formData.originalPrice > formData.price
    ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
    : 0;

  const savingsAmount = formData.originalPrice && formData.originalPrice > formData.price
    ? formData.originalPrice - formData.price
    : 0;

  const currentCategories = categories.filter(c => c.game === formData.game);
  const tagSuggestions = formData.game === 'lienquan' ? LQ_TAG_SUGGESTIONS : FF_TAG_SUGGESTIONS;
  const currentRanks = formData.game === 'lienquan' ? LQ_RANKS : FF_RANKS;

  return (
    <div className="admin-accounts-view">
      {/* 1. TOP METRICS DASHBOARD */}
      <div className="admin-metrics-grid">
        <div className="metric-card metric-total">
          <div className="metric-icon-wrap">
            <Layers size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Tổng Tài Khoản Kho</span>
            <div className="metric-val-row">
              <strong className="metric-number">{metrics.total}</strong>
              <span className="metric-badge-chip">Đang lưu trữ</span>
            </div>
          </div>
        </div>

        <div className="metric-card metric-ff">
          <div className="metric-icon-wrap">
            <Flame size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Nick Free Fire</span>
            <div className="metric-val-row">
              <strong className="metric-number">{metrics.ff}</strong>
              <span className="metric-badge-chip chip-fire">Garena FF</span>
            </div>
          </div>
        </div>

        <div className="metric-card metric-lq">
          <div className="metric-icon-wrap">
            <Swords size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Nick Liên Quân</span>
            <div className="metric-val-row">
              <strong className="metric-number">{metrics.lq}</strong>
              <span className="metric-badge-chip chip-gold">Cực phẩm</span>
            </div>
          </div>
        </div>

        <div className="metric-card metric-revenue">
          <div className="metric-icon-wrap">
            <DollarSign size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Tổng Giá Trị Niêm Yết</span>
            <div className="metric-val-row">
              <strong className="metric-number text-gold">{formatVND(metrics.totalValue)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTROLS & FILTER BAR */}
      <div className="admin-controls-card">
        <div className="controls-left">
          {/* Search Box */}
          <div className="admin-search-wrap">
            <Search size={16} className="text-dim" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã acc, rank, súng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Game Filter Pills */}
          <div className="filter-pill-group">
            <button 
              type="button" 
              className={`filter-pill-btn ${gameFilter === 'all' ? 'active' : ''}`}
              onClick={() => setGameFilter('all')}
            >
              <span>Tất Cả Game</span>
              <span className="pill-count">{metrics.total}</span>
            </button>
            <button 
              type="button" 
              className={`filter-pill-btn pill-ff ${gameFilter === 'freefire' ? 'active' : ''}`}
              onClick={() => setGameFilter('freefire')}
            >
              <Flame size={14} />
              <span>Free Fire</span>
              <span className="pill-count">{metrics.ff}</span>
            </button>
            <button 
              type="button" 
              className={`filter-pill-btn pill-lq ${gameFilter === 'lienquan' ? 'active' : ''}`}
              onClick={() => setGameFilter('lienquan')}
            >
              <Swords size={14} />
              <span>Liên Quân</span>
              <span className="pill-count">{metrics.lq}</span>
            </button>
          </div>

          {/* Status Dropdown */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">⚡ Tất cả trạng thái</option>
            <option value="available">🟢 Đang bán (Còn hàng)</option>
            <option value="sold">🔴 Đã bán</option>
            <option value="vip">👑 Siêu phẩm VIP</option>
            <option value="hidden">👁️ Đang ẩn</option>
          </select>

          {/* Sort Dropdown */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="admin-select"
          >
            <option value="newest">🕒 Mới đăng nhất</option>
            <option value="price-desc">💎 Giá: Cao xuống thấp</option>
            <option value="price-asc">💵 Giá: Thấp lên cao</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="controls-right">
          <button 
            type="button" 
            className="btn-danger-outline"
            onClick={handleDeleteAllAccounts}
            title="Xóa toàn bộ kho tài khoản"
          >
            <Trash2 size={16} />
            <span>XÓA HẾT ACC</span>
          </button>

          {onExitAdmin && (
            <button type="button" className="btn-gaming-outline" onClick={onExitAdmin}>
              <ExternalLink size={16} />
              <span>XEM SHOP</span>
            </button>
          )}

          <button type="button" className="btn-gaming-primary btn-add-acc" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>THÊM ACC MỚI</span>
          </button>
        </div>
      </div>

      {/* 3. ACCOUNTS DATA TABLE */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '85px' }}>ẢNH BÌA</th>
              <th style={{ width: '130px' }}>MÃ ACC</th>
              <th>TIÊU ĐỀ & CHI TIẾT NICK</th>
              <th style={{ width: '120px' }}>GAME</th>
              <th style={{ width: '150px' }}>GIÁ NIÊM YẾT</th>
              <th style={{ width: '130px' }}>RANK / CẤP</th>
              <th style={{ width: '110px' }}>TRẠNG THÁI</th>
              <th style={{ width: '70px' }}>VIP</th>
              <th style={{ width: '70px' }}>HIỂN THỊ</th>
              <th className="text-right" style={{ width: '150px' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => {
                const isSold = acc.status === 'sold';
                const thumbImg = acc.thumbnail || (acc.gallery && acc.gallery[0]) || '/images/logo-shopvanchung.png';
                return (
                  <tr key={acc.id || acc.code} className={acc.hidden ? 'row-hidden' : ''}>
                    {/* Thumbnail */}
                    <td>
                      <div className="table-thumb-cell">
                        <img 
                          src={thumbImg} 
                          alt="" 
                          className="table-acc-thumb"
                          onError={(e) => {
                            e.target.src = '/images/logo-shopvanchung.png';
                          }}
                        />
                        {acc.gallery && acc.gallery.length > 1 && (
                          <span className="gallery-count-badge">+{acc.gallery.length}</span>
                        )}
                      </div>
                    </td>

                    {/* Code */}
                    <td>
                      <div className="table-code-wrap">
                        <span className="code-text">{acc.code || acc.id}</span>
                        {acc.isVip && <Crown size={14} className="text-gold inline-icon" title="Siêu phẩm VIP" />}
                      </div>
                    </td>

                    {/* Title & Stats */}
                    <td>
                      <div className="table-title-cell" title={acc.title}>
                        <strong className="title-text">{acc.title}</strong>
                        <div className="title-sub-stats">
                          {acc.gunSkins && <span className="stat-chip">{acc.gunSkins}</span>}
                          {acc.characters && <span className="stat-chip chip-dim">{acc.characters}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Game */}
                    <td>
                      <span className={`badge-gaming ${acc.game === 'freefire' ? 'badge-fire' : 'badge-gold'}`}>
                        {acc.game === 'freefire' ? '🔥 FREE FIRE' : '⚔️ LIÊN QUÂN'}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="table-price-cell">
                        <span className="price-num">{formatVND(acc.price)}</span>
                        {acc.originalPrice && acc.originalPrice > acc.price && (
                          <del className="price-old">{formatVND(acc.originalPrice)}</del>
                        )}
                        <button 
                          type="button"
                          className="quick-price-btn" 
                          onClick={() => { setQuickPriceAccount(acc); setNewQuickPrice(acc.price); }}
                          title="Đổi nhanh mức giá bán"
                        >
                          Đổi giá nhanh
                        </button>
                      </div>
                    </td>

                    {/* Rank & Level */}
                    <td>
                      <div className="table-rank-cell">
                        <span className="rank-name">{acc.rank || 'Huyền Thoại'}</span>
                        <small className="level-text">Cấp {acc.level || 0}</small>
                      </div>
                    </td>

                    {/* Sold Status Toggle */}
                    <td>
                      <button 
                        type="button"
                        className={`status-toggle-btn ${isSold ? 'sold' : 'available'}`}
                        onClick={() => handleToggleSold(acc)}
                        title="Bấm để đổi trạng thái Còn hàng / Đã bán"
                      >
                        {isSold ? <XCircle size={13} /> : <CheckCircle size={13} />}
                        <span>{isSold ? 'ĐÃ BÁN' : 'CÒN HÀNG'}</span>
                      </button>
                    </td>

                    {/* VIP Toggle */}
                    <td>
                      <button 
                        type="button"
                        className={`icon-toggle-btn ${acc.isVip ? 'is-active-vip' : ''}`}
                        onClick={() => handleToggleVip(acc)}
                        title={acc.isVip ? 'Đang là VIP - Bấm để bỏ' : 'Bấm để đặt làm VIP'}
                      >
                        <Crown size={16} />
                      </button>
                    </td>

                    {/* Hidden Toggle */}
                    <td>
                      <button 
                        type="button"
                        className={`icon-toggle-btn ${acc.hidden ? 'is-hidden-acc' : 'is-visible-acc'}`}
                        onClick={() => handleToggleHidden(acc)}
                        title={acc.hidden ? 'Đang ẩn - Bấm để hiện' : 'Đang hiện - Bấm để ẩn'}
                      >
                        {acc.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="table-actions-cell">
                        <button 
                          type="button"
                          className="btn-acc-view"
                          onClick={() => {
                            const code = acc.code ? acc.code.replace('#', '') : acc.id;
                            window.location.hash = `#/tai-khoan/${code}`;
                            if (onExitAdmin) onExitAdmin();
                          }}
                          title="Xem trên shop"
                        >
                          <ExternalLink size={13} />
                          <span>Xem</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-acc-edit"
                          onClick={() => handleOpenEdit(acc)}
                          title="Chỉnh sửa tài khoản"
                        >
                          <Edit3 size={13} />
                          <span>Sửa</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-acc-delete"
                          onClick={() => handleDeleteAccount(acc)}
                          title="Xóa tài khoản"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-12">
                  <div className="empty-table-state">
                    <Layers size={36} className="text-dim mb-2 opacity-40" />
                    <p className="text-dim font-medium">Không tìm thấy tài khoản nào phù hợp với bộ lọc.</p>
                    <button type="button" className="btn-gaming-primary mt-3" onClick={handleOpenAdd}>
                      <Plus size={16} />
                      <span>Thêm Tài Khoản Đầu Tiên</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. MODAL: QUICK PRICE EDIT */}
      {quickPriceAccount && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickPriceAccount(null);
          }}
        >
          <div className="modal-container quick-price-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-cyber-header">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-gold" />
                <h3>ĐỔI GIÁ BÁN ACC {quickPriceAccount.code || quickPriceAccount.id}</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setQuickPriceAccount(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <label className="text-xs text-dim block mb-2 font-semibold">Nhập mức giá bán mới (VNĐ):</label>
              <div className="input-with-currency mb-2">
                <input 
                  type="number" 
                  value={newQuickPrice}
                  onChange={(e) => setNewQuickPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveQuickPrice();
                    }
                  }}
                  className="admin-input font-bold text-lg"
                  placeholder="Ví dụ: 3500000"
                  autoFocus
                />
                <span className="currency-tag">VNĐ</span>
              </div>
              <div className="text-xs text-gold font-bold mb-4">
                Hiển thị: {formatVND(Number(newQuickPrice) || 0)}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-gaming-outline" onClick={() => setQuickPriceAccount(null)}>Hủy Bỏ</button>
                <button type="button" className="btn-gaming-primary" onClick={handleSaveQuickPrice}>Lưu Giá Mới</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: NÂNG CẤP CHUYÊN NGHIỆP - THÊM / SỬA TÀI KHOẢN GAME */}
      {modalOpen && (
        <div 
          className="modal-overlay" 
          onMouseDown={(e) => {
            overlayMouseDownRef.current = (e.target === e.currentTarget);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && overlayMouseDownRef.current) {
              handleCloseModal();
            }
          }}
        >
          <div className="modal-container pro-account-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Luxury Header */}
            <div className="modal-pro-header">
              <div className="header-left-group">
                <div className={`pro-game-pill ${formData.game === 'lienquan' ? 'pill-lq' : 'pill-ff'}`}>
                  {formData.game === 'lienquan' ? <Swords size={16} /> : <Flame size={16} />}
                  <span>{formData.game === 'lienquan' ? 'LIÊN QUÂN MOBILE' : 'GARENA FREE FIRE'}</span>
                </div>
                <div className="title-text-wrap">
                  <h2>{editingAccount ? `CHỈNH SỬA TÀI KHOẢN ${formData.code}` : 'THÊM MỚI TÀI KHOẢN GAME'}</h2>
                  <p className="subtitle">Niêm yết thông số tài khoản và đưa ảnh lên hệ thống đám mây</p>
                </div>
              </div>

              <div className="header-right-group">
                <span className="pro-code-badge">{formData.code || 'CHƯA CÓ MÃ'}</span>
                <button type="button" className="modal-close-btn" onClick={handleCloseModal} title="Đóng">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveAccount} onKeyDown={handleFormKeyDown} className="admin-form-body pro-form-body">
              {/* SECTION 1: CHỌN GAME & DANH MỤC */}
              <div className="form-card-section">
                <div className="section-header">
                  <div className="section-icon-badge">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h4>1. PHÂN LOẠI & THÔNG TIN CƠ BẢN</h4>
                    <small>Chọn loại game, danh mục bán và mã nhận diện tài khoản</small>
                  </div>
                </div>

                <div className="section-body">
                  {/* Game Selector Cards */}
                  <div className="game-selector-grid mb-4">
                    <button 
                      type="button" 
                      className={`game-card-select ${formData.game === 'freefire' ? 'selected ff' : ''}`}
                      onClick={() => handleSelectGame('freefire')}
                    >
                      <div className="game-card-icon">
                        <Flame size={24} />
                      </div>
                      <div className="game-card-info">
                        <strong>FREE FIRE</strong>
                        <span>Nick VIP, AK Rồng Xanh, MP40 Mãng Xà</span>
                      </div>
                      <div className="card-check-icon">
                        <Check size={16} />
                      </div>
                    </button>

                    <button 
                      type="button" 
                      className={`game-card-select ${formData.game === 'lienquan' ? 'selected lq' : ''}`}
                      onClick={() => handleSelectGame('lienquan')}
                    >
                      <div className="game-card-icon">
                        <Swords size={24} />
                      </div>
                      <div className="game-card-info">
                        <strong>LIÊN QUÂN</strong>
                        <span>Nick Cực Phẩm, Full Tướng, Skin SSS</span>
                      </div>
                      <div className="card-check-icon">
                        <Check size={16} />
                      </div>
                    </button>
                  </div>

                  <div className="form-grid">
                    {/* Category */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Danh Mục Hiển Thị Ngoài Shop:</span>
                        <span className="text-required">*</span>
                      </label>
                      <select 
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="admin-input pro-select"
                        required
                      >
                        {currentCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Code */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Mã Tài Khoản (Code):</span>
                        <span className="text-required">*</span>
                      </label>
                      <div className="input-with-button-wrap">
                        <input 
                          type="text" 
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                          className="admin-input font-bold font-mono tracking-wider"
                          placeholder="VD: #FF1025 hoặc #LQ999"
                          required
                        />
                        <button 
                          type="button" 
                          className="btn-dice-generate"
                          onClick={() => {
                            const newCode = generateRandomCode(formData.game);
                            setFormData(prev => ({ ...prev, code: newCode }));
                            showToast(`Đã tạo mã ngẫu nhiên: ${newCode}`);
                          }}
                          title="Tạo mã ngẫu nhiên mới"
                        >
                          <Dices size={16} />
                          <span>Tạo Mã</span>
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="form-group full-col">
                      <label className="pro-label">
                        <span>Tiêu Đề Hiển Thị Trên Card Nick:</span>
                        <span className="text-required">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="admin-input font-semibold"
                        placeholder="VD: ACC FF VIP #12345 - AK RỒNG XANH LV7 + MP40 MÃNG XÀ"
                        required
                      />

                      {/* Title Tag Suggestions */}
                      <div className="tag-suggestions-row mt-2">
                        <span className="tag-label">Gợi ý chèn nhanh:</span>
                        <div className="tags-flex">
                          {tagSuggestions.map((tag, idx) => (
                            <button 
                              key={idx} 
                              type="button" 
                              className="tag-chip-btn"
                              onClick={() => handleAppendTag(tag)}
                            >
                              <span>+ {tag}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ĐỊNH GIÁ & KHUYẾN MÃI */}
              <div className="form-card-section">
                <div className="section-header">
                  <div className="section-icon-badge badge-gold">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <h4>2. ĐỊNH GIÁ BÁN & KHUYẾN MÃI</h4>
                    <small>Thiết lập mức giá bán thực tế và giá gốc để kích cầu người mua</small>
                  </div>
                </div>

                <div className="section-body">
                  <div className="form-grid">
                    {/* Price */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Giá Bán Thực Tế (VNĐ):</span>
                        <span className="text-required">*</span>
                      </label>
                      <div className="input-with-currency">
                        <input 
                          type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="admin-input font-bold text-lg text-gold"
                          placeholder="1500000"
                          required
                          min="0"
                        />
                        <span className="currency-tag">VNĐ</span>
                      </div>
                      <div className="live-preview-price text-gold font-semibold text-xs mt-1">
                        ≈ {formatVND(formData.price)}
                      </div>
                    </div>

                    {/* Original Price */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Giá Gốc (Trước khi giảm giá):</span>
                      </label>
                      <div className="input-with-currency">
                        <input 
                          type="number" 
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                          className="admin-input"
                          placeholder="2000000"
                          min="0"
                        />
                        <span className="currency-tag">VNĐ</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {discountPercent > 0 ? (
                          <span className="badge-discount-calc">
                            Giảm {discountPercent}% • Tiết kiệm {formatVND(savingsAmount)}
                          </span>
                        ) : (
                          <span className="text-xs text-dim">Chưa áp dụng giảm giá</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Prices Row */}
                    <div className="form-group full-col">
                      <label className="text-xs text-dim block mb-1">Mức giá phổ biến (Chọn nhanh):</label>
                      <div className="quick-price-chips-row">
                        {QUICK_PRICES.map((qp, i) => (
                          <button 
                            key={i} 
                            type="button" 
                            className={`price-preset-btn ${formData.price === qp.value ? 'active' : ''}`}
                            onClick={() => handleSetPrice(qp.value)}
                          >
                            {qp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: THUỘC TÍNH VÀ THÔNG SỐ ACC */}
              <div className="form-card-section">
                <div className="section-header">
                  <div className="section-icon-badge badge-cyan">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <h4>3. THUỘC TÍNH & THÔNG SỐ CHI TIẾT</h4>
                    <small>Các chỉ số hiển thị chi tiết để thu hút người mua</small>
                  </div>
                </div>

                <div className="section-body">
                  <div className="form-grid">
                    {/* Rank */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Mức Rank Hiện Tại:</span>
                      </label>
                      <select 
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        className="admin-input pro-select font-bold"
                      >
                        {currentRanks.map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    {/* Level */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Cấp Độ (Level):</span>
                      </label>
                      <input 
                        type="number" 
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                        className="admin-input"
                        placeholder="VD: 65"
                      />
                    </div>

                    {/* Characters / Champions */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Tướng / Nhân Vật / Cầu Thủ:</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.characters}
                        onChange={(e) => setFormData({ ...formData, characters: e.target.value })}
                        className="admin-input"
                        placeholder="VD: Full nhân vật, 18 Pet"
                      />
                    </div>

                    {/* Gun Skins / Hot Skins */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Skin Súng / Trang Phục Hot:</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.gunSkins}
                        onChange={(e) => setFormData({ ...formData, gunSkins: e.target.value })}
                        className="admin-input"
                        placeholder="VD: AK Rồng Xanh Lv7, MP40 Mãng Xà Lv5"
                      />
                    </div>

                    {/* Outfits */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Trang Phục Đặc Biệt / Set Đồ:</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.outfits}
                        onChange={(e) => setFormData({ ...formData, outfits: e.target.value })}
                        className="admin-input"
                        placeholder="VD: Set Quỷ Dạ Xoa, Áo Mùa 2"
                      />
                    </div>

                    {/* Rare Items */}
                    <div className="form-group">
                      <label className="pro-label">
                        <span>Đồ Cổ / Vật Phẩm Hiếm:</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.rareItems}
                        onChange={(e) => setFormData({ ...formData, rareItems: e.target.value })}
                        className="admin-input"
                        placeholder="VD: Thẻ Vô Cực S1-S2, Đồ Cổ Siêu Hiếm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: HÌNH ẢNH ĐẠI DIỆN VÀ ALBUM ẢNH */}
              <div className="form-card-section">
                <div className="section-header">
                  <div className="section-icon-badge badge-purple">
                    <ImageIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4>4. HÌNH ẢNH ĐẠI DIỆN & ALBUM CHI TIẾT</h4>
                      <span className="badge-cloud-status">
                        <UploadCloud size={13} />
                        <span>Supabase Storage Không Giới Hạn</span>
                      </span>
                    </div>
                    <small>Tải ảnh chụp màn hình trực tiếp từ máy tính lên Cloud với tốc độ cao</small>
                  </div>
                </div>

                <div className="section-body">
                  <div className="form-grid">
                    {/* Thumbnail Image */}
                    <div className="form-group full-col">
                      <div className="pro-sub-box">
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-sm text-cyan flex items-center gap-2">
                            <Star size={16} className="text-gold" />
                            <span>ẢNH BÌA ĐẠI DIỆN CHÍNH (THUMBNAIL)</span>
                          </strong>
                          <span className="text-xs text-dim">Ảnh này xuất hiện ngoài danh sách shop</span>
                        </div>

                        <ImageFileInput 
                          label=""
                          value={formData.thumbnail} 
                          onChange={(val) => {
                            setFormData(prev => ({
                              ...prev,
                              thumbnail: val,
                              gallery: (prev.gallery && prev.gallery.length > 0) ? prev.gallery : (val ? [val] : [])
                            }));
                          }}
                          aspectRatio="card"
                          folder="accounts"
                        />
                      </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="form-group full-col">
                      <div className="pro-sub-box">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <strong className="text-sm text-white flex items-center gap-2">
                            <Layers size={16} className="text-primary" />
                            <span>ALBUM ẢNH CHI TIẾT ACC (XEM NHIỀU ẢNH)</span>
                          </strong>
                          <span className="badge-gallery-count">
                            {formData.gallery ? formData.gallery.length : 0} ảnh đã tải lên
                          </span>
                        </div>

                        {/* File Upload Button for Gallery */}
                        <div className="gallery-upload-controls flex flex-wrap gap-2 mb-3">
                          <label className="btn-gaming-primary cursor-pointer inline-flex items-center gap-2 flex-shrink-0">
                            <UploadCloud size={16} />
                            <span>📁 Chọn tệp ảnh từ máy (Chọn nhiều ảnh cùng lúc)</span>
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
                                  setFormData(prev => {
                                    const updatedGallery = [...(prev.gallery || []), ...newImages];
                                    const updatedThumb = prev.thumbnail || updatedGallery[0] || '';
                                    return {
                                      ...prev,
                                      gallery: updatedGallery,
                                      thumbnail: updatedThumb
                                    };
                                  });
                                  showToast(`Đã thêm ${newImages.length} ảnh vào album thành công!`);
                                }
                              }}
                            />
                          </label>

                          <div className="flex gap-2 flex-1 min-w-[240px]">
                            <input 
                              type="url" 
                              value={newGalleryUrl} 
                              onChange={(e) => setNewGalleryUrl(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddGalleryUrl();
                                }
                              }}
                              placeholder="Hoặc dán đường link ảnh tại đây..."
                              className="admin-input flex-1 text-xs"
                            />
                            <button 
                              type="button" 
                              className="btn-gaming-outline text-xs px-3" 
                              onClick={handleAddGalleryUrl}
                            >
                              Thêm Link
                            </button>
                          </div>
                        </div>

                        {/* Previews with 'Set as Thumbnail' and 'Delete' */}
                        {formData.gallery && formData.gallery.length > 0 ? (
                          <div className="pro-gallery-grid">
                            {formData.gallery.filter(Boolean).map((url, i) => {
                              const isMain = formData.thumbnail === url;
                              return (
                                <div key={i} className={`pro-gallery-item ${isMain ? 'is-main-thumb' : ''}`}>
                                  <img src={url} alt={`Ảnh ${i + 1}`} />
                                  <div className="item-order-tag">#{i + 1}</div>
                                  
                                  {isMain && (
                                    <div className="main-thumb-indicator">
                                      <Star size={10} />
                                      <span>Ảnh bìa</span>
                                    </div>
                                  )}

                                  <div className="gallery-item-hover-actions">
                                    {!isMain && (
                                      <button 
                                        type="button" 
                                        className="btn-set-thumb"
                                        onClick={() => handleSetAsThumbnail(url)}
                                        title="Đặt làm ảnh bìa chính"
                                      >
                                        <Star size={12} />
                                        <span>Làm bìa</span>
                                      </button>
                                    )}
                                    <button 
                                      type="button" 
                                      className="btn-del-img"
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          gallery: prev.gallery.filter((_, idx) => idx !== i)
                                        }));
                                      }}
                                      title="Xóa ảnh này khỏi album"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="empty-gallery-prompt">
                            <UploadCloud size={28} className="text-dim opacity-50 mb-2" />
                            <p className="text-xs text-dim">Chưa có ảnh nào trong album. Hãy bấm nút trên để tải ảnh lên.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: CÀI ĐẶT TRẠNG THÁI & MÔ TẢ */}
              <div className="form-card-section">
                <div className="section-header">
                  <div className="section-icon-badge">
                    <SlidersHorizontal size={16} />
                  </div>
                  <div>
                    <h4>5. TRẠNG THÁI & TÙY CHỌN HIỂN THỊ</h4>
                    <small>Đánh dấu VIP, trạng thái bán và thông tin mô tả chi tiết</small>
                  </div>
                </div>

                <div className="section-body">
                  {/* Status Toggle Cards */}
                  <div className="status-cards-grid mb-4">
                    {/* VIP Toggle Card */}
                    <label className={`status-switch-card ${formData.isVip ? 'active-vip' : ''}`}>
                      <div className="card-top-row">
                        <Crown size={20} className={formData.isVip ? 'text-gold' : 'text-dim'} />
                        <input 
                          type="checkbox" 
                          checked={formData.isVip} 
                          onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })} 
                        />
                      </div>
                      <div className="card-title">SIÊU PHẨM VIP</div>
                      <p className="card-desc">Gắn huy hiệu vương miện vàng, ưu tiên hiển thị đầu showroom</p>
                    </label>

                    {/* Sold Status Toggle Card */}
                    <label className={`status-switch-card ${formData.status === 'sold' ? 'active-sold' : 'active-available'}`}>
                      <div className="card-top-row">
                        {formData.status === 'sold' ? <XCircle size={20} className="text-red-400" /> : <CheckCircle size={20} className="text-green" />}
                        <input 
                          type="checkbox" 
                          checked={formData.status === 'sold'} 
                          onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'sold' : 'available' })} 
                        />
                      </div>
                      <div className="card-title">
                        {formData.status === 'sold' ? 'ĐÃ BÁN (HẾT HÀNG)' : 'CÒN HÀNG (ĐANG BÁN)'}
                      </div>
                      <p className="card-desc">
                        {formData.status === 'sold' ? 'Hiển thị nhãn đã bán, khách không mua được' : 'Hiển thị nút Đặt Mua / Thuê ngay'}
                      </p>
                    </label>

                    {/* Hidden Toggle Card */}
                    <label className={`status-switch-card ${formData.hidden ? 'active-hidden' : 'active-public'}`}>
                      <div className="card-top-row">
                        {formData.hidden ? <EyeOff size={20} className="text-dim" /> : <Eye size={20} className="text-cyan" />}
                        <input 
                          type="checkbox" 
                          checked={formData.hidden} 
                          onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })} 
                        />
                      </div>
                      <div className="card-title">
                        {formData.hidden ? 'ĐANG ẨN KHỎI WEB' : 'CÔNG KHAI TRÊN SHOP'}
                      </div>
                      <p className="card-desc">
                        {formData.hidden ? 'Chỉ Admin mới thấy trong bảng quản trị' : 'Tất cả khách truy cập đều nhìn thấy tài khoản này'}
                      </p>
                    </label>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="pro-label">
                      <span>Mô Tả Chi Tiết / Cam Kết Bảo Mật:</span>
                    </label>
                    <textarea 
                      rows={3}
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="admin-input"
                      placeholder="Nhập thông tin mô tả chi tiết, cam kết tài khoản, liên hệ hỗ trợ..."
                    />
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER ACTIONS */}
              <div className="modal-pro-footer">
                <div className="footer-summary-left">
                  <span className="summary-item">
                    Mã: <strong>{formData.code || '---'}</strong>
                  </span>
                  <span className="summary-dot">•</span>
                  <span className="summary-item">
                    Giá: <strong className="text-gold">{formatVND(formData.price)}</strong>
                  </span>
                  <span className="summary-dot">•</span>
                  <span className="summary-item">
                    Ảnh: <strong>{(formData.gallery ? formData.gallery.length : 0)} tệp</strong>
                  </span>
                </div>

                <div className="footer-actions-right">
                  <button type="button" className="btn-gaming-outline" onClick={handleCloseModal}>
                    Hủy Bỏ
                  </button>

                  <button type="submit" className="btn-gaming-primary btn-save-action">
                    <Save size={18} />
                    <span>{editingAccount ? 'LƯU THAY ĐỔI' : 'TẠO TÀI KHOẢN'}</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-gaming-success btn-view-tab" 
                    onClick={(e) => handleSaveAccount(e, true)}
                    title="Lưu lại và mở tab mới để xem trên shop"
                  >
                    <ExternalLink size={18} />
                    <span>LƯU & XEM TRÊN WEB</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
