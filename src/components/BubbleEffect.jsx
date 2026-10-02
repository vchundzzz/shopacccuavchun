import React, { useMemo } from 'react';
import './BubbleEffect.css';

export default function BubbleEffect({ count = 24 }) {
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
        id: i,
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

  return (
    <div className="bubbles-container" aria-hidden="true">
      {bubbles.map((b) => (
        <div key={b.id} className="soap-bubble" style={b.style} />
      ))}
    </div>
  );
}
