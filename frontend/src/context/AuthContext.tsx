import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../services/auth';
import { checkAuth, login as loginService, signup as signupService, logout as logoutService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar la app (restaurar sesión desde cookies)
  useEffect(() => {
    const verifyAuth = async () => {
      const currentUser = await checkAuth();
      setUser(currentUser);
      setLoading(false);
    };
    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await loginService(email, password);
    setUser(loggedUser);
  };

  const register = async (name: string, email: string, password: string) => {
    const registeredUser = await signupService(name, email, password);
    setUser(registeredUser);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
