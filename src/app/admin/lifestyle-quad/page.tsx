'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Check, Layers } from 'lucide-react';
import {
  getSiteSettings,
  getSiteImages,
  adminUpsertSiteSetting,
  adminUpsertSiteImage,
  SITE_IMAGE_DEFAULTS,
  type SiteImageKey,
} from '@/src/lib/db-browser';
import { CdnImagePicker } from '@/src/components/CdnImagePicker';
import {
  DEFAULT_LIFESTYLE_QUAD_PAYLOAD,
  getLifestyleQuadPayload,
  LIFESTYLE_QUAD_SETTINGS_KEY,
  LIFESTYLE_SLOT_IMAGE_KEYS,
  serializeLifestyleQuadPayload,
  type LifestyleQuadPayload,
} from '@/src/lib/lifestyleQuad';

type ImagesState = Record<SiteImageKey, string>;

function clonePayload(p: LifestyleQuadPayload): LifestyleQuadPayload {
  return JSON.parse(JSON.stringify(p)) as LifestyleQuadPayload;
}

export default function AdminLifestyleQuadPage() {
  const [payload, setPayload] = useState<LifestyleQuadPayload | null>(null);
  const [images, setImages] = useState<ImagesState | null>(null);
  const [baselinePayload, setBaselinePayload] = useState<LifestyleQuadPayload | null>(null);
  const [baselineImages, setBaselineImages] = useState<ImagesState | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getSiteSettings(), getSiteImages()]).then(([s, imgs]) => {
      const p = getLifestyleQuadPayload(s);
      setPayload(clonePayload(p));
      setBaselinePayload(clonePayload(p));
      setImages({ ...imgs });
      setBaselineImages({ ...imgs });
    });
  }, []);

  const isDirty = useMemo(() => {
    if (!payload || !images || !baselinePayload || !baselineImages) return false;
    if (serializeLifestyleQuadPayload(payload) !== serializeLifestyleQuadPayload(baselinePayload)) return true;
    return LIFESTYLE_SLOT_IMAGE_KEYS.some(k => images[k] !== baselineImages[k]);
  }, [payload, images, baselinePayload, baselineImages]);

  const updateCard = (i: number, patch: Partial<LifestyleQuadPayload['cards'][number]>) => {
    setPayload(p => {
      if (!p) return p;
      return {
        ...p,
        cards: p.cards.map((c, j) => (j === i ? { ...c, ...patch } : c)),
      };
    });
  };

  const updateBullet = (cardIndex: number, bulletIndex: number, text: string) => {
    setPayload(p => {
      if (!p) return p;
      const cards = p.cards.map((c, j) => {
        if (j !== cardIndex) return c;
        const bullets = [...c.bullets] as [string, string, string];
        bullets[bulletIndex] = text;
        return { ...c, bullets };
      });
      return { ...p, cards };
    });
  };

  const handleSave = async () => {
    if (!payload || !images) return;
    setSaving(true);
    setError('');
    try {
      const okJson = await adminUpsertSiteSetting(LIFESTYLE_QUAD_SETTINGS_KEY, serializeLifestyleQuadPayload(payload));
      const imgResults = await Promise.all(
        LIFESTYLE_SLOT_IMAGE_KEYS.map(k => adminUpsertSiteImage(k, images[k] ?? SITE_IMAGE_DEFAULTS[k].fallback))
      );
      if (!okJson || imgResults.some(r => !r)) {
        setError('Something failed to save. Try again.');
        setSaving(false);
        return;
      }
      setBaselinePayload(clonePayload(payload));
      setBaselineImages({ ...images });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    } catch {
      setError('Network error while saving.');
    }
    setSaving(false);
  };

  const handleResetCopy = () => {
    setPayload(clonePayload(DEFAULT_LIFESTYLE_QUAD_PAYLOAD));
  };

  if (!payload || !images) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="text-yellow-500" size={26} />
            Home — lifestyle quad
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Four Rughaus-style tiles on the homepage: section title, copy, links, bullets, and hero/thumbnail images
            (stored as <code className="text-xs bg-gray-100 px-1 rounded">{LIFESTYLE_QUAD_SETTINGS_KEY}</code> plus eight
            site image keys).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {savedFlash && (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              <Check size={14} /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={handleResetCopy}
            className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Reset copy to defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="text-xs font-bold px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-gray-950 disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save all'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Section header</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Eyebrow</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
              value={payload.eyebrow}
              onChange={e => setPayload({ ...payload, eyebrow: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
              value={payload.title}
              onChange={e => setPayload({ ...payload, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subtitle</label>
            <textarea
              rows={2}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none"
              value={payload.subtitle}
              onChange={e => setPayload({ ...payload, subtitle: e.target.value })}
            />
          </div>
        </div>
      </div>

      {[0, 1, 2, 3].map(slot => {
        const card = payload.cards[slot]!;
        const heroKey = `lifestyle_${slot + 1}_hero` as SiteImageKey;
        const thumbKey = `lifestyle_${slot + 1}_thumb` as SiteImageKey;
        return (
          <div key={slot} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/80">
              <h2 className="font-bold text-gray-900">Card {slot + 1}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kicker (top line)</label>
                  <input
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    value={card.kicker}
                    onChange={e => updateCard(slot, { kicker: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Link (href)</label>
                  <input
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono"
                    value={card.href}
                    onChange={e => updateCard(slot, { href: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centered title</label>
                <input
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  value={card.title}
                  onChange={e => updateCard(slot, { title: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[0, 1, 2].map(bi => (
                  <div key={bi}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bullet {bi + 1}</label>
                    <input
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                      value={card.bullets[bi]}
                      onChange={e => updateBullet(slot, bi, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero image</p>
                  <div className="mb-2 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[heroKey]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <CdnImagePicker
                    value={images[heroKey]}
                    onChange={url => setImages(prev => (prev ? { ...prev, [heroKey]: url } : prev))}
                    placeholder="Pick hero from CDN…"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thumbnail</p>
                  <div className="mb-2 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[thumbKey]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <CdnImagePicker
                    value={images[thumbKey]}
                    onChange={url => setImages(prev => (prev ? { ...prev, [thumbKey]: url } : prev))}
                    placeholder="Pick thumb from CDN…"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
