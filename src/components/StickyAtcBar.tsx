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
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-bisat-black/10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] safe-area-bottom"
        >
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-3 flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 overflow-hidden bg-[#F6F3EE] flex-shrink-0 hidden sm:block">
              {product.images[0] && (
                <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" />
              )}
            </div>

            {/* Name + Price */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-normal text-bisat-black truncate leading-tight">{product.name}</p>
              <p className="text-bisat-black/60 text-[13px]">${displayPrice.toLocaleString()}</p>
            </div>

            {/* CTA */}
            <button
              onClick={onAddToCart}
              disabled={product.stock === 0 || added}
              className={`flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-[0.18em] font-medium flex-shrink-0 transition-all duration-200 ${
                added
                  ? 'bg-bisat-warm-gray text-white'
                  : product.stock === 0
                  ? 'bg-bisat-black/10 text-bisat-black/30 cursor-not-allowed'
                  : 'bg-bisat-black text-white hover:bg-bisat-charcoal'
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
