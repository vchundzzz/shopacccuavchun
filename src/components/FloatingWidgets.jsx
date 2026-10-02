import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import './FloatingWidgets.css';

export default function FloatingWidgets({ shopConfig = {} }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Zalo & Facebook (Right Edge) */}
      <ul className="nav-fixed">
        <li className="nav-fixed-zalo">
          <a 
            target="_blank" 
            rel="noopener noreferrer" 
            href={`https://zalo.me/${shopConfig.zaloFF || '0868994712'}`}
            title={`Chat Zalo: ${shopConfig.zaloFF || '0868994712'}`}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/60px-Icon_of_Zalo.svg.png" 
              alt="Zalo Chat" 
            />
          </a>
        </li>

        <li className="nav-fixed-face">
          <a 
            target="_blank" 
            rel="noopener noreferrer" 
            href={shopConfig.facebookLink || "https://www.facebook.com/tyseiseiff/"}
            title="Facebook cá nhân"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/960px-2023_Facebook_icon.svg.png" 
              alt="Facebook" 
            />
          </a>
        </li>
      </ul>

      {/* Back to top button */}
      {showBackToTop && (
        <button 
          className="btn-back-to-top" 
          onClick={scrollToTop} 
          title="Lên đầu trang"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
