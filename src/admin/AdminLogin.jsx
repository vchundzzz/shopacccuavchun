import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Flame, 
  ArrowLeft, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { storage } from '../services/storage';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess, onBackToShop }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = storage.loginAdmin(username, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    }, 400);
  };

  return (
    <div className="admin-login-screen">
      <div className="login-card-container">
        {/* Back to Shop Link */}
        <button className="back-to-shop-btn" onClick={onBackToShop}>
          <ArrowLeft size={16} />
          <span>Về trang chủ bán acc</span>
        </button>

        {/* Card Header */}
        <div className="login-card-header">
          <div className="login-logo-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <img 
              src="/images/logo-shopvanchung.png" 
              alt="SHOPVANCHUNG" 
              style={{ 
                maxHeight: '68px', 
                maxWidth: '240px', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 0 14px rgba(255, 185, 0, 0.7)) drop-shadow(0 0 28px rgba(255, 100, 0, 0.4)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.9))' 
              }}
            />
          </div>
          <h2>ĐĂNG NHẬP HỆ THỐNG QUẢN TRỊ</h2>
          <p>Khu vực quản lý dành cho Admin SHOP VĂN CHUNG</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="login-error-alert">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>Tên Đăng Nhập:</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản..."
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Mật Khẩu Quản Trị:</label>
            <div className="input-with-icon">
              <KeyRound size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
              />
              <button 
                type="button" 
                className="toggle-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="remember-checkbox">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ghi nhớ phiên đăng nhập</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-gaming-primary w-full login-submit-btn"
            disabled={isLoading}
          >
            <ShieldCheck size={18} />
            <span>{isLoading ? 'ĐANG XÁC THỰC...' : 'XÁC THỰC & VÀO QUẢN TRỊ'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
