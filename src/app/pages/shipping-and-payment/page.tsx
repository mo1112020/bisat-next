import type { Metadata } from 'next';
import { Shipping } from '@/src/views/Shipping';

export const metadata: Metadata = {
  title: 'Shipping and Payment',
  description: 'Shipping, delivery, and payment information for Bisatim orders.',
};

export default function ShippingAndPaymentPage() {
  return <Shipping />;
}
