"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export interface User {
  sub: string; // usually email or username
  id: number;
  roles: string[];
  role: string;
  name?: string;
  phone?: string;
  email?: string;
  profilePictureUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, role?: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (baseUser: User, token: string) => {
    try {
      // 1. Immediate local cache retrieval
      try {
        const cached = localStorage.getItem(`noboghat_profile_${baseUser.sub}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser((prev) => (prev ? { ...prev, ...parsed } : prev));
        }
      } catch (e) {}

      // 2. Fetch fresh profile from API
      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const updated = {
          name: data.name && !/^\d+$/.test(data.name) ? data.name : "",
          phone: data.phone || "",
          email: data.email || "",
          profilePictureUrl: data.profilePictureUrl || "",
        };
        setUser((prev) => (prev ? { ...prev, ...updated } : prev));
        try {
          localStorage.setItem(`noboghat_profile_${baseUser.sub}`, JSON.stringify(updated));
        } catch (e) {}
      }
    } catch (e) {}
  };

  useEffect(() => {
    // 1. Check URL search parameters for OAuth2 token (e.g. Google OAuth redirect)
    let token = Cookies.get('token');
    let savedRole = Cookies.get('role');

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      const urlRole = params.get('role');
      if (urlToken) {
        token = urlToken;
        savedRole = urlRole || savedRole || 'PENDING';
        Cookies.set('token', token, { expires: 7 });
        if (savedRole) Cookies.set('role', savedRole, { expires: 7 });
        try {
          localStorage.setItem('noboghatToken', token);
          localStorage.setItem('noboghatRole', savedRole);
        } catch (e) {}
        // Remove token from address bar to protect against history leakage
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        const baseUser: User = {
          sub: decoded.sub || '',
          id: decoded.id || 0,
          roles: decoded.roles || [],
          role: savedRole || decoded.role || (decoded.roles && decoded.roles[0]) || 'PENDING'
        };
        setUser(baseUser);
        fetchUserProfile(baseUser, token);
      } catch (error) {
        console.error("Failed to decode token", error);
        Cookies.remove('token');
        Cookies.remove('role');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, role?: string) => {
    Cookies.set('token', token, { expires: 7 }); // 7 days expiry
    if (role) {
      Cookies.set('role', role, { expires: 7 });
    }
    try {
      localStorage.setItem('noboghatToken', token);
      if (role) localStorage.setItem('noboghatRole', role);
    } catch (e) {}
    
    try {
      const decoded = jwtDecode<any>(token);
      const baseUser: User = {
        sub: decoded.sub || '',
        id: decoded.id || 0,
        roles: decoded.roles || [],
        role: role || decoded.role || (decoded.roles && decoded.roles[0]) || 'PENDING'
      };
      setUser(baseUser);
      fetchUserProfile(baseUser, token);
    } catch (error) {
      console.error("Invalid token on login", error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    try {
      localStorage.removeItem('noboghatToken');
      localStorage.removeItem('noboghatRole');
    } catch (e) {}
    setUser(null);
    window.location.href = '/login';
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...data };
      try {
        localStorage.setItem(`noboghat_profile_${prev.sub}`, JSON.stringify({
          name: nextUser.name,
          phone: nextUser.phone,
          email: nextUser.email,
          profilePictureUrl: nextUser.profilePictureUrl,
        }));
      } catch (e) {}
      return nextUser;
    });
  };

  const refreshUser = async () => {
    const token = Cookies.get('token');
    if (token && user) {
      await fetchUserProfile(user, token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
