"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product } from '../data/products';
import { getProducts } from '../lib/db';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, X, SlidersHorizontal } from 'lucide-react';
import { Meta } from '../components/Meta';
import { Schema, getItemListSchema } from '../components/Schema';
import { getSiteUrl } from '../lib/siteUrl';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = ['All', 'Handmade', 'Vintage', 'Machine', 'Kilim'];
const ROOMS = ['All', 'Living Room', 'Bedroom', 'Dining Room', 'Hallway', 'Office'];
const SIZES = ['All', 'Small', 'Medium', 'Large', 'Runner'];

export const Shop = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categoryFilter = searchParams.get('category');
  const roomFilter = searchParams.get('room');
  const sizeFilter = searchParams.get('size');

  const updateFilters = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value === 'All') p.delete(key); else p.set(key, value);
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push(pathname, { scroll: false });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => { setAllProducts(data); setIsLoading(false); });
  }, []);

  const activeCount = [categoryFilter, roomFilter, sizeFilter].filter(Boolean).length;

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.rooms.some(r => r.toLowerCase().includes(term)) ||
        p.material.toLowerCase().includes(term)
      );
    }
    if (categoryFilter && categoryFilter !== 'All') result = result.filter(p => p.category === categoryFilter);
    if (roomFilter && roomFilter !== 'All') result = result.filter(p => p.rooms.includes(roomFilter as any));
    if (sizeFilter && sizeFilter !== 'All') result = result.filter(p => p.sizeCategory === sizeFilter);
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [allProducts, categoryFilter, roomFilter, sizeFilter, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-bisat-ivory">
      <Meta
        title={categoryFilter ? `${categoryFilter} Rugs` : 'Shop All Rugs & Carpets'}
        description="Browse our collection of hand-woven Turkish rugs. Handmade, vintage, kilim and machine-woven carpets shipped worldwide."
        keywords="buy Turkish rugs, handmade carpets, kilim rugs, vintage rugs, silk rugs online"
      />
      <Schema data={getItemListSchema(
        filteredProducts.map(p => ({ id: p.id, name: p.name, url: `${getSiteUrl()}/product/${p.id}`, image: p.images[0] })),
        categoryFilter ? `${categoryFilter} Rugs` : 'All Rugs & Carpets'
      )} />

      {/* Page title bar */}
      <div className="bg-bisat-ivory border-b border-bisat-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-bisat-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-1">Collections</p>
              <h1 className="text-2xl md:text-3xl font-serif text-bisat-black">
                {categoryFilter ? `${categoryFilter} Rugs` : 'All Rugs & Carpets'}
              </h1>
            </div>
            <p className="text-bisat-black/35 text-sm font-medium pb-0.5">{filteredProducts.length} items</p>
          </div>
        </div>
      </div>

      {/* Sticky filter toolbar */}
      <div className="sticky top-16 z-30 bg-bisat-ivory/95 backdrop-blur-md border-b border-bisat-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Row 1: Search + Filters + Sort */}
          <div className="flex items-center gap-2 pt-3 pb-2">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bisat-black/30" />
              <input
                type="text"
                placeholder="Search rugs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-white border border-bisat-black/8 rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none focus:border-bisat-gold/40 w-full transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-bisat-black/25 hover:text-bisat-black">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* More filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all duration-200 flex-shrink-0 ${
                showFilters || activeCount > 0
                  ? 'bg-bisat-gold text-white border-bisat-gold'
                  : 'bg-white border-bisat-black/8 text-bisat-black/55 hover:border-bisat-black/20'
              }`}
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && <span>({activeCount})</span>}
            </button>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-bisat-black/8 rounded-xl pl-3 pr-7 py-2.5 text-[11px] font-semibold text-bisat-black/60 focus:outline-none cursor-pointer transition-all hover:border-bisat-black/20"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-bisat-black/35" />
            </div>

            {/* Clear all */}
            {activeCount > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-[11px] text-bisat-black/40 hover:text-red-500 transition-colors flex-shrink-0">
                <X size={12} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>

          {/* Row 2: Category pills */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => updateFilters('category', cat)}
                className={`px-4 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  (cat === 'All' && !categoryFilter) || categoryFilter === cat
                    ? 'bg-bisat-black text-white'
                    : 'bg-white border border-bisat-black/8 text-bisat-black/55 hover:border-bisat-black/20 hover:text-bisat-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expanded filters row */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/35 mb-2">Room</p>
                    <div className="flex flex-wrap gap-2">
                      {ROOMS.map(room => (
                        <button
                          key={room}
                          onClick={() => updateFilters('room', room)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                            (room === 'All' && !roomFilter) || roomFilter === room
                              ? 'bg-bisat-gold text-white'
                              : 'bg-bisat-black/5 text-bisat-black/50 hover:bg-bisat-black/10'
                          }`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/35 mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => updateFilters('size', size)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                            (size === 'All' && !sizeFilter) || sizeFilter === size
                              ? 'bg-bisat-gold text-white'
                              : 'bg-bisat-black/5 text-bisat-black/50 hover:bg-bisat-black/10'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="py-24 text-center">
            <p className="text-bisat-black/30 text-lg font-serif">Loading collection…</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-bisat-black/30 text-lg font-serif mb-2">No rugs match your filters.</p>
            <p className="text-bisat-black/25 text-sm mb-6">Try adjusting or clearing your filters.</p>
            <button
              onClick={clearAll}
              className="bg-bisat-black text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-bisat-gold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
