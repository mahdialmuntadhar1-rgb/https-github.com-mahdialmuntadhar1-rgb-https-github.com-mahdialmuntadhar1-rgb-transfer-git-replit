/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Mail, Phone, MapPin, Globe, Twitter, Facebook, Instagram, Linkedin, ChevronRight } from 'lucide-react';

const Footer = () => {
  const footerStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '80px 20px 40px 20px',
    borderTop: '1px solid rgba(232, 197, 71, 0.2)'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '60px',
    marginBottom: '80px'
  };

  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: 800,
    color: 'white',
    textDecoration: 'none'
  };

  const linkStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#e8c547',
    margin: '0 0 8px 0'
  };

  const socialIconStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={columnStyle}>
          <div style={logoStyle}>
            <Compass size={32} color="#e8c547" />
            <span>Iraq Compass</span>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            The official business directory of Iraq. Connecting people with verified businesses across all 18 governorates.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={socialIconStyle}><Twitter size={18} /></div>
            <div style={socialIconStyle}><Facebook size={18} /></div>
            <div style={socialIconStyle}><Instagram size={18} /></div>
            <div style={socialIconStyle}><Linkedin size={18} /></div>
          </div>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="#directory" style={linkStyle}><ChevronRight size={14} /> Browse Directory</a>
            <a href="#" style={linkStyle}><ChevronRight size={14} /> Register Business</a>
            <a href="#" style={linkStyle}><ChevronRight size={14} /> Success Stories</a>
            <a href="#" style={linkStyle}><ChevronRight size={14} /> Support Center</a>
          </div>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Governorates</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <a href="#" style={linkStyle}>Baghdad</a>
            <a href="#" style={linkStyle}>Erbil</a>
            <a href="#" style={linkStyle}>Basra</a>
            <a href="#" style={linkStyle}>Nineveh</a>
            <a href="#" style={linkStyle}>Najaf</a>
            <a href="#" style={linkStyle}>Karbala</a>
          </div>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              <Mail size={18} color="#e8c547" />
              <span>support@iraqcompass.iq</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              <Phone size={18} color="#e8c547" />
              <span>+964 770 000 0000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              <MapPin size={18} color="#e8c547" />
              <span>Baghdad, Iraq</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', margin: 0 }}>
          © 2026 Iraq Compass. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ ...linkStyle, fontSize: '12px' }}>Privacy Policy</a>
          <a href="#" style={{ ...linkStyle, fontSize: '12px' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
