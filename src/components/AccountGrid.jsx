import React from 'react';
import AccountCard from './AccountCard';
import { ArrowRight, Flame } from 'lucide-react';
import './AccountGrid.css';

export default function AccountGrid({ 
  title, 
  subtitle, 
  icon, 
  accounts = [], 
  onViewDetails, 
  onBuyNow,
  onViewMore,
  viewMoreText = 'Xem tất cả',
  accentColor = 'fire',
  emptyMessage = 'Hiện chưa có tài khoản nào trong mục này.'
}) {
  return (
    <section className="account-grid-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title-wrap">
            <div className={`section-icon-box ${accentColor === 'cyan' ? 'cyan' : ''}`}>
              {icon || <Flame size={24} />}
            </div>
            <div>
              <h2 className="section-title">{title}</h2>
              {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
          </div>

          {onViewMore && accounts.length > 0 && (
            <button className="view-more-link-btn" onClick={onViewMore}>
              <span>{viewMoreText}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Grid or Empty */}
        {accounts.length > 0 ? (
          <div className="account-cards-grid">
            {accounts.map((acc) => (
              <AccountCard 
                key={acc.id || acc.code}
                account={acc}
                onViewDetails={onViewDetails}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="empty-account-box">
            <p className="empty-msg">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
