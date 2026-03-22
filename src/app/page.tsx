import type { Metadata } from 'next';
import { Home } from '../views/Home';

export const metadata: Metadata = {
  title: 'Bisāṭ | Artisanal Turkish Rugs & Carpets',
  description: 'Bisāṭ – Premium hand-woven rugs & carpets from Turkey. Hereke silk, Oushak vintage, Kilim and more. Shop authentic artisanal heritage for your home.',
};

export default function HomePage() {
  return <Home />;
}
