import type { Metadata } from 'next';
import { Terms } from '../../views/Terms';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Bisāṭ terms and conditions of sale and use.',
};

export default function TermsPage() {
  return <Terms />;
}
