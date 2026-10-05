import React, { useEffect, useState, useCallback } from 'react';
import './ClickSparkleEffect.css';

const SPARKLE_SHAPES = ['✦', '★', '✧', '•', '◆'];
const COLORS = [
  '#22d3ee', // Cyan
  '#38bdf8', // Sky
  '#f59e0b', // Amber/Gold
  '#fbbf24', // Yellow
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#10b981'  // Emerald
];

export default function ClickSparkleEffect() {
  const [sparkles, setSparkles] = useState([]);

  const addSparkles = useCallback((x, y) => {
    // Generate 6-8 small sparkle particles bursting outwards
    const count = 7;
    const newBatch = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const angle = (i * (360 / count) + Math.random() * 25) * (Math.PI / 180);
      const distance = 25 + Math.random() * 45;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const shape = SPARKLE_SHAPES[Math.floor(Math.random() * SPARKLE_SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 10 + Math.random() * 12;

      newBatch.push({
        id: `${now}-${i}-${Math.random()}`,
        x,
        y,
        tx,
        ty,
        shape,
        color,
        size,
        createdAt: now
      });
    }

    setSparkles(prev => [...prev.slice(-30), ...newBatch]);
  }, []);

  useEffect(() => {
    const handlePointerDown = (e) => {
      // Don't spawn if right-clicked
      if (e.button && e.button !== 0) return;
      addSparkles(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [addSparkles]);

  // Clean up old sparkles after 650ms
  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      const threshold = Date.now() - 650;
      setSparkles(prev => prev.filter(s => s.createdAt > threshold));
    }, 200);
    return () => clearTimeout(timer);
  }, [sparkles]);

  return (
    <div className="click-sparkles-container" aria-hidden="true">
      {sparkles.map(s => (
        <span
          key={s.id}
          className="click-sparkle-item"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
            '--color': s.color,
            fontSize: `${s.size}px`,
            color: s.color
          }}
        >
          {s.shape}
        </span>
      ))}
    </div>
  );
}
