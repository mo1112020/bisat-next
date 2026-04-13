'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import {
  adminGetRoomTypes, adminCreateRoomType, adminUpdateRoomType, adminDeleteRoomType,
  adminGetSizeCategories, adminCreateSizeCategory, adminUpdateSizeCategory, adminDeleteSizeCategory,
  RoomType, SizeCategory,
} from '@/src/lib/db-browser';

// ─── Generic list item types ─────────────────────────────────────────────────

interface ListItem {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

interface EditingState {
  id: string;
  name: string;
  sortOrder: number;
}

interface AddingState {
  name: string;
  sortOrder: number;
}

// ─── Reusable list section ────────────────────────────────────────────────────

function ConfigSection({
  title,
  items,
  onAdd,
  onUpdate,
  onDelete,
  onToggleActive,
}: {
  title: string;
  items: ListItem[];
  onAdd: (data: { name: string; sortOrder: number }) => Promise<void>;
  onUpdate: (id: string, data: { name: string; sortOrder: number; active: boolean }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleActive: (item: ListItem) => Promise<void>;
}) {
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [adding, setAdding] = useState<AddingState>({ name: '', sortOrder: items.length });
  const [showAddRow, setShowAddRow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adding.name.trim()) return;
    setSaving(true);
    await onAdd({ name: adding.name.trim(), sortOrder: adding.sortOrder });
    setSaving(false);
    setAdding({ name: '', sortOrder: items.length + 1 });
    setShowAddRow(false);
  };

  const handleUpdate = async (item: ListItem) => {
    if (!editing || editing.id !== item.id) return;
    setSaving(true);
    await onUpdate(item.id, { name: editing.name, sortOrder: editing.sortOrder, active: item.active });
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">{title}</h2>
        <button
          onClick={() => setShowAddRow(v => !v)}
          className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Active</th>
            <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3">
                {editing?.id === item.id ? (
                  <input
                    autoFocus
                    value={editing.name}
                    onChange={e => setEditing(ed => ed ? { ...ed, name: e.target.value } : ed)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 w-full max-w-xs"
                    onKeyDown={e => { if (e.key === 'Enter') handleUpdate(item); if (e.key === 'Escape') setEditing(null); }}
                  />
                ) : (
                  <span className="font-medium text-gray-800">{item.name}</span>
                )}
              </td>
              <td className="px-6 py-3">
                {editing?.id === item.id ? (
                  <input
                    type="number"
                    value={editing.sortOrder}
                    onChange={e => setEditing(ed => ed ? { ...ed, sortOrder: Number(e.target.value) } : ed)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 w-20"
                  />
                ) : (
                  <span className="text-gray-500">{item.sortOrder}</span>
                )}
              </td>
              <td className="px-6 py-3">
                <button
                  onClick={() => onToggleActive(item)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    item.active ? 'bg-yellow-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.active ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-1.5">
                  {editing?.id === item.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(item)}
                        disabled={saving}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditing({ id: item.id, name: item.name, sortOrder: item.sortOrder })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {items.length === 0 && !showAddRow && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                No items yet — click Add to create one.
              </td>
            </tr>
          )}

          {/* Add row */}
          {showAddRow && (
            <tr className="border-b border-yellow-100 bg-yellow-50/50">
              <td className="px-6 py-3" colSpan={4}>
                <form onSubmit={handleAdd} className="flex items-center gap-3">
                  <input
                    autoFocus
                    required
                    placeholder="Name"
                    value={adding.name}
                    onChange={e => setAdding(a => ({ ...a, name: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 flex-1 max-w-xs"
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    value={adding.sortOrder}
                    onChange={e => setAdding(a => ({ ...a, sortOrder: Number(e.target.value) }))}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 w-20"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Adding…' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRow(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </form>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StoreConfigPage() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [sizes, setSizes] = useState<SizeCategory[]>([]);

  const loadRooms = () => adminGetRoomTypes().then(setRooms);
  const loadSizes = () => adminGetSizeCategories().then(setSizes);

  useEffect(() => {
    loadRooms();
    loadSizes();
  }, []);

  // ── Room handlers ─────────────────────────────────────────────────────────

  const handleAddRoom = async (data: { name: string; sortOrder: number }) => {
    await adminCreateRoomType({ ...data, active: true });
    loadRooms();
  };

  const handleUpdateRoom = async (id: string, data: { name: string; sortOrder: number; active: boolean }) => {
    await adminUpdateRoomType(id, data);
    loadRooms();
  };

  const handleDeleteRoom = async (id: string) => {
    await adminDeleteRoomType(id);
    loadRooms();
  };

  const handleToggleRoom = async (item: ListItem) => {
    await adminUpdateRoomType(item.id, { name: item.name, sortOrder: item.sortOrder, active: !item.active });
    loadRooms();
  };

  // ── Size handlers ─────────────────────────────────────────────────────────

  const handleAddSize = async (data: { name: string; sortOrder: number }) => {
    await adminCreateSizeCategory({ ...data, active: true });
    loadSizes();
  };

  const handleUpdateSize = async (id: string, data: { name: string; sortOrder: number; active: boolean }) => {
    await adminUpdateSizeCategory(id, data);
    loadSizes();
  };

  const handleDeleteSize = async (id: string) => {
    await adminDeleteSizeCategory(id);
    loadSizes();
  };

  const handleToggleSize = async (item: ListItem) => {
    await adminUpdateSizeCategory(item.id, { name: item.name, sortOrder: item.sortOrder, active: !item.active });
    loadSizes();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Store Configuration</h1>
        <p className="text-sm text-gray-400">Manage the room types and size categories used across the store and admin.</p>
      </div>

      <ConfigSection
        title="Room Types"
        items={rooms}
        onAdd={handleAddRoom}
        onUpdate={handleUpdateRoom}
        onDelete={handleDeleteRoom}
        onToggleActive={handleToggleRoom}
      />

      <ConfigSection
        title="Size Categories"
        items={sizes}
        onAdd={handleAddSize}
        onUpdate={handleUpdateSize}
        onDelete={handleDeleteSize}
        onToggleActive={handleToggleSize}
      />
    </div>
  );
}
