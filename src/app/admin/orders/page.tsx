'use client';
import React, { useEffect, useState } from 'react';
import { adminGetOrders, adminUpdateOrderStatus } from '@/src/lib/db';

type Order = Awaited<ReturnType<typeof adminGetOrders>>[number];

const STATUS_OPTS = ['pending', 'processing', 'shipped', 'delivered'];
const statusColor: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { adminGetOrders().then(setOrders); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    const ok = await adminUpdateOrderStatus(id, status);
    if (ok) setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Delivery</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono font-semibold text-gray-700">{order.id}</td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs">
                    <ul className="space-y-0.5">
                      {order.items.map((item, i) => <li key={i} className="truncate">{item}</li>)}
                    </ul>
                  </td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-3 text-gray-500 max-w-[180px] truncate">{order.location}</td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{order.estimatedDelivery}</td>
                  <td className="px-6 py-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {STATUS_OPTS.map(s => <option key={s} value={s} className="bg-white text-gray-800 font-normal capitalize">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
