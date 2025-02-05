import { useState, useEffect, createContext, useContext } from 'react';
import AuthService from './auth';

interface AuthContextType {
  user: { username: string; email: string; id: string } | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (AuthService.loggedIn()) {
      const decodedUser = AuthService.getProfile().data;
      setUser(decodedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    AuthService.login(token);
    const decodedUser = AuthService.getProfile().data;
    setUser(decodedUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
