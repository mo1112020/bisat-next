import type { Metadata } from 'next';
import { Checkout } from '../../views/Checkout';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Bisāṭ order securely.',
};

export default function CheckoutPage() {
  return <Checkout />;
}
