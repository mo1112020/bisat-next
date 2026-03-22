import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Shop } from '@/src/views/Shop';

export const metadata: Metadata = {
  title: 'Shop All Rugs & Carpets | Bisāṭ',
  description: 'Browse our exclusive collection of hand-woven Turkish rugs. Handmade, vintage, kilim and machine-woven carpets shipped worldwide.',
  keywords: 'buy Turkish rugs, handmade carpets, kilim rugs, vintage rugs, silk rugs online',
};

export default function ShopPage() {
  return (
    <Suspense>
      <Shop />
    </Suspense>
  );
}
