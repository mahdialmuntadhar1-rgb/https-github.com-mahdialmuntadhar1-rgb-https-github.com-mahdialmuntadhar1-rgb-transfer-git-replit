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
  Globe2,
  Mail,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Lock,
  UserPlus,
  ShieldCheck,
  Loader2,
  Home,
  ListChecks,
  PlusSquare,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Eye as EyeIcon,
  MousePointer2,
  Users,
  Pencil,
  Trash2,
  Filter
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
  email?: string;
  website: string;
  rating: number;
  image_url: string;
  opening_hours?: string;
  is_verified?: boolean;
  owner_id?: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
  icon: string;
  color?: string;
}

interface City {
  id: string;
  name: string;
  name_ar: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Restaurants', name_ar: 'مطاعم', icon: '🍽️', color: 'rgba(239, 68, 68, 0.1)' },
  { id: '2', name: 'Cafes', name_ar: 'مقاهي', icon: '☕', color: 'rgba(120, 113, 108, 0.1)' },
  { id: '3', name: 'Hotels', name_ar: 'فنادق', icon: '🏨', color: 'rgba(59, 130, 246, 0.1)' },
  { id: '4', name: 'Healthcare', name_ar: 'صحة', icon: '🏥', color: 'rgba(16, 185, 129, 0.1)' },
  { id: '5', name: 'Pharmacies', name_ar: 'صيدليات', icon: '💊', color: 'rgba(245, 158, 11, 0.1)' },
  { id: '6', name: 'Education', name_ar: 'تعليم', icon: '🎓', color: 'rgba(139, 92, 246, 0.1)' },
  { id: '7', name: 'Shopping', name_ar: 'تسوق', icon: '🛍️', color: 'rgba(236, 72, 153, 0.1)' },
  { id: '8', name: 'Technology', name_ar: 'تقنية', icon: '💻', color: 'rgba(6, 182, 212, 0.1)' },
  { id: '9', name: 'Banks', name_ar: 'بنوك', icon: '🏦', color: 'rgba(71, 85, 105, 0.1)' },
  { id: '10', name: 'Construction', name_ar: 'إنشاءات', icon: '🏗️', color: 'rgba(217, 119, 6, 0.1)' },
  { id: '11', name: 'Transport', name_ar: 'نقل', icon: '🚗', color: 'rgba(107, 114, 128, 0.1)' },
  { id: '12', name: 'Beauty', name_ar: 'تجميل', icon: '💇', color: 'rgba(219, 39, 119, 0.1)' },
  { id: '13', name: 'Fitness', name_ar: 'رياضة', icon: '💪', color: 'rgba(34, 197, 94, 0.1)' },
  { id: '14', name: 'Legal', name_ar: 'قانوني', icon: '⚖️', color: 'rgba(79, 70, 229, 0.1)' },
  { id: '15', name: 'Media', name_ar: 'إعلام', icon: '📡', color: 'rgba(244, 63, 94, 0.1)' },
  { id: '16', name: 'Other', name_ar: 'أخرى', icon: '🏢', color: 'rgba(100, 116, 139, 0.1)' },
];

const MOCK_CITIES: City[] = [
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
];

