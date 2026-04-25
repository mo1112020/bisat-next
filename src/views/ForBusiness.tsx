"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Meta } from '../components/Meta';

const SHELL = 'mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-16';

const OFFERINGS = [
  {
    num: '01',
    title: 'Hospitality & commercial sourcing',
    body: 'Support for hotels, restaurants, offices, and multi-room interior projects that need consistent quality and reliable lead times.',
  },
  {
    num: '02',
    title: 'Material & colour consultation',
    body: 'Guidance on texture, tone, and durability so selections fit the project concept and daily-use requirements.',
  },
  {
    num: '03',
    title: 'Custom size coordination',
    body: 'Recommendations for scale, placement, and custom orders when standard formats do not fit the plan.',
  },
];

export const ForBusiness = () => {
  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="For Business | Bisatim"
        description="Business inquiries, sourcing support, and project coordination for hospitality, retail, and interior design projects."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-bisat-black px-5 py-28 text-white sm:py-40 lg:py-52">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
            For Business
          </p>
          <h1 className="font-rh text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] text-white">
            Project support for designers and commercial spaces.
          </h1>
          <p className="mx-auto mt-8 max-w-[520px] text-[15px] leading-[1.9] text-white/40">
            We help commercial clients source rugs for hospitality projects, residential developments, and private design commissions.
          </p>
        </div>
      </section>

      {/* ── Offerings ────────────────────────────────── */}
      <section className="bg-[#f7f5f2] py-20 sm:py-28">
        <div className={SHELL}>
          <div className="grid grid-cols-1 gap-px bg-bisat-black/[0.07] sm:grid-cols-3">
            {OFFERINGS.map(item => (
              <div key={item.num} className="bg-white px-8 py-10 sm:px-10 sm:py-12">
                <p className="mb-6 font-rh text-[1.5rem] font-light text-bisat-black/18">{item.num}</p>
                <h3 className="font-rh text-[1.5rem] font-light leading-snug text-bisat-black sm:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.8] text-bisat-black/50">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who we work with ─────────────────────────── */}
      <section className="bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.34em] text-bisat-black/30">
            Who we work with
          </p>
          <h2 className="font-rh text-[2rem] font-light leading-[1.2] text-bisat-black sm:text-[2.75rem]">
            Hotels, design studios, retail, and private commissions.
          </h2>
          <p className="mt-7 text-[15px] leading-[1.9] text-bisat-black/50">
            From boutique guesthouses to large-scale residential developments, we adapt our sourcing and consultation process to fit the scope and timeline of each project.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="bg-bisat-black py-20 sm:py-28">
        <div className="mx-auto max-w-[560px] px-5 text-center">
          <h2 className="font-rh text-[2.25rem] font-light leading-[1.15] text-white sm:text-[3rem]">
            Tell us about your project.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.85] text-white/38">
            Share the scope, timeline, and location. We will suggest product directions, custom options, and next steps.
          </p>
          <div className="mt-10">
            <Link href="/pages/contact" className="inline-flex items-center gap-3 bg-white px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-bisat-black transition-colors hover:bg-white/85">
              Contact us <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
