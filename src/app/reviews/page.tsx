import type { Metadata } from 'next';
import { Reviews } from '../../views/Reviews';

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Read what our customers say about their Bisatim rugs and experience.',
};

export default function ReviewsPage() {
  return <Reviews />;
}
