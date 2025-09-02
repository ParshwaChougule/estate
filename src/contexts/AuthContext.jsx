import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const authState = localStorage.getItem('isAdminAuthenticated');
    const storedAdminData = localStorage.getItem('adminData');
    
    if (authState === 'true' && storedAdminData) {
      setIsAuthenticated(true);
      setAdminData(JSON.parse(storedAdminData));
    }
    setLoading(false);
  }, []);

  const login = (adminInfo) => {
    setIsAuthenticated(true);
    setAdminData(adminInfo);
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('adminData', JSON.stringify(adminInfo));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminData(null);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminData');
  };

  const value = {
    isAuthenticated,
    adminData,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
