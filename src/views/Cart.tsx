"use client";
import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Meta } from '../components/Meta';
import { useLanguage } from '../context/LanguageContext';
import { PageHeader } from '../components/PageHeader';

export const Cart = () => {
  const { t } = useLanguage();
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pb-16 min-h-screen bg-bisat-cream flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 bg-white rounded-3xl mb-8 text-bisat-black/5 relative group"
        >
          <div className="absolute inset-0 bg-bisat-gold/5 rounded-[3rem] scale-90 group-hover:scale-100 transition-transform duration-700" />
          <ShoppingBag size={80} className="relative z-10 text-bisat-black/10" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-serif mb-6 text-bisat-black"
        >
          {t('cart.empty_title')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-bisat-black/50 mb-12 max-w-sm text-center leading-relaxed"
        >
          {t('cart.empty_desc')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/shop" 
            className="bg-bisat-black text-bisat-cream px-12 py-5 rounded-full text-sm uppercase tracking-[0.2em] font-bold hover:bg-bisat-teal transition-all duration-500 shadow-xl shadow-bisat-black/20"
          >
            {t('cart.explore')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-bisat-cream min-h-screen">
      <Meta title={t('cart.title')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          badge={t('cart.shopping_bag')}
          title={t('cart.title')}
        >
          <div className="hidden sm:block mt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/30 mb-1">{t('cart.total_items')}</p>
            <p className="text-2xl font-serif text-bisat-black">{totalItems} {t('cart.pieces')}</p>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl flex flex-row items-start gap-4 sm:gap-6 lg:gap-10 group hover:shadow-lg hover:shadow-bisat-black/5 transition-all duration-500 border border-bisat-black/[0.02]"
              >
                <div className="w-24 h-32 sm:w-36 sm:h-48 flex-shrink-0 rounded-xl overflow-hidden bg-bisat-cream relative">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-bisat-black/5 group-hover:opacity-0 transition-opacity duration-500" />
                </div>
                
                <div className="flex-grow flex flex-col py-2">
                  <div className="flex flex-col justify-between items-start mb-4">
                    <div>
                      <h3 className="text-base sm:text-xl font-serif mb-1.5 text-bisat-black group-hover:text-bisat-gold transition-colors duration-300 leading-snug">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-bisat-black/40 text-[10px] uppercase tracking-[0.2em] font-bold">{item.category}</span>
                        <span className="w-1 h-1 rounded-full bg-bisat-black/10" />
                        <span className="text-bisat-black/40 text-[10px] uppercase tracking-[0.2em] font-bold">{item.dimensions}</span>
                      </div>
                    </div>
                    <p className="text-base font-medium text-bisat-black mt-2">${item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-bisat-black/5">
                    <div className="flex items-center bg-bisat-cream/50 rounded-full p-1 border border-bisat-black/5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2.5 text-bisat-black/40 hover:text-bisat-black hover:bg-white rounded-full transition-all duration-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-bisat-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`p-2.5 rounded-full transition-all duration-300 ${
                          item.quantity >= item.stock 
                            ? 'text-bisat-black/10 cursor-not-allowed' 
                            : 'text-bisat-black/40 hover:text-bisat-black hover:bg-white'
                        }`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 text-bisat-black/20 hover:text-red-500 transition-all duration-300 group/delete"
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover/delete:opacity-100 transition-opacity">{t('cart.remove')}</span>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-bisat-black text-bisat-cream p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl sticky top-24 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-bisat-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl rtl:right-auto rtl:left-0 rtl:-translate-x-1/2" />
              
              <h2 className="text-xl sm:text-2xl font-serif mb-6 relative z-10">{t('cart.order_summary')}</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-bisat-cream/10 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-cream/40 uppercase tracking-widest text-[10px] font-bold">{t('cart.subtotal')}</span>
                  <span className="font-light">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-cream/40 uppercase tracking-widest text-[10px] font-bold">{t('cart.shipping')}</span>
                  <span className="text-bisat-gold uppercase tracking-[0.2em] text-[10px] font-bold">{t('cart.complimentary')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-cream/40 uppercase tracking-widest text-[10px] font-bold">{t('cart.estimated_tax')}</span>
                  <span className="text-bisat-cream/40 italic">{t('cart.tax_calc')}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6 relative z-10">
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-bisat-cream/60">{t('cart.total')}</span>
                <span className="text-3xl font-serif">${totalPrice.toLocaleString()}</span>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-bisat-gold text-white py-6 rounded-full text-sm uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-bisat-black transition-all duration-500 flex items-center justify-center group relative z-10 shadow-xl shadow-black/20"
              >
                {t('cart.checkout')}
                <ArrowRight size={18} className="ml-3 rtl:ml-0 rtl:mr-3 rtl:rotate-180 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-500" />
              </Link>
              
              <div className="mt-8 flex items-center justify-center gap-4 relative z-10">
                <div className="w-1 h-1 rounded-full bg-bisat-cream/20" />
                <p className="text-[10px] text-bisat-cream/30 uppercase tracking-[0.2em] font-bold">
                  {t('cart.secure')}
                </p>
                <div className="w-1 h-1 rounded-full bg-bisat-cream/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
