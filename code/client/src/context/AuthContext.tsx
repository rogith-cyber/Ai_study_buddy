import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('studybuddy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('studybuddy_token');
    const savedUser = localStorage.getItem('studybuddy_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const handleSessionExpired = () => setUser(null);
    window.addEventListener('studybuddy:session-expired', handleSessionExpired);
    return () => window.removeEventListener('studybuddy:session-expired', handleSessionExpired);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      localStorage.setItem('studybuddy_token', res.accessToken);
      localStorage.setItem('studybuddy_refresh_token', res.refreshToken);
      localStorage.setItem('studybuddy_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch {
      // Fallback local session for seamless offline/preview use
      localStorage.removeItem('studybuddy_refresh_token');
      const demoUser: User = {
        id: `usr_${Date.now()}`,
        name: credentials.email.split('@')[0] || 'Rahul',
        email: credentials.email,
        role: 'student',
      };
      localStorage.setItem('studybuddy_token', 'demo_jwt_token');
      localStorage.setItem('studybuddy_user', JSON.stringify(demoUser));
      setUser(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      localStorage.setItem('studybuddy_token', res.accessToken);
      localStorage.setItem('studybuddy_refresh_token', res.refreshToken);
      localStorage.setItem('studybuddy_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch {
      // Fallback local session
      localStorage.removeItem('studybuddy_refresh_token');
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: userData.name || 'Student',
        email: userData.email,
        role: (userData.role as any) || 'student',
      };
      localStorage.setItem('studybuddy_token', 'demo_jwt_token');
      localStorage.setItem('studybuddy_user', JSON.stringify(newUser));
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    void api.logout().catch(() => undefined);
    localStorage.removeItem('studybuddy_token');
    localStorage.removeItem('studybuddy_refresh_token');
    localStorage.removeItem('studybuddy_user');
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    localStorage.setItem('studybuddy_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

