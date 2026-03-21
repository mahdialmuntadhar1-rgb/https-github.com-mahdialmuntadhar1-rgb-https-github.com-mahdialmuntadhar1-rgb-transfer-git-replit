/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Globe, ExternalLink, ArrowRight } from 'lucide-react';
import { Business, Category, City } from '../types';
import HighlightText from './HighlightText';

interface BusinessCardProps {
  business: Business;
  category?: Category;
  city?: City;
  style?: React.CSSProperties;
  onClick: () => void;
  debouncedSearchQuery: string;
}

const BusinessCard = React.memo(({ 
  business, 
  category, 
  city, 
  style, 
  onClick, 
  debouncedSearchQuery 
}: BusinessCardProps) => {
  const cardStyle: React.CSSProperties = {
    ...style,
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    height: '100%',
    position: 'relative'
  };

  const stripeStyle: React.CSSProperties = {
    height: '4px',
    width: '100%',
    backgroundColor: category?.color || '#e8c547'
  };

  const contentStyle: React.CSSProperties = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '12px'
  };

  const tagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '100px',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    width: 'fit-content'
  };

  const titleEnStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a1a1a',
    lineHeight: 1.2,
    margin: 0
  };

  const titleArStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#e8c547',
    lineHeight: 1.2,
    margin: 0,
    textAlign: 'right'
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#666'
  };

  const footerStyle: React.CSSProperties = {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const detailBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#1a1a1a',
    textTransform: 'uppercase'
  };

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
      }}
    >
      <div style={stripeStyle} />
      <div style={contentStyle}>
        <div style={tagStyle}>
          <span>{category?.icon}</span>
          <span>{category?.name}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={titleEnStyle}>
            <HighlightText text={business.name} highlight={debouncedSearchQuery} />
          </h3>
          <h3 style={titleArStyle} dir="rtl" lang="ar">
            <HighlightText text={business.name_ar} highlight={debouncedSearchQuery} />
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <div style={infoRowStyle}>
            <MapPin size={14} color="#e8c547" />
            <span>{city?.name} — {business.address}</span>
          </div>
          
          <div style={infoRowStyle}>
            <Phone size={14} color="#e8c547" />
            <span>{business.phone}</span>
          </div>

          {business.website && (
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ ...infoRowStyle, color: '#e8c547', textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Globe size={14} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <HighlightText text={business.website.replace(/^https?:\/\//, '')} highlight={debouncedSearchQuery} />
              </span>
              <ExternalLink size={10} style={{ marginLeft: '4px', opacity: 0.5 }} />
            </a>
          )}
        </div>

        <div style={footerStyle}>
          <div style={detailBtnStyle}>
            <span>View Details</span>
            <ArrowRight size={14} />
          </div>
          <div style={{ ...detailBtnStyle, direction: 'rtl' }} dir="rtl" lang="ar">
            <span>عرض التفاصيل</span>
            <ArrowRight size={14} style={{ transform: 'rotate(180deg)', marginRight: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default BusinessCard;
