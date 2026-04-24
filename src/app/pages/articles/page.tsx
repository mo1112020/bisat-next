import type { Metadata } from 'next';
import { Blog } from '@/src/views/Blog';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Stories, guides, and useful articles from Bisatim.',
};

export default function ArticlesPage() {
  return <Blog />;
}
