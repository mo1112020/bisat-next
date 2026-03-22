import type { Metadata } from 'next';
import { About } from '../../views/About';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Bisāṭ — our story, our artisans, and our commitment to authentic Turkish rug heritage.',
};

export default function AboutPage() {
  return <About />;
}
