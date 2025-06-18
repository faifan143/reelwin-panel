import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StoreInfo {
  id: string;
  name: string;
  phone: string;
  menuUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  // ...other fields as needed
}

interface StoreAuthContextType {
  jwt: string | null;
  store: StoreInfo | null;
  login: (jwt: string, store: StoreInfo) => void;
  logout: () => void;
}

const StoreAuthContext = createContext<StoreAuthContextType | undefined>(undefined);

export const StoreAuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwt, setJwt] = useState<string | null>(null);
  const [store, setStore] = useState<StoreInfo | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedJwt = localStorage.getItem('store_jwt');
    const savedStore = localStorage.getItem('store_info');
    if (savedJwt) setJwt(savedJwt);
    if (savedStore) setStore(JSON.parse(savedStore));
  }, []);

  const login = (jwt: string, store: StoreInfo) => {
    setJwt(jwt);
    setStore(store);
    localStorage.setItem('store_jwt', jwt);
    localStorage.setItem('store_info', JSON.stringify(store));
  };

  const logout = () => {
    setJwt(null);
    setStore(null);
    localStorage.removeItem('store_jwt');
    localStorage.removeItem('store_info');
  };

  return (
    <StoreAuthContext.Provider value={{ jwt, store, login, logout }}>
      {children}
    </StoreAuthContext.Provider>
  );
};

export const useStoreAuth = () => {
  const context = useContext(StoreAuthContext);
  if (!context) {
    throw new Error('useStoreAuth must be used within a StoreAuthProvider');
  }
  return context;
};
