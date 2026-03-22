import type { Metadata } from 'next';
import { Privacy } from '../../views/Privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Bisāṭ privacy policy — how we collect, use, and protect your personal data.',
};

export default function PrivacyPage() {
  return <Privacy />;
}
