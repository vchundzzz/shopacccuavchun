import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  Check, 
  Copy, 
  MapPin, 
  HelpCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import { SHOP_INFO } from '../data/seedData';
import './ContactSection.css';

export default function ContactSection() {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(SHOP_INFO.zalo);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="contact-view-page">
      <div className="container">
        {/* Banner Header */}
        <div className="contact-hero-banner">
          <div className="contact-hero-content">
            <span className="badge-gaming badge-fire">HỖ TRỢ GAME THỦ 24/7</span>
            <h1 className="contact-hero-title">LIÊN HỆ TRỰC TIẾP VỚI CHỦ SHOP</h1>
            <p className="contact-hero-sub">
              Cam kết giao dịch nhanh gọn trong 3 phút, bảo hành trọn đời, hỗ trợ đổi mật khẩu & cài đặt bảo mật tận tình.
            </p>
          </div>
        </div>

        {/* Contact Cards Grid */}
        <div className="contact-cards-grid">
          {/* Main Zalo Card */}
          <div className="contact-card primary-zalo-card">
            <div className="card-top-icon">
              <MessageCircle size={36} className="text-cyan" />
            </div>
            <h3>KÊNH CHÁT ZALO CHÍNH CHỦ</h3>
            <p>Kênh hỗ trợ giao dịch, tư vấn acc và bàn giao tài khoản nhanh nhất.</p>

            <div className="zalo-display-number">
              <span className="number-label">Số Zalo Duy Nhất:</span>
              <span className="number-val">{SHOP_INFO.zalo}</span>
            </div>

            <div className="contact-actions-row">
              <a 
                href={SHOP_INFO.zaloLink} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-gaming-zalo w-full justify-center"
              >
                <MessageCircle size={18} />
                <span>MỞ CHÁT ZALO NGAY</span>
                <ExternalLink size={16} />
              </a>

              <button className="btn-gaming-outline w-full justify-center" onClick={handleCopyPhone}>
                {copiedPhone ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                <span>{copiedPhone ? 'ĐÃ COPY SỐ ĐIỆN THOẠI' : 'SAO CHÉP SỐ ZALO'}</span>
              </button>
            </div>
          </div>

          {/* Hotline Call Card */}
          <div className="contact-card">
            <div className="card-top-icon">
              <PhoneCall size={36} className="text-fire" />
            </div>
            <h3>HOTLINE HỖ TRỢ TRỰC TIẾP</h3>
            <p>Gọi điện thoại trực tiếp khi cần xử lý giao dịch gấp hoặc tư vấn chọn acc VIP.</p>

            <div className="zalo-display-number">
              <span className="number-label">Đường Dây Nóng:</span>
              <span className="number-val text-fire">{SHOP_INFO.hotline}</span>
            </div>

            <a href={`tel:${SHOP_INFO.hotline}`} className="btn-gaming-primary w-full justify-center">
              <PhoneCall size={18} />
              <span>GỌI ĐIỆN NGAY</span>
            </a>
          </div>

          {/* Working Hours & Warranty */}
          <div className="contact-card">
            <div className="card-top-icon">
              <Clock size={36} className="text-gold" />
            </div>
            <h3>THỜI GIAN LÀM VIỆC</h3>
            <p>Đội ngũ admin túc trực liên tục để phục vụ anh em game thủ:</p>

            <ul className="work-hours-list">
              <li>⏰ <strong>Thứ 2 - Chủ Nhật:</strong> Hoạt động 24/7</li>
              <li>🎉 <strong>Ngày Lễ / Tết:</strong> Vẫn hỗ trợ giao dịch bình thường</li>
              <li>⚡ <strong>Thời gian bàn giao acc:</strong> 1 – 3 phút sau khi ck</li>
            </ul>

            <div className="security-mini-tag">
              <ShieldCheck size={18} className="text-green" />
              <span>Bảo hành trọn đời 100% tất cả nick bán ra</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section-box">
          <div className="section-header">
            <div className="section-title-wrap">
              <div className="section-icon-box">
                <HelpCircle size={22} />
              </div>
              <div>
                <h2 className="section-title">CÂU HỎI THƯỜNG GẶP (FAQ)</h2>
                <p className="section-subtitle">Giải đáp thắc mắc về quy trình mua bán tài khoản game tại shop</p>
              </div>
            </div>
          </div>

          <div className="faq-list">
            <div className="faq-item">
              <h4>1. Quy trình mua tài khoản tại shop diễn ra như thế nào?</h4>
              <p>
                Rất đơn giản! Bạn chỉ cần chọn acc ưng ý trên website, bấm <strong>🔥 MUA NGAY</strong> để lấy mã acc và nhấn <strong>💬 LIÊN HỆ ZALO</strong> đến số <strong>{SHOP_INFO.zalo}</strong>. Sau khi chuyển khoản, Admin sẽ gửi thông tin tài khoản + mật khẩu và hướng dẫn bạn đổi toàn bộ thông tin bảo mật.
              </p>
            </div>

            <div className="faq-item">
              <h4>2. Tài khoản có đảm bảo trắng thông tin và bảo hành không?</h4>
              <p>
                Tất cả tài khoản Free Fire và Liên Quân tại shop đều được kiểm tra kỹ lưỡng, thông tin sạch 100%. Shop cam kết <strong>Bảo hành trọn đời</strong>, hoàn tiền 100% hoặc đổi acc tương đương nếu phát sinh bất kỳ tranh chấp nào.
              </p>
            </div>

            <div className="faq-item">
              <h4>3. Shop chấp nhận những hình thức thanh toán nào?</h4>
              <p>
                Shop hỗ trợ thanh toán linh hoạt qua: Chuyển khoản mọi Ngân hàng tại Việt Nam (Vietcombank, MB Bank, Techcombank, ACB...), Ví điện tử Momo, ZaloPay.
              </p>
            </div>

            <div className="faq-item">
              <h4>4. Sau khi mua tôi có được hỗ trợ đổi mật khẩu không?</h4>
              <p>
                Có! Admin sẽ hỗ trợ từng bước cài đặt số điện thoại, email chính chủ của bạn và kích hoạt mã xác thực 2 lớp để đảm bảo an toàn tuyệt đối.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
