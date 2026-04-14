import type { Metadata } from 'next';
import { Lookbook } from '@/src/views/Lookbook';

export const metadata: Metadata = {
  title: 'Case Gallery',
  description: 'Browse spaces, room ideas, and reference styling for rugs.',
};

export default function CaseGalleryPage() {
  return <Lookbook />;
}
