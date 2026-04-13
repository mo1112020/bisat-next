'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema } from '../components/Schema';
import { ArrowRight, Globe, Heart, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

interface AboutProps {
  artisanImage?: string;
}

export const About = ({ artisanImage }: AboutProps) => {
  const artisanSrc = artisanImage || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186';

  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta
        title="Our Story"
        description="Learn about Bisāṭ's journey, our mission to preserve artisanal heritage, and our connection to global weavers."
      />
      <Schema data={getOrganizationSchema()} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Our Heritage</p>
          <h1 className="text-4xl sm:text-5xl font-light text-bisat-black mb-5 leading-tight max-w-xl">
            Weaving Stories Across Borders
          </h1>
          <p className="text-bisat-black/50 text-sm font-light leading-relaxed max-w-lg mb-10">
            Bisāṭ was born from a simple realization: that a rug is more than just a floor covering. It is a canvas of history, a testament to human patience, and a bridge between cultures.
          </p>
          <div className="flex items-center gap-12 sm:gap-16 pt-8 border-t border-bisat-border">
            {[
              { label: 'Countries', value: '15+' },
              { label: 'Artisans', value: '200+' },
              { label: 'Handmade', value: '100%' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-light text-bisat-black mb-1">{stat.value}</p>
                <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-bisat-black/30">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mission ───────────────────────────────────────────────── */}
      <section className="bg-bisat-cream border-b border-bisat-border py-14 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-12">
            <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Our Purpose</p>
            <h2 className="text-3xl font-light text-bisat-black mb-5 leading-tight">Preserving the Art of the Hand</h2>
            <p className="text-bisat-black/50 text-sm font-light leading-relaxed italic">
              "To preserve the ancient art of hand-weaving by connecting master artisans with modern homes, ensuring that heritage techniques thrive in a world of mass production."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bisat-border">
            {[
              { icon: Heart, title: 'Ethical Sourcing', desc: 'We work directly with weaving communities to ensure fair wages and safe working environments.' },
              { icon: Globe, title: 'Cultural Preservation', desc: 'By supporting traditional patterns and techniques, we help keep regional histories alive.' },
              { icon: ShieldCheck, title: 'Uncompromising Quality', desc: 'Every piece is inspected for material purity and knot density before it reaches your home.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-bisat-ivory p-8 hover:bg-white transition-colors duration-300"
              >
                <item.icon size={20} className="text-bisat-black/35 mb-5" strokeWidth={1.5} />
                <h3 className="text-base font-normal text-bisat-black mb-2">{item.title}</h3>
                <p className="text-[12px] text-bisat-black/45 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artisans ──────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={artisanSrc}
                alt="Artisan weaving a traditional rug"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Global Connection</p>
              <h2 className="text-3xl font-light text-bisat-black mb-6 leading-tight">From the Atlas to the Silk Road</h2>
              <p className="text-bisat-black/55 text-sm leading-relaxed font-light mb-4">
                Our journey takes us to remote villages in the Atlas Mountains of Morocco, the bustling bazaars of Tabriz, and the quiet artisan workshops of Anatolia.
              </p>
              <p className="text-bisat-black/45 text-sm leading-relaxed font-light italic mb-8">
                "We don't just buy rugs; we build relationships. By understanding the climate, the sheep, and the local dyes, we ensure that every Bisāṭ piece is an authentic representation of its origin."
              </p>
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-bisat-border">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 border border-bisat-border flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-bisat-black/40" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-bisat-black/55 leading-snug">Direct-to-Artisan Partnerships</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 border border-bisat-border flex items-center justify-center flex-shrink-0">
                    <Globe size={16} className="text-bisat-black/40" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-bisat-black/55 leading-snug">Supporting 15+ Weaving Regions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Origin story ──────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-bisat-cream border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">The Beginning</p>
            <h2 className="text-3xl font-light text-bisat-black mb-6 leading-tight">The Origin of Bisāṭ</h2>
            <p className="text-bisat-black/50 text-sm font-light leading-relaxed italic mb-8">
              "It started with a single rug found in a small market in Isfahan. The complexity of the knots and the depth of the natural indigo told a story that mass-produced textiles simply couldn't replicate. Bisāṭ was founded to bring those stories to the world."
            </p>
            <p className="text-[9px] uppercase tracking-[0.4em] font-semibold text-bisat-black/25">Established MMXXIV</p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-12 bg-bisat-ivory">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-2">Explore the Collection</p>
            <h2 className="text-xl font-light text-bisat-black">Every rug tells a story.</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-bisat-black text-white px-8 py-3.5 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors">
            Shop All Rugs <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
};
