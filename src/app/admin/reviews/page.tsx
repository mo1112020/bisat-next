'use client';
import React, { useEffect, useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import { adminGetAllReviews, adminDeleteReview } from '@/src/lib/db-browser';

type Review = Awaited<ReturnType<typeof adminGetAllReviews>>[number];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => adminGetAllReviews().then(setReviews);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    setDeleting(id);
    await adminDeleteReview(id);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Reviews</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Reviewer</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Comment</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-800 max-w-[160px] truncate">{r.productName}</td>
                  <td className="px-6 py-3 text-gray-600">{r.userName}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#EAB308' : 'none'} color={s <= r.rating ? '#EAB308' : '#D1D5DB'} />)}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 max-w-xs truncate">{r.comment}</td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No reviews yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
