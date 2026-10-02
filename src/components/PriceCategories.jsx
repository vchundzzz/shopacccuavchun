import React from 'react';
import { Flame, Sparkles, Trophy, Crown, ArrowRight } from 'lucide-react';
import './PriceCategories.css';

export default function PriceCategories({ onSelectCategory, activeCategory, game = 'freefire' }) {
  const isFF = game === 'freefire';

  const categories = isFF ? [
    {
      id: 'ff-under-3m',
      title: 'Acc Dưới 3 Triệu',
      range: '< 3.000.000đ',
      icon: '💰',
      subtitle: 'Giá sinh viên, rank cao, súng cam',
      badge: 'BÁN CHẠY',
      accentColor: '#ff9800',
      glowClass: 'glow-amber'
    },
    {
      id: 'ff-3m-5m',
      title: 'Acc Từ 3 – 5 Triệu',
      range: '3.000.000đ – 5.000.000đ',
      icon: '💎',
      subtitle: 'Súng nâng cấp Lv4-Lv6, nhiều skin',
      badge: 'PHỔ BIẾN',
      accentColor: '#00e5ff',
      glowClass: 'glow-cyan'
    },
    {
      id: 'ff-5m-10m',
      title: 'Acc Từ 5 – 10 Triệu',
      range: '5.000.000đ – 10.000.000đ',
      icon: '🔥',
      subtitle: 'Súng Max Lv7, kho đồ khủng',
      badge: 'CỰC HOT',
      accentColor: '#ff5722',
      glowClass: 'glow-fire'
    },
    {
      id: 'ff-super-vip',
      title: 'Acc Siêu VIP',
      range: '> 10.000.000đ',
      icon: '👑',
      subtitle: 'Quỷ Dạ Xoa, Đồ Cổ S1-S2, Top Server',
      badge: 'ĐẠI GIA',
      accentColor: '#f5a623',
      glowClass: 'glow-gold'
    }
  ] : [
    {
      id: 'lq-under-3m',
      title: 'Liên Quân < 3M',
      range: '< 3.000.000đ',
      icon: '💰',
      subtitle: 'Acc sinh viên, Rank Cao Thủ, Full Ngọc',
      badge: 'GIÁ RẺ',
      accentColor: '#3b82f6',
      glowClass: 'glow-blue'
    },
    {
      id: 'lq-3m-5m',
      title: 'Liên Quân 3M – 5M',
      range: '3.000.000đ – 5.000.000đ',
      icon: '💎',
      subtitle: 'Nhiều Skin S+, SS Tuyệt Sắc',
      badge: 'HOT',
      accentColor: '#8b5cf6',
      glowClass: 'glow-purple'
    },
    {
      id: 'lq-5m-10m',
      title: 'Liên Quân 5M – 10M',
      range: '5.000.000đ – 10.000.000đ',
      icon: '🔥',
      subtitle: 'Full Tướng, Skin SSS Hữu Hạn',
      badge: 'CAO CẤP',
      accentColor: '#ec4899',
      glowClass: 'glow-pink'
    },
    {
      id: 'lq-super-vip',
      title: 'Liên Quân Siêu VIP',
      range: '> 10.000.000đ',
      icon: '👑',
      subtitle: 'Full Bộ Thứ Nguyên Vệ Thần, SSS Thần Thoại',
      badge: 'SIÊU VIP',
      accentColor: '#eab308',
      glowClass: 'glow-gold'
    }
  ];

  return (
    <section className="price-categories-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <div className={`section-icon-box ${!isFF ? 'cyan' : ''}`}>
              {isFF ? <Flame size={24} /> : <Trophy size={24} />}
            </div>
            <div>
              <h2 className="section-title">
                {isFF ? 'DANH MỤC FREE FIRE THEO GIÁ' : 'DANH MỤC LIÊN QUÂN THEO GIÁ'}
              </h2>
              <p className="section-subtitle">
                {isFF 
                  ? 'Sản phẩm chủ lực - Chọn khoảng giá phù hợp với ngân sách của bạn' 
                  : 'Danh mục phụ - Các tài khoản Liên Quân tuyển chọn'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="price-cards-grid">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <div 
                key={cat.id}
                className={`price-card ${cat.glowClass} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="price-card-header">
                  <span className="price-card-icon">{cat.icon}</span>
                  <span className="price-card-badge">{cat.badge}</span>
                </div>

                <h3 className="price-card-title">{cat.title}</h3>
                <div className="price-card-range">{cat.range}</div>
                <p className="price-card-sub">{cat.subtitle}</p>

                <div className="price-card-footer">
                  <span className="explore-text">Xem các acc</span>
                  <ArrowRight size={16} className="arrow-hover-icon" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
