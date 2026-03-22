import type { Metadata } from 'next';
import { OrderTracking } from '../../views/OrderTracking';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track the status of your Bisāṭ rug order.',
};

export default function TrackOrderPage() {
  return <OrderTracking />;
}
