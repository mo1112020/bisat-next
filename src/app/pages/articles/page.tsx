import type { Metadata } from 'next';
import { getBlogPosts } from '@/src/lib/db';
import { Blog } from '@/src/views/Blog';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Stories, guides, and useful articles from Bisatim.',
};

export default async function ArticlesPage() {
  const posts = await getBlogPosts();
  return <Blog initialPosts={posts} />;
}
