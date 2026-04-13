import type { Metadata } from 'next';
import { About } from '../../views/About';
import { getSiteImages } from '../../lib/db';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Bisāṭ — our story, our artisans, and our commitment to authentic Turkish rug heritage.',
};

export default async function AboutPage() {
  const siteImgs = await getSiteImages();
  return <About artisanImage={siteImgs.about_artisan} />;
}
