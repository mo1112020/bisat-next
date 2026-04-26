"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, Settings, ArrowRight, CheckCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Meta } from '../components/Meta';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { createSupabaseBrowser } from '../lib/supabase-browser';

interface Order {
  id: string;
  created_at: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: Array<{ name: string }>;
}

interface Profile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  shipped:    'bg-blue-50 text-blue-700 border-blue-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
};

const TABS = ['Overview', 'Orders', 'Settings'] as const;
type Tab = typeof TABS[number];

export const Account = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>({ full_name: null, phone: null, avatar_url: null });
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/cart');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('full_name, phone, avatar_url').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setProfileForm({ full_name: data.full_name ?? '', phone: data.phone ?? '' });
        }
      });
    supabase.from('orders').select('id, created_at, status, total, items').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({
      full_name: profileForm.full_name,
      phone: profileForm.phone,
    }).eq('id', user.id);
    setProfile(prev => ({ ...prev, ...profileForm }));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-bisat-black/20 border-t-bisat-black" />
      </div>
    );
  }

  const displayName = profile.full_name
    || (user.user_metadata?.full_name as string)
    || (user.user_metadata?.name as string)
    || user.email
    || 'My Account';

  const memberSince = new Date(user.created_at).getFullYear().toString();

  return (
    <div className="pb-16 bg-[#f7f5f2] min-h-screen">
      <Meta title="My Account" description="Manage your Bisatim account, orders, and preferences." />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader badge="My Account" title={`Welcome back, ${displayName.split(' ')[0]}`} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-bisat-black/[0.07] p-8 text-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-20 h-20 bg-bisat-black flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-bisat-cream" strokeWidth={1.5} />
                </div>
              )}
              <h3 className="font-sans text-lg">{displayName}</h3>
              <p className="text-xs text-bisat-black/40 mt-1">Member since {memberSince}</p>
            </div>

            <div className="bg-white border border-bisat-black/[0.07] p-2">
              {TABS.map((tab) => {
                const icons: Record<Tab, React.ElementType> = { Overview: User, Orders: Package, Settings: Settings };
                const Icon = icons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                      activeTab === tab
                        ? 'bg-bisat-black text-white'
                        : 'text-bisat-black/45 hover:text-bisat-black hover:bg-[#f7f5f2]/50'
                    }`}
                  >
                    <Icon size={15} />
                    {tab}
                  </button>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-bisat-black/45 hover:text-red-600 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview */}
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Orders', value: orders.length.toString(), icon: Package },
                      { label: 'Wishlist Items', value: '—', icon: Heart },
                      { label: 'Member Since', value: memberSince, icon: CheckCircle },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-white border border-bisat-black/[0.07] p-8">
                        <Icon size={20} className="text-bisat-gold mb-4" />
                        <p className="text-3xl font-sans mb-1">{value}</p>
                        <p className="text-xs text-bisat-black/40 uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>

                  {orders[0] && (
                    <div className="bg-white border border-bisat-black/[0.07] p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-sans text-xl">Recent Order</h3>
                        <button onClick={() => setActiveTab('Orders')} className="text-xs uppercase tracking-widest font-bold text-bisat-gold flex items-center gap-2 hover:gap-3 transition-all">
                          View All <ArrowRight size={14} />
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-bisat-black/40 uppercase tracking-widest mb-1">#{orders[0].id.slice(0, 8).toUpperCase()}</p>
                          <p className="font-sans">{orders[0].items.map(i => i.name).join(', ')}</p>
                          <p className="text-xs text-bisat-black/40 mt-1">{new Date(orders[0].created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[orders[0].status]}`}>
                            {orders[0].status}
                          </span>
                          <Link href="/track-order" className="text-xs uppercase tracking-widest font-bold text-bisat-black/50 hover:text-bisat-black transition-colors flex items-center gap-1">
                            Track <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/wishlist" className="bg-white border border-bisat-black/[0.07] p-8 flex items-center justify-between group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Heart size={20} className="text-bisat-gold" />
                        <span className="font-bold text-sm uppercase tracking-widest">My Wishlist</span>
                      </div>
                      <ArrowRight size={16} className="text-bisat-black/20 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/track-order" className="bg-white border border-bisat-black/[0.07] p-8 flex items-center justify-between group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Package size={20} className="text-bisat-gold" />
                        <span className="font-bold text-sm uppercase tracking-widest">Track Order</span>
                      </div>
                      <ArrowRight size={16} className="text-bisat-black/20 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === 'Orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-white border border-bisat-black/[0.07] p-12 text-center">
                      <Package size={32} className="text-bisat-black/15 mx-auto mb-4" strokeWidth={1} />
                      <p className="text-bisat-black/45 text-sm">No orders yet.</p>
                    </div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="bg-white border border-bisat-black/[0.07] p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-bisat-black/40 uppercase tracking-widest mb-1">#{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="font-sans text-lg">{order.items.map(i => i.name).join(', ')}</p>
                          <p className="text-sm text-bisat-black/60 mt-1">${order.total.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? ''}`}>
                            {order.status}
                          </span>
                          <Link href="/track-order" className="text-xs uppercase tracking-widest font-bold text-bisat-black/50 hover:text-bisat-black transition-colors flex items-center gap-1">
                            Track <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Settings */}
              {activeTab === 'Settings' && (
                <div className="space-y-4">
                  <div className="bg-white border border-bisat-black/[0.07] p-8">
                    <h3 className="font-sans text-xl mb-6">Personal Information</h3>
                    <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.full_name}
                          onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                          className="w-full bg-[#f7f5f2]/50 border border-bisat-black/[0.07] px-4 py-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email ?? ''}
                          disabled
                          className="w-full bg-[#f7f5f2]/50 border border-bisat-black/[0.07] px-4 py-3 text-sm text-bisat-black/40 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-[#f7f5f2]/50 border border-bisat-black/[0.07] px-4 py-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-bisat-black text-bisat-cream px-8 py-3 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-bisat-charcoal transition-colors disabled:opacity-60"
                        >
                          {saving ? 'Saving…' : saveSuccess ? 'Saved ✓' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
