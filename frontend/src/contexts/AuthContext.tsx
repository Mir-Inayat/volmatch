import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'volunteer' | 'organization' | null;
  user: {
    first_name?: string;
    organization?: {
      name: string;
    };
  } | null;
  setAuth: (isAuth: boolean, type: 'volunteer' | 'organization' | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  user: null,
  setAuth: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [userType, setUserType] = useState<'volunteer' | 'organization' | null>(localStorage.getItem('userType') as 'volunteer' | 'organization' | null);

  const setAuth = (isAuth: boolean, type: 'volunteer' | 'organization' | null) => {
    setIsAuthenticated(isAuth);
    setUserType(type);
  };

  useEffect(() => {
    // Update auth state when localStorage changes
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
      setUserType(localStorage.getItem('userType') as 'volunteer' | 'organization' | null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, user: null, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 