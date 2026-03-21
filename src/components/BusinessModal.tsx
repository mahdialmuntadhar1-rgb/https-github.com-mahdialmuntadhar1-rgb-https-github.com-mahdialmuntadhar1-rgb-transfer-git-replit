/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, MapPin, Phone, Globe, Mail, Clock, ShieldCheck, ExternalLink, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Business, Category, City } from '../types';

interface BusinessModalProps {
  business: Business | null;
  onClose: () => void;
  category: Category | undefined;
  city: City | undefined;
}

const BusinessModal = ({ business, onClose, category, city }: BusinessModalProps) => {
  if (!business) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    color: 'white',
    border: '1px solid rgba(232, 197, 71, 0.2)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)'
  };

  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    color: 'white'
  };

  const headerStyle: React.CSSProperties = {
    padding: '40px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const bodyStyle: React.CSSProperties = {
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#e8c547',
    marginBottom: '16px',
    display: 'block'
  };

  const infoItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px'
  };

  const infoIconStyle: React.CSSProperties = {
    marginTop: '4px',
    color: '#e8c547'
  };

  const infoContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase'
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 500
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={overlayStyle}
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={modalStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <button style={closeBtnStyle} onClick={onClose}>
            <X size={24} />
          </button>

          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{category?.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#e8c547', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {category?.name} / <span dir="rtl" lang="ar">{category?.name_ar}</span>
              </span>
              {business.is_verified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600 }}>
                  <ShieldCheck size={14} />
                  <span>VERIFIED</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{business.name}</h2>
              <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#e8c547' }} dir="rtl" lang="ar">{business.name_ar}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} />
                <span>{city?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#e8c547" color="#e8c547" />
                <span style={{ color: 'white', fontWeight: 600 }}>{business.rating}</span>
                <span>Rating</span>
              </div>
            </div>
          </div>

          <div style={bodyStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <span style={sectionTitleStyle}>About the Business</span>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                  {business.description}
                </p>
                <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#e8c547', textAlign: 'right' }} dir="rtl" lang="ar">
                  {business.description_ar}
                </p>
              </div>

              <div>
                <span style={sectionTitleStyle}>Location & Address</span>
                <div style={infoItemStyle}>
                  <MapPin size={20} style={infoIconStyle} />
                  <div style={infoContentStyle}>
                    <span style={labelStyle}>Full Address</span>
                    <span style={valueStyle}>{business.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <span style={sectionTitleStyle}>Contact Information</span>
                <div style={infoItemStyle}>
                  <Phone size={20} style={infoIconStyle} />
                  <div style={infoContentStyle}>
                    <span style={labelStyle}>Phone Number</span>
                    <span style={valueStyle}>{business.phone}</span>
                  </div>
                </div>

                {business.email && (
                  <div style={infoItemStyle}>
                    <Mail size={20} style={infoIconStyle} />
                    <div style={infoContentStyle}>
                      <span style={labelStyle}>Email Address</span>
                      <span style={valueStyle}>{business.email}</span>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div style={infoItemStyle}>
                    <Globe size={20} style={infoIconStyle} />
                    <div style={infoContentStyle}>
                      <span style={labelStyle}>Official Website</span>
                      <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ ...valueStyle, color: '#e8c547', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {business.website.replace(/^https?:\/\//, '')}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <span style={sectionTitleStyle}>Business Hours</span>
                <div style={infoItemStyle}>
                  <Clock size={20} style={infoIconStyle} />
                  <div style={infoContentStyle}>
                    <span style={labelStyle}>Opening Hours</span>
                    <span style={valueStyle}>{business.opening_hours || 'Contact for hours'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessModal;
