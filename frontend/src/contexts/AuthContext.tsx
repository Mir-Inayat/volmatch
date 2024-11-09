import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  setAuth: (isAuth: boolean, type: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  setAuth: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [userType, setUserType] = useState<string | null>(localStorage.getItem('userType'));

  const setAuth = (isAuth: boolean, type: string | null) => {
    setIsAuthenticated(isAuth);
    setUserType(type);
  };

  useEffect(() => {
    // Update auth state when localStorage changes
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
      setUserType(localStorage.getItem('userType'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 