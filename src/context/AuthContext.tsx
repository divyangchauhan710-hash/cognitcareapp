import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserRole } from '../types';

// Update with your machine's IP for physical device, or 10.0.2.2 for Android emulator
const API_URL = "http://10.253.225.76:8000";

interface AuthContextType {
  currentUser: any | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userObj');
        if (storedToken && storedUser) {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setRole(parsedUser.role as UserRole);
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error("Login failed");
      
      const data = await response.json();
      await persistAuth(data.access_token, data.user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!response.ok) throw new Error("Registration failed");
      
      // Auto login after register
      await login(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const persistAuth = async (newToken: string, user: any) => {
    await SecureStore.setItemAsync('userToken', newToken);
    await SecureStore.setItemAsync('userObj', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    setRole(user.role as UserRole);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userObj');
    setToken(null);
    setCurrentUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        token,
        isLoading,
        login,
        register,
        logout,
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
