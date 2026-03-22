import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/src/data/blogPosts';
import { BlogPost } from '@/src/views/BlogPost';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Bisāṭ Journal`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: [{ url: post.image }],
      type: 'article',
    },
  };
}

export default function BlogPostPage() {
  return <BlogPost />;
}
