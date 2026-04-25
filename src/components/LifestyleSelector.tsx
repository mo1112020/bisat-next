'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

export interface LifestyleCategory {
  id: string;
  tabLabel?: string;
  kicker: string;
  title: string;
  heroSrc: string;
  thumbSrc: string;
  bullets: string[];
  href: string;
}

const DEFAULT_CATEGORIES: LifestyleCategory[] = [
  {
    id: 'thick',
    tabLabel: 'Plush Rugs',
    kicker: 'Plush, high-pile rugs',
    title: 'Find Rich, High-Quality Rugs',
    heroSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=160&auto=format&fit=crop',
    bullets: ['Refined texture and hand-feel', 'Dense, full pile construction', 'Mid to high price range'],
    href: '/collections/authentic-rugs',
  },
  {
    id: 'kids',
    tabLabel: 'Kids & Pets',
    kicker: 'Easy-care rugs for family life',
    title: 'Live Beautifully with Kids and Pets',
    heroSrc: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1585412727339-54e4be3f3467?q=80&w=160&auto=format&fit=crop',
    bullets: ['Washable and simple to maintain', 'Shorter pile, practical underfoot', 'Low to mid price range'],
    href: '/collections/easy-rugs',
  },
  {
    id: 'vintage',
    tabLabel: 'Vintage',
    kicker: 'One-of-a-kind vintage',
    title: 'Meet a Singular Vintage Piece',
    heroSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=160&auto=format&fit=crop',
    bullets: ['Buyer-curated one-off finds', 'Persian and Anatolian character', 'High price range'],
    href: '/collections/vintage-rugs',
  },
  {
    id: 'custom',
    tabLabel: 'Custom Size',
    kicker: 'Made-to-measure for your room',
    title: 'Cover the Whole Floor Plan',
    heroSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1000&auto=format&fit=crop',
    thumbSrc: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=160&auto=format&fit=crop',
    bullets: ['Flexible bespoke sizing', 'Tailored to your layout', 'High price range'],
    href: '/collections/custom-rugs',
  },
] as const;

type Category = LifestyleCategory;

export const LifestyleSelector: React.FC<{ items?: LifestyleCategory[] }> = ({ items }) => {
  const categories = items && items.length > 0 ? items : DEFAULT_CATEGORIES;
  const [activeTab, setActiveTab] = useState<string>(categories[0].id);

  useEffect(() => {
    setActiveTab(current => (categories.some(category => category.id === current) ? current : categories[0].id));
  }, [categories]);

  return (
    <section className="border-b border-bisat-black/[0.06] bg-white py-16 sm:py-24">
      <div className="bisat-shell">
        <div className="mb-12 sm:mb-16">
          <h2 className="font-sans text-[1.45rem] font-light leading-tight tracking-[-0.025em] text-bisat-black sm:text-[1.75rem]">
            Choose a Rug to Suit Your Lifestyle
          </h2>
          <div className="mt-3 h-px w-10 bg-bisat-black/50" />
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 lg:items-stretch lg:gap-6">
          {categories.map((cat, idx) => (
            <ScrollReveal key={cat.id} delay={idx * 80} className="h-full">
              <DesktopCard cat={cat} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`whitespace-nowrap rounded-full border px-5 py-2 text-[11px] font-semibold tracking-wide transition-colors duration-200 ${
                activeTab === cat.id
                  ? 'border-bisat-black bg-bisat-black text-white'
                  : 'border-bisat-black/[0.07] bg-white text-bisat-black/55 hover:border-bisat-black/30'
              }`}
            >
              {cat.tabLabel ?? cat.title}
            </button>
          ))}
        </div>

        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {categories.filter(category => category.id === activeTab).map(cat => (
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

const DesktopCard: React.FC<{ cat: Category }> = ({ cat }) => (
  <Link href={cat.href} className="group flex h-full flex-col focus:outline-none">
    <div className="mb-3.5 flex items-center gap-2 px-0.5">
      <div style={{ width: '2px', height: '14px', backgroundColor: '#000000', flexShrink: 0 }} />
      <span className="text-[11px] font-medium uppercase leading-tight tracking-[0.05em] text-bisat-black">
        {cat.kicker}
      </span>
    </div>

    <div
      className="flex flex-1 flex-col overflow-hidden bg-white transition-all duration-300 group-hover:shadow-[0_18px_40px_rgba(26,26,26,0.08)]"
      style={{
        border: '1px solid #000000',
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 2.5' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.heroSrc}
          alt={cat.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1s] group-hover:scale-[1.03]"
        />
      </div>

      <div className="px-4 py-4 text-center">
        <h3 className="font-sans text-[17px] font-semibold leading-tight tracking-tight text-bisat-black">
          {cat.title}
        </h3>
      </div>

      <div style={{ height: '2px', backgroundColor: '#000000', margin: '0 16px' }} />

      <div className="flex flex-1 items-center gap-4 bg-white px-5 py-0">
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
          {cat.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-[11.5px] font-light leading-relaxed text-bisat-black/70">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-black" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Link>
);

const MobileCard: React.FC<{ cat: Category }> = ({ cat }) => (
  <Link href={cat.href} className="group flex flex-col focus:outline-none">
    <div className="mb-3.5 flex items-center gap-2">
      <div style={{ width: '2px', height: '14px', backgroundColor: '#000000', flexShrink: 0 }} />
      <span className="text-[12px] font-medium uppercase leading-tight tracking-[0.05em] text-bisat-black">
        {cat.kicker}
      </span>
    </div>

    <div
      className="flex flex-col overflow-hidden bg-white"
      style={{
        border: '1px solid #000000',
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
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
          {cat.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] font-light leading-relaxed text-bisat-black/70">
              <span className="mt-[8.5px] h-[5px] w-[5px] shrink-0 rounded-full bg-black" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center px-6 pb-10">
        <span className="inline-flex items-center justify-center rounded-full bg-bisat-black px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
          View Collection
        </span>
      </div>
    </div>
  </Link>
);