export default function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<'home' | 'list' | 'detail' | 'register' | 'login' | 'dashboard'>('home');
  const [dashboardSection, setDashboardSection] = useState<'overview' | 'listings' | 'add' | 'analytics' | 'settings'>('overview');
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [dashboardStatusFilter, setDashboardStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [dashboardCategoryFilter, setDashboardCategoryFilter] = useState('all');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Form State for Add/Edit Business
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    category_id: MOCK_CATEGORIES[0].id,
    city_id: MOCK_CITIES[0].id,
    phone: '',
    email: '',
    website: '',
    address: '',
    description: '',
    description_ar: '',
    opening_hours: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
  const [loginError, setLoginError] = useState('');
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    businessName: '',
    role: 'User'
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateRegField = (name: string, value: string) => {
    let error = '';
    if (name === 'fullName' && value.length > 0 && value.length < 3) error = 'Name too short';
    if (name === 'email' && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email';
    if (name === 'password' && value.length > 0 && value.length < 8) error = 'Min 8 characters';
    if (name === 'confirmPassword' && value.length > 0 && value !== regForm.password) error = 'Passwords do not match';
    if (name === 'phone' && value.length > 0 && !/^\+?[\d\s-]{10,}$/.test(value)) error = 'Invalid phone';
    if (name === 'city' && !value) error = 'Required';
    
    setRegErrors(prev => ({ ...prev, [name]: error }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score: 60, label: 'Medium', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const isRegFormValid = () => {
    const requiredFields = ['fullName', 'email', 'password', 'confirmPassword', 'phone', 'city'];
    const hasAllFields = requiredFields.every(f => regForm[f as keyof typeof regForm].length > 0);
    const hasNoErrors = Object.values(regErrors).every(e => !e);
    return hasAllFields && hasNoErrors;
  };

  const isBusinessOwner = user?.user_metadata?.role === 'Business Owner';

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegFormValid()) {
      setAuthLoading(true);
      try {
        const { error } = await supabase.auth.signUp({
          email: regForm.email,
          password: regForm.password,
          options: {
            data: {
              full_name: regForm.fullName,
              phone: regForm.phone,
              city: regForm.city,
              role: regForm.role,
              business_name: regForm.businessName
            }
          }
        });

        if (error) throw error;

        setRegistrationSuccess(true);
        setTimeout(() => {
          setRegistrationSuccess(false);
          setView('home');
        }, 3000);
      } catch (error: any) {
        alert(error.message || 'Registration failed');
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;
      
      setView('home');
    } catch (error: any) {
      setLoginError(error.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('home');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    setImagePreview(business.image_url);
    setDashboardSection('add');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setFormLoading(true);
    setFormError(null);

    try {
      let finalImageUrl = formData.image_url;

      // 1. Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `business-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      const businessData = {
        ...formData,
        image_url: finalImageUrl,
        owner_id: user.id,
        rating: 0,
        is_verified: false // New listings are pending by default
      };

      if (editingBusinessId) {
        const { error } = await supabase
          .from('businesses')
          .update(businessData)
          .eq('id', editingBusinessId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('businesses')
          .insert([businessData]);
        
        if (error) throw error;
      }

      // Reset form and refresh data
      setDashboardSection('listings');
      setEditingBusinessId(null);
      setFormData({
        name: '',
        name_ar: '',
        category_id: MOCK_CATEGORIES[0].id,
        city_id: MOCK_CITIES[0].id,
        phone: '',
        email: '',
        website: '',
        address: '',
        description: '',
        description_ar: '',
        opening_hours: '',
        image_url: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Refresh businesses
      const { data } = await supabase.from('businesses').select('*');
      if (data) setBusinesses(data);

    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setBusinesses(businesses.filter(b => b.id !== id));
    } catch (error: any) {
      alert('Error deleting business: ' + error.message);
    }
  };
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedCity]);

  const resultsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'list' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage, view]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setLoadingProgress(0);

      // 1. Fetch Categories & Cities (Standard)
      const { data: catData } = await supabase.from('categories').select('*');
      const { data: cityData } = await supabase.from('cities').select('*');
      
      if (catData && catData.length > 0) {
        setCategories(catData);
      } else {
        setCategories(MOCK_CATEGORIES);
      }

      if (cityData && cityData.length > 0) {
        setCities(cityData);
      } else {
        setCities(MOCK_CITIES);
      }

      // 2. Auto-detect Table Name
      const tableNames = ['businesses', 'listings', 'companies', 'directory', 'places'];
      let activeTable = '';
      
      for (const name of tableNames) {
        try {
          const { data, error } = await supabase.from(name).select('*').limit(1);
          if (!error && data) {
            activeTable = name;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!activeTable) {
        console.warn('No business table detected in Supabase. Using mock data.');
        // Fallback to mock data
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
            email: 'info@almansour.iq',
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
            category_id: '3',
            city_id: '4',
            address: 'Gulan Street, Erbil',
            phone: '+964 66 210 5555',
            email: 'erbil@rotana.com',
            website: 'https://rotana.com',
            rating: 4.9,
            image_url: 'https://picsum.photos/seed/hotel/800/600',
            created_at: new Date().toISOString()
          }
        ]);
        return;
      }

      // 3. Auto-detect Field Names (Mapping)
      const { data: sample } = await supabase.from(activeTable).select('*').limit(1);
      const fields = sample?.[0] ? Object.keys(sample[0]) : [];
      
      const mapField = (candidates: string[]) => 
        candidates.find(c => fields.includes(c)) || candidates[0];

      const fieldMap = {
        name: mapField(['name', 'title', 'business_name', 'company_name']),
        name_ar: mapField(['name_ar', 'title_ar', 'arabic_name']),
        category: mapField(['category_id', 'category', 'sector']),
        city: mapField(['city_id', 'city', 'governorate', 'location']),
        phone: mapField(['phone', 'telephone', 'contact', 'mobile']),
        address: mapField(['address', 'location_details', 'street']),
        description: mapField(['description', 'about', 'info', 'bio']),
        description_ar: mapField(['description_ar', 'about_ar', 'arabic_description']),
        email: mapField(['email', 'contact_email']),
        website: mapField(['website', 'url', 'site', 'link']),
        image_url: mapField(['image_url', 'photo', 'image', 'cover_photo']),
        rating: mapField(['rating', 'stars', 'score'])
      };

      // 4. Batch Fetching (1,000 records at a time)
      let allBusinesses: Business[] = [];
      let offset = 0;
      let hasMore = true;
      const batchSize = 1000;

      while (hasMore) {
        const { data, error } = await supabase
          .from(activeTable)
          .select('*')
          .range(offset, offset + batchSize - 1);

        if (error || !data || data.length === 0) {
          hasMore = false;
        } else {
          const mappedData = data.map((item: any) => ({
            id: item.id || String(Math.random()),
            name: item[fieldMap.name] || '',
            name_ar: item[fieldMap.name_ar] || '',
            description: item[fieldMap.description] || '',
            description_ar: item[fieldMap.description_ar] || '',
            category_id: item[fieldMap.category] || '',
            city_id: item[fieldMap.city] || '',
            address: item[fieldMap.address] || '',
            phone: item[fieldMap.phone] || '',
            website: item[fieldMap.website] || '',
            rating: Number(item[fieldMap.rating]) || 0,
            image_url: item[fieldMap.image_url] || '',
            created_at: item.created_at || new Date().toISOString()
          }));

          allBusinesses = [...allBusinesses, ...mappedData];
          offset += batchSize;
          setLoadingProgress(allBusinesses.length);
          
          if (data.length < batchSize) {
            hasMore = false;
          }
        }
      }

      setBusinesses(allBusinesses);

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
      b.description.toLowerCase().includes(searchLower) ||
      b.description_ar.includes(searchQuery) ||
      b.address.toLowerCase().includes(searchLower) ||
      b.phone.includes(searchQuery) ||
      b.website.toLowerCase().includes(searchLower) ||
      (category?.name.toLowerCase().includes(searchLower) ?? false) ||
      (category?.name_ar.includes(searchQuery) ?? false) ||
      (city?.name.toLowerCase().includes(searchLower) ?? false) ||
      (city?.name_ar.includes(searchQuery) ?? false);
      
    const matchesCategory = !selectedCategory || b.category_id === selectedCategory;
    const matchesCity = !selectedCity || b.city_id === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

  const toArabicNumbers = (num: number | string) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/\d/g, (d) => arabicNumbers[parseInt(d)]);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBusiness(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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

      {/* Categories Grid Section */}
      <section id="directory">
        <div className={styles.sectionTitle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.dataLabel}>Sector Analysis</span>
            <h2 className={styles.categoryHeading}>Browse by Category</h2>
          </div>
          <span className={styles.arabic} style={{ fontSize: '1.5rem', color: 'var(--brand-gold)', fontWeight: 'bold' }}>تصفح حسب الفئة</span>
        </div>
        
        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const count = businesses.filter(b => 
              b.category_id === cat.id && 
              (!selectedCity || b.city_id === selectedCity)
            ).length;
            
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setView('list');
                }}
                className={styles.categoryTile}
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <div className={styles.categoryIconWrapper}>
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                </div>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryNameAr}>{cat.name_ar}</span>
                  <span className={styles.categoryNameEn}>{cat.name}</span>
                </div>
                <div className={styles.categoryBadge}>
                  {count}
                </div>
              </div>
            );
          })}
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

  const renderList = () => {
    const startIdx = (currentPage - 1) * itemsPerPage + 1;
    const endIdx = Math.min(currentPage * itemsPerPage, filteredBusinesses.length);

    return (
      <div className={styles.container} ref={resultsRef}>
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
              <div className={styles.dataLabel} style={{ direction: 'rtl', fontSize: '14px', color: 'var(--brand-gold)' }}>
                عرض {toArabicNumbers(startIdx)}-{toArabicNumbers(endIdx)} من {toArabicNumbers(filteredBusinesses.length)} نتيجة
              </div>
              <span className={`${styles.mono}`} style={{ fontSize: '1.25rem', color: 'var(--text-warm)' }}>
                {filteredBusinesses.length.toString().padStart(3, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.businessGrid}>
        {paginatedBusinesses.map((business) => {
          const category = categories.find(c => c.id === business.category_id);
          const city = cities.find(c => c.id === business.city_id);
          
          return (
            <div
              key={business.id}
              className={styles.postcardCard}
              onClick={() => handleBusinessClick(business)}
            >
              <div 
                className={styles.categoryStripe} 
                style={{ background: category?.color || 'var(--brand-gold)' }} 
              />
              <div className={styles.postcardContent}>
                <div className={styles.postcardTag}>
                  <span>{category?.icon}</span>
                  <span>{category?.name}</span>
                </div>
                
                <h3 className={styles.postcardTitle}>{business.name}</h3>
                
                <div className={styles.postcardMeta}>
                  <div className={styles.postcardLink}>
                    <MapPin size={14} color="var(--brand-gold)" />
                    <span>{city?.name}</span>
                  </div>
                  
                  <a 
                    href={`tel:${business.phone}`} 
                    className={styles.postcardLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone size={14} color="var(--brand-gold)" />
                    <span>{business.phone}</span>
                  </a>

                  {business.email && (
                    <a 
                      href={`mailto:${business.email}`} 
                      className={styles.postcardLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail size={14} color="var(--brand-gold)" />
                      <span>{business.email}</span>
                    </a>
                  )}

                  {business.website && (
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.postcardLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe size={14} color="var(--brand-gold)" />
                      <span>{business.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink size={10} style={{ marginLeft: '4px', opacity: 0.5 }} />
                    </a>
                  )}
                </div>

                <div className={styles.postcardFooter}>
                  <div className={styles.viewDetails}>
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </div>
                  <div className={styles.viewDetails} style={{ direction: 'rtl' }}>
                    <span>عرض التفاصيل</span>
                    <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className={styles.pageBtn}
          >
            ← Previous
          </button>
          
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>·</span>
          
          <div className={styles.pageNumbers}>
            {getPageNumbers().map((page, idx) => (
              <React.Fragment key={idx}>
                <button
                  className={`${styles.pageNumber} ${currentPage === page ? styles.pageNumberActive : ''} ${page === '...' ? styles.pageEllipsis : ''}`}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                >
                  {page}
                </button>
                {idx < getPageNumbers().length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>·</span>}
              </React.Fragment>
            ))}
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>·</span>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className={styles.pageBtn}
          >
            Next →
          </button>
        </div>
      )}
    </div>
    );
  };

  const renderDashboard = () => {
    if (!user || !isBusinessOwner) {
      setView('home');
      return null;
    }

    const sidebarItems = [
      { id: 'overview', label: 'Overview', icon: <Home size={20} />, labelAr: 'نظرة عامة' },
      { id: 'listings', label: 'My Listings', icon: <ListChecks size={20} />, labelAr: 'قوائمي' },
      { id: 'add', label: 'Add Business', icon: <PlusSquare size={20} />, labelAr: 'إضافة عمل' },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, labelAr: 'التحليلات' },
      { id: 'settings', label: 'Settings', icon: <Settings size={20} />, labelAr: 'الإعدادات' },
    ];

    return (
      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={styles.dashboardSidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarLogo}>
              <Compass size={24} color="var(--brand-gold)" />
              <span>OWNER PORTAL</span>
            </div>
          </div>
          
          <nav className={styles.sidebarNav}>
            {sidebarItems.map(item => (
              <button
                key={item.id}
                className={`${styles.sidebarItem} ${dashboardSection === item.id ? styles.sidebarItemActive : ''}`}
                onClick={() => setDashboardSection(item.id as any)}
              >
                {item.icon}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{item.label}</span>
                  <span style={{ fontSize: '10px', opacity: 0.6 }} className={styles.arabic}>{item.labelAr}</span>
                </div>
              </button>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.sidebarLogout} onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.dashboardContent}>
          <header className={styles.dashboardHeader}>
            <div className={styles.dashboardTitleGroup}>
              <h1 className={styles.dashboardTitle}>
                {sidebarItems.find(i => i.id === dashboardSection)?.label}
              </h1>
              <p className={styles.dashboardSubtitle}>
                Welcome back, {user.user_metadata?.full_name || 'Owner'}
              </p>
            </div>
            <div className={styles.dashboardHeaderActions}>
              <div className={styles.statusBadge}>
                <div className={styles.statusDot} />
                <span>SYSTEM ONLINE</span>
              </div>
            </div>
          </header>

          <div className={styles.dashboardScrollArea}>
            {dashboardSection === 'overview' && (
              <div className={styles.overviewGrid}>
                {/* Stats Cards */}
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <Building2 size={20} color="var(--brand-gold)" />
                    <span>Total Listings</span>
                  </div>
                  <div className={styles.statValue}>1</div>
                  <div className={styles.statTrend} style={{ color: 'var(--text-muted)' }}>
                    <span>Active nodes in network</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <EyeIcon size={20} color="var(--brand-gold)" />
                    <span>Views (This Month)</span>
                  </div>
                  <div className={styles.statValue}>1,284</div>
                  <div className={styles.statTrend}>
                    <TrendingUp size={14} />
                    <span>+12.5% vs last month</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <Phone size={20} color="var(--brand-gold)" />
                    <span>Phone Clicks</span>
                  </div>
                  <div className={styles.statValue}>84</div>
                  <div className={styles.statTrend}>
                    <TrendingUp size={14} />
                    <span>+3.1% vs last month</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <CheckCircle2 size={20} color="var(--brand-gold)" />
                    <span>Profile Completeness</span>
                  </div>
                  <div className={styles.statValue}>85%</div>
                  <div className={styles.statTrend} style={{ color: '#f59e0b' }}>
                    <span>Add website to reach 100%</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className={styles.dashboardSectionCard} style={{ gridColumn: 'span 4' }}>
                  <h3 className={styles.cardTitle}>Recent Activity Feed</h3>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <EyeIcon size={14} />
                      </div>
                      <div className={styles.activityDetails}>
                        <p>New view on <strong>Al-Mansour Restaurant</strong> from Baghdad</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <Phone size={14} />
                      </div>
                      <div className={styles.activityDetails}>
                        <p>Phone number revealed by user in Erbil</p>
                        <span>5 hours ago</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon} style={{ background: 'rgba(232, 197, 71, 0.1)', color: 'var(--brand-gold)' }}>
                        <CheckCircle2 size={14} />
                      </div>
                      <div className={styles.activityDetails}>
                        <p>Business profile updated: Added new photos</p>
                        <span>Yesterday at 14:20</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <AlertCircle size={14} />
                      </div>
                      <div className={styles.activityDetails}>
                        <p>System Alert: Monthly intelligence report available</p>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dashboardSection === 'listings' && (
              <div className={styles.dashboardSectionCard}>
                <div className={styles.dashboardSectionHeader}>
                  <div className={styles.dashboardTitleGroup}>
                    <h3 className={styles.cardTitle}>My Business Nodes</h3>
                    <p className={styles.dashboardSubtitle}>Manage and monitor your registered entities</p>
                  </div>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setDashboardSection('add')}>
                    <PlusSquare size={16} />
                    <span>Add New Node</span>
                  </button>
                </div>

                <div className={styles.dashboardFilters}>
                  <div className={styles.dashboardSearchBox}>
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search your listings..." 
                      value={dashboardSearch}
                      onChange={(e) => setDashboardSearch(e.target.value)}
                    />
                  </div>
                  <div className={styles.dashboardFilterGroup}>
                    <div className={styles.filterSelect}>
                      <Filter size={14} />
                      <select 
                        value={dashboardStatusFilter}
                        onChange={(e) => setDashboardStatusFilter(e.target.value as any)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div className={styles.filterSelect}>
                      <LayoutGrid size={14} />
                      <select 
                        value={dashboardCategoryFilter}
                        onChange={(e) => setDashboardCategoryFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.listingsTableWrapper}>
                  <div className={styles.listingsTable}>
                    <div className={styles.tableHeader}>
                      <span>Business Name</span>
                      <span>Category</span>
                      <span>City</span>
                      <span>Status</span>
                      <span>Views</span>
                      <span style={{ textAlign: 'right' }}>Actions</span>
                    </div>
                    
                    {/* Filtered Listings Logic */}
                    {businesses
                      .filter(b => {
                        // In a real app, we'd filter by owner_id here
                        // For demo, we show all but filter by search/status/category
                        const matchesSearch = b.name.toLowerCase().includes(dashboardSearch.toLowerCase()) || 
                                            b.name_ar.includes(dashboardSearch);
                        const matchesStatus = dashboardStatusFilter === 'all' || 
                                            (dashboardStatusFilter === 'active' && b.is_verified) ||
                                            (dashboardStatusFilter === 'pending' && !b.is_verified);
                        const matchesCategory = dashboardCategoryFilter === 'all' || b.category_id === dashboardCategoryFilter;
                        
                        return matchesSearch && matchesStatus && matchesCategory;
                      })
                      .map(b => (
                        <div key={b.id} className={styles.tableRow}>
                          <div className={styles.tableNameCell}>
                            <div className={styles.tableAvatar}>{b.name[0]}</div>
                            <div className={styles.tableNameGroup}>
                              <span className={styles.tableNameEn}>{b.name}</span>
                              <span className={styles.tableNameAr}>{b.name_ar}</span>
                            </div>
                          </div>
                          <span className={styles.tableCategory}>
                            {categories.find(c => c.id === b.category_id)?.name}
                          </span>
                          <span className={styles.tableCity}>
                            {cities.find(c => c.id === b.city_id)?.name}
                          </span>
                          <div className={styles.tableStatus}>
                            <span className={b.is_verified ? styles.badgeActive : styles.badgePending}>
                              {b.is_verified ? 'Active' : 'Pending'}
                            </span>
                          </div>
                          <span className={styles.tableViews}>1,284</span>
                          <div className={styles.tableActions}>
                            <button 
                              className={styles.iconBtn} 
                              title="Edit Node"
                              onClick={() => handleEdit(b)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              className={`${styles.iconBtn} ${styles.iconBtnDelete}`} 
                              title="Delete Node"
                              onClick={() => handleDelete(b.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {dashboardSection === 'add' && (
              <div className={styles.formContainer}>
                <div className={styles.dashboardSectionCard} style={{ flex: 1 }}>
                  <h3 className={styles.cardTitle}>
                    {editingBusinessId ? 'Update Intelligence Node' : 'Initialize New Node'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
                    {editingBusinessId 
                      ? 'Modify the parameters of an existing entity in the network.' 
                      : 'Register a new business entity in the Iraq Compass intelligence network.'}
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Business Name (EN)</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="e.g. Baghdad Tech Hub" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Business Name (AR)</label>
                        <input 
                          type="text" 
                          className={`${styles.formInput} ${styles.arabic}`} 
                          placeholder="مثال: مركز بغداد للتقنية" 
                          value={formData.name_ar}
                          onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Category</label>
                        <select 
                          className={styles.formInput}
                          value={formData.category_id}
                          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>City</label>
                        <select 
                          className={styles.formInput}
                          value={formData.city_id}
                          onChange={(e) => setFormData({...formData, city_id: e.target.value})}
                        >
                          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Phone Number</label>
                        <input 
                          type="tel" 
                          className={styles.formInput} 
                          placeholder="+964..." 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email Address</label>
                        <input 
                          type="email" 
                          className={styles.formInput} 
                          placeholder="contact@business.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Website URL</label>
                        <input 
                          type="url" 
                          className={styles.formInput} 
                          placeholder="https://..." 
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Physical Address</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="Street, District, Near..." 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.formLabel}>Description (EN)</label>
                        <textarea 
                          className={styles.formInput} 
                          style={{ height: '100px', resize: 'none' }}
                          placeholder="Tell us about your business..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.formLabel}>Description (AR)</label>
                        <textarea 
                          className={`${styles.formInput} ${styles.arabic}`} 
                          style={{ height: '100px', resize: 'none' }}
                          placeholder="أخبرنا عن عملك..."
                          value={formData.description_ar}
                          onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Opening Hours</label>
                        <input 
                          type="text" 
                          className={styles.formInput} 
                          placeholder="e.g. 9:00 AM - 10:00 PM" 
                          value={formData.opening_hours}
                          onChange={(e) => setFormData({...formData, opening_hours: e.target.value})}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Business Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className={styles.formInput} 
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    {formError && (
                      <div className={styles.errorMsg} style={{ marginTop: '20px' }}>
                        {formError}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                      <button 
                        type="submit"
                        className={`${styles.btn} ${styles.btnPrimary}`} 
                        style={{ width: '200px' }}
                        disabled={formLoading}
                      >
                        {formLoading ? <Loader2 className={styles.spinner} size={16} /> : (editingBusinessId ? 'UPDATE NODE' : 'DEPLOY NODE')}
                      </button>
                      <button 
                        type="button"
                        className={`${styles.btn} ${styles.btnOutline}`}
                        onClick={() => {
                          setDashboardSection('listings');
                          setEditingBusinessId(null);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Preview */}
                <div className={styles.previewContainer}>
                  <h4 className={styles.previewTitle}>Live Intelligence Preview</h4>
                  <div className={styles.card} style={{ width: '100%', margin: 0 }}>
                    <div className={styles.cardImageContainer}>
                      <img 
                        src={imagePreview || 'https://picsum.photos/seed/business/800/600'} 
                        alt="Preview" 
                        className={styles.cardImage}
                        referrerPolicy="no-referrer"
                      />
                      <div className={styles.cardBadge}>
                        {categories.find(c => c.id === formData.category_id)?.icon} {categories.find(c => c.id === formData.category_id)?.name}
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitleText}>{formData.name || 'Business Name'}</h3>
                        <div className={styles.cardRating}>
                          <Star size={14} fill="var(--brand-gold)" color="var(--brand-gold)" />
                          <span>0.0</span>
                        </div>
                      </div>
                      <p className={styles.cardDescription}>
                        {formData.description || 'Business description will appear here...'}
                      </p>
                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <MapPin size={14} />
                          <span>{cities.find(c => c.id === formData.city_id)?.name}, {formData.address || 'Address'}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Clock size={14} />
                          <span>{formData.opening_hours || 'Opening Hours'}</span>
                        </div>
                      </div>
                      <button className={styles.cardBtn}>
                        VIEW INTELLIGENCE
                      </button>
                    </div>
                  </div>
                  <div className={styles.previewNote}>
                    <AlertCircle size={14} />
                    <span>This is how your business will appear in the network.</span>
                  </div>
                </div>
              </div>
            )}

            {dashboardSection === 'analytics' && (
              <div className={styles.dashboardSectionCard}>
                <h3 className={styles.cardTitle}>Network Intelligence</h3>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--border-slate)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <BarChart3 size={48} color="var(--brand-gold)" style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Detailed analytics engine initializing...</p>
                  </div>
                </div>
              </div>
            )}

            {dashboardSection === 'settings' && (
              <div className={styles.dashboardSectionCard} style={{ maxWidth: '600px' }}>
                <h3 className={styles.cardTitle}>Account Protocols</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className={styles.settingsItem}>
                    <div>
                      <h4 style={{ color: 'var(--text-warm)', marginBottom: '4px' }}>Email Notifications</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Receive weekly intelligence reports</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className={styles.settingsItem}>
                    <div>
                      <h4 style={{ color: 'var(--text-warm)', marginBottom: '4px' }}>Public Profile</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Allow others to see your owner status</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <button className={`${styles.btn} ${styles.btnDark}`} style={{ width: 'fit-content' }}>
                    Update Protocols
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderLogin = () => {
    return (
      <div className={styles.container} style={{ padding: '100px 20px' }}>
        <div className={styles.registerContainer}>
          <div className={styles.registerHeader}>
            <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(232, 197, 71, 0.1)', borderRadius: '50%', marginBottom: '20px', color: 'var(--brand-gold)' }}>
              <Lock size={32} />
            </div>
            <h2 className={styles.registerTitle}>Secure Login</h2>
            <p className={styles.registerSubtitle}>Enter your credentials to access the network</p>
          </div>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '4px', marginBottom: '24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>البريد الإلكتروني Email Address</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="email" 
                  placeholder="user@network.iq"
                  className={styles.formInput}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>كلمة المرور Password</label>
              <div className={styles.inputWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  className={styles.formInput}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
                <button 
                  type="button"
                  className={styles.validationIcon} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                />
                تذكرني / Remember Me
              </label>
              <span style={{ fontSize: '13px', color: 'var(--brand-gold)', cursor: 'pointer' }}>Forgot Password?</span>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={authLoading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {authLoading ? <Loader2 className={styles.spinner} size={20} /> : 'AUTHENTICATE'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            New to the network? <span style={{ color: 'var(--brand-gold)', cursor: 'pointer' }} onClick={() => setView('register')}>Create Account</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRegister = () => {
    const strength = getPasswordStrength(regForm.password);
    
    return (
      <div className={styles.container} style={{ padding: '60px 20px' }}>
        <div className={styles.registerContainer}>
          <div className={styles.registerHeader}>
            <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(232, 197, 71, 0.1)', borderRadius: '50%', marginBottom: '20px', color: 'var(--brand-gold)' }}>
              <UserPlus size={32} />
            </div>
            <h2 className={styles.registerTitle}>Create Account</h2>
            <p className={styles.registerSubtitle}>Join the Iraq Compass intelligence network</p>
          </div>

          <form onSubmit={handleRegisterSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>الاسم الكامل Full Name</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  className={`${styles.formInput} ${regErrors.fullName ? styles.formInputError : regForm.fullName.length >= 3 ? styles.formInputSuccess : ''}`}
                  value={regForm.fullName}
                  onChange={(e) => {
                    setRegForm({...regForm, fullName: e.target.value});
                    validateRegField('fullName', e.target.value);
                  }}
                />
                <div className={styles.validationIcon}>
                  {regErrors.fullName ? <AlertCircle size={18} color="#ef4444" /> : regForm.fullName.length >= 3 ? <CheckCircle2 size={18} color="#10b981" /> : null}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>البريد الإلكتروني Email Address</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="email" 
                  placeholder="user@network.iq"
                  className={`${styles.formInput} ${regErrors.email ? styles.formInputError : regForm.email.includes('@') ? styles.formInputSuccess : ''}`}
                  value={regForm.email}
                  onChange={(e) => {
                    setRegForm({...regForm, email: e.target.value});
                    validateRegField('email', e.target.value);
                  }}
                />
                <div className={styles.validationIcon}>
                  {regErrors.email ? <AlertCircle size={18} color="#ef4444" /> : regForm.email.includes('@') ? <CheckCircle2 size={18} color="#10b981" /> : null}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>كلمة المرور Password</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min 8 chars"
                    className={`${styles.formInput} ${regErrors.password ? styles.formInputError : regForm.password.length >= 8 ? styles.formInputSuccess : ''}`}
                    value={regForm.password}
                    onChange={(e) => {
                      setRegForm({...regForm, password: e.target.value});
                      validateRegField('password', e.target.value);
                    }}
                  />
                  <button 
                    type="button"
                    className={styles.validationIcon} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', right: '36px' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
                  </button>
                  <div className={styles.validationIcon}>
                    {regErrors.password ? <AlertCircle size={18} color="#ef4444" /> : regForm.password.length >= 8 ? <CheckCircle2 size={18} color="#10b981" /> : null}
                  </div>
                </div>
                {regForm.password && (
                  <>
                    <div className={styles.strengthMeter}>
                      <div className={styles.strengthBar} style={{ width: `${strength.score}%`, backgroundColor: strength.color }} />
                    </div>
                    <div className={styles.strengthText} style={{ color: strength.color }}>{strength.label}</div>
                  </>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>تأكيد كلمة المرور Confirm</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Repeat password"
                    className={`${styles.formInput} ${regErrors.confirmPassword ? styles.formInputError : (regForm.confirmPassword && !regErrors.confirmPassword) ? styles.formInputSuccess : ''}`}
                    value={regForm.confirmPassword}
                    onChange={(e) => {
                      setRegForm({...regForm, confirmPassword: e.target.value});
                      validateRegField('confirmPassword', e.target.value);
                    }}
                  />
                  <div className={styles.validationIcon}>
                    {regErrors.confirmPassword ? <AlertCircle size={18} color="#ef4444" /> : (regForm.confirmPassword && !regErrors.confirmPassword) ? <CheckCircle2 size={18} color="#10b981" /> : null}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رقم الهاتف Phone Number</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="tel" 
                    placeholder="+964..."
                    className={`${styles.formInput} ${regErrors.phone ? styles.formInputError : regForm.phone.length >= 10 ? styles.formInputSuccess : ''}`}
                    value={regForm.phone}
                    onChange={(e) => {
                      setRegForm({...regForm, phone: e.target.value});
                      validateRegField('phone', e.target.value);
                    }}
                  />
                  <div className={styles.validationIcon}>
                    {regErrors.phone ? <AlertCircle size={18} color="#ef4444" /> : regForm.phone.length >= 10 ? <CheckCircle2 size={18} color="#10b981" /> : null}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>المحافظة City</label>
                <div className={styles.inputWrapper}>
                  <select 
                    className={`${styles.formInput} ${regErrors.city ? styles.formInputError : regForm.city ? styles.formInputSuccess : ''}`}
                    value={regForm.city}
                    onChange={(e) => {
                      setRegForm({...regForm, city: e.target.value});
                      validateRegField('city', e.target.value);
                    }}
                    style={{ appearance: 'none' }}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  <div className={styles.validationIcon}>
                    {regErrors.city ? <AlertCircle size={18} color="#ef4444" /> : regForm.city ? <CheckCircle2 size={18} color="#10b981" /> : null}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>الدور Role</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  className={`${styles.btn} ${regForm.role === 'User' ? styles.btnPrimary : styles.btnDark}`}
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => setRegForm({...regForm, role: 'User'})}
                >
                  User / مستخدم
                </button>
                <button 
                  type="button"
                  className={`${styles.btn} ${regForm.role === 'Business Owner' ? styles.btnPrimary : styles.btnDark}`}
                  style={{ flex: 1, fontSize: '12px' }}
                  onClick={() => setRegForm({...regForm, role: 'Business Owner'})}
                >
                  Owner / صاحب عمل
                </button>
              </div>
            </div>

            {regForm.role === 'Business Owner' && (
              <div className={styles.formGroup} style={{ animation: 'fadeIn 0.3s ease' }}>
                <label className={styles.formLabel}>اسم العمل Business Name (Optional)</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    placeholder="Your establishment name"
                    className={styles.formInput}
                    value={regForm.businessName}
                    onChange={(e) => setRegForm({...regForm, businessName: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={!isRegFormValid() || authLoading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {authLoading ? <Loader2 className={styles.spinner} size={20} /> : 'COMPLETE REGISTRATION'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Already have clearance? <span style={{ color: 'var(--brand-gold)', cursor: 'pointer' }}>Sign In</span>
          </div>
        </div>

        {registrationSuccess && (
          <div className={styles.welcomeOverlay}>
            <div className={styles.welcomeContent}>
              <div style={{ display: 'inline-flex', padding: '24px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '32px', color: '#10b981' }}>
                <ShieldCheck size={64} />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-warm)', marginBottom: '16px' }}>Welcome, {regForm.fullName}!</h1>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: '1.6' }} className={styles.mono}>
                YOUR ACCESS PROTOCOLS HAVE BEEN INITIALIZED.<br />
                REDIRECTING TO SECURE DASHBOARD...
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderDetailModal = () => {
    if (!selectedBusiness) return null;
    const category = categories.find(c => c.id === selectedBusiness.category_id);
    const city = cities.find(c => c.id === selectedBusiness.city_id);

    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: selectedBusiness.name,
          text: selectedBusiness.description,
          url: window.location.href,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    };

    return (
      <div className={styles.modalOverlay} onClick={() => setSelectedBusiness(null)}>
        <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={() => setSelectedBusiness(null)}>
            <X size={20} />
          </button>

          <div className={styles.modalHeader}>
            <div className={styles.modalIconLarge}>
              {category?.icon}
            </div>
            <h2 className={styles.modalTitle}>{selectedBusiness.name}</h2>
            <div className={styles.modalBadge}>{category?.name}</div>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>Contact Information</h3>
            <div className={styles.contactGrid}>
              <a href={`tel:${selectedBusiness.phone}`} className={styles.contactItem}>
                <Phone size={16} color="var(--brand-gold)" />
                <span>{selectedBusiness.phone}</span>
              </a>
              {selectedBusiness.email && (
                <a href={`mailto:${selectedBusiness.email}`} className={styles.contactItem}>
                  <Mail size={16} color="var(--brand-gold)" />
                  <span>{selectedBusiness.email}</span>
                </a>
              )}
              {selectedBusiness.website && (
                <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                  <Globe size={16} color="var(--brand-gold)" />
                  <span>{selectedBusiness.website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink size={12} style={{ opacity: 0.5 }} />
                </a>
              )}
              <div className={styles.contactItem}>
                <MapPin size={16} color="var(--brand-gold)" />
                <span>{selectedBusiness.address}, {city?.name}</span>
              </div>
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBusiness.address + ', ' + city?.name + ', Iraq')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              📍 View on Map
            </a>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>Entity Profile</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Rating</span>
                <span className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} color="var(--brand-gold)" fill="var(--brand-gold)" />
                  {selectedBusiness.rating.toFixed(1)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Node ID</span>
                <span className={`${styles.infoValue} ${styles.mono}`} style={{ fontSize: '11px' }}>{selectedBusiness.id}</span>
              </div>
              <div className={styles.infoItem} style={{ gridColumn: 'span 2' }}>
                <span className={styles.infoLabel}>Description (EN)</span>
                <span className={styles.infoValue}>{selectedBusiness.description}</span>
              </div>
              <div className={styles.infoItem} style={{ gridColumn: 'span 2' }}>
                <span className={styles.infoLabel}>الوصف (AR)</span>
                <span className={`${styles.infoValue} ${styles.arabic}`} style={{ fontSize: '1.1rem' }}>{selectedBusiness.description_ar}</span>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ flex: 1 }} onClick={handleShare}>
              Share Node
            </button>
            <button className={`${styles.btn} ${styles.btnDark}`} style={{ flex: 1 }} onClick={() => setSelectedBusiness(null)}>
              Close
            </button>
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
              {user ? (
                <>
                  {isBusinessOwner && (
                    <button 
                      className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                      onClick={() => setView('dashboard')}
                    >
                      Dashboard
                    </button>
                  )}
                  <div className={styles.userBadge}>
                    <User size={14} />
                    <span>{user.email.split('@')[0]}</span>
                  </div>
                  <button className={styles.navBtn} onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button className={styles.navBtn} onClick={() => setView('login')}>Login</button>
                  <button 
                    className={`${styles.navBtn} ${styles.navBtnPrimary}`}
                    onClick={() => setView('register')}
                  >
                    Register
                  </button>
                </>
              )}
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
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className={styles.mobileUserBadge}>
                    <User size={18} />
                    <span>{user.email}</span>
                  </div>
                  {isBusinessOwner && (
                    <button 
                      className={`${styles.mobileMenuBtn} ${styles.mobileMenuBtnPrimary}`}
                      onClick={() => { setView('dashboard'); setIsMenuOpen(false); }}
                    >
                      Dashboard
                    </button>
                  )}
                  <button className={styles.mobileMenuBtn} onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <>
                  <button className={styles.mobileMenuBtn} onClick={() => { setView('login'); setIsMenuOpen(false); }}>Login</button>
                  <button 
                    className={`${styles.mobileMenuBtn} ${styles.mobileMenuBtnPrimary}`}
                    onClick={() => { setView('register'); setIsMenuOpen(false); }}
                  >
                    Register
                  </button>
                </>
              )}
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
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingText}>Initializing Intelligence Feed...</div>
            <div className={styles.loadingProgress}>
              جاري التحميل... {loadingProgress.toLocaleString()} سجل
            </div>
          </div>
        ) : (
          <div>
            {view === 'home' && renderHome()}
            {view === 'list' && renderList()}
            {view === 'register' && renderRegister()}
            {view === 'login' && renderLogin()}
            {view === 'dashboard' && renderDashboard()}
            {renderDetailModal()}
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
