"use client";
import React from 'react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const RecentlyViewed: React.FC = () => {
  const { recentlyViewed } = useRecentlyViewed();
  const { t } = useTranslation();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-start justify-between mb-6 sm:mb-10">
          <div>
            <span className="text-bisat-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block">
              {t('product.yourJourney')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif">{t('product.recentlyViewed')}</h2>
          </div>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 sm:gap-6 scrollbar-hide snap-x snap-mandatory">
            {recentlyViewed.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-none w-[72vw] sm:w-64 snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Subtle fade indicators for scroll */}
          <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none hidden lg:block" />
        </div>
      </div>
    </section>
  );
};
