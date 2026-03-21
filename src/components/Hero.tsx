/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, LayoutGrid, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onStartSearch: () => void;
  businessCount: number;
}

const Hero = ({ onStartSearch, businessCount }: HeroProps) => {
  const heroStyle: React.CSSProperties = {
    position: 'relative',
    padding: '120px 20px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '32px',
    borderBottom: '1px solid rgba(232, 197, 71, 0.2)'
  };

  const mapStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '800px',
    opacity: 0.1,
    color: '#e8c547',
    pointerEvents: 'none'
  };

  const badgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '100px',
    backgroundColor: 'rgba(232, 197, 71, 0.1)',
    border: '1px solid rgba(232, 197, 71, 0.3)',
    fontSize: '13px',
    fontWeight: 600,
    color: '#e8c547',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 'clamp(32px, 8vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    maxWidth: '900px',
    margin: 0,
    letterSpacing: '-0.02em'
  };

  const subHeadingStyle: React.CSSProperties = {
    fontSize: 'clamp(16px, 4vw, 20px)',
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '600px',
    lineHeight: 1.6,
    margin: 0
  };

  const ctaStyle: React.CSSProperties = {
    padding: '16px 40px',
    borderRadius: '100px',
    backgroundColor: '#e8c547',
    color: '#1a1a1a',
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 24px rgba(232, 197, 71, 0.3)'
  };

  const statPillStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 24px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minWidth: '120px'
  };

  return (
    <section style={heroStyle}>
      <svg style={mapStyle} viewBox="0 0 200 200" fill="currentColor">
        <path d="M140,40 L160,60 L170,90 L165,120 L150,150 L120,170 L90,165 L60,150 L40,120 L35,90 L45,60 L70,40 Z" opacity="0.5" />
        <path d="M100,20 L120,30 L140,50 L150,80 L145,110 L130,140 L100,160 L70,155 L40,140 L20,110 L15,80 L25,50 L50,30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 1 }}
      >
        <div style={badgeStyle}>
          <span>🇮🇶</span>
          <span dir="rtl" lang="ar">دليل الأعمال الرسمي</span>
        </div>
        
        <h1 style={headingStyle}>
          Discover Iraq's Best Businesses
          <br />
          <span style={{ color: '#e8c547' }} dir="rtl" lang="ar">اكتشف أفضل الأعمال في العراق</span>
        </h1>
        
        <p style={subHeadingStyle}>
          Iraq's most complete business directory — {businessCount}+ verified listings across all 18 governorates
        </p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={statPillStyle}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#e8c547' }}>+{businessCount}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5 }}>Businesses</span>
          </div>
          <div style={statPillStyle}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#e8c547' }}>18</span>
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5 }}>Governorates</span>
          </div>
        </div>
        
        <button 
          style={ctaStyle}
          onClick={onStartSearch}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(232, 197, 71, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 197, 71, 0.3)';
          }}
        >
          <span>Start Search Now</span>
          <ChevronRight size={20} />
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
