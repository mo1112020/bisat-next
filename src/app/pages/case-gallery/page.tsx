import type { Metadata } from 'next';
import { Lookbook } from '@/src/views/Lookbook';
import { getSiteImages } from '@/src/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Case Gallery',
  description: 'Browse spaces, room ideas, and reference styling for rugs.',
};

export default async function CaseGalleryPage() {
  const siteImages = await getSiteImages();
  return <Lookbook siteImages={siteImages} />;
}
