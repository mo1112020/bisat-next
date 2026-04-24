import type { Metadata } from 'next';
import { Contact } from '@/src/views/Contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Bisatim for sourcing help, questions, or project support.',
};

export default function ContactPage() {
  return <Contact />;
}
