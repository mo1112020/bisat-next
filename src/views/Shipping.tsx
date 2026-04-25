"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Package, Globe, ShieldCheck, Clock } from 'lucide-react';
import { Meta } from '../components/Meta';
import Link from 'next/link';
import { PageHeader } from '../components/PageHeader';

export const Shipping = () => {
  return (
    <div className="pb-16 bg-[#f7f5f2] min-h-screen">
      <Meta
        title="Global Shipping"
        description="Bisatim ships worldwide. Learn about our delivery timelines, packaging, and shipping policy for handmade rugs."
      />

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader
          badge="Worldwide Delivery"
          title={<>Shipped with <span className="italic text-bisat-gold">Care</span></>}
          description="Every rug is hand-rolled, wrapped in protective cloth, and packaged to ensure it arrives at your door in perfect condition — wherever you are in the world."
        />
      </section>

      {/* Info Cards */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Globe,
              title: 'Worldwide Shipping',
              body: 'We ship to over 80 countries. Your rug travels safely from our workshops in Anatolia to your home.',
            },
            {
              icon: Clock,
              title: 'Delivery Times',
              body: 'Domestic (Türkiye): 3–5 business days. International: 7–14 business days depending on destination and customs.',
            },
            {
              icon: Package,
              title: 'Free Shipping',
              body: 'Complimentary worldwide shipping on all orders over $1,500. Shipping rates for smaller orders are calculated at checkout.',
            },
            {
              icon: ShieldCheck,
              title: 'Fully Insured',
              body: 'Every shipment is fully insured for its declared value. In the rare event of damage in transit, we will replace your piece.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="bg-white border border-bisat-black/[0.07] p-10"
            >
              <item.icon size={28} strokeWidth={1.5} className="text-bisat-gold mb-6" />
              <h3 className="text-xl font-sans mb-3 text-bisat-black">{item.title}</h3>
              <p className="text-bisat-black/60 text-sm leading-relaxed font-light">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Policy Details */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 mb-24">
        <div className="bg-white border border-bisat-black/[0.07] p-8 md:p-12">
          <h2 className="text-3xl font-sans mb-8 text-bisat-black">Shipping Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-bisat-black/60 leading-relaxed font-light">
            <div className="space-y-6">
              <div>
                <h4 className="text-bisat-black font-semibold mb-2 text-[10px] uppercase tracking-[0.2em]">Processing Time</h4>
                <p>Orders are processed within 1–3 business days. Custom or made-to-order pieces may require additional lead time — you will be notified at checkout.</p>
              </div>
              <div>
                <h4 className="text-bisat-black font-semibold mb-2 text-[10px] uppercase tracking-[0.2em]">Customs & Duties</h4>
                <p>International orders may be subject to import duties and taxes. These charges are the responsibility of the recipient and are not included in the product price or shipping fee.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-bisat-black font-semibold mb-2 text-[10px] uppercase tracking-[0.2em]">Returns</h4>
                <p>We accept returns within 14 days of delivery for undamaged items in their original packaging. Please contact us before initiating a return.</p>
              </div>
              <div>
                <h4 className="text-bisat-black font-semibold mb-2 text-[10px] uppercase tracking-[0.2em]">Track Your Order</h4>
                <p>Once dispatched, you will receive a tracking number by email. You can also use our <Link href="/track-order" className="text-bisat-gold hover:underline">order tracking page</Link> anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-bisat-black/50 mb-6 text-sm">Have questions about your order?</p>
          <Link
            href="/contact"
            className="inline-block bg-bisat-gold text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-bisat-black transition-all duration-500"
          >
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
