import type { Metadata } from 'next';
import { About } from '@/src/views/About';
import { getSiteImages } from '@/src/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Bisatim and our approach to sourcing and curating rugs.',
};

export default async function AboutPage() {
  return <About />;
}
