import React, { useState } from 'react';
import { Phone, ShieldCheck, Mail, Lock } from 'lucide-react';
import './Footer.css';

export default function Footer({ shopConfig = {}, onSecretAdminTrigger }) {
  const [clickCount, setClickCount] = useState(0);

  // Secret trigger: clicking copyright 3 times opens Admin login
  const handleSecretClick = () => {
    const next = clickCount + 1;
    if (next >= 3) {
      setClickCount(0);
      if (onSecretAdminTrigger) {
        onSecretAdminTrigger();
      }
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 1500);
    }
  };

  return (
    <footer id="footer" className="shop-footer">
      <div className="footer-top-section">
        <div className="footer-container">
          {/* Logo Column */}
          <div className="footer-col-logo">
            <a href="#top" className="footer-logo-link" title={shopConfig.shopName || 'SHOPVANCHUNG'}>
              <img 
                src={shopConfig.whiteLogo || shopConfig.blackLogo || "/images/logo-shopvanchung.png"} 
                alt={shopConfig.shopName || 'SHOPVANCHUNG'} 
                className="footer-logo-img"
              />
            </a>
            <p className="footer-brand-motto">
              {shopConfig.shopName || 'SHOP VĂN CHUNG'} - Hệ thống bán và cho thuê tài khoản game Free Fire, Liên Quân Mobile uy tín số 1 Việt Nam.
            </p>
          </div>

          {/* Contact Support Column */}
          <div className="footer-col-contact">
            <h4 className="footer-heading">LIÊN HỆ HỖ TRỢ</h4>
            
            <div className="footer-contact-buttons">
              <a 
                href={shopConfig.facebookLink || "https://www.facebook.com/tyseiseiff/"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-footer-link"
              >
                <i className="fa-brands fa-square-facebook"></i>
                <span>Facebook</span>
              </a>

              <a 
                href={`tel:${shopConfig.hotline || '0868994712'}`} 
                className="btn-footer-link"
              >
                <i className="fa-solid fa-phone"></i>
                <span>{shopConfig.hotline || '0868994712'}</span>
              </a>

              <a 
                href={`https://zalo.me/${shopConfig.zaloFF || '0868994712'}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-footer-link"
              >
                <i className="fa-solid fa-comments"></i>
                <span>Zalo 24/7</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Footer Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
            <div 
              className="copyright-text"
              onClick={handleSecretClick}
              title={`© Bản quyền thuộc về ${shopConfig.shopName || 'SHOPVANCHUNG'}`}
              style={{ cursor: 'default' }}
            >
              Phát triển bởi <strong className="text-primary">{shopConfig.shopName || 'SHOPVANCHUNG'}</strong>
            </div>
          <div className="version-text">
            Phiên bản: Custom Gaming 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
