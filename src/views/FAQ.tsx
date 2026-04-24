"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Meta } from '../components/Meta';
import { Schema, getFAQSchema } from '../components/Schema';

const faqs = [
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does shipping take?",
        a: "We offer worldwide shipping. Domestic orders (within Turkiye) typically arrive in 3-5 business days. International shipping usually takes 7-14 business days depending on the destination and customs processing."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes, we offer complimentary worldwide shipping on all orders over $1,500. For orders below this amount, shipping rates are calculated at checkout based on the rug's weight and dimensions."
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your rug is dispatched, you will receive a tracking number via email. You can also track your order directly on our website using the 'Track Order' page."
      }
    ]
  },
  {
    category: "Rug Care & Maintenance",
    questions: [
      {
        q: "How should I clean my handmade rug?",
        a: "We recommend regular vacuuming (without a beater bar) to remove surface dust. For spills, blot immediately with a clean, dry cloth. For deep cleaning, always use a professional rug cleaner who specializes in handmade oriental rugs."
      },
      {
        q: "Should I use a rug pad?",
        a: "Yes, we highly recommend using a high-quality rug pad. It prevents the rug from slipping, protects the fibers from wear against the floor, and adds an extra layer of cushioning."
      },
      {
        q: "How do I prevent my rug from fading?",
        a: "Avoid placing your rug in direct, prolonged sunlight. We recommend rotating your rug 180 degrees every 6 months to ensure even wear and exposure."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We want you to love your Bisatim rug. If you are not completely satisfied, you can return your rug within 14 days of delivery for a full refund, minus shipping costs. The rug must be in its original condition."
      },
      {
        q: "How do I initiate a return?",
        a: "Please contact our support team at heritage@bisatim.com with your order number. We will provide you with return instructions and a shipping label if applicable."
      }
    ]
  },
  {
    category: "Authenticity & Craftsmanship",
    questions: [
      {
        q: "Are your rugs truly handmade?",
        a: "Yes, every rug in our collection is 100% handmade by skilled artisans. We specialize in traditional weaving techniques that have been passed down through generations."
      },
      {
        q: "Do you provide certificates of authenticity?",
        a: "Every rug from our 'Handmade Heritage' and 'Vintage Revival' collections comes with a signed Certificate of Authenticity, detailing its origin, approximate age, and material composition."
      }
    ]
  }
];

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pb-16 bg-bisat-ivory min-h-screen">
      <Meta
        title="FAQ – Shipping, Care & Authenticity"
        description="Answers to common questions about shipping, rug care, returns, and the authenticity of Bisatim artisanal pieces."
      />
      <Schema data={getFAQSchema(faqs)} />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader
          badge="Assistance"
          title="Common Questions"
          description="Everything you need to know about our artisanal process, shipping logistics, and how to care for your piece of history."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-2">
              {faqs.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => {
                    setActiveCategory(cat.category);
                    setOpenIndex(0);
                  }}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between group ${
                    activeCategory === cat.category 
                    ? 'bg-bisat-black text-white shadow-lg' 
                    : 'bg-white text-bisat-black/60 hover:bg-bisat-cream'
                  }`}
                >
                  <span className="font-medium">{cat.category}</span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeCategory === cat.category ? 'bg-bisat-gold scale-150' : 'bg-bisat-black/10'
                  }`} />
                </button>
              ))}

              <div className="mt-12 p-8 bg-bisat-cream border border-bisat-border">
                <h4 className="font-sans text-xl mb-4">Still have questions?</h4>
                <p className="text-sm text-bisat-black/60 mb-6 leading-relaxed">
                  Our heritage experts are available to assist you with any specific inquiries.
                </p>
                <button className="text-bisat-gold font-bold text-xs uppercase tracking-widest hover:text-bisat-black transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {faqs.find(f => f.category === activeCategory)?.questions.map((item, idx) => (
                    <div 
                      key={idx}
                      className="mb-4 bg-white border border-bisat-border overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-bisat-cream/30 transition-colors"
                      >
                        <span className="text-lg font-medium text-bisat-black">{item.q}</span>
                        <div className={`p-2 rounded-full transition-all duration-300 ${openIndex === idx ? 'bg-bisat-black text-white rotate-180' : 'bg-bisat-black/5 text-bisat-black'}`}>
                          {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {openIndex === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-8 pb-8 text-bisat-black/60 leading-relaxed text-base">
                              <div className="w-full h-[1px] bg-bisat-black/5 mb-6" />
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
