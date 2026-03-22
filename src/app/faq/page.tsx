import type { Metadata } from 'next';
import { FAQ } from '../../views/FAQ';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Bisāṭ rugs, shipping, returns, and care.',
};

export default function FAQPage() {
  return <FAQ />;
}
