import React, { createContext, useState, useEffect } from 'react';
import authApi from '../services/authApi';
import userApi from '../services/userApi';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'attendance_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (registrationNumber, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await authApi.login({ registrationNumber, password });
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const createdUser = await authApi.register(userData);
      setUser(createdUser);
      return createdUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Helper to switch user easily for testing or seeded accounts
   */
  const quickLogin = async (regNo) => {
    setLoading(true);
    try {
      const found = await userApi.getUserByRegistrationNumber(regNo);
      setUser(found);
      return found;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    loading,
    error,
    login,
    register,
    logout,
    quickLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
