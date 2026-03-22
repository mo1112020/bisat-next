"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addView: (product: Product) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENTLY_VIEWED = 10;

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recentlyViewed from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addView = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists to move to front
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered];
      // Limit size
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return context;
};
