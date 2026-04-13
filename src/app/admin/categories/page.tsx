'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  Category,
} from '@/src/lib/db-browser';
import { CdnImagePicker } from '@/src/components/CdnImagePicker';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const EMPTY_FORM: Omit<Category, 'id'> = {
  name: '',
  slug: '',
  badge: '',
  imageUrl: '',
  sortOrder: 0,
  active: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Omit<Category, 'id'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => adminGetCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      badge: cat.badge,
      imageUrl: cat.imageUrl,
      sortOrder: cat.sortOrder,
      active: cat.active,
    });
    setError('');
    setShowModal(true);
  };

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      name,
      slug: editing ? f.slug : slugify(name),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    let ok = false;
    if (editing) {
      ok = await adminUpdateCategory(editing.id, form);
    } else {
      const result = await adminCreateCategory(form);
      ok = result !== null;
    }
    setSaving(false);
    if (!ok) {
      setError('Failed to save. Check the console for details.');
      return;
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    setDeleting(id);
    await adminDeleteCategory(id);
    setDeleting(null);
    load();
  };

  const toggleActive = async (cat: Category) => {
    await adminUpdateCategory(cat.id, { ...cat, imageUrl: cat.imageUrl, active: !cat.active });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Badge</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Active</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs font-mono">{cat.slug}</td>
                  <td className="px-6 py-3">
                    {cat.badge && (
                      <span className="text-xs font-bold px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full">{cat.badge}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{cat.sortOrder}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleActive(cat)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        cat.active ? 'bg-yellow-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          cat.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deleting === cat.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    No categories yet — add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={15} /></button>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                  placeholder="e.g. Handmade"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Slug</label>
                <input
                  required
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 font-mono"
                  placeholder="e.g. handmade"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Badge</label>
                <input
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                  placeholder="e.g. Trending, New Arrivals, Save 20%"
                />
              </div>

              <CdnImagePicker
                label="Category Image"
                value={form.imageUrl}
                onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                placeholder="Pick category image from CDN…"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active</label>
                  <div className="flex items-center h-[42px]">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        form.active ? 'bg-yellow-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          form.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-sm text-gray-600">{form.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
