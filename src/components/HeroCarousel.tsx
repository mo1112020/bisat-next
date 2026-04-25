'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1920&auto=format&fit=crop',
    title: 'Bisāṭim New Lifestyle Interior',
    subtitle: 'Colour and fibre, brought into everyday rooms with a more thoughtful, collected feel.',
    cta: 'Explore Collection',
    href: '/collections/rug',
  },
  {
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=85&w=1920&auto=format&fit=crop',
    title: 'Bedroom Collection',
    subtitle: 'Softer palettes and quieter pile for spaces made to slow the room down.',
    cta: 'Shop Bedroom',
    href: '/collections/rug?room=Bedroom',
  },
  {
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=85&w=1920&auto=format&fit=crop',
    title: 'Vintage Archive',
    subtitle: 'One-of-a-kind Persian and Anatolian pieces with singular character and presence.',
    cta: 'View Archive',
    href: '/collections/vintage-rugs',
  },
];

const AUTO_PLAY_INTERVAL = 6000;

export const HeroCarousel: React.FC<{ slides?: HeroSlide[] }> = ({ slides }) => {
  const slideItems = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slideItems.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [slideItems.length]);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-bisat-black">
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
              src={slideItems[current].image}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/18 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="bisat-shell w-full pb-16 sm:pb-20 lg:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-[660px]"
            >
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                {String(current + 1).padStart(2, '0')} / {String(slideItems.length).padStart(2, '0')}
              </p>
              <h1 className="font-rh text-[clamp(2.5rem,5.5vw,3.9rem)] font-light leading-[1.03] tracking-[-0.025em] text-white">
                {slideItems[current].title}
              </h1>
              <p className="mt-4 max-w-[440px] text-[14px] leading-[1.75] text-white/68">
                {slideItems[current].subtitle}
              </p>
              <div className="mt-8">
                <Link
                  href={slideItems[current].href}
                  className="inline-flex items-center gap-3 border border-white/80 bg-transparent px-8 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-bisat-black"
                >
                  {slideItems[current].cta}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-3">
            {slideItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="group relative h-[2px] w-12 overflow-hidden bg-white/20 focus:outline-none sm:w-20"
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
