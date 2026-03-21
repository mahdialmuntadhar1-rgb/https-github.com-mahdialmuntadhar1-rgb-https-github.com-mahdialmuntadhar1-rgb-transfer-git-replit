/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, X, User, LogOut, LayoutGrid, PlusSquare, Settings, Home } from 'lucide-react';
import { View, DashboardSection } from '../types';

interface HeaderProps {
  user: any;
  onViewChange: (view: View) => void;
  onLogout: () => void;
  currentView: View;
}

const Header = ({ user, onViewChange, onLogout, currentView }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(232, 197, 71, 0.2)',
    padding: '0 20px',
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'white'
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  };

  const navLinkStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const activeNavLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    color: '#e8c547'
  };

  const authBtnStyle: React.CSSProperties = {
    padding: '8px 20px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #e8c547',
    backgroundColor: 'transparent',
    color: '#e8c547'
  };

  const primaryAuthBtnStyle: React.CSSProperties = {
    ...authBtnStyle,
    backgroundColor: '#e8c547',
    color: '#1a1a1a'
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle} onClick={() => onViewChange('home')}>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#e8c547', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', fontWeight: 800, fontSize: '20px' }}>
          IC
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.05em' }}>IRAQ COMPASS</span>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#e8c547', letterSpacing: '0.2em' }} dir="rtl" lang="ar">دليل العراق</span>
        </div>
      </div>

      {/* Desktop Nav */}
      <nav style={{ ...navStyle, display: 'none' }} className="desktop-nav">
        <div 
          style={currentView === 'home' ? activeNavLinkStyle : navLinkStyle}
          onClick={() => onViewChange('home')}
        >
          <Home size={16} />
          <span>Home</span>
        </div>
        <div 
          style={currentView === 'list' ? activeNavLinkStyle : navLinkStyle}
          onClick={() => onViewChange('list')}
        >
          <LayoutGrid size={16} />
          <span>Directory</span>
        </div>
        {user ? (
          <div 
            style={currentView === 'dashboard' ? activeNavLinkStyle : navLinkStyle}
            onClick={() => onViewChange('dashboard')}
          >
            <PlusSquare size={16} />
            <span>Dashboard</span>
          </div>
        ) : (
          <div 
            style={currentView === 'login' ? activeNavLinkStyle : navLinkStyle}
            onClick={() => onViewChange('login')}
          >
            <User size={16} />
            <span>Sign In</span>
          </div>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'none' }} className="desktop-user">
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)' }}>Welcome,</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'white', marginLeft: '4px' }}>{user.email.split('@')[0]}</span>
            </div>
            <button 
              style={{ ...authBtnStyle, display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={onLogout}
            >
              <LogOut size={16} />
              <span className="desktop-text">Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={authBtnStyle} onClick={() => onViewChange('login')}>Login</button>
            <button style={primaryAuthBtnStyle} onClick={() => onViewChange('register')}>Join</button>
          </div>
        )}

        <button 
          style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-btn"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-user { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-text { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
