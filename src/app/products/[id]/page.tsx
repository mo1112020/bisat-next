import type { Metadata } from 'next';
import { getProduct } from '@/src/lib/db';
import { ProductDetail } from '@/src/views/ProductDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  const title = `${product.name} | ${product.category} Rug | Bisatim`;
  const description = product.description.slice(0, 160);
  const image = product.images[0];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function ProductPage() {
  return <ProductDetail />;
}
