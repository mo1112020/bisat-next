import type { Metadata } from 'next';
import { ForBusiness } from '@/src/views/ForBusiness';

export const metadata: Metadata = {
  title: 'For Business',
  description: 'Project and business support for designers, hospitality, and commercial sourcing.',
};

export default function ForBusinessPage() {
  return <ForBusiness />;
}
