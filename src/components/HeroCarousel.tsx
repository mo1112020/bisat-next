'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1920&auto=format&fit=crop',
    title: 'Bisāṭim New Lifestyle Interior',
    subtitle: 'Colour and fibre, brought into everyday rooms — the way you actually live.',
    cta: 'Details Here',
    href: '/collections/rug',
  },
  {
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=85&w=1920&auto=format&fit=crop',
    title: 'Bedroom Collection',
    subtitle: 'Softer palettes and quieter pile for spaces made for rest.',
    cta: 'Details Here',
    href: '/collections/rug?room=Bedroom',
  },
  {
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=85&w=1920&auto=format&fit=crop',
    title: 'Vintage Archive',
    subtitle: 'One-of-a-kind Persian and Anatolian pieces with singular character.',
    cta: 'Details Here',
    href: '/collections/vintage-rugs',
  },
];

const AUTO_PLAY_INTERVAL = 6000; // 6 seconds

export const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[540px] w-full overflow-hidden bg-bisat-black">
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SLIDES[current].image}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      </div>

      {/* Content — bottom-left, Rughaus editorial style */}
      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-[640px]"
            >
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </p>
              <h1 className="font-rh text-[clamp(2.4rem,5.5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
                {SLIDES[current].title}
              </h1>
              <p className="mt-4 max-w-[400px] text-[14px] leading-[1.7] text-white/65">
                {SLIDES[current].subtitle}
              </p>
              <div className="mt-8">
                <Link
                  href={SLIDES[current].href}
                  className="inline-flex items-center gap-3 border border-white/80 bg-transparent px-8 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-bisat-black"
                >
                  {SLIDES[current].cta}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators — thin progress bars */}
          <div className="mt-10 flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="group relative h-[2px] w-12 sm:w-20 overflow-hidden bg-white/20 focus:outline-none"
              >
                {i === current ? (
                  <motion.div
                    key={`progress-${i}-${current}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                    className="absolute inset-0 origin-left bg-white"
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/40" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
