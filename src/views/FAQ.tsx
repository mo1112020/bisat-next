"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Meta } from '../components/Meta';
import { Schema, getFAQSchema } from '../components/Schema';
import Link from 'next/link';

const SHELL = 'mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-16';

const faqs = [
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does shipping take?",
        a: "We offer worldwide shipping. Domestic orders (within Turkey) typically arrive in 3–5 business days. International shipping usually takes 7–14 business days depending on the destination and customs processing."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes, we offer complimentary worldwide shipping on all orders over $1,500. For orders below this amount, shipping rates are calculated at checkout based on the rug's weight and dimensions."
      },
      {
        q: "Can I track my order?",
        a: "Once your rug is dispatched, you will receive a tracking number via email. You can also track your order directly on our website using the Track Order page."
      }
    ]
  },
  {
    category: "Rug Care & Maintenance",
    questions: [
      {
        q: "How should I clean my handmade rug?",
        a: "We recommend regular vacuuming (without a beater bar) to remove surface dust. For spills, blot immediately with a clean, dry cloth. For deep cleaning, always use a professional rug cleaner who specialises in handmade oriental rugs."
      },
      {
        q: "Should I use a rug pad?",
        a: "Yes. A quality rug pad prevents slipping, protects fibres from wear against the floor, and adds cushioning underfoot. We recommend a natural-fibre or felt pad."
      },
      {
        q: "How do I prevent my rug from fading?",
        a: "Avoid placing your rug in direct, prolonged sunlight. We recommend rotating your rug 180 degrees every six months to ensure even wear and exposure."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "If you are not completely satisfied, you can return your rug within 14 days of delivery for a full refund, minus shipping costs. The rug must be in its original, undamaged condition."
      },
      {
        q: "How do I initiate a return?",
        a: "Please contact our team at heritage@bisatim.com with your order number. We will provide return instructions and a shipping label where applicable."
      }
    ]
  },
  {
    category: "Authenticity & Craftsmanship",
    questions: [
      {
        q: "Are your rugs truly handmade?",
        a: "Every rug in our collection is 100% handmade by skilled artisans using traditional weaving techniques passed down through generations."
      },
      {
        q: "Do you provide certificates of authenticity?",
        a: "Every piece from our Handmade Heritage and Vintage collections comes with a signed Certificate of Authenticity, detailing its origin, approximate age, and material composition."
      }
    ]
  }
];

export const FAQ = () => {
  const [openKey, setOpenKey] = useState<string | null>('Shipping & Delivery-0');
  const toggle = (key: string) => setOpenKey(prev => prev === key ? null : key);

  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="FAQ | Bisatim"
        description="Answers to common questions about shipping, rug care, returns, and the authenticity of Bisatim artisanal pieces."
      />
      <Schema data={getFAQSchema(faqs)} />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-bisat-black px-5 py-28 text-white sm:py-40 lg:py-52">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
            Help
          </p>
          <h1 className="font-rh text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] text-white">
            Common questions.
          </h1>
          <p className="mx-auto mt-8 max-w-[480px] text-[15px] leading-[1.9] text-white/40">
            Shipping, care, returns, and authenticity — answered clearly.
          </p>
        </div>
      </section>

      {/* ── Accordion ────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className={SHELL}>
          <div className="mx-auto max-w-[760px]">
            {faqs.map(group => (
              <div key={group.category} className="mb-14 last:mb-0">
                <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.3em] text-bisat-black/35">
                  {group.category}
                </p>
                <div className="border-t border-bisat-black/[0.07]">
                  {group.questions.map((item, idx) => {
                    const key = `${group.category}-${idx}`;
                    const isOpen = openKey === key;
                    return (
                      <div key={key} className="border-b border-bisat-black/[0.07]">
                        <button
                          onClick={() => toggle(key)}
                          className="flex w-full items-start justify-between gap-6 py-6 text-left"
                        >
                          <span className="font-rh text-[1.2rem] font-light leading-snug text-bisat-black sm:text-[1.35rem]">
                            {item.q}
                          </span>
                          {isOpen
                            ? <Minus size={15} strokeWidth={1.5} className="mt-1.5 shrink-0 text-bisat-black/35" />
                            : <Plus size={15} strokeWidth={1.5} className="mt-1.5 shrink-0 text-bisat-black/35" />
                          }
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <p className="pb-7 text-[14px] leading-[1.9] text-bisat-black/52">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Still have questions ─────────────────────── */}
      <section className="bg-[#f7f5f2] py-16 sm:py-20">
        <div className="mx-auto max-w-[480px] px-5 text-center">
          <h2 className="font-rh text-[2rem] font-light text-bisat-black sm:text-[2.5rem]">
            Still have questions?
          </h2>
          <p className="mt-5 text-[15px] leading-[1.85] text-bisat-black/48">
            Our team is available Monday to Saturday and will respond within 24 hours.
          </p>
          <div className="mt-8">
            <Link href="/pages/contact" className="inline-flex items-center gap-3 bg-bisat-black px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-bisat-black/85">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
