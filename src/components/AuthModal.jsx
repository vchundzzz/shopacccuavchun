import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, LogIn, UserPlus } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ initialMode = 'login', isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Vui lòng nhập tên tài khoản và mật khẩu!');
      return;
    }

    if (mode === 'register') {
      alert(`Đăng ký thành công tài khoản "${username}". Bạn có thể đăng nhập ngay!`);
      setMode('login');
    } else {
      alert(`Chào mừng ${username} đã đăng nhập thành công vào hệ thống!`);
      if (onLoginSuccess) onLoginSuccess({ username });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-header-title">
            {mode === 'login' ? <LogIn size={22} className="text-primary" /> : <UserPlus size={22} className="text-primary" />}
            <div>
              <h3>{mode === 'login' ? 'ĐĂNG NHẬP TÀI KHOẢN' : 'TẠO TÀI KHOẢN MỚI'}</h3>
              <p>{mode === 'login' ? 'Đăng nhập để xem lịch sử mua và số dư' : 'Đăng ký tài khoản miễn phí trong 30 giây'}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="auth-modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên tài khoản:</label>
            <div className="input-icon-wrap">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input with-icon"
                placeholder="Nhập tên đăng nhập của bạn" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <div className="input-icon-wrap">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="form-input with-icon"
                    placeholder="Nhập số điện thoại Zalo" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ email (tùy chọn):</label>
                <div className="input-icon-wrap">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input with-icon"
                    placeholder="Dùng để cấp lại mật khẩu" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Mật khẩu:</label>
            <div className="input-icon-wrap">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="form-input with-icon"
                placeholder="Nhập mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit-auth">
            {mode === 'login' ? 'ĐĂNG NHẬP NGAY' : 'ĐĂNG KÝ NGAY'}
          </button>

          <div className="auth-switch-prompt">
            {mode === 'login' ? (
              <span>Bạn chưa có tài khoản? <strong onClick={() => setMode('register')}>Đăng ký ngay</strong></span>
            ) : (
              <span>Đã có tài khoản? <strong onClick={() => setMode('login')}>Đăng nhập ngay</strong></span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
