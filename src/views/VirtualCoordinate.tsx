"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Meta } from '../components/Meta';

const SHELL = 'mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-16';

export const VirtualCoordinate = () => {
  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Virtual Coordinate | Bisatim"
        description="Get support visualizing rugs in your space and narrowing down the right scale, color, and category."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-bisat-black px-5 py-28 text-white sm:py-40 lg:py-52">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
            Virtual Coordinate
          </p>
          <h1 className="font-rh text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] text-white">
            See the rug in your room before you decide.
          </h1>
          <p className="mx-auto mt-8 max-w-[520px] text-[15px] leading-[1.9] text-white/40">
            Send a room photo. We suggest rugs that fit your layout, style, and scale — before you commit to a single piece.
          </p>
        </div>
      </section>

      {/* ── Steps ────────────────────────────────────── */}
      <section className="bg-[#f7f5f2] py-20 sm:py-28">
        <div className={SHELL}>
          <div className="grid grid-cols-1 gap-px bg-bisat-black/[0.07] sm:grid-cols-2">
            <div className="bg-white px-8 py-10 sm:px-10 sm:py-12">
              <p className="mb-6 font-rh text-[1.5rem] font-light text-bisat-black/18">01</p>
              <h3 className="font-rh text-[1.5rem] font-light leading-snug text-bisat-black sm:text-[1.75rem]">
                Share your room
              </h3>
              <p className="mt-4 text-[14px] leading-[1.8] text-bisat-black/50">
                Send a clear photo of the space along with notes about dimensions, preferred tones, and intended use.
              </p>
            </div>
            <div className="bg-white px-8 py-10 sm:px-10 sm:py-12">
              <p className="mb-6 font-rh text-[1.5rem] font-light text-bisat-black/18">02</p>
              <h3 className="font-rh text-[1.5rem] font-light leading-snug text-bisat-black sm:text-[1.75rem]">
                Receive recommendations
              </h3>
              <p className="mt-4 text-[14px] leading-[1.8] text-bisat-black/50">
                We reply with a focused set of options closer to your room&apos;s proportions and preferred style direction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What to include ──────────────────────────── */}
      <section className="bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.34em] text-bisat-black/30">
            What to include
          </p>
          <h2 className="font-rh text-[2rem] font-light leading-[1.2] text-bisat-black sm:text-[2.75rem]">
            The more context, the better the match.
          </h2>
          <p className="mt-7 text-[15px] leading-[1.9] text-bisat-black/50">
            Room dimensions, current furniture, desired mood, budget range — any detail that helps us understand the space will lead to a more precise recommendation.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="bg-bisat-black py-20 sm:py-28">
        <div className="mx-auto max-w-[560px] px-5 text-center">
          <h2 className="font-rh text-[2.25rem] font-light leading-[1.15] text-white sm:text-[3rem]">
            Ready to coordinate your room?
          </h2>
          <p className="mt-5 text-[15px] leading-[1.85] text-white/38">
            Contact us with your room photo and we will help narrow down the right collection and dimensions.
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
