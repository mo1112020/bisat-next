'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createSupabaseBrowser } from '../lib/supabase-browser';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, ShieldCheck, Lock, CreditCard,
  Truck, Check, ChevronDown,
} from 'lucide-react';
import { Meta } from '../components/Meta';

type Step = 'shipping' | 'payment';

const COUNTRIES = [
  'Turkey', 'United States', 'United Kingdom', 'Germany', 'France',
  'Italy', 'Spain', 'Netherlands', 'Saudi Arabia', 'UAE', 'Qatar',
  'Kuwait', 'Canada', 'Australia', 'Japan', 'Other',
];

const inputClass =
  'w-full bg-white border border-bisat-black/[0.07] px-5 py-4 text-sm focus:outline-none transition-all placeholder:text-bisat-black/25 text-bisat-black';

const labelClass = 'block text-[10px] uppercase tracking-[0.25em] font-bold text-bisat-black/50 mb-2';

export const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>('shipping');
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/cart');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const displayName: string = (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? '';
    const parts = displayName.trim().split(' ');
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ');
    setShipping(prev => ({
      ...prev,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || lastName,
      email: prev.email || (user.email ?? ''),
    }));
  }, [user]);

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apt: '', city: '', state: '', zip: '', country: 'Turkey',
  });

  const [payment, setPayment] = useState({
    cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsPlacing(true);

    const supabase = createSupabaseBrowser();
    await supabase.from('orders').insert({
      user_id: user.id,
      items: cart,
      shipping_address: shipping,
      total: totalPrice,
      status: 'processing',
    });

    clearCart();
    router.push('/order-confirmation');
  };

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + ' / ' + digits.slice(2);
    return digits;
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-bisat-black/20 border-t-bisat-black" />
      </div>
    );
  }

  if (cart.length === 0 && !isPlacing) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-3xl font-sans mb-6 text-bisat-black">Your cart is empty</p>
        <Link href="/shop" className="bg-bisat-black text-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-bisat-charcoal transition-colors">
          Explore Collection
        </Link>
      </div>
    );
  }

  const estimatedDelivery = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();

  return (
    <div className="min-h-screen bg-[#f7f5f2] pb-16 sm:pb-24">
      <Meta title="Checkout" description="Complete your Bisatim order securely." />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-8">

        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-bisat-black/40 hover:text-bisat-black transition-colors mb-4 sm:mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans text-bisat-black">Checkout</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-6 sm:mb-10">
          {(['shipping', 'payment'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => s === 'shipping' && setStep('shipping')}
                className={`flex items-center gap-3 transition-all ${step === s ? 'opacity-100' : step === 'payment' && s === 'shipping' ? 'opacity-60 cursor-pointer' : 'opacity-30 cursor-default'}`}
              >
                <span className={`w-7 h-7 flex items-center justify-center text-[10px] font-medium transition-all border ${
                  step === s ? 'bg-bisat-black border-bisat-black text-white' :
                  step === 'payment' && s === 'shipping' ? 'bg-bisat-black border-bisat-black text-white' : 'border-bisat-black/[0.07] text-bisat-black/30'
                }`}>
                  {step === 'payment' && s === 'shipping' ? <Check size={14} /> : i + 1}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-bisat-black hidden sm:inline">
                  {s === 'shipping' ? 'Shipping' : 'Payment'}
                </span>
              </button>
              {i < 1 && <div className={`flex-1 max-w-16 h-[1px] transition-all ${step === 'payment' ? 'bg-bisat-gold' : 'bg-bisat-black/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {step === 'shipping' ? (
                <motion.form
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  onSubmit={handleShippingSubmit}
                  className="space-y-8"
                >
                  {/* Contact */}
                  <div className="bg-white border border-bisat-black/[0.07] p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 border border-bisat-black/[0.07] flex items-center justify-center">
                        <span className="text-bisat-black/50 text-xs font-medium">1</span>
                      </div>
                      <h2 className="text-xl font-sans">Contact Information</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>First Name</label>
                        <input required className={inputClass} value={shipping.firstName}
                          onChange={e => setShipping(p => ({ ...p, firstName: e.target.value }))} placeholder="Leila" />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input required className={inputClass} value={shipping.lastName}
                          onChange={e => setShipping(p => ({ ...p, lastName: e.target.value }))} placeholder="Yılmaz" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input required type="email" className={inputClass} value={shipping.email}
                        onChange={e => setShipping(p => ({ ...p, email: e.target.value }))} placeholder="leila@example.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input type="tel" className={inputClass} value={shipping.phone}
                        onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white border border-bisat-black/[0.07] p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 border border-bisat-black/[0.07] flex items-center justify-center">
                        <Truck size={13} className="text-bisat-black/40" />
                      </div>
                      <h2 className="text-xl font-sans">Shipping Address</h2>
                    </div>
                    <div>
                      <label className={labelClass}>Street Address</label>
                      <input required className={inputClass} value={shipping.address}
                        onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} placeholder="123 Grand Bazaar St." />
                    </div>
                    <div>
                      <label className={labelClass}>Apt / Suite / Floor (optional)</label>
                      <input className={inputClass} value={shipping.apt}
                        onChange={e => setShipping(p => ({ ...p, apt: e.target.value }))} placeholder="Apt 4B" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>City</label>
                        <input required className={inputClass} value={shipping.city}
                          onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} placeholder="Istanbul" />
                      </div>
                      <div>
                        <label className={labelClass}>State / Province</label>
                        <input className={inputClass} value={shipping.state}
                          onChange={e => setShipping(p => ({ ...p, state: e.target.value }))} placeholder="Marmara" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>ZIP / Postal Code</label>
                        <input required className={inputClass} value={shipping.zip}
                          onChange={e => setShipping(p => ({ ...p, zip: e.target.value }))} placeholder="34000" />
                      </div>
                      <div>
                        <label className={labelClass}>Country</label>
                        <div className="relative">
                          <select
                            className={inputClass + ' appearance-none cursor-pointer pr-10'}
                            value={shipping.country}
                            onChange={e => setShipping(p => ({ ...p, country: e.target.value }))}
                          >
                            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-bisat-black/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-bisat-black text-white py-5 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-3 group"
                  >
                    Continue to Payment
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35 }}
                  onSubmit={handlePaymentSubmit}
                  className="space-y-8"
                >
                  <div className="bg-white border border-bisat-black/[0.07] p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 border border-bisat-black/[0.07] flex items-center justify-center">
                        <CreditCard size={13} className="text-bisat-black/40" />
                      </div>
                      <h2 className="text-xl font-sans">Payment Details</h2>
                      <div className="ml-auto flex items-center gap-2">
                        <Lock size={12} className="text-bisat-black/30" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/30">Secure</span>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Card Number</label>
                      <input
                        required
                        className={inputClass}
                        value={payment.cardNumber}
                        onChange={e => setPayment(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Name on Card</label>
                      <input required className={inputClass} value={payment.nameOnCard}
                        onChange={e => setPayment(p => ({ ...p, nameOnCard: e.target.value }))} placeholder="Leila Yılmaz" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Expiry Date</label>
                        <input
                          required
                          className={inputClass}
                          value={payment.expiry}
                          onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                          placeholder="MM / YY"
                          maxLength={7}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>CVV</label>
                        <input
                          required
                          className={inputClass}
                          value={payment.cvv}
                          onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="•••"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#f7f5f2] border border-bisat-black/[0.07] px-5 py-4">
                      <ShieldCheck size={15} className="text-bisat-warm-gray flex-shrink-0" />
                      <p className="text-xs text-bisat-black/50 leading-relaxed">
                        Your payment is encrypted with 256-bit SSL. We never store card details.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="flex items-center gap-2 px-8 py-5 border border-bisat-black/[0.07] text-[11px] uppercase tracking-[0.2em] font-medium text-bisat-black/50 hover:border-bisat-black hover:text-bisat-black transition-all group"
                    >
                      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPlacing}
                      className="flex-1 bg-bisat-black text-white py-5 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPlacing ? (
                        <span className="flex items-center gap-3">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Placing Order…
                        </span>
                      ) : (
                        <>
                          Place Order · ${totalPrice.toLocaleString()}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-bisat-black text-bisat-cream p-8 lg:sticky lg:top-28 overflow-hidden"
            >

              <h2 className="text-2xl font-sans mb-8 relative z-10">Order Summary</h2>

              <div className="space-y-5 mb-8 relative z-10 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-bisat-charcoal">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug mb-1 truncate">{item.name}</p>
                      <p className="text-bisat-cream/40 text-[10px] uppercase tracking-widest">{item.dimensions}</p>
                      {item.quantity > 1 && (
                        <p className="text-bisat-gold text-[10px] font-bold mt-0.5">×{item.quantity}</p>
                      )}
                    </div>
                    <p className="text-sm font-light flex-shrink-0">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-bisat-cream/10 pt-6 space-y-4 mb-6 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-cream/40 text-[10px] uppercase tracking-widest font-bold">Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-cream/40 text-[10px] uppercase tracking-widest font-bold">Shipping</span>
                  <span className="text-bisat-gold text-[10px] uppercase tracking-widest font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-bisat-cream/40 text-[10px] uppercase tracking-widest font-bold">Tax</span>
                  <span className="text-bisat-cream/40 italic text-xs">Calculated at delivery</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-bisat-cream/10 pt-6 mb-6 relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-bisat-cream/60">Total</span>
                <span className="text-3xl font-sans">${totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 relative z-10">
                <Truck size={13} className="text-bisat-cream/50 flex-shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-bisat-cream/60">Estimated Delivery</p>
                  <p className="text-sm mt-0.5">{estimatedDelivery}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
