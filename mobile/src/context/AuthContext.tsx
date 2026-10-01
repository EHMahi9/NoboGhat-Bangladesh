import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, saveToken, getToken, clearToken, setUnauthorizedHandler } from '../api/client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await clearToken();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await apiClient.get<UserProfile>('/users/profile');
      setUser(response.data);
      if (response.data.role) {
        setRole(response.data.role.replace(/^ROLE_/, ''));
      }
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
    }
  };

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const data = response.data;
    if (data.token) {
      await saveToken(data.token);
      setToken(data.token);
      setRole(data.role);
      // Fetch full profile immediately
      try {
        const profileRes = await apiClient.get<UserProfile>('/users/profile', {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        setUser(profileRes.data);
      } catch {
        setUser({
          userId: 0,
          name: data.email.split('@')[0],
          phone: '',
          email: data.email,
          role: data.role,
          profilePictureUrl: '',
        });
      }
    }
    return data;
  };

  const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });

    const initAuth = async () => {
      try {
        const savedToken = await getToken();
        if (savedToken) {
          setToken(savedToken);
          const profileRes = await apiClient.get<UserProfile>('/users/profile');
          setUser(profileRes.data);
          if (profileRes.data.role) {
            setRole(profileRes.data.role.replace(/^ROLE_/, ''));
          }
        }
      } catch (error) {
        // Token expired or invalid
        await clearToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
