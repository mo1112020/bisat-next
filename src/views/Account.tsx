"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, Settings, MapPin, Mail, Phone, Edit2, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Meta } from '../components/Meta';
import { PageHeader } from '../components/PageHeader';

const DUMMY_ORDERS = [
  { id: 'ORD-12345', date: '2026-03-15', status: 'shipped', items: ['Tabriz Heritage Rug', 'Silk Road Runner'], total: '€2,840' },
  { id: 'ORD-67890', date: '2026-03-10', status: 'delivered', items: ['Modern Minimalist Grey'], total: '€1,290' },
  { id: 'ORD-55555', date: '2026-03-19', status: 'processing', items: ['Kilim Geometric Blue'], total: '€980' },
];

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
};

const TABS = ['Overview', 'Orders', 'Addresses', 'Settings'];

export const Account = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="pb-16 bg-bisat-cream min-h-screen">
      <Meta title="My Account" description="Manage your Bisāṭ account, orders, and preferences." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          badge="My Account"
          title="Welcome back, Leila"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avatar Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-bisat-black flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-bisat-cream" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg">Leila Arslan</h3>
              <p className="text-xs text-bisat-black/40 mt-1">Member since 2025</p>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm">
              {TABS.map((tab) => {
                const icons = { Overview: User, Orders: Package, Addresses: MapPin, Settings: Settings };
                const Icon = icons[tab as keyof typeof icons];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
                      activeTab === tab
                        ? 'bg-bisat-black text-bisat-cream'
                        : 'text-bisat-black/50 hover:text-bisat-black hover:bg-bisat-cream/50'
                    }`}
                  >
                    <Icon size={15} />
                    {tab}
                  </button>
                );
              })}
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
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Orders', value: '3', icon: Package },
                      { label: 'Wishlist Items', value: '5', icon: Heart },
                      { label: 'Loyalty Points', value: '420', icon: CheckCircle },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-white rounded-[2rem] p-8 shadow-sm">
                        <Icon size={20} className="text-bisat-gold mb-4" />
                        <p className="text-3xl font-serif mb-1">{value}</p>
                        <p className="text-xs text-bisat-black/40 uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Order */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl">Recent Order</h3>
                      <button onClick={() => setActiveTab('Orders')} className="text-xs uppercase tracking-widest font-bold text-bisat-gold flex items-center gap-2 hover:gap-3 transition-all">
                        View All <ArrowRight size={14} />
                      </button>
                    </div>
                    {DUMMY_ORDERS[0] && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-bisat-black/40 uppercase tracking-widest mb-1">{DUMMY_ORDERS[0].id}</p>
                          <p className="font-serif">{DUMMY_ORDERS[0].items.join(', ')}</p>
                          <p className="text-xs text-bisat-black/40 mt-1">{DUMMY_ORDERS[0].date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[DUMMY_ORDERS[0].status]}`}>
                            {DUMMY_ORDERS[0].status}
                          </span>
                          <Link href="/track-order" className="text-xs uppercase tracking-widest font-bold text-bisat-black/50 hover:text-bisat-black transition-colors flex items-center gap-1">
                            Track <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/wishlist" className="bg-white rounded-[2rem] p-8 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Heart size={20} className="text-bisat-gold" />
                        <span className="font-bold text-sm uppercase tracking-widest">My Wishlist</span>
                      </div>
                      <ArrowRight size={16} className="text-bisat-black/20 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/track-order" className="bg-white rounded-[2rem] p-8 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
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
                  {DUMMY_ORDERS.map((order) => (
                    <div key={order.id} className="bg-white rounded-[2rem] p-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-bisat-black/40 uppercase tracking-widest mb-1">{order.id} · {order.date}</p>
                          <p className="font-serif text-lg">{order.items.join(', ')}</p>
                          <p className="text-sm text-bisat-black/60 mt-1">{order.total}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[order.status]}`}>
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

              {/* Addresses */}
              {activeTab === 'Addresses' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin size={18} className="text-bisat-gold" />
                          <span className="text-xs uppercase tracking-widest font-bold">Default Address</span>
                        </div>
                        <p className="font-serif text-lg">Leila Arslan</p>
                        <p className="text-sm text-bisat-black/60 mt-1 leading-relaxed">
                          14 Bosphorus Avenue, Apt 3B<br />
                          Beşiktaş, Istanbul 34353<br />
                          Turkey
                        </p>
                      </div>
                      <button className="p-2 text-bisat-black/30 hover:text-bisat-black transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                  <button className="w-full bg-white rounded-[2rem] p-6 shadow-sm border-2 border-dashed border-bisat-black/10 text-bisat-black/30 hover:text-bisat-black hover:border-bisat-black/20 transition-colors text-sm uppercase tracking-widest font-bold">
                    + Add New Address
                  </button>
                </div>
              )}

              {/* Settings */}
              {activeTab === 'Settings' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                    <h3 className="font-serif text-xl mb-6">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'First Name', value: 'Leila', type: 'text' },
                        { label: 'Last Name', value: 'Arslan', type: 'text' },
                        { label: 'Email', value: 'leila.arslan@email.com', type: 'email', icon: Mail },
                        { label: 'Phone', value: '+90 532 000 0000', type: 'tel', icon: Phone },
                      ].map(({ label, value, type }) => (
                        <div key={label}>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 block mb-2">{label}</label>
                          <input
                            type={type}
                            defaultValue={value}
                            className="w-full bg-bisat-cream/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-bisat-gold focus:outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 bg-bisat-black text-bisat-cream px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-bisat-gold transition-colors">
                      Save Changes
                    </button>
                  </div>

                  <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                    <h3 className="font-serif text-xl mb-6">Notifications</h3>
                    {['Order updates', 'New arrivals', 'Exclusive offers'].map((item) => (
                      <div key={item} className="flex items-center justify-between py-3 border-b border-bisat-black/5 last:border-0">
                        <span className="text-sm">{item}</span>
                        <div className="w-10 h-5 bg-bisat-gold rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                        </div>
                      </div>
                    ))}
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
