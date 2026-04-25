'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Meta } from '../components/Meta';
import { ArrowRight } from 'lucide-react';

const SHELL = 'mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-16';

const ROOMS = [
  {
    title: 'Living Room',
    description: 'Ground your living space with texture and warmth.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
    href: '/collections/rug?room=Living+Room',
  },
  {
    title: 'Bedroom',
    description: 'Create a restful sanctuary underfoot.',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200',
    href: '/collections/rug?room=Bedroom',
  },
  {
    title: 'Dining Room',
    description: 'Define the dining area with a considered anchor piece.',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200',
    href: '/collections/rug?room=Dining+Room',
  },
  {
    title: 'Hallway',
    description: 'Make a strong first impression with the right runner.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    href: '/collections/rug?room=Hallway',
  },
  {
    title: 'Home Office',
    description: 'Bring calm and focus to your workspace.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
    href: '/collections/rug?room=Office',
  },
  {
    title: 'Outdoor',
    description: 'Extend your interior style to open-air spaces.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200',
    href: '/collections/rug',
  },
];

const STYLE_GUIDES = [
  {
    title: 'How to Choose the Right Rug Size',
    excerpt: 'Proportion is everything. Learn the rules — then break them intentionally.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    href: '/size-guide',
  },
  {
    title: 'Layering Rugs: The Art of Texture',
    excerpt: 'A flat-weave under a pile rug adds depth and warmth to any room.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    href: '/blog',
  },
  {
    title: 'Caring for Your Handmade Rug',
    excerpt: 'Simple habits that preserve colour, pile, and character for decades.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    href: '/blog',
  },
];

export const Lookbook = () => {
  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Room Ideas | Bisatim"
        description="Find the perfect rug for every room. Browse room inspiration, styling guides, and curated looks from Bisatim."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-bisat-black px-5 py-28 text-white sm:py-40 lg:py-52">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
            Room Ideas
          </p>
          <h1 className="font-rh text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] text-white">
            Every room is a canvas.
          </h1>
          <p className="mx-auto mt-8 max-w-[520px] text-[15px] leading-[1.9] text-white/40">
            Browse by space to find rugs that suit your layout, proportions, and light. Real rooms, real scale.
          </p>
        </div>
      </section>

      {/* ── Room Grid — full-width, edge-to-edge ──── */}
      <section className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room, i) => (
            <Link
              key={room.title}
              href={room.href}
              className="group relative overflow-hidden"
              style={{ minHeight: 'clamp(320px, 48vw, 680px)' }}
            >
              <Image
                src={room.image}
                alt={room.title}
                fill
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/15 to-transparent" />
              {/* Right border between tiles */}
              {(i % 3 !== 2) && <div className="absolute right-0 inset-y-0 w-px bg-white/12 hidden lg:block" />}
              {(i % 2 !== 1) && <div className="absolute right-0 inset-y-0 w-px bg-white/12 lg:hidden" />}
              {/* Bottom border between rows */}
              {i < ROOMS.length - (ROOMS.length % 3 || 3) && <div className="absolute bottom-0 inset-x-0 h-px bg-white/12" />}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <p className="font-rh text-[1.75rem] font-light leading-[1.1] text-white sm:text-[2.25rem] lg:text-[2.75rem]">
                  {room.title}
                </p>
                <p className="mt-2 text-[12px] leading-[1.6] text-white/50 group-hover:text-white/70 transition-colors duration-300 max-w-[240px]">
                  {room.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/50 transition-all duration-300 group-hover:text-white/90">
                  Shop <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Editorial Pull Quote ───────────────────── */}
      <section className="bg-white px-5 py-24 text-center sm:py-36">
        <div className="mx-auto max-w-[780px]">
          <p className="font-rh text-[clamp(1.75rem,4vw,3rem)] font-light italic leading-[1.3] text-bisat-black">
            &ldquo;Scale and proportion decide a room. The right rug doesn&apos;t just sit on a floor — it defines one.&rdquo;
          </p>
          <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.38em] text-bisat-black/28">
            Bisāṭim
          </p>
        </div>
      </section>

      {/* ── Styling Guides ────────────────────────── */}
      <section className="bg-[#f7f5f2] py-20 sm:py-28">
        <div className={SHELL}>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-bisat-black/35">
                Guides
              </p>
              <h2 className="font-rh text-[2.25rem] font-light leading-[1.1] text-bisat-black sm:text-[3rem]">
                Styling & Care
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-2 border-b border-bisat-black/25 pb-px text-[11px] font-medium uppercase tracking-[0.22em] text-bisat-black/55 transition-colors hover:border-bisat-black hover:text-bisat-black sm:inline-flex"
            >
              All articles
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px bg-bisat-black/[0.07] sm:grid-cols-3">
            {STYLE_GUIDES.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group block bg-white"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-8 py-8 sm:px-10">
                  <h3 className="font-rh text-[1.5rem] font-light leading-snug text-bisat-black sm:text-[1.625rem]">
                    {guide.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.8] text-bisat-black/48">
                    {guide.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-bisat-black/35 transition-all duration-300 group-hover:text-bisat-black">
                    Read <ArrowRight size={9} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="bg-bisat-black py-20 sm:py-28">
        <div className="mx-auto max-w-[560px] px-5 text-center">
          <h2 className="font-rh text-[2.25rem] font-light leading-[1.15] text-white sm:text-[3rem]">
            Ready to find your rug?
          </h2>
          <p className="mt-5 text-[15px] leading-[1.85] text-white/38">
            Browse our full collection of handmade, vintage, and contemporary pieces.
          </p>
          <div className="mt-10">
            <Link href="/collections/rug" className="inline-flex items-center gap-3 bg-white px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-bisat-black transition-colors hover:bg-white/85">
              Shop all rugs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
