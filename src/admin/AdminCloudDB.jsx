import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  UploadCloud, 
  ExternalLink, 
  Save, 
  Server, 
  HelpCircle,
  Zap, 
  Info,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { cloudDatabase } from '../services/cloudDatabase';
import { supabaseClient } from '../services/supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { storage } from '../services/storage';
import './AdminCloudDB.css';

export default function AdminCloudDB({ shopConfig, onUpdateShopConfig, showToast }) {
  const [activeDbTab, setActiveDbTab] = useState('supabase'); // 'supabase' | 'firebase'

  // Firebase State
  const currentSavedFirebaseUrl = cloudDatabase.getCloudUrl(shopConfig);
  const [firebaseUrl, setFirebaseUrl] = useState(currentSavedFirebaseUrl);
  const [testingFirebase, setTestingFirebase] = useState(false);
  const [firebaseTestResult, setFirebaseTestResult] = useState(null);
  const [syncingFirebase, setSyncingFirebase] = useState(false);

  // Supabase State
  const creds = supabaseClient.getCredentials(shopConfig);
  const [supabaseUrl, setSupabaseUrl] = useState(creds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(creds.anonKey);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  useEffect(() => {
    setFirebaseUrl(cloudDatabase.getCloudUrl(shopConfig));
    const c = supabaseClient.getCredentials(shopConfig);
    setSupabaseUrl(c.url);
    setSupabaseAnonKey(c.anonKey);
  }, [shopConfig]);

  // --- SUPABASE HANDLERS ---
  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setSupabaseTestResult({
        success: false,
        message: 'Vui lòng nhập đầy đủ Supabase Project URL và Anon Key!'
      });
      return;
    }
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    const result = await supabaseService.testConnection(supabaseUrl, supabaseAnonKey);
    setTestingSupabase(false);
    setSupabaseTestResult(result);
    if (result.success) {
      showToast('Kiểm tra kết nối Supabase thành công!');
    }
  };

  const handleSaveSupabaseConfig = (e) => {
    if (e) e.preventDefault();
    supabaseClient.setCredentials(supabaseUrl, supabaseAnonKey);
    const updated = {
      ...shopConfig,
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    };
    onUpdateShopConfig(updated);
    showToast('Đã lưu cấu hình Supabase Cloud SQL thành công!');
  };

  const handleSyncSupabaseNow = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      alert('Vui lòng nhập đầy đủ Supabase Project URL và Anon Key trước khi đồng bộ!');
      return;
    }

    setSyncingSupabase(true);
    supabaseClient.setCredentials(supabaseUrl, supabaseAnonKey);
    const payload = {
      shopConfig: storage.getShopConfig(),
      accounts: storage.getAccounts(),
      banners: storage.getBanners(),
      categories: storage.getCategories()
    };

    const result = await supabaseService.saveAllData(payload, {
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });
    setSyncingSupabase(false);

    if (result && result.success) {
      showToast('✅ Đã đồng bộ toàn bộ tài khoản lên Supabase SQL thành công!');
      onUpdateShopConfig({
        ...shopConfig,
        supabaseUrl: supabaseUrl.trim(),
        supabaseAnonKey: supabaseAnonKey.trim()
      });
    } else {
      alert(result?.message || 'Không thể đồng bộ lên Supabase. Vui lòng kiểm tra lại thông tin.');
    }
  };

  // --- FIREBASE HANDLERS ---
  const handleTestFirebase = async () => {
    if (!firebaseUrl.trim()) {
      setFirebaseTestResult({
        success: false,
        message: 'Vui lòng nhập đường link Firebase Database URL trước khi kiểm tra!'
      });
      return;
    }
    setTestingFirebase(true);
    setFirebaseTestResult(null);
    const result = await cloudDatabase.testConnection(firebaseUrl);
    setTestingFirebase(false);
    setFirebaseTestResult(result);
    if (result.success) {
      showToast('Kiểm tra kết nối Firebase thành công!');
    }
  };

  const handleSaveFirebaseConfig = (e) => {
    if (e) e.preventDefault();
    const cleanUrl = cloudDatabase.setCloudUrl(firebaseUrl);
    const updated = {
      ...shopConfig,
      cloudDbUrl: cleanUrl
    };
    onUpdateShopConfig(updated);
    showToast('Đã lưu cấu hình Firebase Database thành công!');
  };

  const handleSyncFirebaseNow = async () => {
    if (!firebaseUrl.trim()) {
      alert('Vui lòng nhập đường dẫn Firebase Database URL trước khi đồng bộ!');
      return;
    }
    setSyncingFirebase(true);
    const result = await storage.syncAllToCloud(firebaseUrl);
    setSyncingFirebase(false);

    if (result && result.success) {
      showToast('Đã đồng bộ toàn bộ dữ liệu lên Firebase thành công!');
      onUpdateShopConfig({
        ...shopConfig,
        cloudDbUrl: cloudDatabase.normalizeUrl(firebaseUrl)
      });
    } else {
      alert(result?.message || 'Không thể đồng bộ Firebase.');
    }
  };

  const isSupabaseActive = supabaseClient.isConfigured(shopConfig);

  return (
    <div className="admin-cloud-view">
      {/* Header Banner */}
      <div className="cloud-header-card">
        <div className="flex items-center gap-3">
          <div className="cloud-icon-box">
            <Database size={26} className="text-cyan" />
          </div>
          <div>
            <h2>CƠ SỞ DỮ LIỆU ĐÁM MÂY (CLOUD DATABASE)</h2>
            <p>Hỗ trợ Supabase (Cloud SQL - PostgreSQL) & Google Firebase để website vanchung.click tự động online 24/7 và đồng bộ tài khoản cho mọi khách hàng</p>
          </div>
        </div>

        <div className="cloud-status-badge-wrap">
          {isSupabaseActive ? (
            <div className="status-badge status-online">
              <CheckCircle2 size={16} />
              <span>SUPABASE SQL ĐANG HOẠT ĐỘNG</span>
            </div>
          ) : (
            <div className="status-badge status-online" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: '#f59e0b' }}>
              <CheckCircle2 size={16} />
              <span>FIREBASE CLOUD ĐANG HOẠT ĐỘNG</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Selector: Supabase vs Firebase */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          type="button"
          onClick={() => setActiveDbTab('supabase')}
          className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            activeDbTab === 'supabase'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 border border-emerald-500'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
          }`}
        >
          <Database size={18} />
          <span>Supabase (Cloud SQL - PostgreSQL)</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Khuyên Dùng</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveDbTab('firebase')}
          className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            activeDbTab === 'firebase'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30 border border-amber-500'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
          }`}
        >
          <Zap size={18} />
          <span>Google Firebase Realtime Database</span>
        </button>
      </div>

      {/* TAB 1: SUPABASE */}
      {activeDbTab === 'supabase' && (
        <div className="cloud-content-grid">
          {/* Left Column: Form */}
          <div className="cloud-left-col">
            <div className="admin-card">
              <div className="card-title-row">
                <Database size={20} className="text-emerald-400" />
                <h3>1. CẤU HÌNH SUPABASE (POSTGRESQL CLOUD SQL)</h3>
              </div>

              <p className="card-desc">
                Supabase là hệ quản trị cơ sở dữ liệu SQL trên đám mây (PostgreSQL), hoàn toàn <strong>miễn phí 24/7</strong>. Bạn có bảng quản lý trực quan như Excel trên web. Khi nhập thông tin vào đây, website <code>vanchung.click</code> sẽ kết nối thẳng vào Supabase.
              </p>

              <div className="form-group mb-4">
                <label className="text-emerald-400 font-semibold">Supabase Project URL:</label>
                <input 
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzabcdefghijklmno.supabase.co"
                  className="admin-input font-mono text-sm"
                />
                <span className="input-hint">
                  Lấy tại mục: <strong>Project Settings ➔ API ➔ Project URL</strong>
                </span>
              </div>

              <div className="form-group mb-4">
                <label className="text-emerald-400 font-semibold">Supabase Anon Key (Public Key):</label>
                <input 
                  type="text"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="admin-input font-mono text-sm"
                />
                <span className="input-hint">
                  Lấy tại mục: <strong>Project Settings ➔ API ➔ Project API keys ➔ anon (public)</strong>
                </span>
              </div>

              {/* Feedback */}
              {supabaseTestResult && (
                <div className={`test-feedback-box ${supabaseTestResult.success ? 'feedback-success' : 'feedback-error'}`}>
                  {supabaseTestResult.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  <div>
                    <strong>{supabaseTestResult.success ? 'Kết Nối Thành Công!' : 'Kết Nối Thất Bại:'}</strong>
                    <p>{supabaseTestResult.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <button 
                  type="button" 
                  className="btn-gaming-outline"
                  onClick={handleTestSupabase}
                  disabled={testingSupabase}
                >
                  <RefreshCw size={16} className={testingSupabase ? 'spin-anim' : ''} />
                  <span>{testingSupabase ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn-gaming-primary"
                  onClick={handleSaveSupabaseConfig}
                >
                  <Save size={16} />
                  <span>Lưu Cấu Hình Supabase</span>
                </button>

                <button 
                  type="button" 
                  className="btn-gaming-success"
                  onClick={handleSyncSupabaseNow}
                  disabled={syncingSupabase}
                  title="Đẩy toàn bộ acc, Zalo và ảnh hiện tại lên bảng Supabase SQL"
                >
                  <UploadCloud size={16} className={syncingSupabase ? 'spin-anim' : ''} />
                  <span>{syncingSupabase ? 'Đang Đồng Bộ...' : 'Đồng Bộ Toàn Bộ Dữ Liệu Lên Supabase'}</span>
                </button>
              </div>
            </div>

            {/* Advantages Box */}
            <div className="admin-card">
              <div className="card-title-row">
                <Server size={18} className="text-cyan" />
                <h3>2. LỢI ÍCH KHI DÙNG SUPABASE SQL</h3>
              </div>
              <div className="steps-explain-list">
                <div className="explain-item">
                  <div className="step-num-badge">1</div>
                  <div>
                    <strong>SQL Chuẩn 100% Chạy Đám Mây:</strong>
                    <p>Dữ liệu được lưu trữ trong các bảng SQL (PostgreSQL), có quan hệ rõ ràng, tốc độ truy xuất cực nhanh.</p>
                  </div>
                </div>
                <div className="explain-item">
                  <div className="step-num-badge">2</div>
                  <div>
                    <strong>Quản Lý Dễ Dàng Như Excel:</strong>
                    <p>Trên trang web Supabase có giao diện Table Editor trực quan. Bạn có thể vào trực tiếp web Supabase bấm sửa từng dòng, lọc acc, xuất file Excel tiện lợi.</p>
                  </div>
                </div>
                <div className="explain-item">
                  <div className="step-num-badge">3</div>
                  <div>
                    <strong>Online 24/7 Miễn Phí Vĩnh Viễn:</strong>
                    <p>Không cần bật máy tính hay thuê VPS. Supabase lưu trữ đám mây đảm bảo website <code>vanchung.click</code> luôn hoạt động mượt mà.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Supabase Tutorial */}
          <div className="cloud-right-col">
            <div className="admin-card tutorial-card">
              <div className="card-title-row">
                <HelpCircle size={18} className="text-emerald-400" />
                <h3>3 BƯỚC THIẾT LẬP SUPABASE TRONG 2 PHÚT</h3>
              </div>

              <div className="tutorial-steps">
                {/* Step 1 */}
                <div className="tutorial-step-box">
                  <span className="step-tag" style={{ background: '#059669' }}>BƯỚC 1</span>
                  <h4>Đăng ký Supabase Miễn Phí</h4>
                  <p>Truy cập vào trang Supabase và đăng nhập bằng tài khoản GitHub hoặc Google:</p>
                  <a 
                    href="https://supabase.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="firebase-link-btn"
                    style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
                  >
                    <span>Mở Trang Supabase.com</span>
                    <ExternalLink size={14} />
                  </a>
                  <p className="mt-2 text-slate-400 text-xs">
                    Nhấn <strong>"New Project"</strong> ➔ Đặt tên ví dụ <code>shopacc-vanchung</code>, đặt mật khẩu database và chọn khu vực <code>Southeast Asia (Singapore)</code> ➔ Nhấn <strong>Create new project</strong>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="tutorial-step-box">
                  <span className="step-tag" style={{ background: '#059669' }}>BƯỚC 2</span>
                  <h4>Tạo bảng bằng file SQL có sẵn</h4>
                  <p>
                    Vào menu bên trái chọn <strong>SQL Editor</strong> ➔ chọn <strong>New Query</strong>.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Mở file <code>supabase_schema.sql</code> (đã tạo sẵn trong thư mục dự án của bạn), copy toàn bộ nội dung dán vào và nhấn nút <strong>Run</strong> (xanh lá cây) là toàn bộ bảng và dữ liệu mẫu được tạo ngay lập tức!
                  </p>
                </div>

                {/* Step 3 */}
                <div className="tutorial-step-box">
                  <span className="step-tag" style={{ background: '#059669' }}>BƯỚC 3</span>
                  <h4>Lấy URL & Key dán vào ô bên trái</h4>
                  <p>
                    Vào biểu tượng bánh răng <strong>Project Settings</strong> (ở góc dưới cùng bên trái) ➔ Chọn mục <strong>API</strong>.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    • Copy <strong>Project URL</strong> dán vào ô URL bên cạnh.<br />
                    • Copy <strong>anon public key</strong> dán vào ô Anon Key bên cạnh.<br />
                    • Nhấn <strong>Lưu Cấu Hình</strong> & <strong>Đồng Bộ</strong> là hoàn tất 100%!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIREBASE */}
      {activeDbTab === 'firebase' && (
        <div className="cloud-content-grid">
          {/* Left Column: Form */}
          <div className="cloud-left-col">
            <div className="admin-card">
              <div className="card-title-row">
                <Zap size={18} className="text-fire" />
                <h3>KẾT NỐI GOOGLE FIREBASE REALTIME DATABASE</h3>
              </div>

              <p className="card-desc">
                Google Firebase Realtime Database hiện đang hoạt động tự động cho shop của bạn. Khi kết nối, bất kỳ thay đổi nào của bạn ở trang Quản trị này sẽ được gửi lên máy chủ Google và hiển thị ngay cho toàn bộ khách hàng trên tên miền của bạn.
              </p>

              <div className="form-group mb-4">
                <label>Đường dẫn Firebase Database URL:</label>
                <input 
                  type="text"
                  value={firebaseUrl}
                  onChange={(e) => setFirebaseUrl(e.target.value)}
                  placeholder="https://ten-du-an-default-rtdb.asia-southeast1.firebasedatabase.app/"
                  className="admin-input font-mono text-sm"
                />
              </div>

              {/* Feedback */}
              {firebaseTestResult && (
                <div className={`test-feedback-box ${firebaseTestResult.success ? 'feedback-success' : 'feedback-error'}`}>
                  {firebaseTestResult.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  <div>
                    <strong>{firebaseTestResult.success ? 'Kết Nối Thành Công!' : 'Kết Nối Thất Bại:'}</strong>
                    <p>{firebaseTestResult.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <button 
                  type="button" 
                  className="btn-gaming-outline"
                  onClick={handleTestFirebase}
                  disabled={testingFirebase}
                >
                  <RefreshCw size={16} className={testingFirebase ? 'spin-anim' : ''} />
                  <span>{testingFirebase ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối'}</span>
                </button>

                <button 
                  type="button" 
                  className="btn-gaming-primary"
                  onClick={handleSaveFirebaseConfig}
                >
                  <Save size={16} />
                  <span>Lưu Cấu Hình Firebase</span>
                </button>

                <button 
                  type="button" 
                  className="btn-gaming-success"
                  onClick={handleSyncFirebaseNow}
                  disabled={syncingFirebase}
                  title="Đẩy toàn bộ acc, Zalo và ảnh hiện tại lên Firebase Database"
                >
                  <UploadCloud size={16} className={syncingFirebase ? 'spin-anim' : ''} />
                  <span>{syncingFirebase ? 'Đang Đồng Bộ...' : 'Đồng Bộ Lên Firebase'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Firebase Tutorial */}
          <div className="cloud-right-col">
            <div className="admin-card tutorial-card">
              <div className="card-title-row">
                <HelpCircle size={18} className="text-green" />
                <h3>THÔNG TIN FIREBASE ĐANG KẾT NỐI</h3>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Firebase Realtime Database hiện đã được liên kết sẵn vào hệ thống của bạn tại máy chủ Đông Nam Á (Singapore).
              </p>
              <div className="p-3 bg-slate-900 rounded border border-slate-700 font-mono text-xs text-amber-400 break-all mb-4">
                {currentSavedFirebaseUrl || 'https://shopaccvchun-default-rtdb.asia-southeast1.firebasedatabase.app'}
              </div>
              <p className="text-xs text-slate-400">
                Nếu bạn muốn chuyển sang dùng Supabase SQL để quản lý dạng bảng trực quan, hãy chọn tab <strong>Supabase (Cloud SQL)</strong> ở phía trên.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
