/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Business, Category, City } from '../types';
import BusinessCard from './BusinessCard';
import VirtualizedBusinessGrid from './VirtualizedBusinessGrid';

interface DirectoryProps {
  businesses: Business[];
  filteredBusinesses: Business[];
  paginatedBusinesses: Business[];
  categories: Category[];
  cities: City[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  selectedCity: string | null;
  setSelectedCity: (id: string | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  getPageNumbers: () => (number | string)[];
  onBusinessClick: (business: Business) => void;
  debouncedSearchQuery: string;
  loading: boolean;
}

const Directory = ({
  businesses,
  filteredBusinesses,
  paginatedBusinesses,
  categories,
  cities,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  currentPage,
  setCurrentPage,
  totalPages,
  getPageNumbers,
  onBusinessClick,
  debouncedSearchQuery,
  loading
}: DirectoryProps) => {
  const directoryStyle: React.CSSProperties = {
    padding: '80px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  };

  const filterBarStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px 16px 52px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const selectStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    cursor: 'pointer',
    width: '100%'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '40px'
  };

  const pageBtnStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease'
  };

  const activePageBtnStyle: React.CSSProperties = {
    ...pageBtnStyle,
    backgroundColor: '#e8c547',
    borderColor: '#e8c547',
    color: '#1a1a1a'
  };

  return (
    <section id="directory" style={directoryStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#e8c547', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Directory Explorer</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Browse Businesses</h2>
        </div>
        <div style={{ textAlign: 'right' }} dir="rtl" lang="ar">
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#e8c547', textTransform: 'uppercase', letterSpacing: '0.1em' }}>دليل الأعمال</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>تصفح الشركات</h2>
        </div>
      </div>

      <div style={filterBarStyle}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category, or keyword... / ابحث بالاسم أو الفئة..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Filter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} size={16} />
            <select 
              style={{ ...selectStyle, paddingLeft: '36px' }}
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories / جميع الفئات</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} / {cat.name_ar}</option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none' }} size={16} />
            <select 
              style={{ ...selectStyle, paddingLeft: '36px' }}
              value={selectedCity || ''}
              onChange={(e) => setSelectedCity(e.target.value || null)}
            >
              <option value="">All Cities / جميع المدن</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name} / {city.name_ar}</option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedCategory || selectedCity) && (
            <button 
              style={{ ...selectStyle, backgroundColor: '#1a1a1a', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedCity(null);
              }}
            >
              <X size={16} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>
          Showing <span style={{ color: '#1a1a1a' }}>{filteredBusinesses.length}</span> results
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Live Database</span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '16px' }}>
          <Loader2 className="spinner" size={48} color="#e8c547" />
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#666' }}>Accessing Directory...</span>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed rgba(0, 0, 0, 0.1)' }}>
          <Search size={48} color="#ccc" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>No Results Found</h3>
          <p style={{ color: '#666', margin: 0 }}>Try adjusting your filters or search query.</p>
        </div>
      ) : filteredBusinesses.length > 200 ? (
        <VirtualizedBusinessGrid 
          items={filteredBusinesses}
          categories={categories}
          cities={cities}
          onBusinessClick={onBusinessClick}
          debouncedSearchQuery={debouncedSearchQuery}
        />
      ) : (
        <>
          <div style={gridStyle}>
            {paginatedBusinesses.map(business => (
              <BusinessCard 
                key={business.id}
                business={business}
                category={categories.find(c => c.id === business.category_id)}
                city={cities.find(c => c.id === business.city_id)}
                onClick={() => onBusinessClick(business)}
                debouncedSearchQuery={debouncedSearchQuery}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button 
                style={pageBtnStyle}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft size={20} />
              </button>

              {getPageNumbers().map((page, i) => (
                <button
                  key={i}
                  style={page === currentPage ? activePageBtnStyle : pageBtnStyle}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={typeof page !== 'number'}
                >
                  {page}
                </button>
              ))}

              <button 
                style={pageBtnStyle}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default Directory;
