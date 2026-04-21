'use client';
import React, { useEffect, useState } from 'react';
import { Check, ImageIcon, RotateCcw } from 'lucide-react';
import { getSiteImages, adminUpsertSiteImage, SITE_IMAGE_DEFAULTS, SiteImageKey } from '@/src/lib/db-browser';
import { LIFESTYLE_SLOT_IMAGE_KEYS } from '@/src/lib/lifestyleQuad';
import { CdnImagePicker } from '@/src/components/CdnImagePicker';

type Images = Record<SiteImageKey, string>;

export default function SiteImagesPage() {
  const [images, setImages] = useState<Images | null>(null);
  const [saving, setSaving] = useState<SiteImageKey | null>(null);
  const [saved, setSaved] = useState<SiteImageKey | null>(null);

  useEffect(() => { getSiteImages().then(setImages); }, []);

  const handleSave = async (key: SiteImageKey, url: string) => {
    setSaving(key);
    await adminUpsertSiteImage(key, url);
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleChange = (key: SiteImageKey, url: string) => {
    setImages(prev => prev ? { ...prev, [key]: url } : prev);
  };

  const handleReset = async (key: SiteImageKey) => {
    const fallback = SITE_IMAGE_DEFAULTS[key].fallback;
    handleChange(key, fallback);
    await handleSave(key, fallback);
  };

  if (!images) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Images</h1>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Images</h1>
        <p className="text-sm text-gray-400 mt-1">
          Control which images appear in the static sections of your website. Pick from your CDN library. Lifestyle quad
          hero/thumbnails are edited under <strong className="text-gray-600">Lifestyle quad</strong> in the sidebar.
        </p>
      </div>

      <div className="space-y-4">
        {(Object.keys(SITE_IMAGE_DEFAULTS) as SiteImageKey[])
          .filter(key => !LIFESTYLE_SLOT_IMAGE_KEYS.includes(key))
          .map(key => {
          const { label, fallback } = SITE_IMAGE_DEFAULTS[key];
          const current = images[key];
          const isDefault = current === fallback;

          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-5">
                {/* Preview */}
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                  {current ? (
                    <img src={current} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-800">{label}</p>
                    {isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full uppercase tracking-wider">default</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono truncate mb-3">{current || '—'}</p>

                  <CdnImagePicker
                    value={current}
                    onChange={url => handleChange(key, url)}
                    placeholder="Pick from CDN…"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleSave(key, images[key])}
                    disabled={saving === key}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {saved === key ? <Check size={13} /> : null}
                    {saving === key ? 'Saving…' : saved === key ? 'Saved!' : 'Save'}
                  </button>
                  {!isDefault && (
                    <button
                      onClick={() => handleReset(key)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <RotateCcw size={12} />
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
