import type { Metadata } from 'next';
import { Cart } from '../../views/Cart';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your selected rugs and proceed to checkout.',
};

export default function CartPage() {
  return <Cart />;
}
