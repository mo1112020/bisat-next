import type { Metadata } from 'next';
import { Blog } from '../../views/Blog';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, guides, and inspiration from the world of Turkish rugs and artisanal craftsmanship.',
};

export default function BlogPage() {
  return <Blog />;
}
