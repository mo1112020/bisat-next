import type { Metadata } from 'next';
import { Blog } from '@/src/views/Blog';

export const metadata: Metadata = {
  title: 'Living With Rugs',
  description: 'Room ideas, styling notes, and stories around living with rugs.',
};

export default function LivingWithRugsPage() {
  return <Blog />;
}
