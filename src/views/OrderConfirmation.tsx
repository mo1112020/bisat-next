'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, Package, Truck, MapPin, ArrowRight, Mail } from 'lucide-react';
import { Meta } from '../components/Meta';

const generateOrderNumber = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BST-';
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const STEPS = [
  { icon: Check, label: 'Order Confirmed', active: true },
  { icon: Package, label: 'Being Prepared', active: false },
  { icon: Truck, label: 'Shipped', active: false },
  { icon: MapPin, label: 'Delivered', active: false },
];

export const OrderConfirmation = () => {
  const [orderNumber] = useState(generateOrderNumber);

  const estimatedDelivery = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();

  return (
    <div className="min-h-screen bg-bisat-cream pb-24">
      <Meta title="Order Confirmed" description="Your Bisatim order has been placed successfully." />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 pt-6">

        {/* Success Animation */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-bisat-black flex items-center justify-center mx-auto mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            >
              <Check size={40} strokeWidth={2.5} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-bisat-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4">Order Placed</p>
            <h1 className="text-5xl md:text-6xl font-sans text-bisat-black mb-4">Thank You</h1>
            <p className="text-bisat-black/50 text-lg leading-relaxed max-w-md mx-auto">
              Your order has been confirmed. A confirmation email is on its way to you.
            </p>
          </motion.div>
        </div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white overflow-hidden border border-bisat-border mb-8"
        >
          <div className="bg-bisat-black text-bisat-cream px-8 py-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-cream/50 mb-1">Order Number</p>
              <p className="text-2xl font-sans">{orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-cream/50 mb-1">Est. Delivery</p>
              <p className="text-sm font-medium">{estimatedDelivery}</p>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="px-8 py-10">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-5 right-5 h-[1px] bg-bisat-black/5 hidden sm:block" />
              <motion.div
                className="absolute top-5 left-5 h-[1px] bg-bisat-gold hidden sm:block"
                initial={{ width: 0 }}
                animate={{ width: '8%' }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex flex-col items-center text-center relative"
                  >
                    <div className={`w-10 h-10 flex items-center justify-center mb-3 z-10 relative transition-all border ${
                      s.active
                        ? 'bg-bisat-black border-bisat-black text-white'
                        : 'border-bisat-border text-bisat-black/20'
                    }`}>
                      <s.icon size={16} />
                    </div>
                    <p className={`text-[10px] uppercase tracking-[0.15em] font-bold ${s.active ? 'text-bisat-black' : 'text-bisat-black/25'}`}>
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-start gap-4 bg-bisat-cream border border-bisat-border px-6 py-5 mb-10"
        >
          <Mail size={18} className="text-bisat-gold mt-0.5 flex-shrink-0" />
          <p className="text-sm text-bisat-black/60 leading-relaxed">
            A detailed confirmation with your invoice and tracking link will be sent to your email address within a few minutes.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/track-order"
            className="flex-1 bg-bisat-black text-white py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-3 group"
          >
            <Truck size={14} />
            Track Your Order
          </Link>
          <Link
            href="/shop"
            className="flex-1 border border-bisat-border text-bisat-black/60 py-5 text-[10px] uppercase tracking-[0.2em] font-medium hover:border-bisat-black hover:text-bisat-black transition-colors flex items-center justify-center gap-3 group"
          >
            Continue Shopping
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
