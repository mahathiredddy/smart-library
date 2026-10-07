import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { storage } from './storage';
import { supabaseService, isSupabaseConfigured } from './supabase';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupabaseActive: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: { name: string; email: string; password?: string; favoriteGenre?: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  quickDemoLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_SESSION_KEY = 'ebook_current_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default to initial logged-in user Sarah Chen for instant interactive experience
    const initialUser = storage.getUserById('user-1');
    return initialUser || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_SESSION_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await supabaseService.signIn(email, password);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Authentication failed.' };
    }

    setCurrentUser(res.user);
    return { success: true, user: res.user };
  };

  const register = async (data: { name: string; email: string; password?: string; favoriteGenre?: string }): Promise<{ success: boolean; user?: User; error?: string }> => {
    const res = await supabaseService.signUp(data);
    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Registration failed.' };
    }

    setCurrentUser(res.user);
    return { success: true, user: res.user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...data };
    await supabaseService.updateUser(updated);
    setCurrentUser(updated);
  };

  const quickDemoLogin = (role: UserRole) => {
    if (role === 'admin') {
      const admin = storage.getUsers().find((u) => u.role === 'admin') || storage.getUserById('user-admin');
      if (admin) setCurrentUser(admin);
    } else {
      const user = storage.getUserById('user-1') || storage.getUsers().find((u) => u.role === 'user');
      if (user) setCurrentUser(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin',
        isSupabaseActive: isSupabaseConfigured,
        login,
        register,
        logout,
        updateProfile,
        quickDemoLogin,
      }}
    >
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
