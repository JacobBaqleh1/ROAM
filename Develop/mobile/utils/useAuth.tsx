import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { router } from 'expo-router';

const TOKEN_KEY = 'id_token';

interface UserProfile {
  username: string;
  email: string;
  id: string;
}

interface ExtendedJwt extends JwtPayload {
  data: UserProfile;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  refreshAuth: async () => {},
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      const decoded = jwtDecode<ExtendedJwt>(token);
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      setIsLoggedIn(true);
      setUser(decoded.data);
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    const decoded = jwtDecode<ExtendedJwt>(token);
    setIsLoggedIn(true);
    setUser(decoded.data);
    router.replace('/');
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setIsLoggedIn(false);
    setUser(null);
    router.replace('/');
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, refreshAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
