'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getBlogPosts, adminCreateBlogPost, adminUpdateBlogPost, adminDeleteBlogPost } from '@/src/lib/db-browser';
import { BlogPostData } from '@/src/data/blogPosts';
import { CdnImagePicker } from '@/src/components/CdnImagePicker';

const EMPTY_FORM = { title: '', excerpt: '', content: '', image: '', date: '', author: '', category: '', metaDescription: '' };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPostData | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => getBlogPosts().then(setPosts);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p: BlogPostData) => {
    setEditing(p);
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, image: p.image, date: p.date, author: p.author, category: p.category, metaDescription: p.metaDescription || '' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await adminUpdateBlogPost(editing.id, form);
    } else {
      await adminCreateBlogPost(form);
    }
    setSaving(false);
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await adminDeleteBlogPost(id);
    load();
  };

  const field = (key: keyof typeof EMPTY_FORM, label: string, opts?: { multiline?: boolean; rows?: number; colSpan?: boolean; placeholder?: string }) => (
    <div className={opts?.colSpan ? 'col-span-2' : ''}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      {opts?.multiline
        ? <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={opts.rows || 3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none" placeholder={opts?.placeholder} />
        : <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" placeholder={opts?.placeholder} />
      }
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-800 max-w-xs truncate">{p.title}</td>
                  <td className="px-6 py-3 text-gray-600">{p.author}</td>
                  <td className="px-6 py-3"><span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">{p.category}</span></td>
                  <td className="px-6 py-3 text-gray-500">{p.date}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No posts yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field('title', 'Title', { colSpan: true })}
                {field('author', 'Author')}
                {field('category', 'Category')}
                {field('date', 'Date', { placeholder: 'e.g. March 15, 2026' })}
                <div className="col-span-2">
                  <CdnImagePicker
                    label="Cover Image"
                    value={form.image}
                    onChange={url => setForm(f => ({ ...f, image: url }))}
                    placeholder="Pick cover image from CDN…"
                  />
                </div>
                {field('excerpt', 'Excerpt', { colSpan: true, multiline: true, rows: 2 })}
                {field('content', 'Content (HTML)', { colSpan: true, multiline: true, rows: 6 })}
                {field('metaDescription', 'Meta Description', { colSpan: true, multiline: true, rows: 2 })}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
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
