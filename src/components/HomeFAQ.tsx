'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const HOME_FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Domestic orders (within Turkey) typically arrive in 3–5 business days. International shipping usually takes 7–14 business days depending on destination and customs processing.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes, we offer complimentary worldwide shipping on all orders over $1,500. Shipping rates for smaller orders are calculated at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'You can return your rug within 14 days of delivery for a full refund, minus shipping costs. The piece must be in its original, undamaged condition.',
  },
  {
    q: 'Are your rugs truly handmade?',
    a: 'Every rug in our collection is 100% handmade by skilled artisans using traditional weaving techniques passed down through generations.',
  },
];

export const HomeFAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[760px] border-t border-bisat-black/[0.07]">
      {HOME_FAQS.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="border-b border-bisat-black/[0.07]">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex w-full items-start justify-between gap-6 py-6 text-left"
            >
              <span className="font-rh text-[1.15rem] font-light leading-snug text-bisat-black sm:text-[1.3rem]">
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
                  <p className="pb-7 text-[14px] leading-[1.9] text-bisat-black/52">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
