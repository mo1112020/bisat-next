'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, CloudUpload, ImageIcon, Search, X } from 'lucide-react';

interface CDNFile {
  name: string;
  id: string;
  size: number;
  publicUrl: string;
}

const MAX_SIZE_MB = 10;
const COMPRESS_IF_ABOVE_KB = 500;
const MAX_DIMENSION = 2000;
const COMPRESS_QUALITY = 0.82;

async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  if (file.size <= COMPRESS_IF_ABOVE_KB * 1024) return file;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const r = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * r);
        height = Math.round(height * r);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => resolve((!blob || blob.size >= file.size) ? file : new File([blob], file.name, { type: 'image/jpeg' })),
        'image/jpeg', COMPRESS_QUALITY,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// ── Single-select variant ───────────────────────────────────────────────────
interface SingleProps {
  multiple?: false;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

// ── Multi-select variant ────────────────────────────────────────────────────
interface MultiProps {
  multiple: true;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  placeholder?: string;
}

type Props = SingleProps | MultiProps;

export function CdnImagePicker(props: Props) {
  const { label, placeholder = 'Pick from CDN…' } = props;
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<CDNFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // normalise value to string[] internally
  const selected: string[] = props.multiple
    ? (props.value as string[])
    : (props.value as string) ? [(props.value as string)] : [];

  const commit = (urls: string[]) => {
    if (props.multiple) {
      (props as MultiProps).onChange(urls);
    } else {
      (props as SingleProps).onChange(urls[0] ?? '');
      setOpen(false);
    }
  };

  const toggle = (url: string) => {
    if (props.multiple) {
      const cur = props.value as string[];
      commit(cur.includes(url) ? cur.filter(u => u !== url) : [...cur, url]);
    } else {
      commit([url]);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/cdn');
    const json = await res.json();
    setFiles((json.files ?? []) as CDNFile[]);
    setLoading(false);
  }, []);

  useEffect(() => { if (open) load(); }, [open, load]);

  const handleUpload = async (fileList: FileList) => {
    const images = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    const tooBig = images.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig.length) { setUploadMsg(`Exceeds ${MAX_SIZE_MB} MB: ${tooBig.map(f => f.name).join(', ')}`); return; }
    setUploading(true);
    setUploadMsg(`Uploading ${images.length} image${images.length > 1 ? 's' : ''}…`);
    await Promise.all(images.map(async file => {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append('file', compressed, file.name);
      await fetch('/api/admin/cdn', { method: 'POST', body: fd });
    }));
    setUploading(false);
    setUploadMsg('');
    await load();
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  // ── Preview strip for selected images (outside modal) ───────────────────
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      )}

      {/* Selected thumbnails */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(url => (
            <div key={url} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => commit(selected.filter(u => u !== url))}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm border border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-500 hover:text-yellow-700 px-4 py-2.5 rounded-xl w-full transition-all"
      >
        <ImageIcon size={15} />
        {selected.length > 0
          ? props.multiple ? `${selected.length} image${selected.length > 1 ? 's' : ''} selected` : 'Change image'
          : placeholder}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">CDN Image Library</h3>
                <p className="text-xs text-gray-400 mt-0.5">{props.multiple ? 'Click to select/deselect · multiple allowed' : 'Click an image to select'}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Upload from within picker */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 rounded-lg transition-colors disabled:opacity-50"
                >
                  <CloudUpload size={13} />
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
                {props.multiple && selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Done ({selected.length})
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 ml-1">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Upload status */}
            {uploadMsg && (
              <div className="px-5 py-2 text-xs font-medium text-yellow-700 bg-yellow-50 border-b border-yellow-100 flex-shrink-0">
                {uploadMsg}
              </div>
            )}

            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search images…"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <ImageIcon size={36} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">{search ? 'No matches' : 'No images in CDN yet — upload some above'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {filtered.map(file => {
                    const isSelected = selected.includes(file.publicUrl);
                    return (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => toggle(file.publicUrl)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                          isSelected ? 'border-yellow-400 shadow-md shadow-yellow-200' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow">
                              <Check size={13} className="text-gray-950" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[9px] text-white truncate">{file.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.length) handleUpload(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}
