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
  Info
} from 'lucide-react';
import { cloudDatabase } from '../services/cloudDatabase';
import { storage } from '../services/storage';
import './AdminCloudDB.css';

export default function AdminCloudDB({ shopConfig, onUpdateShopConfig, showToast }) {
  const currentSavedUrl = cloudDatabase.getCloudUrl(shopConfig);
  const [dbUrl, setDbUrl] = useState(currentSavedUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setDbUrl(cloudDatabase.getCloudUrl(shopConfig));
  }, [shopConfig]);

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
      // Update parent config
      onUpdateShopConfig({
        ...shopConfig,
        cloudDbUrl: cloudDatabase.normalizeUrl(dbUrl)
      });
    } else {
      alert(result?.message || 'Không thể đồng bộ. Hãy kiểm tra lại link hoặc quyền truy cập Firebase của bạn.');
    }
  };

  const isConnected = !!currentSavedUrl;

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
            <p>Kết nối Google Firebase Realtime Database để tự động đồng bộ acc, Zalo và giá tiền cho mọi khách hàng khi bạn chạy trên tên miền riêng</p>
          </div>
        </div>

        <div className="cloud-status-badge-wrap">
          {isConnected ? (
            <div className="status-badge status-online">
              <CheckCircle2 size={16} />
              <span>ĐÃ KẾT NỐI CLOUD</span>
            </div>
          ) : (
            <div className="status-badge status-offline">
              <Info size={16} />
              <span>CHƯA KẾT NỐI CLOUD</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="cloud-content-grid">
        {/* Left Column: Configuration & Controls */}
        <div className="cloud-left-col">
          {/* Card 1: Connection Form */}
          <div className="admin-card">
            <div className="card-title-row">
              <Zap size={18} className="text-fire" />
              <h3>1. KẾT NỐI GOOGLE FIREBASE REALTIME DATABASE</h3>
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

            {/* Action Buttons */}
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
                <span>{syncing ? 'Đang Đồng Bộ...' : 'Đồng Bộ Toàn Bộ Dữ Liệu Lên Đám Mây'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Highlights / How it Works */}
          <div className="admin-card">
            <div className="card-title-row">
              <Server size={18} className="text-cyan" />
              <h3>2. NGUYÊN LÝ HOẠT ĐỘNG KHI CHẠY TRÊN TÊN MIỀN</h3>
            </div>

            <div className="steps-explain-list">
              <div className="explain-item">
                <div className="step-num-badge">1</div>
                <div>
                  <strong>Lưu trữ trên máy chủ Google (Miễn phí 100% vĩnh viễn):</strong>
                  <p>Mỗi khi bạn thêm acc mới, sửa giá, bấm "Đã bán" hay đổi số Zalo, dữ liệu được chuyển lên Firebase ngay lập tức.</p>
                </div>
              </div>

              <div className="explain-item">
                <div className="step-num-badge">2</div>
                <div>
                  <strong>Khách hàng thấy ngay trong 0.1 giây:</strong>
                  <p>Khách hàng truy cập vào tên miền của bạn (ví dụ <code>vanchung.click</code>) từ điện thoại hay máy tính sẽ tự động tải các acc mới nhất về xem.</p>
                </div>
              </div>

              <div className="explain-item">
                <div className="step-num-badge">3</div>
                <div>
                  <strong>Quản trị bất kỳ đâu:</strong>
                  <p>Bạn không cần mở máy tính hay mở code. Chỉ cần cầm điện thoại gõ <code>tenmien.com/#admin</code>, đăng nhập và quản lý shop tiện lợi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Tutorial */}
        <div className="cloud-right-col">
          <div className="admin-card tutorial-card">
            <div className="card-title-row">
              <HelpCircle size={18} className="text-green" />
              <h3>HƯỚNG DẪN 3 BƯỚC TẠO FIREBASE TRONG 2 PHÚT</h3>
            </div>

            <div className="tutorial-steps">
              {/* Step 1 */}
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
                <p className="mt-2 text-slate-400 text-xs">
                  Bấm nút <strong>"Thêm dự án" (Add project)</strong> ➔ Đặt tên ví dụ <code>shopacc-vanchung</code> rồi bấm Tiếp tục.
                </p>
              </div>

              {/* Step 2 */}
              <div className="tutorial-step-box">
                <span className="step-tag">BƯỚC 2</span>
                <h4>Tạo Realtime Database</h4>
                <p>
                  Ở menu bên trái, tìm mục <strong>Build (Xây dựng)</strong> ➔ chọn <strong>Realtime Database</strong>.
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  • Nhấn nút <strong>"Tạo cơ sở dữ liệu" (Create Database)</strong>.<br />
                  • Vị trí chọn <code>Singapore</code> (hoặc United States).<br />
                  • Ở bước chọn quyền, tích chọn: <strong>Bắt đầu ở chế độ thử nghiệm (Start in test mode)</strong> để cho phép lưu dữ liệu.
                </p>
              </div>

              {/* Step 3 */}
              <div className="tutorial-step-box">
                <span className="step-tag">BƯỚC 3</span>
                <h4>Copy link dán vào bảng bên cạnh</h4>
                <p>
                  Ngay trên đầu bảng Database, bạn sẽ thấy đường link màu xanh có đuôi <code>.firebaseio.com/</code> hoặc <code>.firebasedatabase.app/</code>.
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Copy đường link đó, dán vào ô <strong>Đường dẫn Firebase Database URL</strong> ở bảng bên cạnh, rồi nhấn <strong>Lưu Cấu Hình</strong> & <strong>Đồng Bộ</strong> là xong 100%!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
