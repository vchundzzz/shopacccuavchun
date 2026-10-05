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
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Server,
  ArrowRight,
  Info,
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';
import { cloudDatabase } from '../services/cloudDatabase';
import { storage } from '../services/storage';
import { 
  testSupabaseConnection, 
  isSupabaseConfigured, 
  getSupabaseCredentials 
} from '../services/supabaseStorage';
import './AdminCloudDB.css';

export default function AdminCloudDB({ shopConfig, onUpdateShopConfig, showToast }) {
  // Firebase Realtime DB State
  const currentSavedUrl = cloudDatabase.getCloudUrl(shopConfig);
  const [dbUrl, setDbUrl] = useState(currentSavedUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Supabase Storage State
  const savedSupabase = getSupabaseCredentials(shopConfig);
  const [supabaseUrl, setSupabaseUrl] = useState(savedSupabase.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(savedSupabase.anonKey);
  const [supabaseBucket, setSupabaseBucket] = useState(savedSupabase.bucket);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);

  useEffect(() => {
    setDbUrl(cloudDatabase.getCloudUrl(shopConfig));
    const supa = getSupabaseCredentials(shopConfig);
    setSupabaseUrl(supa.url);
    setSupabaseAnonKey(supa.anonKey);
    setSupabaseBucket(supa.bucket);
  }, [shopConfig]);

  // Firebase Handlers
  const handleTestConnection = async () => {
    if (!dbUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập đường link Firebase Database URL trước khi kiểm tra!'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await cloudDatabase.testConnection(dbUrl);
    setTesting(false);
    setTestResult(result);

    if (result.success) {
      showToast('Kiểm tra kết nối Firebase thành công!');
    }
  };

  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    const cleanUrl = cloudDatabase.setCloudUrl(dbUrl);
    const updated = {
      ...shopConfig,
      cloudDbUrl: cleanUrl
    };
    onUpdateShopConfig(updated);
    showToast('Đã lưu cấu hình Cloud Database thành công!');
  };

  const handleSyncNow = async () => {
    if (!dbUrl.trim()) {
      alert('Vui lòng nhập đường dẫn Firebase Database URL trước khi đồng bộ!');
      return;
    }

    setSyncing(true);
    const result = await storage.syncAllToCloud(dbUrl);
    setSyncing(false);

    if (result && result.success) {
      showToast('Đã đồng bộ toàn bộ tài khoản, Zalo và banner lên Firebase Cloud thành công!');
      onUpdateShopConfig({
        ...shopConfig,
        cloudDbUrl: cloudDatabase.normalizeUrl(dbUrl)
      });
    } else {
      alert(result?.message || 'Không thể đồng bộ. Hãy kiểm tra lại link hoặc quyền truy cập Firebase của bạn.');
    }
  };

  // Supabase Handlers
  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setSupabaseTestResult({
        success: false,
        message: 'Vui lòng nhập đầy đủ Supabase Project URL và Public Anon Key!'
      });
      return;
    }

    setTestingSupabase(true);
    setSupabaseTestResult(null);

    const result = await testSupabaseConnection(supabaseUrl, supabaseAnonKey, supabaseBucket);
    setTestingSupabase(false);
    setSupabaseTestResult(result);

    if (result.success) {
      showToast('✅ Kết nối Supabase Storage thành công! Bucket sẵn sàng lưu ảnh.');
    }
  };

  const handleSaveSupabaseConfig = (e) => {
    if (e) e.preventDefault();
    const updated = {
      ...shopConfig,
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
      supabaseBucket: (supabaseBucket.trim() || 'shop-images')
    };
    onUpdateShopConfig(updated);
    showToast('✅ Đã lưu cấu hình Supabase Storage! Toàn bộ ảnh mới sẽ lưu thẳng lên Cloud.');
  };

  const isConnected = !!currentSavedUrl;
  const isSupabaseActive = isSupabaseConfigured(shopConfig);

  return (
    <div className="admin-cloud-view">
      {/* Header Banner */}
      <div className="cloud-header-card">
        <div className="flex items-center gap-3">
          <div className="cloud-icon-box">
            <Database size={26} className="text-cyan" />
          </div>
          <div>
            <h2>CƠ SỞ DỮ LIỆU & LƯU TRỮ ĐÁM MÂY (CLOUD SERVICES)</h2>
            <p>Kết nối Google Firebase (Đồng bộ acc tức thì) và Supabase Storage (Lưu trữ ảnh không giới hạn dung lượng)</p>
          </div>
        </div>

        <div className="cloud-status-badge-wrap flex items-center gap-2">
          {isSupabaseActive ? (
            <div className="status-badge status-online">
              <CheckCircle2 size={16} />
              <span>SUPABASE STORAGE: ONLINE</span>
            </div>
          ) : (
            <div className="status-badge status-offline">
              <HardDrive size={16} />
              <span>DÙNG BỘ NHỚ TRÌNH DUYỆT</span>
            </div>
          )}

          {isConnected ? (
            <div className="status-badge status-online">
              <CheckCircle2 size={16} />
              <span>FIREBASE: ONLINE</span>
            </div>
          ) : (
            <div className="status-badge status-offline">
              <Info size={16} />
              <span>FIREBASE: OFFLINE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="cloud-content-grid">
        {/* Left Column: Configuration & Controls */}
        <div className="cloud-left-col">
          {/* CARD 1: SUPABASE STORAGE CONFIGURATION */}
          <div className="admin-card" style={{ border: isSupabaseActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(6, 182, 212, 0.35)' }}>
            <div className="card-title-row">
              <UploadCloud size={20} className="text-cyan" />
              <h3>1. SUPABASE STORAGE (MỞ RỘNG LƯU TRỮ ẢNH KHÔNG GIỚI HẠN)</h3>
            </div>

            <p className="card-desc">
              <strong>Giải pháp mở rộng lưu trữ triệt để:</strong> Supabase Storage cung cấp <strong>1GB lưu trữ ảnh miễn phí vĩnh viễn</strong> với CDN toàn cầu. Khi kết nối, mọi ảnh bạn thêm (ảnh bìa, album acc, banner) sẽ được lưu thẳng lên Supabase và sinh ra đường link cực nhẹ, <strong>xóa bỏ hoàn toàn giới hạn 5MB</strong> của trình duyệt!
            </p>

            <div className="form-group mb-3">
              <label>Supabase Project URL:</label>
              <input 
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzprojectid.supabase.co"
                className="admin-input font-mono text-sm"
              />
              <span className="input-hint">
                Lấy tại <code>Project Settings ➔ Configuration ➔ API ➔ Project URL</code>
              </span>
            </div>

            <div className="form-group mb-3">
              <label>Supabase Public Anon Key (anon/public):</label>
              <input 
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="admin-input font-mono text-sm"
              />
              <span className="input-hint">
                Khóa công khai <code>anon public key</code> trong mục API của Supabase
              </span>
            </div>

            <div className="form-group mb-4">
              <label>Tên Bucket lưu ảnh (Mặc định: <code>shop-images</code>):</label>
              <input 
                type="text"
                value={supabaseBucket}
                onChange={(e) => setSupabaseBucket(e.target.value)}
                placeholder="shop-images"
                className="admin-input font-mono text-sm"
              />
              <span className="input-hint">
                Bucket này phải được bật chế độ <strong>"Public Bucket: ON"</strong> trên Supabase
              </span>
            </div>

            {/* Test Supabase Feedback */}
            {supabaseTestResult && (
              <div className={`test-feedback-box ${supabaseTestResult.success ? 'feedback-success' : 'feedback-error'}`}>
                {supabaseTestResult.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <div>
                  <strong>{supabaseTestResult.success ? 'Kết Nối Supabase Thành Công!' : 'Kết Nối Thất Bại:'}</strong>
                  <p>{supabaseTestResult.message}</p>
                </div>
              </div>
            )}

            {/* Action Buttons for Supabase */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <button 
                type="button" 
                className="btn-gaming-outline"
                onClick={handleTestSupabase}
                disabled={testingSupabase}
              >
                <RefreshCw size={16} className={testingSupabase ? 'spin-anim' : ''} />
                <span>{testingSupabase ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối Supabase'}</span>
              </button>

              <button 
                type="button" 
                className="btn-gaming-primary"
                onClick={handleSaveSupabaseConfig}
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', borderColor: '#06b6d4' }}
              >
                <Save size={16} />
                <span>Lưu Cấu Hình Supabase</span>
              </button>
            </div>
          </div>

          {/* CARD 2: FIREBASE REALTIME DATABASE */}
          <div className="admin-card">
            <div className="card-title-row">
              <Zap size={18} className="text-fire" />
              <h3>2. KẾT NỐI GOOGLE FIREBASE REALTIME DATABASE (ĐỒNG BỘ DỮ LIỆU)</h3>
            </div>

            <p className="card-desc">
              Dán đường dẫn Firebase Realtime Database của bạn vào đây. Khi kết nối, bất kỳ thay đổi nào của bạn ở trang Quản trị này sẽ được gửi lên máy chủ Google và hiển thị ngay cho toàn bộ khách hàng trên tên miền của bạn.
            </p>

            <div className="form-group mb-4">
              <label>Đường dẫn Firebase Database URL:</label>
              <input 
                type="text"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                placeholder="https://ten-du-an-default-rtdb.firebaseio.com/"
                className="admin-input font-mono text-sm"
              />
              <span className="input-hint">
                Ví dụ: <code>https://shopvanchung-default-rtdb.firebaseio.com/</code> hoặc <code>https://shopvanchung-default-rtdb.asia-southeast1.firebasedatabase.app/</code>
              </span>
            </div>

            {/* Test Connection Feedback */}
            {testResult && (
              <div className={`test-feedback-box ${testResult.success ? 'feedback-success' : 'feedback-error'}`}>
                {testResult.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <div>
                  <strong>{testResult.success ? 'Kết Nối Thành Công!' : 'Kết Nối Thất Bại:'}</strong>
                  <p>{testResult.message}</p>
                </div>
              </div>
            )}

            {/* Action Buttons for Firebase */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <button 
                type="button" 
                className="btn-gaming-outline"
                onClick={handleTestConnection}
                disabled={testing}
              >
                <RefreshCw size={16} className={testing ? 'spin-anim' : ''} />
                <span>{testing ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối'}</span>
              </button>

              <button 
                type="button" 
                className="btn-gaming-primary"
                onClick={handleSaveConfig}
              >
                <Save size={16} />
                <span>Lưu Cấu Hình</span>
              </button>

              <button 
                type="button" 
                className="btn-gaming-success"
                onClick={handleSyncNow}
                disabled={syncing}
                title="Đẩy toàn bộ acc, Zalo và ảnh hiện tại lên Firebase Database"
              >
                <UploadCloud size={16} className={syncing ? 'spin-anim' : ''} />
                <span>{syncing ? 'Đang Đồng Bộ...' : 'Đồng Bộ Dữ Liệu Lên Cloud'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Tutorials */}
        <div className="cloud-right-col">
          {/* SUPABASE TUTORIAL CARD */}
          <div className="admin-card tutorial-card" style={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}>
            <div className="card-title-row">
              <UploadCloud size={18} className="text-cyan" />
              <h3>HƯỚNG DẪN 3 BƯỚC TẠO SUPABASE STORAGE</h3>
            </div>

            <div className="tutorial-steps">
              {/* Step 1 */}
              <div className="tutorial-step-box">
                <span className="step-tag" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>BƯỚC 1</span>
                <h4>Đăng ký Supabase Miễn Phí</h4>
                <p>
                  Truy cập trang Supabase bằng tài khoản GitHub hoặc Google:
                </p>
                <a 
                  href="https://supabase.com/dashboard" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="firebase-link-btn"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}
                >
                  <span>Mở Supabase Dashboard</span>
                  <ExternalLink size={14} />
                </a>
                <p className="mt-2 text-slate-400 text-xs">
                  Bấm nút <strong>"New Project"</strong> ➔ Chọn vị trí <code>Singapore</code> (gần Việt Nam nhất, tốc độ nhanh nhất) ➔ Đặt mật khẩu rồi bấm Create.
                </p>
              </div>

              {/* Step 2 */}
              <div className="tutorial-step-box">
                <span className="step-tag" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>BƯỚC 2</span>
                <h4>Tạo Bucket tên "shop-images"</h4>
                <p className="text-slate-400 text-xs mt-1">
                  • Ở menu bên trái, bấm vào biểu tượng <strong>Storage</strong> (hình chiếc xô/hộp).<br />
                  • Bấm <strong>"New bucket"</strong>.<br />
                  • Đặt tên Bucket là: <code>shop-images</code>.<br />
                  • <strong>RẤT QUAN TRỌNG:</strong> Bật công tắc <strong>"Public bucket"</strong> sang màu xanh (ON) để khách hàng xem được ảnh.<br />
                  • Bấm <strong>Save bucket</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="tutorial-step-box">
                <span className="step-tag" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>BƯỚC 3</span>
                <h4>Copy URL và Anon Key dán vào đây</h4>
                <p className="text-slate-400 text-xs mt-1">
                  • Vào <strong>Project Settings</strong> (biểu tượng bánh răng dưới cùng menu trái).<br />
                  • Chọn mục <strong>API</strong> (hoặc Data API).<br />
                  • Copy <strong>Project URL</strong> dán vào ô URL bên trái.<br />
                  • Copy <strong>Project API keys (anon / public)</strong> dán vào ô Anon Key bên trái.<br />
                  • Bấm <strong>"Lưu Cấu Hình Supabase"</strong> là hoàn tất!
                </p>
              </div>
            </div>
          </div>

          {/* FIREBASE TUTORIAL CARD */}
          <div className="admin-card tutorial-card">
            <div className="card-title-row">
              <HelpCircle size={18} className="text-green" />
              <h3>HƯỚNG DẪN TẠO FIREBASE DATABASE</h3>
            </div>

            <div className="tutorial-steps">
              <div className="tutorial-step-box">
                <span className="step-tag">BƯỚC 1</span>
                <h4>Mở Google Firebase Console</h4>
                <p>
                  Truy cập vào trang Firebase của Google bằng tài khoản Gmail của bạn:
                </p>
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="firebase-link-btn"
                >
                  <span>Mở Firebase Console</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="tutorial-step-box">
                <span className="step-tag">BƯỚC 2</span>
                <h4>Tạo Realtime Database</h4>
                <p className="text-slate-400 text-xs mt-1">
                  • Ở menu bên trái, tìm mục <strong>Build</strong> ➔ chọn <strong>Realtime Database</strong>.<br />
                  • Vị trí chọn <code>Singapore</code>.<br />
                  • Chọn quyền: <strong>Start in test mode (Chế độ thử nghiệm)</strong>.
                </p>
              </div>

              <div className="tutorial-step-box">
                <span className="step-tag">BƯỚC 3</span>
                <h4>Dán link vào ô bên trái</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Copy đường link màu xanh trên đầu bảng Database dán vào ô <strong>Firebase Database URL</strong> rồi nhấn <strong>Lưu & Đồng Bộ</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
