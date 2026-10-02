import React, { useState } from 'react';
import { X, CreditCard, Wallet, Copy, Check, AlertCircle } from 'lucide-react';
import './DepositModal.css';

export default function DepositModal({ shopConfig = {}, isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('atm'); // 'atm' | 'card'
  const [copiedField, setCopiedField] = useState(null);

  // Card form state
  const [cardType, setCardType] = useState('VIETTEL');
  const [cardAmount, setCardAmount] = useState('50000');
  const [cardSerial, setCardSerial] = useState('');
  const [cardCode, setCardCode] = useState('');
  const [cardSubmitted, setCardSubmitted] = useState(false);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardSerial || !cardCode) {
      alert('Vui lòng nhập đầy đủ Số Serial và Mã thẻ!');
      return;
    }
    setCardSubmitted(true);
    setTimeout(() => {
      alert('Hệ thống đã nhận thẻ cào của bạn và đang duyệt tự động. Tiền sẽ được cộng trong 1-3 phút!');
      setCardSerial('');
      setCardCode('');
      setCardSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="deposit-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="deposit-modal-header">
          <div className="deposit-title-wrap">
            <Wallet className="text-primary" size={24} />
            <div>
              <h3>NẠP TIỀN VÀO HỆ THỐNG</h3>
              <p>Tự động 24/7 - Xử lý trong vài giây</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="deposit-tabs-header">
          <button 
            className={`deposit-tab-btn ${activeTab === 'atm' ? 'active' : ''}`}
            onClick={() => setActiveTab('atm')}
          >
            <CreditCard size={18} />
            <span>Chuyển Khoản ATM / MoMo</span>
          </button>
          <button 
            className={`deposit-tab-btn ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            <Wallet size={18} />
            <span>Nạp Qua Thẻ Cào</span>
          </button>
        </div>

        <div className="deposit-modal-body">
          {activeTab === 'atm' ? (
            <div className="deposit-atm-panel">
              <div className="atm-alert-box">
                <AlertCircle size={18} className="text-primary" />
                <span>Quét mã QR hoặc chuyển đúng số tài khoản bên dưới để tiền tự động cộng!</span>
              </div>

              <div className="banking-card-preview">
                <div className="banking-row">
                  <span className="b-label">Ngân Hàng:</span>
                  <span className="b-value font-bold text-primary">MB BANK (Quân Đội)</span>
                </div>

                <div className="banking-row">
                  <span className="b-label">Số Tài Khoản:</span>
                  <div className="copy-val-wrap">
                    <span className="b-value highlight font-mono">{shopConfig.hotline || shopConfig.zaloFF || '0868994712'}</span>
                    <button className="btn-copy-sm" onClick={() => handleCopy(shopConfig.hotline || shopConfig.zaloFF || '0868994712', 'stk')}>
                      {copiedField === 'stk' ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                      <span>{copiedField === 'stk' ? 'Đã sao chép' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="banking-row">
                  <span className="b-label">Chủ Tài Khoản:</span>
                  <span className="b-value font-bold">{shopConfig.shopName || 'SHOPVANCHUNG'}</span>
                </div>

                <div className="banking-row">
                  <span className="b-label">Nội Dung CK:</span>
                  <div className="copy-val-wrap">
                    <span className="b-value highlight font-mono">NAPTIEN {(shopConfig.shopName || 'SHOPVANCHUNG').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}</span>
                    <button className="btn-copy-sm" onClick={() => handleCopy(`NAPTIEN ${(shopConfig.shopName || 'SHOPVANCHUNG').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`, 'nd')}>
                      {copiedField === 'nd' ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                      <span>{copiedField === 'nd' ? 'Đã sao chép' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="deposit-help-note">
                Nếu quá 5 phút chưa được cộng tiền, vui lòng liên hệ Zalo: <strong>{shopConfig.zaloFF || '0868994712'}</strong> để được hỗ trợ kiểm tra ngay lập tức.
              </div>
            </div>
          ) : (
            <form className="deposit-card-panel" onSubmit={handleCardSubmit}>
              <div className="form-group">
                <label>Loại thẻ cào:</label>
                <select 
                  className="form-input"
                  value={cardType} 
                  onChange={(e) => setCardType(e.target.value)}
                >
                  <option value="VIETTEL">Viettel (Khuyên dùng)</option>
                  <option value="VINAPHONE">Vinaphone</option>
                  <option value="MOBIFONE">Mobifone</option>
                  <option value="ZING">Thẻ Zing</option>
                  <option value="GARENA">Thẻ Garena</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mệnh giá:</label>
                <select 
                  className="form-input"
                  value={cardAmount} 
                  onChange={(e) => setCardAmount(e.target.value)}
                >
                  <option value="10000">10,000 đ</option>
                  <option value="20000">20,000 đ</option>
                  <option value="50000">50,000 đ</option>
                  <option value="100000">100,000 đ</option>
                  <option value="200000">200,000 đ</option>
                  <option value="500000">500,000 đ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Số Serial:</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Nhập dãy số serial in trên thẻ" 
                  value={cardSerial}
                  onChange={(e) => setCardSerial(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mã thẻ (dưới lớp cào):</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Nhập mã thẻ cào" 
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-submit-deposit"
                disabled={cardSubmitted}
              >
                {cardSubmitted ? 'Đang gửi thẻ...' : 'NẠP THẺ CÀO NGAY'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
