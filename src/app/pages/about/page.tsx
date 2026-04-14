import type { Metadata } from 'next';
import { About } from '@/src/views/About';
import { getSiteImages } from '@/src/lib/db';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Bisāṭ and our approach to sourcing and curating rugs.',
};

export default async function AboutPage() {
  const siteImgs = await getSiteImages();
  return <About artisanImage={siteImgs.about_artisan} />;
}
