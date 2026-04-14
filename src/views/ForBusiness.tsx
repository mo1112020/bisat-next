"use client";
import React from 'react';
import Link from 'next/link';
import { Briefcase, Palette, Ruler, ArrowRight } from 'lucide-react';
import { Meta } from '../components/Meta';

const OFFERINGS = [
  {
    icon: Briefcase,
    title: 'Hospitality and commercial sourcing',
    body: 'Support for hotels, restaurants, offices, and multi-room interior projects that need consistent quality and lead times.',
  },
  {
    icon: Palette,
    title: 'Material and color consultation',
    body: 'Guidance on texture, tone, and durability so selections fit the project concept and daily use requirements.',
  },
  {
    icon: Ruler,
    title: 'Custom size coordination',
    body: 'Recommendations for scale, placement, and custom orders when standard formats do not fit the plan.',
  },
];

export const ForBusiness = () => {
  return (
    <div className="min-h-screen bg-white">
      <Meta
        title="For Business"
        description="Business inquiries, sourcing support, and project coordination for hospitality, retail, and interior design projects."
      />

      <section className="border-b border-bisat-border bg-white">
        <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">For Business</p>
          <h1 className="max-w-3xl font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
            Project support for designers, retailers, and hospitality spaces.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-bisat-black/56">
            Bisāṭ helps commercial clients source rugs for residential developments, hospitality projects, curated retail spaces, and private design commissions.
          </p>
        </div>
      </section>

      <section className="border-b border-bisat-border bg-bisat-cream py-14 sm:py-18">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-px bg-bisat-border md:grid-cols-3">
            {OFFERINGS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white px-6 py-8 sm:px-8">
                <Icon size={20} className="mb-5 text-bisat-black/45" strokeWidth={1.5} />
                <h2 className="font-serif text-[1.7rem] font-light tracking-[-0.04em] text-bisat-black">{title}</h2>
                <p className="mt-4 text-[14px] leading-6 text-bisat-black/56">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="border border-bisat-border bg-white px-6 py-10 sm:px-10">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Contact</p>
            <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
              Tell us about your project.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-bisat-black/56">
              Share the scope, timeline, and location of your project. We can then suggest product directions, custom options, and next steps.
            </p>
            <div className="mt-8">
              <Link href="/pages/contact" className="bisat-button">
                Contact us
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
