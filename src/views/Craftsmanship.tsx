'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Meta } from '../components/Meta';
import { PageHeader } from '../components/PageHeader';

export const Craftsmanship = () => {
  return (
    <div className="pb-16 bg-[#f7f5f2] min-h-screen">
      <Meta
        title="Craftsmanship"
        description="Discover the artisanal craft behind every Bisatim rug — centuries of tradition, natural materials, and human patience woven into each piece."
      />

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader
          badge="The Art of Weaving"
          title={<>Made by <span className="italic text-bisat-gold">Hand</span></>}
          description="Every Bisatim rug is a product of centuries-old tradition. Skilled artisans across Anatolia and Central Asia hand-knot each piece using time-honoured techniques passed down through generations — no shortcuts, no machines, only patience and craft."
        />
      </section>

      {/* Steps */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: '01',
              title: 'Natural Materials',
              body: 'We source only the finest wool, silk, and cotton — dyed using traditional plant-based and mineral pigments that age gracefully over time.',
            },
            {
              step: '02',
              title: 'Hand-Knotting',
              body: 'A single square foot of a fine rug can contain up to 400 hand-tied knots. Each knot is placed individually, creating the density and durability that defines a heirloom piece.',
            },
            {
              step: '03',
              title: 'Finishing & Quality',
              body: 'After weaving, rugs are washed, stretched, and sheared by hand to achieve an even pile. Each piece is inspected before it leaves the workshop.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="bg-white border border-bisat-black/[0.07] p-10"
            >
              <span className="text-bisat-gold font-bold text-[10px] uppercase tracking-[0.4em] mb-6 block">{item.step}</span>
              <h3 className="text-2xl font-sans mb-4 text-bisat-black">{item.title}</h3>
              <p className="text-bisat-black/60 leading-relaxed font-light">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center pb-12">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-bisat-black text-bisat-ivory px-12 py-20"
        >
          <p className="text-3xl md:text-5xl font-sans italic leading-relaxed mb-8">
            "A rug is never finished — it only begins its life when it enters your home."
          </p>
          <span className="text-bisat-gold text-[10px] uppercase tracking-[0.4em] font-bold">Bisatim Atelier</span>
        </motion.blockquote>
      </section>
    </div>
  );
};
