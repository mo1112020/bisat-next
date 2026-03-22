import type { Metadata } from 'next';
import { Shipping } from '../../views/Shipping';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Bisāṭ worldwide shipping information, delivery times, and return policy.',
};

export default function ShippingPage() {
  return <Shipping />;
}
