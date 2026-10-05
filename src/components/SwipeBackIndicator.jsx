import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import './SwipeBackIndicator.css';

export default function SwipeBackIndicator({ 
  isActive, 
  progress = 0, // 0 to 1
  deltaX = 0,
  isReady = false 
}) {
  if (!isActive && progress === 0) return null;

  // Clamp translation to max 50px
  const translateX = Math.min(Math.max(deltaX * 0.35, 8), 50);
  const opacity = Math.min(Math.max(progress * 1.2, 0.2), 1);
  const scale = isReady ? 1.08 : 0.95 + progress * 0.05;

  return (
    <div 
      className={`swipe-back-overlay ${isReady ? 'is-ready' : ''}`}
      aria-hidden="true"
    >
      <div 
        className="swipe-back-pill"
        style={{
          transform: `translate3d(${translateX}px, -50%, 0) scale(${scale})`,
          opacity
        }}
      >
        <div className="swipe-back-icon-wrap">
          {isReady ? (
            <Check size={20} className="swipe-icon-check" />
          ) : (
            <ArrowLeft size={20} className="swipe-icon-arrow" />
          )}
        </div>
        <span className="swipe-back-text">
          {isReady ? 'Thả để quay lại' : 'Quay lại'}
        </span>
      </div>
    </div>
  );
}

