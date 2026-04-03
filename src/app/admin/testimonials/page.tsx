'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Star } from 'lucide-react';
import { getTestimonials, adminCreateTestimonial, adminDeleteTestimonial } from '@/src/lib/db';

type Testimonial = Awaited<ReturnType<typeof getTestimonials>>[number];

const EMPTY_FORM = { name: '', location: '', title: '', text: '', date: '', rating: 5, category: '' };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => getTestimonials().then(setTestimonials);
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await adminCreateTestimonial({ ...form, rating: Number(form.rating) });
    setSaving(false);
    setShowModal(false);
    setForm(EMPTY_FORM);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setDeleting(id);
    await adminDeleteTestimonial(id);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-800">{t.name}</td>
                  <td className="px-6 py-3 text-gray-600">{t.location}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= t.rating ? '#EAB308' : 'none'} color={s <= t.rating ? '#EAB308' : '#D1D5DB'} />)}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 max-w-[180px] truncate">{t.title}</td>
                  <td className="px-6 py-3"><span className="text-xs font-bold px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full">{t.category}</span></td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{t.date}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400">No testimonials yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">New Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['name', 'location', 'title', 'category', 'date'] as const).map(key => (
                  <div key={key} className={key === 'title' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{key}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" placeholder={key === 'date' ? 'e.g. March 2026' : ''} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating</label>
                  <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Text</label>
                  <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
