import type { Metadata } from 'next';
import { getBlogPost } from '@/src/lib/db';
import { BlogPost } from '@/src/views/BlogPost';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) {
    return { title: 'Article Not Found' };
  }
  const title = `${post.title} | Bisāṭ Journal`;
  const description = post.metaDescription || post.excerpt?.slice(0, 160) || '';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default function BlogPostPage() {
  return <BlogPost />;
}
