import type { Metadata } from 'next';
import { Contact } from '../../views/Contact';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Bisāṭ team for enquiries about our rugs and carpets.',
};

export default function ContactPage() {
  return <Contact />;
}
