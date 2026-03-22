import type { Metadata } from 'next';
import { Account } from '../../views/Account';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your Bisāṭ account, orders, and preferences.',
};

export default function AccountPage() {
  return <Account />;
}
