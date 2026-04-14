"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { Meta } from '../components/Meta';
import { PageHeader } from '../components/PageHeader';
import { getOrder } from '../lib/db';

interface OrderStatus {
  id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'pending';
  date: string;
  items: string[];
  estimatedDelivery: string;
  location: string;
}

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError('');
    setTrackingResult(null);

    const result = await getOrder(orderId.trim());
    if (result) {
      setTrackingResult(result as OrderStatus);
    } else {
      setError('Order not found. Please check your ID and try again.');
    }
    setIsSearching(false);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Order Placed', icon: Clock },
    { label: 'Processing', icon: Package },
    { label: 'In Transit', icon: Truck },
    { label: 'Delivered', icon: CheckCircle },
  ];

  const currentStep = trackingResult ? getStatusStep(trackingResult.status) : 0;

  return (
    <div className="pb-16 bg-bisat-cream min-h-screen">
      <Meta title="Track Your Order" description="Follow your artisanal rug's journey from our looms to your home." />
      
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader
          badge="Logistics & Delivery"
          title="Track Your Heritage"
          description="Enter your unique order identifier to follow your piece's journey across borders and artisan workshops."
        />

        {/* Search Bar */}
        <div className="bg-white border border-bisat-border p-5 sm:p-8 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-bisat-black/30" size={20} />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-12345"
                className="w-full bg-bisat-cream border border-bisat-border pl-14 pr-6 py-5 text-sm focus:ring-2 focus:ring-bisat-gold transition-all uppercase tracking-widest"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-bisat-black text-bisat-cream px-10 py-5 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-bisat-charcoal transition-all disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Track'}
            </button>
          </form>
          <p className="mt-4 text-[10px] text-bisat-black/30 uppercase tracking-widest text-center sm:text-left">
            Hint: Try ORD-12345, ORD-67890, or ORD-55555
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center p-6 bg-red-50 text-red-600 border border-red-100 mb-8"
            >
              <AlertCircle size={20} className="mr-3 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {trackingResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Progress Bar */}
              <div className="bg-white border border-bisat-border p-10">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h3 className="text-xl font-serif mb-1">Status: {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}</h3>
                    <p className="text-xs text-bisat-black/40 uppercase tracking-widest">Order {trackingResult.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-bisat-black/40 uppercase tracking-widest mb-1">Est. Delivery</p>
                    <p className="text-sm font-bold">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-5 left-0 w-full h-0.5 bg-bisat-black/5" />
                  <div 
                    className="absolute top-5 left-0 h-0.5 bg-bisat-gold transition-all duration-1000" 
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                  
                  <div className="relative flex justify-between">
                    {steps.map((step, i) => {
                      const Icon = step.icon;
                      const isActive = i + 1 <= currentStep;
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${
                            isActive ? 'bg-bisat-gold text-white' : 'bg-white border-2 border-bisat-black/5 text-bisat-black/20'
                          }`}>
                            <Icon size={18} />
                          </div>
                          <p className={`mt-4 text-[10px] uppercase tracking-widest font-bold ${
                            isActive ? 'text-bisat-black' : 'text-bisat-black/20'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-bisat-border p-8">
                  <div className="flex items-center mb-6 text-bisat-gold">
                    <MapPin size={20} className="mr-3" />
                    <h4 className="text-xs uppercase tracking-widest font-bold">Current Location</h4>
                  </div>
                  <p className="text-bisat-black font-serif text-lg">{trackingResult.location}</p>
                </div>

                <div className="bg-white border border-bisat-border p-8">
                  <div className="flex items-center mb-6 text-bisat-gold">
                    <Package size={20} className="mr-3" />
                    <h4 className="text-xs uppercase tracking-widest font-bold">Items in Shipment</h4>
                  </div>
                  <ul className="space-y-2">
                    {trackingResult.items.map((item, i) => (
                      <li key={i} className="text-sm flex items-center">
                        <ArrowRight size={12} className="mr-2 text-bisat-black/20" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-serif mb-8">Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-white/50 border border-bisat-border">
              <h4 className="font-bold text-sm mb-2">Where is my order ID?</h4>
              <p className="text-xs text-bisat-black/60 leading-relaxed">You can find your order ID in the confirmation email sent immediately after your purchase.</p>
            </div>
            <div className="p-8 bg-white/50 border border-bisat-border">
              <h4 className="font-bold text-sm mb-2">International Shipping</h4>
              <p className="text-xs text-bisat-black/60 leading-relaxed">Artisanal pieces may take longer to clear customs. We appreciate your patience as heritage travels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
