import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Shop } from '@/src/views/Shop';

interface Props {
  params: Promise<{ slug: string }>;
}

const TITLES: Record<string, string> = {
  rug: 'All Products',
  'authentic-rugs': 'Authentic Rugs',
  'easy-rugs': 'Easy Rugs',
  'vintage-rugs': 'Vintage Rugs',
  'custom-rugs': 'Custom Rugs',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = TITLES[slug] ?? 'Products';
  return {
    title: `${title} | Bisāṭ`,
    description: `Browse ${title.toLowerCase()} from Bisāṭ.`,
  };
}

export default function CollectionPage() {
  return (
    <Suspense>
      <Shop />
    </Suspense>
  );
}
