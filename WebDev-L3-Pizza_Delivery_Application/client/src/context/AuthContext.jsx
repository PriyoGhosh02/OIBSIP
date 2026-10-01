import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth session on initial app load
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('pizzahub_user');
      const storedToken = localStorage.getItem('pizzahub_token');

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const res = await api.get('/auth/profile');
          if (res.data.success && res.data.user) {
            const freshUser = {
              id: res.data.user._id,
              name: res.data.user.name,
              email: res.data.user.email,
              role: res.data.user.role,
              isVerified: res.data.user.isVerified,
            };
            setUser(freshUser);
            localStorage.setItem('pizzahub_user', JSON.stringify(freshUser));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing stale auth data.');
          localStorage.removeItem('pizzahub_user');
          localStorage.removeItem('pizzahub_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Standard User Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
      localStorage.setItem('pizzahub_token', res.data.token);
    }
    return res.data;
  };

  // Separate Admin Login
  const adminLogin = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
      localStorage.setItem('pizzahub_token', res.data.token);
    }
    return res.data;
  };

  // User Registration
  const register = async (name, email, password, confirmPassword) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('pizzahub_user', JSON.stringify(res.data.user));
      if (res.data.token) {
        localStorage.setItem('pizzahub_token', res.data.token);
      }
    }
    return res.data;
  };

  // Verify Email
  const verifyEmail = async (token) => {
    const res = await api.get(`/auth/verify/${token}`);
    return res.data;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  };

  // Reset Password
  const resetPassword = async (token, password, confirmPassword) => {
    const res = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return res.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API warning:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem('pizzahub_user');
      localStorage.removeItem('pizzahub_token');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    adminLogin,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
