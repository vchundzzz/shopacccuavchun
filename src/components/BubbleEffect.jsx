import React, { useMemo } from 'react';
import './BubbleEffect.css';

export default function BubbleEffect({ count = 22, embersCount = 18 }) {
  // Generate random static configurations for bubbles
  const bubbles = useMemo(() => {
    const list = [];
    const sizes = [16, 20, 24, 28, 34, 40, 48, 54];
    
    for (let i = 0; i < count; i++) {
      const size = sizes[i % sizes.length];
      const left = ((i * 17 + 7) % 96) + 2; // evenly distributed across 2% - 98%
      const riseDuration = 11 + ((i * 2.3) % 9); // between 11s and 20s
      const swayDuration = 3.5 + ((i * 1.1) % 3); // between 3.5s and 6.5s
      const negativeDelay = -((i * 1.8) % 18); // start midway through animation
      const opacity = 0.55 + ((i * 0.15) % 0.4); // between 0.55 and 0.95

      list.push({
        id: `bubble-${i}`,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          opacity: opacity,
          animationDuration: `${riseDuration}s, ${swayDuration}s`,
          animationDelay: `${negativeDelay}s, ${negativeDelay * 0.5}s`,
        }
      });
    }
    return list;
  }, [count]);

  // Generate glowing magic cyber embers (golden & cyan fireflies)
  const embers = useMemo(() => {
    const list = [];
    const colors = ['#22d3ee', '#38bdf8', '#fbbf24', '#f59e0b', '#ec4899'];
    for (let i = 0; i < embersCount; i++) {
      const size = 3 + (i % 4) * 1.5;
      const left = ((i * 23 + 11) % 94) + 3;
      const top = ((i * 37 + 19) % 88) + 6;
      const duration = 6 + (i % 5) * 1.8;
      const delay = -(i * 1.3);
      const color = colors[i % colors.length];

      list.push({
        id: `ember-${i}`,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 5}px ${color}`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }
      });
    }
    return list;
  }, [embersCount]);

  return (
    <div className="bubbles-container" aria-hidden="true">
      {/* 1. Realistic 3D Soap Bubbles */}
      {bubbles.map((b) => (
        <div key={b.id} className="soap-bubble" style={b.style} />
      ))}

      {/* 2. Floating Cyber Magic Embers */}
      {embers.map((e) => (
        <div key={e.id} className="magic-ember" style={e.style} />
      ))}
    </div>
  );
}
