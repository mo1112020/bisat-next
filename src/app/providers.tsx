'use client';

import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import { RecentlyViewedProvider } from '../context/RecentlyViewedContext';
import { WishlistProvider } from '../context/WishlistContext';
import '../i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <RecentlyViewedProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </RecentlyViewedProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
