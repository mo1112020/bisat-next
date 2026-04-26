import type { Metadata } from 'next';
import { getTestimonials } from '../../lib/db';
import { Reviews } from '../../views/Reviews';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Read what our customers say about their Bisatim rugs and experience.',
};

export default async function ReviewsPage() {
  const reviews = await getTestimonials();
  return <Reviews initialReviews={reviews} />;
}
