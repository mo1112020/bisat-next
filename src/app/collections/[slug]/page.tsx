import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Shop } from '@/src/views/Shop';
import { getProducts, getCategories, getRoomTypes, getSizeCategories } from '@/src/lib/db';

export const revalidate = 300;

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
    title: `${title} | Bisatim`,
    description: `Browse ${title.toLowerCase()} from Bisatim.`,
  };
}

export default async function CollectionPage() {
  const [products, categories, rooms, sizes] = await Promise.all([
    getProducts(),
    getCategories(),
    getRoomTypes(),
    getSizeCategories(),
  ]);

  const config = {
    categories: categories.map(c => c.name),
    rooms: rooms.map(r => r.name),
    sizes: sizes.map(s => s.name),
  };

  return (
    <Suspense>
      <Shop initialProducts={products} initialConfig={config} />
    </Suspense>
  );
}
