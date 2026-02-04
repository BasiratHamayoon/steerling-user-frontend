'use client'; // Add this at the top

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}