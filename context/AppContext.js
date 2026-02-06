'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const savedUser = localStorage.getItem('adminUser');
    if (savedAuth === 'true' && savedUser) {
      setIsAdminAuthenticated(true);
      setAdminUser(JSON.parse(savedUser));
    }
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const adminLogin = (username, password) => {
    // For demo purposes - in production, this should be an API call
    if (username === 'admin' && password === 'admin123') {
      const user = {
        username,
        name: 'Administrator',
        email: 'admin@steerflux.com',
        lastLogin: new Date().toISOString()
      };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
  };

  const updateAdminPassword = (newPassword) => {
    // In a real app, this would make an API call
    alert('Password updated successfully!');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        isSearchOpen,
        setIsSearchOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        updateAdminPassword
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}