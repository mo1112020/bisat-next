'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'thick',
    kicker: 'Plush, high-pile rugs',
    title: 'Find Rich, High-Quality Rugs',
    heroSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=160&auto=format&fit=crop',
    bullets: ['Refined texture and hand-feel', 'Dense, full pile construction', 'Mid to high price range'],
    href: '/collections/thick-texture',
  },
  {
    id: 'kids',
    kicker: 'Easy-care rugs for family life',
    title: 'Live Beautifully with Kids and Pets',
    heroSrc: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1585412727339-54e4be3f3467?q=80&w=160&auto=format&fit=crop',
    bullets: ['Washable and simple to maintain', 'Shorter pile, practical underfoot', 'Low to mid price range'],
    href: '/collections/kids-pets',
  },
  {
    id: 'vintage',
    kicker: 'One-of-a-kind vintage',
    title: 'Meet a Singular Vintage Piece',
    heroSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=160&auto=format&fit=crop',
    bullets: ['Buyer-curated one-off finds', 'Persian and Anatolian character', 'High price range'],
    href: '/collections/vintage',
  },
  {
    id: 'custom',
    kicker: 'Made-to-measure for your room',
    title: 'Cover the Whole Floor Plan',
    heroSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=160&auto=format&fit=crop',
    bullets: ['Flexible bespoke sizing', 'Tailored to your layout', 'High price range'],
    href: '/collections/custom',
  },
] as const;

type Category = typeof CATEGORIES[number];

const TAB_LABELS: Record<string, string> = {
  thick: 'Plush Rugs',
  kids: 'Kids & Pets',
  vintage: 'Vintage',
  custom: 'Custom Size',
};

/* ─── Main section ──────────────────────────────────────────────────────────── */
export const LifestyleSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0].id);

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-bisat-black/[0.06]">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-10">

        {/* Section heading */}
        <div className="mb-12 sm:mb-16">
          <h2 className="font-sans text-[1.45rem] sm:text-[1.75rem] font-light text-bisat-black leading-tight tracking-[-0.025em]">
            Choose a Rug to Suit Your Lifestyle
          </h2>
          <div className="mt-3 h-px w-10 bg-bisat-black/50" />
        </div>

        {/* ── Desktop 4-column grid (lg+) ─────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:items-stretch">
          {CATEGORIES.map((cat, idx) => (
            <ScrollReveal key={cat.id} delay={idx * 80} className="h-full">
              <DesktopCard cat={cat} />
            </ScrollReveal>
          ))}
        </div>

        {/* ── Mobile tab strip ────────────────────────────────────────────── */}
        <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`whitespace-nowrap rounded-full border px-5 py-2 text-[11px] font-semibold tracking-wide transition-colors duration-200 ${
                activeTab === cat.id
                  ? 'border-bisat-black bg-bisat-black text-white'
                  : 'border-bisat-border bg-white text-bisat-black/55 hover:border-bisat-black/30'
              }`}
            >
              {TAB_LABELS[cat.id]}
            </button>
          ))}
        </div>

        {/* ── Mobile animated card ─────────────────────────────────────────── */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {CATEGORIES.filter((c) => c.id === activeTab).map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <MobileCard cat={cat} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

/* ─── Desktop Card ─────────────────────────────────────────────────────────── */
const DesktopCard: React.FC<{ cat: Category }> = ({ cat }) => (
  <Link href={cat.href} className="group flex flex-col h-full focus:outline-none">

    {/* Overhead Category Label + 2px Vertical Stroke (user updated) */}
    <div className="mb-3.5 flex items-center gap-2 px-0.5">
      <div style={{ width: '2px', height: '14px', backgroundColor: '#000000', flexShrink: 0 }} />
      <span className="text-[11px] font-medium leading-tight text-bisat-black uppercase tracking-[0.05em]">
        {cat.kicker}
      </span>
    </div>

    {/* Card Container: Asymmetrical Rounding, 1px Black border (user updated) */}
    <div 
      className="flex flex-col flex-1 bg-white overflow-hidden transition-all duration-300"
      style={{ 
        border: '1px solid #000000', 
        borderTopLeftRadius: '0px', 
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        boxShadow: 'none',
      }}
    >
      {/* Top Lifestyle Image: User updated to 4/2.5 ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 2.5' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.heroSrc}
          alt={cat.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1s] group-hover:scale-[1.03]"
        />
      </div>

      {/* Main Card Title: User updated to py-4 */}
      <div className="px-4 py-4 text-center">
        <h3 className="font-sans text-[17.5px] font-semibold leading-tight tracking-tight text-bisat-black whitespace-nowrap overflow-hidden text-ellipsis w-full">
          {cat.title}
        </h3>
      </div>

      {/* Internal Divider: Sharp 2px solid black line */}
      <div style={{ height: '2px', backgroundColor: '#000000', margin: '0 16px' }} />

      {/* Details Row: NO vertical padding (py-0) */}
      <div className="flex items-center gap-4 px-5 py-0 flex-1 bg-white">
        {/* Thumbnail: Enlarged to 84px, no vertical space */}
        <div 
          className="shrink-0 overflow-hidden border border-bisat-black/5"
          style={{ width: '84px', height: '84px' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cat.thumbSrc}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <ul className="space-y-1.5 py-4">
          {cat.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[11.5px] font-light leading-relaxed text-bisat-black/70">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-black" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Link>
);

/* ─── Mobile Card ───────────────────────────────────────────────────────────── */
const MobileCard: React.FC<{ cat: Category }> = ({ cat }) => (
  <Link href={cat.href} className="group flex flex-col focus:outline-none">

    {/* Kicker */}
    <div className="mb-3.5 flex items-center gap-2">
      <div style={{ width: '2px', height: '14px', backgroundColor: '#000000', flexShrink: 0 }} />
      <span className="text-[12px] font-medium leading-tight text-bisat-black uppercase tracking-[0.05em]">
        {cat.kicker}
      </span>
    </div>

    {/* Card */}
    <div 
      className="flex flex-col bg-white overflow-hidden"
      style={{ 
        border: '1px solid #000000', 
        borderTopLeftRadius: '0px', 
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: 'none'
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 2.5' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.heroSrc}
          alt={cat.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="px-4 py-4 text-center">
        <h3 className="font-sans text-[19px] font-semibold leading-snug tracking-tight text-bisat-black">
          {cat.title}
        </h3>
      </div>
      <div style={{ height: '2px', backgroundColor: '#000000', margin: '0 16px' }} />
      <div className="flex items-center gap-5 px-6 py-0">
        <div 
          className="shrink-0 overflow-hidden border border-bisat-black/5"
          style={{ width: '90px', height: '90px' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cat.thumbSrc} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <ul className="space-y-2.5 py-6">
          {cat.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] font-light leading-relaxed text-bisat-black/70">
              <span className="mt-[8.5px] h-[5px] w-[5px] shrink-0 rounded-full bg-black" />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 pb-10 flex justify-center">
        <span className="inline-flex items-center justify-center rounded-full bg-bisat-black px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
          View Collection
        </span>
      </div>
    </div>
  </Link>
);
