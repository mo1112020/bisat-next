'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Upload, Trash2, Copy, Check, ImageIcon, HardDrive, X, Search, CloudUpload } from 'lucide-react';

const MAX_SIZE_MB = 10;          // reject files larger than this
const COMPRESS_IF_ABOVE_KB = 500; // compress if file > 500 KB
const MAX_DIMENSION = 2000;       // scale down if width or height > 2000 px
const COMPRESS_QUALITY = 0.82;    // JPEG quality after compression

interface CDNFile {
  name: string;
  id: string;
  updated_at: string;
  size: number;
  mimetype: string;
  publicUrl: string;
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Compress an image file client-side using Canvas
async function compressImage(file: File): Promise<File> {
  const isSVG = file.type === 'image/svg+xml';
  const isGIF = file.type === 'image/gif';
  // Don't compress SVG or GIF (GIF would lose animation)
  if (isSVG || isGIF) return file;
  // Don't compress if already small
  if (file.size <= COMPRESS_IF_ABOVE_KB * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      // Scale down if too large
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file); // compression made it bigger, keep original
          } else {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }
        },
        'image/jpeg',
        COMPRESS_QUALITY,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function CDNPage() {
  const [files, setFiles] = useState<CDNFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadLogs, setUploadLogs] = useState<{ msg: string; status: 'pending' | 'done' | 'error' }[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CDNFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/cdn');
    const json = await res.json();
    if (!res.ok) { setError(json.error); setLoading(false); return; }
    setFiles(json.files ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadFiles = async (fileList: FileList) => {
    const images = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (images.length === 0) { setError('Only image files are allowed.'); return; }

    // Validate size before anything
    const tooBig = images.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig.length > 0) {
      setError(`These files exceed the ${MAX_SIZE_MB} MB limit: ${tooBig.map(f => f.name).join(', ')}`);
      return;
    }

    setUploading(true);
    setUploadLogs(images.map(f => ({ msg: `Preparing ${f.name}…`, status: 'pending' as const })));

    await Promise.all(
      images.map(async (file, i) => {
        // Compress client-side first
        setUploadLogs(prev => {
          const next = [...prev];
          next[i] = { msg: `Compressing ${file.name}…`, status: 'pending' };
          return next;
        });
        const compressed = await compressImage(file);
        const savedKB = Math.round((file.size - compressed.size) / 1024);

        setUploadLogs(prev => {
          const next = [...prev];
          next[i] = {
            msg: `Uploading ${file.name}${savedKB > 0 ? ` (saved ${savedKB} KB)` : ''}…`,
            status: 'pending',
          };
          return next;
        });

        const fd = new FormData();
        fd.append('file', compressed, file.name);
        const res = await fetch('/api/admin/cdn', { method: 'POST', body: fd });
        const json = await res.json();

        setUploadLogs(prev => {
          const next = [...prev];
          next[i] = res.ok
            ? { msg: `Done: ${file.name}${savedKB > 0 ? ` · saved ${savedKB} KB` : ''}`, status: 'done' }
            : { msg: `Failed: ${file.name} — ${json.error}`, status: 'error' };
          return next;
        });
      })
    );

    setUploading(false);
    await load();
    setTimeout(() => setUploadLogs([]), 4000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (file: CDNFile) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    setDeleting(file.name);
    const res = await fetch('/api/admin/cdn', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error);
    setDeleting(null);
    if (preview?.name === file.name) setPreview(null);
    await load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const totalSize = files.reduce((acc, f) => acc + (f.size ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CDN Images</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {files.length} image{files.length !== 1 ? 's' : ''} · {formatBytes(totalSize)} used
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          <Upload size={16} />
          Upload Images
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
      </div>

      {/* Limits info */}
      <div className="mb-5 flex items-center gap-4 text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
        <span>Max file size: <strong className="text-gray-600">{MAX_SIZE_MB} MB</strong></span>
        <span>·</span>
        <span>Auto-compressed if &gt; <strong className="text-gray-600">{COMPRESS_IF_ABOVE_KB} KB</strong></span>
        <span>·</span>
        <span>Max resolution: <strong className="text-gray-600">{MAX_DIMENSION}×{MAX_DIMENSION}px</strong></span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <X size={15} className="flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
        </div>
      )}

      {/* Upload log */}
      {uploadLogs.length > 0 && (
        <div className="mb-4 bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-3 space-y-1">
          {uploadLogs.map((log, i) => (
            <p key={i} className={`text-xs font-medium ${
              log.status === 'done' ? 'text-green-600' :
              log.status === 'error' ? 'text-red-600' : 'text-gray-400'
            }`}>
              {log.msg}
            </p>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all select-none ${
          dragOver ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
        }`}
      >
        <CloudUpload size={36} className={`mx-auto mb-2 transition-colors ${dragOver ? 'text-yellow-500' : 'text-gray-300'}`} />
        <p className="text-sm font-medium text-gray-500">
          {uploading ? 'Processing…' : 'Drop images here or click to upload'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP, GIF, SVG · auto-compressed</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by filename…"
          className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-yellow-400 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <ImageIcon size={44} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm">
            {search ? 'No images match your search' : 'No images yet — upload some above'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(file => (
            <div
              key={file.id}
              className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              <div
                className="aspect-square bg-gray-50 overflow-hidden cursor-zoom-in"
                onClick={() => setPreview(file)}
              >
                <img
                  src={file.publicUrl}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="px-3 py-2.5">
                <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatBytes(file.size ?? 0)}</p>
              </div>

              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => { e.stopPropagation(); copyUrl(file.publicUrl); }}
                  title="Copy URL"
                  className="w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg shadow text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {copied === file.publicUrl ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(file); }}
                  disabled={deleting === file.name}
                  title="Delete"
                  className="w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg shadow text-gray-600 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Deleting overlay */}
              {deleting === file.name && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                  <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer stats */}
      {files.length > 0 && !loading && (
        <div className="mt-6 flex items-center gap-6 text-xs text-gray-400 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5"><ImageIcon size={13} /> {files.length} images</span>
          <span className="flex items-center gap-1.5"><HardDrive size={13} /> {formatBytes(totalSize)}</span>
          {search && filtered.length !== files.length && (
            <span className="text-yellow-600 font-medium">{filtered.length} matching &quot;{search}&quot;</span>
          )}
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-800 truncate mr-4 min-w-0">{preview.name}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyUrl(preview.publicUrl)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 rounded-lg transition-colors"
                >
                  {copied === preview.publicUrl ? <Check size={12} /> : <Copy size={12} />}
                  {copied === preview.publicUrl ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  onClick={() => handleDelete(preview)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
                <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-700 ml-1">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center min-h-0">
              <img src={preview.publicUrl} alt={preview.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-400 flex-shrink-0">{formatBytes(preview.size ?? 0)}</span>
              <code className="text-xs text-gray-500 truncate flex-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                {preview.publicUrl}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
