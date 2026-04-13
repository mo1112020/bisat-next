"use client";
import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Meta } from '../components/Meta';
import { useLanguage } from '../context/LanguageContext';

export const Cart = () => {
  const { t } = useLanguage();
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-bisat-ivory flex flex-col items-center justify-center px-4">
        <ShoppingBag size={48} className="text-bisat-black/15 mb-6" strokeWidth={1} />
        <h2 className="text-2xl font-light text-bisat-black mb-3">{t('cart.empty_title')}</h2>
        <p className="text-bisat-black/45 mb-10 max-w-sm text-center text-sm font-light leading-relaxed">
          {t('cart.empty_desc')}
        </p>
        <Link
          href="/shop"
          className="bg-bisat-black text-white px-10 py-3.5 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors"
        >
          {t('cart.explore')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta title={t('cart.title')} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-3">{t('cart.shopping_bag')}</p>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-light text-bisat-black">{t('cart.title')}</h1>
            <p className="text-sm font-light text-bisat-black/40 pb-0.5">{totalItems} {t('cart.pieces')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

          {/* ── Items ────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-px">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="bg-white border border-bisat-border flex flex-row items-start gap-5 p-5 sm:p-6 group"
              >
                <div className="w-20 h-28 sm:w-28 sm:h-36 flex-shrink-0 overflow-hidden bg-bisat-cream">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-grow flex flex-col py-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className="text-sm font-normal text-bisat-black leading-snug line-clamp-2">{item.name}</h3>
                    <p className="text-sm font-normal text-bisat-black flex-shrink-0">${item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-bisat-black/35 font-semibold mb-4">
                    {item.category} · {item.dimensions}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-bisat-border">
                    <div className="flex items-center border border-bisat-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-bisat-black/40 hover:text-bisat-black hover:bg-bisat-cream transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-normal text-bisat-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 text-bisat-black/40 hover:text-bisat-black hover:bg-bisat-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-semibold text-bisat-black/25 hover:text-bisat-terracotta transition-colors"
                    >
                      <Trash2 size={13} />
                      {t('cart.remove')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Summary ──────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="bg-bisat-cream border border-bisat-border p-6 lg:sticky lg:top-28">
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-5">{t('cart.order_summary')}</p>

              <div className="space-y-3 mb-5 pb-5 border-b border-bisat-border">
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-black/45 font-light">{t('cart.subtotal')}</span>
                  <span className="font-normal">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-black/45 font-light">{t('cart.shipping')}</span>
                  <span className="text-bisat-black/60 text-[10px] uppercase tracking-[0.15em] font-semibold">{t('cart.complimentary')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-black/45 font-light">{t('cart.estimated_tax')}</span>
                  <span className="text-bisat-black/35 text-xs font-light">{t('cart.tax_calc')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-bisat-black/45">{t('cart.total')}</span>
                <span className="text-2xl font-light text-bisat-black">${totalPrice.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-bisat-black text-white py-4 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-2 group"
              >
                {t('cart.checkout')}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <p className="text-[9px] text-bisat-black/25 uppercase tracking-[0.2em] font-semibold text-center mt-4">
                {t('cart.secure')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
