'use client';
import React from 'react';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema } from '../components/Schema';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SHELL = 'mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-16';

export const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Our Story | Bisatim"
        description="Learn about Bisatim's journey, our mission to preserve artisanal heritage, and our connection to master weavers."
      />
      <Schema data={getOrganizationSchema()} />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-bisat-black px-5 py-28 text-white sm:py-40 lg:py-52">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
            Our Story
          </p>
          <h1 className="font-rh text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] text-white">
            Weaving heritage into contemporary rooms.
          </h1>
          <p className="mx-auto mt-8 max-w-[520px] text-[15px] leading-[1.9] text-white/40">
            Bisatim was built on one belief: that a rug is not a commodity. It is a record of time, labour, and place — made to outlive every trend.
          </p>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────── */}
      <section className="border-y border-bisat-black/[0.06] bg-[#f7f5f2]">
        <div className={SHELL}>
          <div className="grid grid-cols-2 divide-x divide-bisat-black/[0.07] sm:grid-cols-4">
            {[
              { value: '40+',   label: 'Master weavers' },
              { value: '4',     label: 'Source countries' },
              { value: '100%',  label: 'Handmade' },
              { value: '12yr',  label: 'In the trade' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-2 px-6 py-10 sm:px-10 ${i < 2 ? 'border-b border-bisat-black/[0.07] sm:border-b-0' : ''}`}
              >
                <p className="font-rh text-[2.75rem] font-light leading-none text-bisat-black sm:text-[3.5rem]">
                  {s.value}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-bisat-black/38">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission quote ────────────────────────────── */}
      <section className="bg-white px-5 py-24 text-center sm:py-36">
        <div className="mx-auto max-w-[780px]">
          <p className="font-rh text-[clamp(1.75rem,4vw,3rem)] font-light italic leading-[1.3] text-bisat-black">
            &ldquo;To preserve the ancient art of hand-weaving by connecting master artisans with modern homes — ensuring that heritage techniques thrive in a world of mass production.&rdquo;
          </p>
          <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.38em] text-bisat-black/28">
            Our mission
          </p>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section className="bg-[#f7f5f2] py-20 sm:py-28">
        <div className={SHELL}>
          <h2 className="mb-14 font-rh text-[2rem] font-light text-bisat-black sm:text-[2.75rem]">
            How we work
          </h2>
          <div className="grid grid-cols-1 gap-px bg-bisat-black/[0.07] sm:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Ethical sourcing',
                body: 'We work directly with weaving communities to ensure fair wages, safe conditions, and long-term relationships — not one-off transactions.',
              },
              {
                num: '02',
                title: 'Cultural preservation',
                body: 'By supporting traditional patterns and regional dyeing techniques, we help keep centuries-old craft alive and economically viable.',
              },
              {
                num: '03',
                title: 'Uncompromising quality',
                body: 'Every piece is assessed for material purity, knot density, and structural integrity before it ever reaches your home.',
              },
            ].map(item => (
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

      {/* ── Origin story ─────────────────────────────── */}
      <section className="bg-white px-5 py-24 sm:py-36">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.34em] text-bisat-black/30">
            The beginning
          </p>
          <h2 className="font-rh text-[2rem] font-light leading-[1.2] text-bisat-black sm:text-[2.75rem]">
            It started with a single rug.
          </h2>
          <p className="mt-7 text-[15px] leading-[1.9] text-bisat-black/50">
            Found in a small market in Isfahan, the complexity of the knots and the depth of its natural indigo told a story that mass-produced textiles simply couldn&apos;t replicate. Bisatim was founded to bring those stories to the world.
          </p>
          <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.42em] text-bisat-black/22">
            Established MMXXIV
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="bg-bisat-black py-20 sm:py-28">
        <div className="mx-auto max-w-[560px] px-5 text-center">
          <h2 className="font-rh text-[2.25rem] font-light leading-[1.15] text-white sm:text-[3rem]">
            Every rug tells a story.
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
