'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetCategories, adminGetRoomTypes, adminGetSizeCategories,
  Category, RoomType, SizeCategory,
} from '@/src/lib/db-browser';
import { Product } from '@/src/data/products';
import { CdnImagePicker } from '@/src/components/CdnImagePicker';

const EMPTY_FORM = {
  name: '', category: '', price: 0, description: '',
  images: [] as string[], dimensions: '', sizeCategory: '', rooms: [] as string[],
  material: '', origin: '', stock: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [sizeCategories, setSizeCategories] = useState<SizeCategory[]>([]);
  const [configLoading, setConfigLoading] = useState(true);

  const load = () => getProducts().then(setProducts);

  useEffect(() => {
    load();
    Promise.all([
      adminGetCategories(),
      adminGetRoomTypes(),
      adminGetSizeCategories(),
    ]).then(([cats, rooms, sizes]) => {
      setCategories(cats);
      setRoomTypes(rooms);
      setSizeCategories(sizes);
      // set defaults in EMPTY_FORM from DB
      setForm(f => ({
        ...f,
        category: cats[0]?.name ?? '',
        sizeCategory: sizes[0]?.name ?? '',
      }));
      setConfigLoading(false);
    });
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      category: categories[0]?.name ?? '',
      sizeCategory: sizeCategories[0]?.name ?? '',
    });
    setShowModal(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, price: p.price,
      description: p.description, images: p.images,
      dimensions: p.dimensions, sizeCategory: p.sizeCategory,
      rooms: p.rooms as string[], material: p.material,
      origin: p.origin, stock: p.stock,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editing) {
      await adminUpdateProduct(editing.id, payload);
    } else {
      await adminCreateProduct(payload);
    }
    setSaving(false);
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    await adminDeleteProduct(id);
    setDeleting(null);
    load();
  };

  const toggleRoom = (room: string) => {
    setForm(f => ({
      ...f,
      rooms: f.rooms.includes(room) ? f.rooms.filter(r => r !== room) : [...f.rooms, room],
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3"><span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{p.category}</span></td>
                  <td className="px-6 py-3 font-semibold text-gray-700">${p.price.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No products yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Size</label>
                  <select value={form.sizeCategory} onChange={e => setForm(f => ({ ...f, sizeCategory: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400">
                    {sizeCategories.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price ($)</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Stock</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dimensions</label>
                  <input value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" placeholder="e.g. 4' x 6'" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Material</label>
                  <input value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Origin</label>
                  <input value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400" />
                </div>

                {/* CDN Image Picker (multi) */}
                <div className="col-span-2">
                  <CdnImagePicker
                    multiple
                    label="Product Images"
                    value={form.images}
                    onChange={images => setForm(f => ({ ...f, images }))}
                    placeholder="Pick product images from CDN…"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rooms</label>
                  <div className="flex flex-wrap gap-2">
                    {roomTypes.map(room => (
                      <button key={room.id} type="button" onClick={() => toggleRoom(room.name)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${form.rooms.includes(room.name) ? 'bg-yellow-500 text-gray-950 border-yellow-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                        {room.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving || configLoading} className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
                  {configLoading ? 'Loading…' : saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
