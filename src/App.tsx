/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Business, Category, City, View, DashboardSection } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Directory from './components/Directory';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import BusinessModal from './components/BusinessModal';
import Footer from './components/Footer';

const ITEMS_PER_PAGE = 12;

const App = () => {
  // State
  const [view, setView] = useState<View>('home');
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>('listings');
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          { data: bizData, error: bizError },
          { data: catData, error: catError },
          { data: cityData, error: cityError }
        ] = await Promise.all([
          supabase.from('businesses').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name'),
          supabase.from('cities').select('*').order('name')
        ]);

        if (bizError) throw bizError;
        if (catError) throw catError;
        if (cityError) throw cityError;

        setBusinesses(bizData || []);
        setCategories(catData || []);
        setCities(cityData || []);
      } catch (err: any) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Check Auth Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Performance Optimization: Memoized Filtered Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(biz => {
      const matchesSearch = 
        biz.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        biz.name_ar.includes(debouncedSearchQuery) ||
        biz.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        biz.description_ar.includes(debouncedSearchQuery);
      
      const matchesCategory = !selectedCategory || biz.category_id === selectedCategory;
      const matchesCity = !selectedCity || biz.city_id === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [businesses, debouncedSearchQuery, selectedCategory, selectedCity]);

  // Performance Optimization: Memoized Paginated Businesses
  const paginatedBusinesses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBusinesses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBusinesses, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE), [filteredBusinesses]);

  // Performance Optimization: Memoized Page Numbers
  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
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
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  // Handlers
  const handleLogin = useCallback(async (data: any) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      if (error) throw error;
      setView('home');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (data: any) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role
          }
        }
      });
      if (authError) throw authError;
      if (authData.user) {
        setView('home');
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setView('home');
  }, []);

  const handleBusinessSubmit = useCallback(async (data: any) => {
    if (!user) return;
    setAuthLoading(true);
    setDashboardError(null);
    try {
      if (editingBusinessId) {
        const { error } = await supabase
          .from('businesses')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', editingBusinessId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('businesses')
          .insert([{ ...data, owner_id: user.id, is_verified: false }]);
        if (error) throw error;
      }
      
      // Refresh data
      const { data: bizData } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
      setBusinesses(bizData || []);
      setDashboardSection('listings');
      setEditingBusinessId(null);
    } catch (err: any) {
      setDashboardError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }, [user, editingBusinessId]);

  const handleBusinessDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const { error } = await supabase.from('businesses').delete().eq('id', id);
      if (error) throw error;
      setBusinesses(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      console.error('Error deleting business:', err.message);
    }
  }, []);

  const scrollToDirectory = useCallback(() => {
    const el = document.getElementById('directory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        user={user} 
        onViewChange={setView} 
        onLogout={handleLogout} 
        currentView={view}
      />

      <main style={{ flex: 1 }}>
        {view === 'home' && (
          <>
            <Hero 
              onStartSearch={scrollToDirectory} 
              businessCount={businesses.length} 
            />
            <Directory 
              businesses={businesses}
              filteredBusinesses={filteredBusinesses}
              paginatedBusinesses={paginatedBusinesses}
              categories={categories}
              cities={cities}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              getPageNumbers={getPageNumbers}
              onBusinessClick={setSelectedBusiness}
              debouncedSearchQuery={debouncedSearchQuery}
              loading={loading}
            />
          </>
        )}

        {view === 'login' && (
          <Auth 
            type="login" 
            onSwitch={() => setView('register')} 
            onSubmit={handleLogin}
            loading={authLoading}
            error={authError}
          />
        )}

        {view === 'register' && (
          <Auth 
            type="register" 
            onSwitch={() => setView('login')} 
            onSubmit={handleRegister}
            loading={authLoading}
            error={authError}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard 
            section={dashboardSection}
            setSection={setDashboardSection}
            businesses={businesses}
            categories={categories}
            cities={cities}
            user={user}
            onSubmit={handleBusinessSubmit}
            onDelete={handleBusinessDelete}
            loading={authLoading}
            error={dashboardError}
            editingBusinessId={editingBusinessId}
            setEditingBusinessId={setEditingBusinessId}
          />
        )}
      </main>

      <Footer />

      {selectedBusiness && (
        <BusinessModal 
          business={selectedBusiness}
          category={categories.find(c => c.id === selectedBusiness.category_id)}
          city={cities.find(c => c.id === selectedBusiness.city_id)}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
};

export default App;
