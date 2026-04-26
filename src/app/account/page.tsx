import type { Metadata } from 'next';
import { createSupabaseServer } from '../../lib/supabase-server';
import { Account } from '../../views/Account';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your Bisatim account, orders, and preferences.',
};

export default async function AccountPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <Account initialProfile={null} initialOrders={[]} />;
  }

  const [profileRes, ordersRes] = await Promise.all([
    supabase.from('profiles').select('full_name, phone, avatar_url').eq('id', user.id).single(),
    supabase.from('orders').select('id, created_at, status, total, items').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  return (
    <Account
      initialProfile={profileRes.data ?? null}
      initialOrders={(ordersRes.data ?? []) as Parameters<typeof Account>[0]['initialOrders']}
    />
  );
}
