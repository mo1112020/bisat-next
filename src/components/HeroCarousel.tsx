'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=85&w=1920&auto=format&fit=crop',
    title: 'RUGHAUS New Lifestyle Interior',
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
    <section className="relative h-[500px] sm:h-[580px] w-full overflow-hidden bg-bisat-black">
      {/* Background Images with Overlapping Slide Animation (No Black Gap) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-30%', opacity: 0 }}
            transition={{ 
              x: { duration: 1.2, ease: [0.45, 0, 0.55, 1] },
              opacity: { duration: 0.8 }
            }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SLIDES[current].image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-28 pt-32 sm:px-10 sm:pb-32 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 max-w-[700px]"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
              EDITORIAL / 0{current + 1}
            </p>
            <h1 className="font-rh text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1] tracking-[-0.03em] text-white">
              {SLIDES[current].title}
            </h1>
            <p className="mt-5 max-w-[440px] text-[14px] leading-relaxed text-white/70 font-normal">
              {SLIDES[current].subtitle}
            </p>
            <div className="mt-8">
              <Link
                href={SLIDES[current].href}
                className="inline-flex items-center justify-center border border-white bg-transparent px-9 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                {SLIDES[current].cta}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators: With Progress Loading Animation */}
      <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative h-[8px] w-14 sm:w-40 overflow-hidden transition-all duration-500 focus:outline-none"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            {i === current ? (
              <motion.div 
                key={`progress-${i}-${current}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                className="absolute inset-0 origin-left bg-white"
              />
            ) : (
              <div className="absolute inset-0 bg-transparent transition-colors group-hover:bg-white/10" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};
