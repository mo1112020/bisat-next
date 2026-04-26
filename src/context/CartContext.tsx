"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product } from '../data/products';
import { createSupabaseBrowser } from '../lib/supabase-browser';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEBOUNCE_MS = 400;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingFromDb = useRef(false);
  const supabase = createSupabaseBrowser();

  const loadCartFromDb = useCallback(async (uid: string) => {
    isLoadingFromDb.current = true;
    const { data } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', uid)
      .maybeSingle();

    if (data?.items) {
      const dbItems = data.items as CartItem[];
      setCart(prev => {
        if (prev.length === 0) return dbItems;
        // Merge: local items take precedence for quantity
        const merged = [...dbItems];
        for (const localItem of prev) {
          const idx = merged.findIndex(i => i.id === localItem.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], quantity: localItem.quantity };
          } else {
            merged.push(localItem);
          }
        }
        return merged;
      });
    }
    // Allow next render cycle before re-enabling persist
    setTimeout(() => { isLoadingFromDb.current = false; }, 50);
  }, []);

  // Subscribe to auth state to sync cart
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) loadCartFromDb(uid);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        await loadCartFromDb(uid);
      } else {
        setCart([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadCartFromDb]);

  const persistToDb = useCallback((items: CartItem[], uid: string) => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      supabase.from('carts').upsert(
        { user_id: uid, items, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      ).then(() => {});
    }, DEBOUNCE_MS);
  }, []);

  // Persist on every cart change (skip initial DB load)
  useEffect(() => {
    if (isLoadingFromDb.current) return;
    if (userId) persistToDb(cart, userId);
  }, [cart, userId, persistToDb]);

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === productId);
      if (!item) return prev;
      if (quantity <= 0) return prev.filter(i => i.id !== productId);
      const newQuantity = Math.min(quantity, item.stock);
      return prev.map(i => i.id === productId ? { ...i, quantity: newQuantity } : i);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (userId) {
      supabase.from('carts').upsert(
        { user_id: userId, items: [], updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      ).then(() => {});
    }
  }, [userId]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
