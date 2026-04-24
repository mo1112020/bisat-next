"use client";
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Meta } from '../components/Meta';

export const Wishlist: React.FC = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="pb-16 bg-bisat-cream min-h-screen">
      <Meta
        title="My Wishlist"
        description="Your saved rugs and carpets at Bisatim."
        robots="noindex, nofollow"
      />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader
          badge="Saved Items"
          title="Your Wishlist"
          description={`${wishlist.length} ${wishlist.length === 1 ? 'piece' : 'pieces'} saved`}
        />

      {wishlist.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-bisat-cream/30 border border-bisat-border"
        >
          <Heart size={48} className="mx-auto mb-6 text-bisat-sand/40" />
          <h2 className="text-2xl font-sans mb-4">Your wishlist is empty</h2>
          <p className="text-bisat-warm-gray mb-8 max-w-md mx-auto">
            Save your favorite Turkish masterpieces to view them later or share with others.
          </p>
          <Link 
            href="/shop" 
            className="bg-bisat-black text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-bisat-charcoal transition-colors inline-block"
          >
            Explore Collection
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
