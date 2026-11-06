import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { DEMO_ACCOUNTS } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tb_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo user for instant interactive testing: Rahul (1st Year)
    return {
      id: 'usr-first-1',
      full_name: 'Rahul Gupta',
      email: 'rahul.firstyear@nitw.ac.in',
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      role: 'first_year',
      college_name: 'National Institute of Technology (NIT)',
      academic_year: 1,
      branch: 'Computer Science and Engineering',
      skills: ['C Language', 'HTML5', 'Basic Python'],
      interests: ['Where to Start Programming', 'Finding Right Mentor'],
      is_verified: true,
      verification_status: 'approved'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('tb_token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tb_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('tb_token', token);
    } else {
      localStorage.removeItem('tb_token');
    }
  }, [token]);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Switch demo account (Allows instant role-switching for testing Admin, Placed Graduate, 1st Year, etc.)
  const switchDemoAccount = async (accountId) => {
    const demo = DEMO_ACCOUNTS.find(a => a.id === accountId);
    if (!demo) return;

    try {
      // Fetch full profile from backend
      const res = await api.get(`/users/${demo.id}`);
      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        setToken(`mock-token-${demo.id}`);
        return;
      }
    } catch (e) {
      // Fallback local construct
    }

    const fallbackUser = {
      id: demo.id,
      full_name: demo.name,
      email: demo.email,
      avatar_url: demo.avatar,
      role: demo.role,
      college_name: 'National Institute of Technology (NIT)',
      academic_year: demo.role === 'first_year' ? 1 : 4,
      branch: 'Computer Science and Engineering',
      placed_company: demo.role === 'placed_graduate' ? 'Google' : null,
      is_verified: true,
      verification_status: 'approved'
    };
    setUser(fallbackUser);
    setToken(`mock-token-${demo.id}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tb_user');
    localStorage.removeItem('tb_token');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates);
      if (res.data?.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const submitVerification = async (docs) => {
    try {
      const res = await api.post('/auth/verify', docs);
      if (res.data?.success) {
        setUser(prev => ({ ...prev, verification_status: 'pending' }));
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchDemoAccount,
      updateProfile,
      submitVerification,
      isAdmin: user?.role === 'admin',
      isPlacedSenior: user?.role === 'placed_graduate',
      isSenior: ['third_year', 'final_year', 'placed_graduate'].includes(user?.role)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

