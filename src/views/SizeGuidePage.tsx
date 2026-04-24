import React from 'react';
import Link from 'next/link';
import { Meta } from '../components/Meta';
import { ArrowRight, Check } from 'lucide-react';

const SIZES = [
  {
    name: 'Small',
    dimensions: 'Up to 160 × 230 cm',
    sqm: 'Under 4 m²',
    rooms: ['Bedside', 'Entry', 'Small office'],
    tip: 'Perfect under a coffee table or beside the bed. Ensure at least the front legs of sofas sit on the rug.',
  },
  {
    name: 'Medium',
    dimensions: '160 × 230 — 200 × 300 cm',
    sqm: '4 – 8 m²',
    rooms: ['Living room', 'Dining room', 'Bedroom'],
    tip: 'The most versatile size. In a living room, all front sofa legs should rest on the rug.',
  },
  {
    name: 'Large',
    dimensions: '200 × 300 cm and above',
    sqm: '8 – 12 m²',
    rooms: ['Open-plan living', 'Large dining', 'Master bedroom'],
    tip: 'All furniture legs sit fully on the rug. Leave at least 45 cm of floor visible around all edges.',
  },
  {
    name: 'Runner',
    dimensions: '70 – 90 cm wide, any length',
    sqm: 'Variable',
    rooms: ['Hallway', 'Kitchen', 'Staircase'],
    tip: 'Leave 10–15 cm of floor on each side. For a hallway, the runner should extend close to both walls.',
  },
];

const ROOM_GUIDES = [
  { room: 'Living Room', recommendation: '200 × 290 cm or larger', rule: 'Front sofa legs on the rug minimum. All four legs preferred.' },
  { room: 'Dining Room', recommendation: '230 × 300 cm minimum', rule: 'All chairs should remain on the rug even when pulled out.' },
  { room: 'Bedroom (King)', recommendation: '200 × 290 cm or two runners', rule: 'At least 60 cm extending from each side of the bed.' },
  { room: 'Bedroom (Queen)', recommendation: '160 × 230 cm or larger', rule: 'Same rule — the rug should frame the bed generously.' },
  { room: 'Hallway', recommendation: '70–80 cm wide runner', rule: 'Match the length of the hallway, leaving 15 cm clearance at walls.' },
  { room: 'Home Office', recommendation: '160 × 230 cm', rule: 'Large enough for the desk and chair, including when the chair is pulled back.' },
];

export const SizeGuidePage = () => {
  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta
        title="Rug Size Guide | Bisatim"
        description="Find the perfect rug size for every room. Our comprehensive size guide covers living rooms, bedrooms, dining rooms, hallways, and more."
      />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="border-b border-bisat-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Shopping Help</p>
          <h1 className="text-4xl sm:text-5xl font-light text-bisat-black mb-4 leading-tight">
            Rug Size Guide
          </h1>
          <p className="text-bisat-black/50 text-sm font-light leading-relaxed max-w-lg">
            Choosing the right size is the single most important decision when buying a rug. These guidelines will help you get it right.
          </p>
        </div>
      </div>

      {/* ── The golden rule ───────────────────────────────────────── */}
      <section className="bg-bisat-cream border-b border-bisat-border py-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-8 h-8 bg-bisat-black flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-semibold text-bisat-black text-sm mb-1">The golden rule</p>
              <p className="text-bisat-black/55 text-sm font-light leading-relaxed">
                When in doubt, go larger. A rug that is too small visually shrinks the room and makes furniture appear to float. A larger rug grounds the space and creates a sense of luxury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Size categories ───────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-10">Size Categories</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-bisat-border">
            {SIZES.map((size) => (
              <div key={size.name} className="bg-bisat-ivory p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-normal text-bisat-black">{size.name}</h3>
                    <p className="text-[11px] text-bisat-black/40 font-light mt-0.5">{size.dimensions}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold bg-bisat-cream text-bisat-black/50 px-2.5 py-1">{size.sqm}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {size.rooms.map(r => (
                    <span key={r} className="text-[10px] border border-bisat-border text-bisat-black/50 px-2 py-0.5 font-light">{r}</span>
                  ))}
                </div>
                <p className="text-[12px] text-bisat-black/50 font-light leading-relaxed border-t border-bisat-border pt-4">{size.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Room-by-room guide ────────────────────────────────────── */}
      <section className="bg-bisat-cream border-t border-bisat-border py-14 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-3">By Room</p>
          <h2 className="text-2xl sm:text-3xl font-light text-bisat-black mb-10">Room-by-Room Recommendations</h2>
          <div className="divide-y divide-bisat-border border border-bisat-border">
            {ROOM_GUIDES.map((guide) => (
              <div key={guide.room} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 p-6 bg-bisat-ivory hover:bg-white transition-colors">
                <div>
                  <p className="font-normal text-bisat-black text-sm">{guide.room}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-bisat-black/30 mb-1">Recommended Size</p>
                  <p className="text-sm font-light text-bisat-black">{guide.recommendation}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-bisat-black/30 mb-1">Rule of Thumb</p>
                  <p className="text-[12px] font-light text-bisat-black/55 leading-relaxed">{guide.rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Measurement tip ───────────────────────────────────────── */}
      <section className="border-t border-bisat-border py-10 bg-bisat-ivory">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-3">Pro Tip</p>
            <p className="text-bisat-black/55 text-sm font-light leading-relaxed mb-6">
              Before ordering, tape out the rug dimensions on your floor with painter's tape. Live with it for a day. You'll immediately know if you need to go larger.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-bisat-black text-white px-7 py-3 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors">
              Shop All Sizes <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
