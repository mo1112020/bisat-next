"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

interface StickyAtcBarProps {
  product: { name: string; price: number; salePrice?: number; images: string[]; stock: number };
  anchorRef: React.RefObject<HTMLElement | null>;
  onAddToCart: () => void;
  added: boolean;
}

export const StickyAtcBar = ({ product, anchorRef, onAddToCart, added }: StickyAtcBarProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [anchorRef]);

  const displayPrice = product.salePrice != null && product.salePrice < product.price
    ? product.salePrice : product.price;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-bisat-border bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.05)]"
        >
          <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-5 py-3 sm:px-8 lg:px-12">
            <div className="relative hidden h-12 w-12 flex-shrink-0 overflow-hidden border border-bisat-border bg-bisat-cream sm:block">
              {product.images[0] && (
                <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate font-serif text-[1rem] font-light leading-tight text-bisat-black">{product.name}</p>
              <p className="text-[13px] text-bisat-black/55">${displayPrice.toLocaleString()}</p>
            </div>

            <button
              onClick={onAddToCart}
              disabled={product.stock === 0 || added}
              className={`flex flex-shrink-0 items-center gap-2 border px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-200 ${
                added
                  ? 'border-bisat-black bg-bisat-black text-white'
                : product.stock === 0
                  ? 'cursor-not-allowed border-bisat-border bg-bisat-cream text-bisat-black/30'
                  : 'border-bisat-black bg-bisat-black text-white hover:border-bisat-gold-dark hover:bg-bisat-gold-dark'
              }`}
            >
              {added ? <><Check size={15} /> Added</> : <><ShoppingBag size={15} /> Add to Bag</>}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
