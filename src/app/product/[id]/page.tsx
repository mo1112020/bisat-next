import type { Metadata } from 'next';
import { products } from '@/src/data/products';
import { ProductDetail } from '@/src/views/ProductDetail';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | Bisāṭ`,
    description: `${product.description.slice(0, 155)}… Hand-woven in ${product.origin}.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
      type: 'website',
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetail />;
}
