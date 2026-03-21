/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusSquare, ListChecks, BarChart3, Settings, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2, Globe, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Business, Category, City, DashboardSection } from '../types';

interface DashboardProps {
  section: DashboardSection;
  setSection: (section: DashboardSection) => void;
  businesses: Business[];
  categories: Category[];
  cities: City[];
  user: any;
  onSubmit: (data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  editingBusinessId: string | null;
  setEditingBusinessId: (id: string | null) => void;
}

const Dashboard = ({ 
  section, 
  setSection, 
  businesses, 
  categories, 
  cities, 
  user, 
  onSubmit, 
  onDelete, 
  loading, 
  error,
  editingBusinessId,
  setEditingBusinessId
}: DashboardProps) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    category_id: categories[0]?.id || '',
    city_id: cities[0]?.id || '',
    phone: '',
    email: '',
    website: '',
    address: '',
    description: '',
    description_ar: '',
    opening_hours: '',
    image_url: ''
  });

  const userBusinesses = businesses.filter(b => b.owner_id === user?.id);

  const containerStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 72px)',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px'
  };

  const dashboardGridStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '32px'
  };

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const sidebarBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  };

  const activeSidebarBtnStyle: React.CSSProperties = {
    ...sidebarBtnStyle,
    backgroundColor: 'rgba(232, 197, 71, 0.1)',
    color: '#e8c547'
  };

  const contentCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#666'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '15px',
    backgroundColor: '#f8f9fa',
    outline: 'none'
  };

  const handleEdit = (business: Business) => {
    setEditingBusinessId(business.id);
    setFormData({
      name: business.name,
      name_ar: business.name_ar,
      category_id: business.category_id,
      city_id: business.city_id,
      phone: business.phone,
      email: business.email || '',
      website: business.website,
      address: business.address,
      description: business.description,
      description_ar: business.description_ar,
      opening_hours: business.opening_hours || '',
      image_url: business.image_url
    });
    setSection('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={containerStyle}>
      <div style={dashboardGridStyle} className="dashboard-grid">
        <aside style={sidebarStyle}>
          <div style={{ marginBottom: '24px', padding: '0 20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Management</span>
          </div>
          <button 
            style={section === 'listings' ? activeSidebarBtnStyle : sidebarBtnStyle}
            onClick={() => setSection('listings')}
          >
            <ListChecks size={20} />
            <span>My Listings</span>
          </button>
          <button 
            style={section === 'add' ? activeSidebarBtnStyle : sidebarBtnStyle}
            onClick={() => {
              setEditingBusinessId(null);
              setFormData({
                name: '',
                name_ar: '',
                category_id: categories[0]?.id || '',
                city_id: cities[0]?.id || '',
                phone: '',
                email: '',
                website: '',
                address: '',
                description: '',
                description_ar: '',
                opening_hours: '',
                image_url: ''
              });
              setSection('add');
            }}
          >
            <PlusSquare size={20} />
            <span>{editingBusinessId ? 'Edit Listing' : 'Add New Listing'}</span>
          </button>
          <button 
            style={section === 'stats' ? activeSidebarBtnStyle : sidebarBtnStyle}
            onClick={() => setSection('stats')}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button 
            style={section === 'settings' ? activeSidebarBtnStyle : sidebarBtnStyle}
            onClick={() => setSection('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </aside>

        <main style={contentCardStyle}>
          {section === 'listings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>My Business Listings</h2>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>{userBusinesses.length} Total</span>
              </div>

              {userBusinesses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px dashed rgba(0, 0, 0, 0.05)', borderRadius: '24px' }}>
                  <PlusSquare size={48} color="#ccc" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>No Listings Yet</h3>
                  <p style={{ color: '#666', marginBottom: '24px' }}>Start by adding your first business to the directory.</p>
                  <button 
                    style={{ padding: '12px 24px', borderRadius: '100px', backgroundColor: '#e8c547', color: '#1a1a1a', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => setSection('add')}
                  >
                    Add Business
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userBusinesses.map(business => (
                    <div key={business.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.05)', backgroundColor: '#fcfcfc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(232, 197, 71, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                          {categories.find(c => c.id === business.category_id)?.icon}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>{business.name}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#666' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {cities.find(c => c.id === business.city_id)?.name}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} color={business.is_verified ? '#22c55e' : '#ccc'} /> {business.is_verified ? 'Verified' : 'Pending'}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}
                          onClick={() => handleEdit(business)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}
                          onClick={() => onDelete(business.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'add' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>
                {editingBusinessId ? 'Edit Business Listing' : 'Register New Business'}
              </h2>

              {error && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontSize: '14px' }}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Business Name (English)</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div style={inputGroupStyle} dir="rtl" lang="ar">
                  <label style={{ ...labelStyle, textAlign: 'right' }}>اسم العمل (بالعربية)</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, textAlign: 'right' }}
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Category / الفئة</label>
                  <select 
                    style={inputStyle}
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name} / {cat.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>City / المدينة</label>
                  <select 
                    style={inputStyle}
                    value={formData.city_id}
                    onChange={(e) => setFormData({...formData, city_id: e.target.value})}
                    required
                  >
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name} / {city.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Phone Number / رقم الهاتف</label>
                  <input 
                    type="tel" 
                    style={inputStyle}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email Address / البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    style={inputStyle}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div style={{ ...inputGroupStyle, gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Full Address / العنوان الكامل</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Description (English)</label>
                  <textarea 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                <div style={inputGroupStyle} dir="rtl" lang="ar">
                  <label style={{ ...labelStyle, textAlign: 'right' }}>الوصف (بالعربية)</label>
                  <textarea 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', textAlign: 'right' }}
                    value={formData.description_ar}
                    onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                    required
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button 
                    type="submit" 
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="spinner" size={20} /> : (editingBusinessId ? 'Update Listing' : 'Publish Listing')}
                  </button>
                  <button 
                    type="button" 
                    style={{ padding: '16px 32px', borderRadius: '12px', backgroundColor: 'white', color: '#666', border: '1px solid rgba(0, 0, 0, 0.1)', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => setSection('listings')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {section === 'stats' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <BarChart3 size={48} color="#e8c547" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>Analytics Coming Soon</h3>
              <p style={{ color: '#666' }}>Track views, clicks, and engagement for your business listings.</p>
            </div>
          )}

          {section === 'settings' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Settings size={48} color="#e8c547" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>Account Settings</h3>
              <p style={{ color: '#666' }}>Manage your profile and notification preferences.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
