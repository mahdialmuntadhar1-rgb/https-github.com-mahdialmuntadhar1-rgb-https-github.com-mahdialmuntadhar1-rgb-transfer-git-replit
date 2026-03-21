/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Mail, Lock, User, UserPlus, ShieldCheck, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  type: 'login' | 'register';
  onSwitch: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const Auth = ({ type, onSwitch, onSubmit, loading, error }: AuthProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'User',
    businessName: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8f9fa'
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
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

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 48px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '15px',
    backgroundColor: '#f8f9fa',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const submitBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    border: 'none',
    cursor: 'pointer',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.2s ease'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(232, 197, 71, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8c547', margin: '0 auto 24px auto' }}>
            {type === 'login' ? <ShieldCheck size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}>
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            {type === 'login' ? 'Access your Iraq Compass account' : 'Join the official business directory'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontSize: '14px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {type === 'register' && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name / الاسم الكامل</label>
              <div style={inputWrapperStyle}>
                <User style={{ position: 'absolute', left: '16px', color: '#666' }} size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  style={inputStyle}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address / البريد الإلكتروني</label>
            <div style={inputWrapperStyle}>
              <Mail style={{ position: 'absolute', left: '16px', color: '#666' }} size={18} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                style={inputStyle}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password / كلمة المرور</label>
            <div style={inputWrapperStyle}>
              <Lock style={{ position: 'absolute', left: '16px', color: '#666' }} size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                style={inputStyle}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button 
                type="button"
                style={{ position: 'absolute', right: '16px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {type === 'register' && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Account Type / نوع الحساب</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: formData.role === 'User' ? '#e8c547' : 'white', color: formData.role === 'User' ? '#1a1a1a' : '#666', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setFormData({...formData, role: 'User'})}
                >
                  USER / مستخدم
                </button>
                <button 
                  type="button"
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.1)', backgroundColor: formData.role === 'Business Owner' ? '#e8c547' : 'white', color: formData.role === 'Business Owner' ? '#1a1a1a' : '#666', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setFormData({...formData, role: 'Business Owner'})}
                >
                  OWNER / صاحب عمل
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            style={submitBtnStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#e8c547';
                e.currentTarget.style.color = '#1a1a1a';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = 'white';
              }
            }}
          >
            {loading ? <Loader2 className="spinner" size={20} /> : (type === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button 
            style={{ background: 'none', border: 'none', color: '#e8c547', fontWeight: 700, cursor: 'pointer', marginLeft: '8px' }}
            onClick={onSwitch}
          >
            {type === 'login' ? 'Join Now' : 'Login'}
          </button>
        </div>
      </motion.div>

      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Auth;
