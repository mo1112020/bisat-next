'use client';
import React, { useEffect, useState } from 'react';
import { Package, FileText, ShoppingBag, Star, MessageSquare } from 'lucide-react';
import { getDashboardStats, adminGetOrders } from '@/src/lib/db-browser';

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, reviews: 0, blogPosts: 0, testimonials: 0 });
  const [recentOrders, setRecentOrders] = useState<Awaited<ReturnType<typeof adminGetOrders>>>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    adminGetOrders().then(o => setRecentOrders(o.slice(0, 5)));
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Reviews', value: stats.reviews, icon: Star, color: 'bg-yellow-500' },
    { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'bg-purple-500' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'bg-pink-500' },
  ];

  const statusColor: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono font-semibold text-gray-700">{order.id}</td>
                  <td className="px-6 py-3 text-gray-600">{order.items.join(', ')}</td>
                  <td className="px-6 py-3 text-gray-500">{order.date}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
