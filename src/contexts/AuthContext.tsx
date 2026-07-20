import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { apiRequest } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (userData: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('campushub_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest('/auth/me');
        if (response.success && response.data) {
          setUser({
            id: String(response.data.id),
            name: response.data.full_name,
            email: response.data.email,
            role: response.data.role,
            avatarUrl: response.data.avatar,
          });
        } else {
          localStorage.removeItem('campushub_token');
        }
      } catch {
        localStorage.removeItem('campushub_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const loginUser = async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      const { access_token, user: userData } = response.data;
      localStorage.setItem('campushub_token', access_token);
      setUser({
        id: String(userData.id),
        name: userData.full_name,
        email: userData.email,
        role: userData.role,
        avatarUrl: userData.avatar,
      });
    }
  };

  const registerUser = async (userData: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
      }),
    });

    if (response.success && response.data) {
      const { access_token, user: registeredUser } = response.data;
      localStorage.setItem('campushub_token', access_token);
      setUser({
        id: String(registeredUser.id),
        name: registeredUser.full_name,
        email: registeredUser.email,
        role: registeredUser.role,
        avatarUrl: registeredUser.avatar,
      });
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('campushub_token');
    setUser(null);
    apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginUser,
        registerUser,
        logoutUser,
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
