import type { Metadata } from 'next';
import { Craftsmanship } from '../../views/Craftsmanship';

export const metadata: Metadata = {
  title: 'Our Craftsmanship',
  description: 'Discover the centuries-old techniques behind every Bisāṭ rug — from loom to living room.',
};

export default function CraftsmanshipPage() {
  return <Craftsmanship />;
}
