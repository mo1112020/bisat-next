'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema } from '../components/Schema';
import { ArrowRight, Globe, Heart, ShieldCheck, Users } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface AboutProps {
  artisanImage?: string;
}

export const About = ({ artisanImage }: AboutProps) => {
  const artisanSrc = artisanImage || 'https://images.unsplash.com/photo-1528360983277-13d401cdc186';
  return (
    <div className="pb-16 bg-bisat-cream min-h-screen">
      <Meta 
        title="Our Story" 
        description="Learn about Bisāṭ's journey, our mission to preserve artisanal heritage, and our connection to global weavers."
      />
      <Schema data={getOrganizationSchema()} />

      {/* Hero Section */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-4">
        <PageHeader
          badge="Our Heritage"
          title={<>Weaving Stories <span className="italic text-bisat-gold">Across Borders</span></>}
          description="Bisāṭ was born from a simple realization: that a rug is more than just a floor covering. It is a canvas of history, a testament to human patience, and a bridge between cultures."
        >
          <div className="flex items-center space-x-12 lg:space-x-16 mt-10">
            {[
              { label: "Countries", value: "15+" },
              { label: "Artisans", value: "200+" },
              { label: "Handmade", value: "100%" }
            ].map((stat, i) => (
              <div key={i} className="text-left">
                <p className="text-4xl font-serif text-bisat-black mb-1">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/30">{stat.label}</p>
              </div>
            ))}
          </div>
        </PageHeader>
      </section>

      {/* Mission Section */}
      <section className="bg-bisat-black text-bisat-cream py-16 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-bisat-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-bisat-teal/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px]" />
        
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-bisat-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">Our Purpose</span>
            <h2 className="text-3xl lg:text-4xl font-serif mb-6 leading-tight">Preserving the Art of the Hand</h2>
            <p className="text-bisat-cream/50 text-lg leading-relaxed font-light italic">
              "To preserve the ancient art of hand-weaving by connecting master artisans with modern homes, ensuring that heritage techniques thrive in a world of mass production."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Heart,
                title: "Ethical Sourcing",
                desc: "We work directly with weaving communities to ensure fair wages and safe working environments."
              },
              {
                icon: Globe,
                title: "Cultural Preservation",
                desc: "By supporting traditional patterns and techniques, we help keep regional histories alive."
              },
              {
                icon: ShieldCheck,
                title: "Uncompromising Quality",
                desc: "Every piece is inspected for material purity and knot density before it reaches your home."
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-bisat-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={24} className="text-bisat-gold" />
                </div>
                <h3 className="text-xl font-serif mb-3 text-bisat-cream">{item.title}</h3>
                <p className="text-sm text-bisat-cream/40 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-2 lg:order-1 lg:col-span-6 relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-bisat-black/5"
          >
            <Image
              src={artisanSrc}
              alt="Artisan weaving a traditional rug"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-bisat-gold/10 mix-blend-overlay" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 lg:col-span-6"
          >
            <span className="text-bisat-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
              Global Connection
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif mb-6 leading-tight">From the Atlas to the Silk Road</h2>
            <div className="space-y-8">
              <p className="text-bisat-black/60 text-lg leading-relaxed font-light">
                Our journey takes us to remote villages in the Atlas Mountains of Morocco, the bustling bazaars of Tabriz, and the quiet artisan workshops of Anatolia. 
              </p>
              <p className="text-bisat-black/60 text-lg leading-relaxed font-light italic">
                "We don't just buy rugs; we build relationships. By understanding the climate, the sheep, and the local dyes, we ensure that every Bisāṭ piece is an authentic representation of its origin."
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-bisat-black/5">
                <div className="flex items-center space-x-5 group">
                  <div className="p-4 bg-white rounded-2xl text-bisat-gold group-hover:bg-bisat-gold group-hover:text-white transition-all duration-300 shadow-sm">
                    <Users size={24} />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-bisat-black/60">Direct-to-Artisan <br />Partnerships</span>
                </div>
                <div className="flex items-center space-x-5 group">
                  <div className="p-4 bg-white rounded-2xl text-bisat-gold group-hover:bg-bisat-gold group-hover:text-white transition-all duration-300 shadow-sm">
                    <Globe size={24} />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-bisat-black/60">Supporting 15+ <br />Weaving Regions</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 text-center pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-bisat-black/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-bisat-gold via-bisat-teal to-bisat-gold" />
          <h2 className="text-3xl font-serif mb-8 text-bisat-black">The Origin of Bisāṭ</h2>
          <p className="text-bisat-black/60 text-xl font-serif leading-relaxed mb-8 italic max-w-3xl mx-auto">
            "It started with a single rug found in a small market in Isfahan. The complexity of the knots and the depth of the natural indigo told a story that mass-produced textiles simply couldn't replicate. Bisāṭ was founded to bring those stories to the world."
          </p>
          <div className="flex flex-col items-center">
            <div className="w-16 h-0.5 bg-bisat-gold/20 mb-8" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-bisat-gold">Established MMXXIV</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
