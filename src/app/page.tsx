import type { Metadata } from 'next';
import { Home } from '../views/Home';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bisatim | Artisanal Turkish Rugs & Carpets',
  description: 'Bisatim – Premium hand-woven rugs & carpets from Turkey. Hereke silk, Oushak vintage, Kilim and more. Shop authentic artisanal heritage for your home.',
};

export default function HomePage() {
  return <Home />;
}
