import type { Metadata } from 'next';
import { OrderConfirmation } from '../../views/OrderConfirmation';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your Bisatim order has been placed successfully.',
};

export default function OrderConfirmationPage() {
  return <OrderConfirmation />;
}
