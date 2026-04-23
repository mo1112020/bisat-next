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
    <section className="overflow-hidden border-t border-bisat-border bg-white py-14 sm:py-20">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-start justify-between sm:mb-10">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-bisat-black/38">
              {t('product.yourJourney')}
            </span>
            <h2 className="font-serif text-3xl font-light sm:text-4xl">{t('product.recentlyViewed')}</h2>
          </div>
        </div>

        <div className="relative">
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide sm:gap-6">
            {recentlyViewed.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-[72vw] flex-none snap-start sm:w-64"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-16 bg-gradient-to-l from-white to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
};
