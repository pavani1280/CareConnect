import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('careconnect_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.success) {
          setUser(res.user);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('careconnect_token');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('careconnect_token', res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.success) {
      localStorage.setItem('careconnect_token', res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('careconnect_token');
    setUser(null);
  };

  // Quick Demo Login Helper for Hackathon / Capstone demo evaluation
  const loginAsDemoRole = async (role) => {
    const demoEmails = {
      CUSTOMER: 'customer@careconnect.com',
      PROVIDER: 'rahul.provider@careconnect.com',
      OPERATIONS_MANAGER: 'ops@careconnect.com',
      SUPPORT_AGENT: 'support@careconnect.com',
      ADMIN: 'admin@careconnect.com',
    };
    const email = demoEmails[role] || 'customer@careconnect.com';
    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginAsDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
