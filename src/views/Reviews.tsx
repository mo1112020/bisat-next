"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Filter, ArrowRight, MessageSquare, ThumbsUp } from 'lucide-react';
import { Meta } from '../components/Meta';
import { getTestimonials } from '../lib/db';

export const Reviews = () => {
  const [filter, setFilter] = useState('All');
  const [reviews, setReviews] = useState<Awaited<ReturnType<typeof getTestimonials>>>([]);
  const categories = ['All', 'Handmade', 'Vintage', 'Modern'];

  useEffect(() => {
    getTestimonials().then(setReviews);
  }, []);

  const filteredReviews = filter === 'All'
    ? reviews
    : reviews.filter(r => r.category === filter);

  return (
    <div className="pb-16 bg-bisat-ivory min-h-screen">
      <Meta
        title="Customer Reviews"
        description="Read verified reviews from customers around the world who brought a piece of Turkish heritage into their homes with Bisāṭ."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          badge="Testimonials"
          title="Kind Words from Our Global Community"
          description="Discover why collectors and designers around the world trust Bisāṭ for their most cherished spaces."
        />

        {/* Filter */}
        <div className="flex items-center gap-2 sm:gap-4 bg-white p-2 rounded-2xl shadow-sm border border-bisat-black/5 w-full sm:w-fit mb-10 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                filter === cat
                ? 'bg-bisat-black text-white shadow-md'
                : 'text-bisat-black/40 hover:text-bisat-black hover:bg-bisat-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Average Rating', value: '4.9/5', icon: Star },
            { label: 'Happy Customers', value: '2,500+', icon: ThumbsUp },
            { label: 'Total Reviews', value: '1,840', icon: MessageSquare }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-bisat-black/5 flex items-center gap-5">
              <div className="p-4 bg-bisat-gold/10 rounded-2xl text-bisat-gold">
                <stat.icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/40 mb-1">{stat.label}</p>
                <p className="text-3xl font-serif text-bisat-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.div 
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-bisat-black/5 flex flex-col h-full"
              >
                <div className="mb-6">
                  <span className="text-bisat-black/40 text-sm font-medium">{review.title}</span>
                  <div className="w-full h-[1px] border-t border-dashed border-bisat-black/10 mt-4" />
                </div>
                
                <p className="text-bisat-black/70 text-sm sm:text-base mb-6 leading-relaxed flex-grow italic">
                  "{review.text}"
                </p>
                
                <div className="flex justify-between items-end pt-5 border-t border-bisat-black/5">
                  <div>
                    <h4 className="font-bold text-base text-bisat-black">{review.name}</h4>
                    <p className="text-sm text-bisat-black/40">{review.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 mb-2 justify-end">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                      ))}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-bisat-black/40">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="bg-bisat-black text-white px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-bisat-gold transition-all duration-500 flex items-center mx-auto group">
            Load More Reviews
            <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
