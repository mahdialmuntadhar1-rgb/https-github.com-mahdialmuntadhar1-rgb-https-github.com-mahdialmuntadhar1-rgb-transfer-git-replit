/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  Star, 
  Phone, 
  Globe, 
  Clock, 
  Menu, 
  X,
  LayoutGrid,
  Building2,
  Utensils,
  Hotel,
  ShoppingBag,
  Stethoscope,
  Car,
  Briefcase,
  Compass,
  Globe2
} from 'lucide-react';
import styles from './App.module.css';

// Types
interface Business {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  category_id: string;
  city_id: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  image_url: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
  icon: string;
}

interface City {
  id: string;
  name: string;
  name_ar: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'restaurants': <Utensils size={24} />,
  'hotels': <Hotel size={24} />,
  'shopping': <ShoppingBag size={24} />,
  'health': <Stethoscope size={24} />,
  'automotive': <Car size={24} />,
  'services': <Briefcase size={24} />,
  'default': <Building2 size={24} />
};

export default function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<'home' | 'list' | 'detail'>('home');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      const { data: cityData, error: cityError } = await supabase.from('cities').select('*');
      
      if (catError || cityError) {
        console.warn('Could not fetch from Supabase. Using mock data for demo.');
        setCategories([
          { id: '1', name: 'Restaurants', name_ar: 'مطاعم', icon: 'restaurants' },
          { id: '2', name: 'Hotels', name_ar: 'فنادق', icon: 'hotels' },
          { id: '3', name: 'Shopping', name_ar: 'تسوق', icon: 'shopping' },
          { id: '4', name: 'Health', name_ar: 'صحة', icon: 'health' },
          { id: '5', name: 'Services', name_ar: 'خدمات', icon: 'services' },
        ]);
        setCities([
          { id: '1', name: 'Baghdad', name_ar: 'بغداد' },
          { id: '2', name: 'Basra', name_ar: 'البصرة' },
          { id: '3', name: 'Nineveh', name_ar: 'نينوى' },
          { id: '4', name: 'Erbil', name_ar: 'أربيل' },
          { id: '5', name: 'Sulaymaniyah', name_ar: 'السليمانية' },
          { id: '6', name: 'Kirkuk', name_ar: 'كركوك' },
          { id: '7', name: 'Duhok', name_ar: 'دهوك' },
          { id: '8', name: 'Anbar', name_ar: 'الأنبار' },
          { id: '9', name: 'Diyala', name_ar: 'ديالى' },
          { id: '10', name: 'Babil', name_ar: 'بابل' },
          { id: '11', name: 'Karbala', name_ar: 'كربلاء' },
          { id: '12', name: 'Najaf', name_ar: 'النجف' },
          { id: '13', name: 'Wasit', name_ar: 'واسط' },
          { id: '14', name: 'Maysan', name_ar: 'ميسان' },
          { id: '15', name: 'Dhi Qar', name_ar: 'ذي قار' },
          { id: '16', name: 'Muthanna', name_ar: 'المثنى' },
          { id: '17', name: 'Qadisiyyah', name_ar: 'القادسية' },
          { id: '18', name: 'Saladin', name_ar: 'صلاح الدين' },
        ]);
        
        setBusinesses([
          {
            id: '1',
            name: 'Al-Mansour Restaurant',
            name_ar: 'مطعم المنصور',
            description: 'Traditional Iraqi cuisine in the heart of Baghdad.',
            description_ar: 'مأكولات عراقية تقليدية في قلب بغداد.',
            category_id: '1',
            city_id: '1',
            address: 'Al-Mansour District, Baghdad',
            phone: '+964 770 123 4567',
            website: 'https://example.com',
            rating: 4.8,
            image_url: 'https://picsum.photos/seed/food/800/600',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Rotana Erbil',
            name_ar: 'روتانا أربيل',
            description: 'Luxury hotel with world-class amenities.',
            description_ar: 'فندق فاخر مع مرافق عالمية المستوى.',
            category_id: '2',
            city_id: '2',
            address: 'Gulan Street, Erbil',
            phone: '+964 66 210 5555',
            website: 'https://rotana.com',
            rating: 4.9,
            image_url: 'https://picsum.photos/seed/hotel/800/600',
            created_at: new Date().toISOString()
          }
        ]);
      } else {
        setCategories(catData || []);
        setCities(cityData || []);
        const { data: busData } = await supabase.from('businesses').select('*');
        setBusinesses(busData || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(b => {
    const category = categories.find(c => c.id === b.category_id);
    const city = cities.find(c => c.id === b.city_id);
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      b.name.toLowerCase().includes(searchLower) || 
      b.name_ar.includes(searchQuery) ||
      (category?.name.toLowerCase().includes(searchLower) ?? false) ||
      (category?.name_ar.includes(searchQuery) ?? false) ||
      (city?.name.toLowerCase().includes(searchLower) ?? false) ||
      (city?.name_ar.includes(searchQuery) ?? false) ||
      b.phone.includes(searchQuery);
      
    const matchesCategory = !selectedCategory || b.category_id === selectedCategory;
    const matchesCity = !selectedCity || b.city_id === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setView('list');
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setView('detail');
  };

  const renderHome = () => (
    <div className={styles.container}>
      {/* Dashboard Header Status */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', borderBottom: '1px solid var(--border-slate)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={styles.statusDot} />
          <span className={`${styles.mono} ${styles.dataLabel}`} style={{ marginBottom: 0 }}>System Live</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={styles.dataLabel} style={{ marginBottom: 0 }}>Region:</span>
          <span className={styles.mono} style={{ fontSize: '10px', color: 'var(--brand-gold)' }}>Middle East / Iraq</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span className={styles.dataLabel} style={{ marginBottom: 0 }}>Last Sync:</span>
          <span className={styles.mono} style={{ fontSize: '10px' }}>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <svg className={styles.heroMap} viewBox="0 0 200 200" fill="currentColor">
          <path d="M140,40 L160,60 L170,90 L165,120 L150,150 L120,170 L90,165 L60,150 L40,120 L35,90 L45,60 L70,40 Z" opacity="0.5" />
          <path d="M100,20 L120,30 L140,50 L150,80 L145,110 L130,140 L100,160 L70,155 L40,140 L20,110 L15,80 L25,50 L50,30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>🇮🇶</span>
            <span>دليل الأعمال الرسمي</span>
          </div>
          
          <h1 className={styles.heroHeading}>
            اكتشف أفضل الأعمال في العراق
          </h1>
          
          <p className={styles.heroSubheading}>
            Iraq's most complete business directory — 6,000+ verified listings across all 18 governorates
          </p>
          
          <div className={styles.statPills}>
            <div className={styles.statPill}>
              <span className={styles.statValue}>+6,000</span>
              <span className={styles.statLabel}>شركة</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue}>18</span>
              <span className={styles.statLabel}>محافظة</span>
            </div>
          </div>
          
          <button 
            className={styles.heroCTA}
            onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>ابدأ البحث الآن</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Governorates Horizontal Scroll Strip */}
      <div className={styles.govStripContainer}>
        <div className={styles.govStripTrack}>
          {/* Duplicate for seamless scrolling */}
          {[...cities, ...cities].map((city, index) => (
            <button
              key={`${city.id}-${index}`}
              className={`${styles.govPill} ${selectedCity === city.id ? styles.govPillActive : ''}`}
              onClick={() => {
                setSelectedCity(selectedCity === city.id ? null : city.id);
                setView('list');
              }}
            >
              <span className={styles.govIcon}>📍</span>
              <span className={styles.govEn}>{city.name}</span>
              <span className={`${styles.arabic} ${styles.govAr}`}>{city.name_ar}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <section id="directory">
        <div className={styles.sectionTitle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.dataLabel}>Sector Analysis</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-warm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Browse by Category</h2>
          </div>
          <span className={styles.arabic} style={{ fontSize: '1.25rem', color: 'var(--brand-gold)' }}>تصفح حسب الفئة</span>
        </div>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={styles.catCard}
            >
              <div className={styles.catIcon}>
                {CATEGORY_ICONS[cat.icon] || CATEGORY_ICONS['default']}
              </div>
              <div className={styles.dataLabel}>Category ID: {cat.id.padStart(2, '0')}</div>
              <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-warm)', marginBottom: '4px' }}>{cat.name}</span>
              <span className={`${styles.arabic}`} style={{ fontSize: '0.875rem', color: 'var(--brand-gold)' }}>{cat.name_ar}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cities */}
      <section style={{ marginTop: '80px' }}>
        <div className={styles.sectionTitle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.dataLabel}>Geospatial Nodes</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-warm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore Cities</h2>
          </div>
          <span className={styles.arabic} style={{ fontSize: '1.25rem', color: 'var(--brand-gold)' }}>استكشف المدن</span>
        </div>
        <div className={styles.grid}>
          {cities.map((city) => (
            <div
              key={city.id}
              onClick={() => {
                setSelectedCity(city.id);
                setView('list');
              }}
              className={styles.cityCard}
            >
              <div className={styles.cityOverlay} />
              <img 
                src={`https://picsum.photos/seed/${city.name}/400/300`} 
                alt={city.name}
                className={styles.cityImg}
                referrerPolicy="no-referrer"
              />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className={styles.dataLabel}>Node: {city.name.toUpperCase()}</div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-warm)' }}>{city.name}</span>
                <span className={styles.arabic} style={{ fontSize: '1rem', color: 'var(--brand-gold)', display: 'block' }}>{city.name_ar}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderList = () => (
    <div className={styles.container}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px', borderBottom: '1px solid var(--border-slate)', paddingBottom: '24px' }}>
        <button 
          onClick={() => setView('home')}
          style={{ background: 'none', border: 'none', color: 'var(--brand-gold)', cursor: 'pointer', textAlign: 'left', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          className={styles.mono}
        >
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
          <span>Return to Dashboard</span>
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className={styles.dataLabel}>Query Results</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-warm)', letterSpacing: '-0.02em' }}>
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Global Directory'}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.dataLabel}>Record Count</div>
            <span className={`${styles.mono}`} style={{ fontSize: '1.25rem', color: 'var(--brand-gold)' }}>
              {filteredBusinesses.length.toString().padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.businessGrid}>
        {filteredBusinesses.map((business) => (
          <div
            key={business.id}
            className={styles.businessCard}
            onClick={() => handleBusinessClick(business)}
            style={{ border: '1px solid var(--border-slate)' }}
          >
            <div style={{ height: '180px', position: 'relative' }}>
              <img 
                src={business.image_url} 
                alt={business.name} 
                className={styles.businessImg}
                referrerPolicy="no-referrer"
              />
              <div className={styles.mono} style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--bg-deep)', border: '1px solid var(--brand-gold)', color: 'var(--brand-gold)', padding: '4px 8px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                <Star size={12} color="var(--brand-gold)" fill="var(--brand-gold)" />
                {business.rating.toFixed(1)}
              </div>
            </div>
            <div className={styles.businessInfo}>
              <div className={styles.dataLabel}>Entity: {business.id}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-warm)' }}>{business.name}</h3>
                <span className={styles.arabic} style={{ fontSize: '1rem', color: 'var(--brand-gold)' }}>{business.name_ar}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                {business.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }} className={styles.mono}>
                <MapPin size={14} />
                <span>{cities.find(c => c.id === business.city_id)?.name} / NODE_{business.city_id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedBusiness) return null;
    return (
      <div className={styles.container} style={{ maxWidth: '1100px' }}>
        <button 
          onClick={() => setView('list')}
          style={{ background: 'none', border: 'none', color: 'var(--brand-gold)', cursor: 'pointer', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          className={styles.mono}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          <span>Back to Query Results</span>
        </button>

        <div style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-slate)', overflow: 'hidden' }}>
          <div style={{ height: '400px', position: 'relative', borderBottom: '1px solid var(--border-slate)' }}>
            <img 
              src={selectedBusiness.image_url} 
              alt={selectedBusiness.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3)' }}
              referrerPolicy="no-referrer"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(5, 8, 10, 0.8))' }} />
          </div>
          <div style={{ padding: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
              <div>
                <div className={styles.dataLabel}>Intelligence Node: {selectedBusiness.id}</div>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-warm)', letterSpacing: '-0.03em' }}>{selectedBusiness.name}</h1>
                <h2 className={styles.arabic} style={{ fontSize: '2.5rem', color: 'var(--brand-gold)' }}>{selectedBusiness.name_ar}</h2>
              </div>
              <div className={styles.mono} style={{ border: '1px solid var(--brand-gold)', padding: '16px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'rgba(232, 197, 71, 0.05)' }}>
                <div className={styles.dataLabel} style={{ color: 'var(--brand-gold)' }}>Rating Index</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Star size={24} color="var(--brand-gold)" fill="var(--brand-gold)" />
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--brand-gold)' }}>{selectedBusiness.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '64px' }}>
              <div>
                <h3 className={styles.dataLabel}>Entity Description</h3>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-warm)', marginBottom: '32px' }}>{selectedBusiness.description}</p>
                <p className={styles.arabic} style={{ fontSize: '1.5rem', lineHeight: '1.8', color: 'var(--brand-gold)' }}>{selectedBusiness.description_ar}</p>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '40px', border: '1px solid var(--border-slate)' }}>
                <h3 className={styles.dataLabel}>Communication Channels</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <MapPin size={20} color="var(--accent-teal)" />
                    <div>
                      <div className={styles.dataLabel}>Location</div>
                      <p style={{ fontWeight: '600', color: 'var(--text-warm)' }}>{selectedBusiness.address}</p>
                      <p className={styles.mono} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cities.find(c => c.id === selectedBusiness.city_id)?.name} / {selectedBusiness.city_id}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Phone size={20} color="var(--accent-teal)" />
                    <div>
                      <div className={styles.dataLabel}>Direct Line</div>
                      <p className={styles.mono} style={{ fontWeight: '600', color: 'var(--text-warm)' }}>{selectedBusiness.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Globe size={20} color="var(--accent-teal)" />
                    <div>
                      <div className={styles.dataLabel}>Web Access</div>
                      <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-gold)', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid var(--brand-gold)' }}>
                        ESTABLISH CONNECTION
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={`${styles.container} ${styles.navContent}`}>
          {/* Left: Logo */}
          <div 
            className={styles.logo} 
            onClick={() => {
              setView('home');
              setSelectedCategory(null);
              setSelectedCity(null);
              setSearchQuery('');
            }}
          >
            <div className={styles.logoIcon}>
              <Compass size={22} color="var(--bg-deep)" />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoEn}>Iraq Compass</span>
              <span className={`${styles.arabic} ${styles.logoAr}`}>دليل العراق</span>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className={styles.navSearch}>
            <div className={styles.searchWrapper}>
              <Search className={styles.navSearchIcon} size={16} />
              <input 
                type="text"
                placeholder="Search name, category, city..."
                className={styles.navSearchInput}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (view !== 'list') setView('list');
                }}
              />
              {searchQuery && (
                <div className={styles.searchBadge}>
                  {filteredBusinesses.length}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions & Mobile Toggle */}
          <div className={styles.navActions}>
            <div className={styles.desktopActions}>
              <button 
                className={styles.langToggle}
                onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}
              >
                <Globe2 size={16} />
                <span>{language}</span>
              </button>
              <button className={styles.navBtn}>Login</button>
              <button className={`${styles.navBtn} ${styles.navBtnPrimary}`}>Register</button>
            </div>
            
            <button 
              className={styles.mobileToggle}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              <button 
                className={styles.mobileLangToggle}
                onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}
              >
                <Globe2 size={18} />
                <span>Language: {language}</span>
              </button>
              <button className={styles.mobileMenuBtn}>Login</button>
              <button className={`${styles.mobileMenuBtn} ${styles.mobileMenuBtnPrimary}`}>Register</button>
              <div className={styles.mobileNavLinks}>
                <button onClick={() => { setView('home'); setIsMenuOpen(false); }}>Dashboard</button>
                <button onClick={() => { setView('list'); setSelectedCategory(null); setIsMenuOpen(false); }}>Database</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ padding: '40px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ color: '#999' }}>Loading Iraq Compass...</p>
          </div>
        ) : (
          <div>
            {view === 'home' && renderHome()}
            {view === 'list' && renderList()}
            {view === 'detail' && renderDetail()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div>
            <div className={styles.logo} style={{ marginBottom: '32px' }}>
              <div className={styles.logoIcon}>
                <LayoutGrid size={16} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-warm)', textTransform: 'uppercase' }}>Iraq Compass</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.8' }} className={styles.mono}>
              SECURE ACCESS PROTOCOL V2.0.1<br />
              ENCRYPTED DIRECTORY SERVICES FOR THE REPUBLIC OF IRAQ.
            </p>
          </div>
          
          <div>
            <h4 className={styles.mono} style={{ marginBottom: '32px', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-warm)' }}>Access Nodes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }} className={styles.mono}>
              <span style={{ cursor: 'pointer' }} onClick={() => setView('home')}>01. DASHBOARD</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setView('list')}>02. DATABASE</span>
              <span>03. PROTOCOLS</span>
              <span>04. SUPPORT</span>
            </div>
          </div>

          <div>
            <h4 className={styles.mono} style={{ marginBottom: '32px', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-warm)' }}>Data Feed</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '20px' }} className={styles.mono}>SUBSCRIBE TO INTELLIGENCE UPDATES.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="email" 
                placeholder="USER@NETWORK" 
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-slate)', padding: '10px 16px', borderRadius: '4px', color: 'var(--text-warm)', flex: 1, outline: 'none', fontSize: '12px' }}
                className={styles.mono}
              />
              <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '10px 16px' }}>SYNC</button>
            </div>
          </div>
        </div>
        <div className={styles.container} style={{ marginTop: '100px', paddingTop: '40px', borderTop: '1px solid var(--border-slate)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <p className={styles.mono}>© 2026 IRAQ COMPASS — SECURITY CLEARANCE REQUIRED. ALL DATA ENCRYPTED.</p>
        </div>
      </footer>
    </div>
  );
}
