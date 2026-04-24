"use client";
import React from 'react';
import Link from 'next/link';
import { Camera, LayoutGrid, ArrowRight } from 'lucide-react';
import { Meta } from '../components/Meta';

export const VirtualCoordinate = () => {
  return (
    <div className="min-h-screen bg-white">
      <Meta
        title="Virtual Coordinate"
        description="Get support visualizing rugs in your space and narrowing down the right scale, color, and category."
      />

      <section className="border-b border-bisat-border bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-bisat-black/38">Virtual Coordinate</p>
          <h1 className="max-w-3xl font-sans text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
            Compare rug options with your room before you decide.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-bisat-black/56">
            Send a room photo and your preferred size or mood. We will suggest rugs that fit the layout, style, and scale of your space.
          </p>
        </div>
      </section>

      <section className="border-b border-bisat-border bg-bisat-cream py-14 sm:py-18">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-px bg-bisat-border md:grid-cols-2">
            <div className="bg-white px-6 py-10 sm:px-10">
              <Camera size={20} className="mb-5 text-bisat-black/45" strokeWidth={1.5} />
              <h2 className="font-sans text-[1.9rem] font-light tracking-[-0.04em] text-bisat-black">1. Share your room</h2>
              <p className="mt-4 text-[14px] leading-6 text-bisat-black/56">
                Send a clear photo of the space along with any notes about dimensions, preferred tones, and intended use.
              </p>
            </div>
            <div className="bg-white px-6 py-10 sm:px-10">
              <LayoutGrid size={20} className="mb-5 text-bisat-black/45" strokeWidth={1.5} />
              <h2 className="font-sans text-[1.9rem] font-light tracking-[-0.04em] text-bisat-black">2. Receive recommendations</h2>
              <p className="mt-4 text-[14px] leading-6 text-bisat-black/56">
                We reply with a focused set of options that are closer to your room proportions and your preferred style direction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="border border-bisat-border bg-white px-6 py-10 sm:px-10">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-bisat-black/38">Start</p>
            <h2 className="font-sans text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
              Ready to coordinate your room?
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-bisat-black/56">
              Contact us with your room photo and we will help narrow down the right collection and dimensions.
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
