'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Meta } from '../components/Meta';
import { ArrowRight } from 'lucide-react';

const ROOMS = [
  {
    title: 'Living Room',
    description: 'Ground your living space with texture and warmth.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    href: '/shop?room=Living+Room',
    tag: 'Most Popular',
  },
  {
    title: 'Bedroom',
    description: 'Create a restful sanctuary underfoot.',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
    href: '/shop?room=Bedroom',
    tag: 'Bestseller',
  },
  {
    title: 'Dining Room',
    description: 'Define the dining area with a considered anchor piece.',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
    href: '/shop?room=Dining+Room',
    tag: null,
  },
  {
    title: 'Hallway',
    description: 'Make a strong first impression with the right runner.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    href: '/shop?room=Hallway',
    tag: null,
  },
  {
    title: 'Home Office',
    description: 'Bring calm and focus to your workspace.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    href: '/shop?room=Office',
    tag: null,
  },
  {
    title: 'Outdoor',
    description: 'Extend your interior style to open-air spaces.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
    href: '/shop',
    tag: 'New',
  },
];

const STYLE_GUIDES = [
  {
    title: 'How to Choose the Right Rug Size',
    excerpt: 'Proportion is everything. Learn the rules — then break them intentionally.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    href: '/size-guide',
  },
  {
    title: 'Layering Rugs: The Art of Texture',
    excerpt: 'A flat-weave under a pile rug adds depth and warmth to any room.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    href: '/blog',
  },
  {
    title: 'Caring for Your Handmade Rug',
    excerpt: 'Simple habits that preserve colour, pile, and character for decades.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    href: '/blog',
  },
];

export const Lookbook = () => {
  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta
        title="Room Ideas & Lookbook | Bisatim"
        description="Find the perfect rug for every room. Browse room inspiration, styling guides, and curated looks from Bisatim."
      />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="border-b border-bisat-border bg-bisat-ivory">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Inspiration</p>
          <h1 className="text-4xl sm:text-5xl font-light text-bisat-black mb-4 leading-tight max-w-xl">
            Room Ideas
          </h1>
          <p className="text-bisat-black/50 text-sm font-light leading-relaxed max-w-lg">
            Every room tells a story. Browse by space to find rugs that suit your layout, style, and light.
          </p>
        </div>
      </div>

      {/* ── Room grid ─────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bisat-border">
          {ROOMS.map((room) => (
            <Link
              key={room.title}
              href={room.href}
              className="group relative overflow-hidden aspect-[4/5] bg-bisat-ivory block"
            >
              <Image
                src={room.image}
                alt={room.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {room.tag && (
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-bisat-black text-[8px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
                    {room.tag}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-light mb-1">{room.title}</h3>
                <p className="text-white/60 text-xs font-light mb-3 leading-relaxed">{room.description}</p>
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-semibold text-white/80 group-hover:text-white transition-colors">
                  Shop Rugs <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Style guides ──────────────────────────────────────────── */}
      <section className="bg-bisat-cream border-t border-bisat-border py-14 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-3">Guides</p>
              <h2 className="text-2xl sm:text-3xl font-light text-bisat-black">Styling & Care</h2>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-bisat-black/40 hover:text-bisat-black transition-colors">
              All Articles <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bisat-border">
            {STYLE_GUIDES.map((guide) => (
              <Link key={guide.title} href={guide.href} className="group bg-bisat-ivory p-6 hover:bg-white transition-colors block">
                <div className="relative aspect-[16/9] overflow-hidden mb-5">
                  <Image src={guide.image} alt={guide.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <h3 className="text-base font-normal text-bisat-black mb-2 leading-snug group-hover:text-bisat-gold transition-colors">{guide.title}</h3>
                <p className="text-[12px] text-bisat-black/45 font-light leading-relaxed">{guide.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-bisat-border py-14 bg-bisat-ivory">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-2">Ready to shop?</p>
            <h2 className="text-2xl font-light text-bisat-black">Browse the full collection</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-bisat-black text-white px-8 py-3.5 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors">
            Shop All Rugs <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
};
