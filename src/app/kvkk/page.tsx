import type { Metadata } from 'next';
import { KVKK } from '../../views/KVKK';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Kişisel verilerin korunması kanunu kapsamında Bisatim aydınlatma metni.',
};

export default function KVKKPage() {
  return <KVKK />;
}
