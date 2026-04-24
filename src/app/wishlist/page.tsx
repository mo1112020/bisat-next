import type { Metadata } from 'next';
import { Wishlist } from '../../views/Wishlist';

export const metadata: Metadata = {
  title: 'Your Wishlist',
  description: 'Your saved rugs and carpets from Bisatim.',
};

export default function WishlistPage() {
  return <Wishlist />;
}
