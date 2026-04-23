"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Product } from '../data/products';
import { getProducts } from '../lib/db';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, X, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';
import { Meta } from '../components/Meta';
import { Schema, getItemListSchema } from '../components/Schema';
import { getSiteUrl } from '../lib/siteUrl';
import { ProductCard } from '../components/ProductCard';

interface StoreConfig { categories: string[]; rooms: string[]; sizes: string[]; }

const COLOR_OPTIONS = [
  { label: 'Ivory',  value: 'ivory',  hex: '#F5F0E8', keywords: ['ivory','cream','beige','off-white','natural','white'] },
  { label: 'Brown',  value: 'brown',  hex: '#8B5E3C', keywords: ['brown','tan','terracotta','rust','copper','bronze','camel'] },
  { label: 'Red',    value: 'red',    hex: '#B03030', keywords: ['red','burgundy','crimson','wine','rose','coral'] },
  { label: 'Blue',   value: 'blue',   hex: '#2C5F8A', keywords: ['blue','navy','indigo','teal','turquoise','cobalt'] },
  { label: 'Green',  value: 'green',  hex: '#4A7C59', keywords: ['green','olive','sage','emerald','forest','mint'] },
  { label: 'Gold',   value: 'gold',   hex: '#C9A44C', keywords: ['gold','yellow','amber','ochre','saffron','mustard'] },
  { label: 'Black',  value: 'black',  hex: '#1A1A1A', keywords: ['black','charcoal','dark','ebony','onyx'] },
  { label: 'Multi',  value: 'multi',  hex: 'linear-gradient(135deg,#B03030,#2C5F8A,#4A7C59,#C9A44C)', keywords: ['multi','colorful','tribal','geometric','boho'] },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name',       label: 'Name A–Z' },
];

export const Shop = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const [sortBy,      setSortBy]      = useState('newest');
  const [searchTerm,  setSearchTerm]  = useState(searchParams.get('q') || '');
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [config,      setConfig]      = useState<StoreConfig>({ categories: [], rooms: [], sizes: [] });

  const categoryFilter = searchParams.get('category');
  const roomFilter     = searchParams.get('room');
  const sizeFilter     = searchParams.get('size');
  const colorFilter    = searchParams.get('color');
  const minPrice       = searchParams.get('minPrice');
  const maxPrice       = searchParams.get('maxPrice');
  const activeCount    = [categoryFilter, roomFilter, sizeFilter, colorFilter, minPrice || maxPrice].filter(Boolean).length;

  const [priceRange, setPriceRange] = useState({ min: minPrice || '', max: maxPrice || '' });

  useEffect(() => {
    getProducts().then(data => { setAllProducts(data); setIsLoading(false); });
    fetch('/api/store-config')
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfig({
        categories: ['Handmade','Vintage','Machine','Kilim'],
        rooms: ['Living Room','Bedroom','Dining Room','Hallway','Office'],
        sizes: ['Small','Medium','Large','Runner'],
      }));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const setFilter = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (!value) p.delete(key); else p.set(key, value);
    p.delete('q');
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const clearAll = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    router.push(pathname, { scroll: false });
  };

  const applyPriceRange = () => {
    const p = new URLSearchParams(searchParams);
    if (priceRange.min) p.set('minPrice', priceRange.min); else p.delete('minPrice');
    if (priceRange.max) p.set('maxPrice', priceRange.max); else p.delete('maxPrice');
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.rooms.some(r => r.toLowerCase().includes(term)) ||
        p.material.toLowerCase().includes(term) ||
        p.origin.toLowerCase().includes(term)
      );
    }
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (roomFilter)     result = result.filter(p => p.rooms.includes(roomFilter as Product['rooms'][number]));
    if (sizeFilter)     result = result.filter(p => p.sizeCategory === sizeFilter);
    if (colorFilter) {
      const colorData = COLOR_OPTIONS.find(c => c.value === colorFilter);
      if (colorData) {
        result = result.filter(p => {
          const haystack = `${p.name} ${p.description} ${p.material}`.toLowerCase();
          return colorData.keywords.some(kw => haystack.includes(kw));
        });
      }
    }
    if (minPrice) result = result.filter(p => (p.salePrice ?? p.price) >= Number(minPrice));
    if (maxPrice) result = result.filter(p => (p.salePrice ?? p.price) <= Number(maxPrice));
    if (sortBy === 'price-low')  result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [allProducts, categoryFilter, roomFilter, sizeFilter, colorFilter, minPrice, maxPrice, sortBy, searchTerm]);

  // Shared filter panel used in both desktop sidebar and mobile drawer
  const FilterPanel = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-6">
      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2 mt-1">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => { setFilter('color', colorFilter === c.value ? '' : c.value); onClose?.(); }}
              className={`relative w-7 h-7 rounded-full border-2 transition-all ${colorFilter === c.value ? 'border-bisat-black scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
              style={c.value === 'multi'
                ? { background: 'conic-gradient(#B03030 0deg, #2C5F8A 90deg, #4A7C59 180deg, #C9A44C 270deg, #B03030 360deg)' }
                : { backgroundColor: c.hex }
              }
            >
              {colorFilter === c.value && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check size={12} className={c.value === 'ivory' ? 'text-bisat-black' : 'text-white'} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Price">
        <div className="w-full space-y-2 mt-1">
          <div className="flex gap-2 items-center">
            <input
              type="number" min="0" placeholder="Min $"
              value={priceRange.min}
              onChange={e => setPriceRange(r => ({ ...r, min: e.target.value }))}
              className="w-full border border-bisat-border px-2.5 py-1.5 text-xs focus:outline-none"
            />
            <span className="text-bisat-black/30 text-xs flex-shrink-0">–</span>
            <input
              type="number" min="0" placeholder="Max $"
              value={priceRange.max}
              onChange={e => setPriceRange(r => ({ ...r, max: e.target.value }))}
              className="w-full border border-bisat-border px-2.5 py-1.5 text-xs focus:outline-none"
            />
          </div>
          <button
            onClick={() => { applyPriceRange(); onClose?.(); }}
            className="w-full text-[11px] font-bold py-1.5 bg-bisat-black text-white rounded-sm hover:bg-bisat-charcoal transition-colors"
          >
            Apply
          </button>
        </div>
      </FilterSection>

      {config.categories.length > 0 && (
        <FilterSection title="Category">
          <FilterPill label="All" active={!categoryFilter} onClick={() => { setFilter('category',''); onClose?.(); }} />
          {config.categories.map(c => (
            <FilterPill key={c} label={c} active={categoryFilter === c} onClick={() => { setFilter('category', c); onClose?.(); }} />
          ))}
        </FilterSection>
      )}
      {config.rooms.length > 0 && (
        <FilterSection title="Room">
          <FilterPill label="Any Room" active={!roomFilter} onClick={() => { setFilter('room',''); onClose?.(); }} />
          {config.rooms.map(r => (
            <FilterPill key={r} label={r} active={roomFilter === r} onClick={() => { setFilter('room', r); onClose?.(); }} />
          ))}
        </FilterSection>
      )}
      {config.sizes.length > 0 && (
        <FilterSection title="Size">
          <FilterPill label="Any Size" active={!sizeFilter} onClick={() => { setFilter('size',''); onClose?.(); }} />
          {config.sizes.map(s => (
            <FilterPill key={s} label={s} active={sizeFilter === s} onClick={() => { setFilter('size', s); onClose?.(); }} />
          ))}
        </FilterSection>
      )}
      {activeCount > 0 && (
        <button onClick={() => { clearAll(); onClose?.(); }}
          className="w-full text-sm font-semibold text-bisat-black/40 hover:text-red-500 transition-colors flex items-center justify-center gap-2 py-2.5 border border-dashed border-bisat-border hover:border-red-200">
          <X size={13} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bisat-ivory">
      <Meta
        title={categoryFilter ? `${categoryFilter} Rugs | Bisāṭ` : 'Shop All Rugs & Carpets | Bisāṭ'}
        description="Browse our collection of hand-woven Turkish rugs. Handmade, vintage, kilim and machine-woven carpets shipped worldwide."
        keywords="buy Turkish rugs, handmade carpets, kilim rugs, vintage rugs online"
      />
      <Schema data={getItemListSchema(
        filteredProducts.map(p => ({ id: p.id, name: p.name, url: `${getSiteUrl()}/product/${p.id}`, image: p.images[0] })),
        categoryFilter ? `${categoryFilter} Rugs` : 'All Rugs & Carpets'
      )} />

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="bg-bisat-ivory border-b border-bisat-border">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-3 text-[11px] text-bisat-black/35 font-medium">
            <Link href="/" className="hover:text-bisat-gold transition-colors">Home</Link>
            <span>/</span>
            {categoryFilter
              ? <><Link href="/shop" className="hover:text-bisat-gold transition-colors">Shop</Link><span>/</span><span className="text-bisat-black/60">{categoryFilter}</span></>
              : <span className="text-bisat-black/60">Shop</span>
            }
          </nav>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-light text-bisat-black">
              {categoryFilter ? `${categoryFilter} Rugs` : searchTerm ? `Results for "${searchTerm}"` : 'All Rugs & Carpets'}
            </h1>
            <p className="text-bisat-black/35 text-sm font-medium pb-0.5 flex-shrink-0">
              {isLoading ? '…' : `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Category quick-nav pills ──────────────────────────────────────── */}
      <div className="bg-bisat-ivory border-b border-bisat-border sticky top-[4.5rem] z-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button onClick={() => setFilter('category','')}
              className={`px-4 py-2 rounded-sm text-[11px] font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                !categoryFilter ? 'bg-bisat-black text-white' : 'bg-transparent border border-bisat-border text-bisat-black/55 hover:border-bisat-black/20 hover:text-bisat-black'
              }`}>
              All
            </button>
            {config.categories.map(cat => (
              <button key={cat} onClick={() => setFilter('category', categoryFilter === cat ? '' : cat)}
                className={`px-4 py-2 rounded-sm text-[11px] font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  categoryFilter === cat ? 'bg-bisat-black text-white' : 'bg-transparent border border-bisat-border text-bisat-black/55 hover:border-bisat-black/20 hover:text-bisat-black'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-8">
        <div className="flex gap-8">

          {/* ── Desktop sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-[6rem]">
              <div className="border border-bisat-border p-6">
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/35 mb-5">Filter By</p>
                <FilterPanel />
              </div>
            </div>
          </aside>

          {/* ── Product area ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar row */}
            <div className="flex items-center gap-3 mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bisat-black/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, material, origin…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-bisat-border rounded-sm pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-bisat-black/30 transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-bisat-black/25 hover:text-bisat-black">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setMobileOpen(true)}
                className={`lg:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm text-[11px] font-semibold border transition-all flex-shrink-0 ${
                  activeCount > 0 ? 'bg-bisat-black text-white border-bisat-black' : 'bg-transparent border-bisat-border text-bisat-black/55 hover:border-bisat-black/20'
                }`}>
                <SlidersHorizontal size={13} />
                Filter{activeCount > 0 && ` (${activeCount})`}
              </button>

              {/* Sort */}
              <div className="relative flex-shrink-0">
                <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-bisat-black/30 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-bisat-border rounded-sm pl-8 pr-8 py-2.5 text-[11px] font-semibold text-bisat-black/60 focus:outline-none cursor-pointer hover:border-bisat-black/20 transition-all"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-bisat-black/35" />
              </div>
            </div>

            {/* Active filter chips */}
            {(categoryFilter || roomFilter || sizeFilter || colorFilter || minPrice || maxPrice || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/25">Filtering:</span>
                {searchTerm    && <ActivePill label={`"${searchTerm}"`} onRemove={() => setSearchTerm('')} />}
                {categoryFilter && <ActivePill label={categoryFilter} onRemove={() => setFilter('category','')} />}
                {roomFilter     && <ActivePill label={roomFilter}     onRemove={() => setFilter('room','')}     />}
                {sizeFilter     && <ActivePill label={sizeFilter}     onRemove={() => setFilter('size','')}     />}
                {colorFilter    && <ActivePill label={COLOR_OPTIONS.find(c => c.value === colorFilter)?.label ?? colorFilter} onRemove={() => setFilter('color','')} />}
                {(minPrice || maxPrice) && (
                  <ActivePill
                    label={`$${minPrice || '0'} – ${maxPrice ? '$' + maxPrice : '∞'}`}
                    onRemove={() => {
                      setPriceRange({ min: '', max: '' });
                      const p = new URLSearchParams(searchParams);
                      p.delete('minPrice'); p.delete('maxPrice');
                      router.push(`${pathname}?${p.toString()}`, { scroll: false });
                    }}
                  />
                )}
                <button onClick={clearAll} className="text-[10px] text-bisat-black/30 hover:text-red-500 underline transition-colors ml-1">Clear all</button>
              </div>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-bisat-cream animate-pulse" style={{ aspectRatio: '3/4' }} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 sm:gap-y-12">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(product => (
                    <motion.div key={product.id} layout
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.22 }}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-24 text-center bg-white border border-bisat-border">
                <div className="w-16 h-16 bg-bisat-cream flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-bisat-black/20" />
                </div>
                <p className="text-bisat-black/40 text-xl font-light mb-2">No rugs found</p>
                <p className="text-bisat-black/25 text-sm mb-6">Try adjusting your filters or search</p>
                <button onClick={clearAll}
                  className="bg-bisat-black text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-bisat-charcoal transition-all">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter bottom sheet ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-bisat-ivory z-50 lg:hidden border-t border-bisat-border max-h-[88vh] flex flex-col" style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.07)' }}>
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 bg-bisat-black/10 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-bisat-black/5 flex-shrink-0">
                <h3 className="font-bold text-gray-900">Filter & Sort</h3>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-700 p-1"><X size={20} /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-5 space-y-6">
                {/* Sort inside drawer */}
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/35 mb-3">Sort By</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => setSortBy(o.value)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold border transition-all ${
                          sortBy === o.value ? 'bg-bisat-black text-white border-bisat-black' : 'bg-transparent border-bisat-border text-bisat-black/60'
                        }`}>
                        {sortBy === o.value && <Check size={11} />}
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
                <FilterPanel onClose={() => setMobileOpen(false)} />
              </div>
              <div className="p-5 border-t border-bisat-black/5 flex-shrink-0">
                <button onClick={() => setMobileOpen(false)}
                  className="w-full bg-bisat-black text-white py-4 font-bold text-sm hover:bg-bisat-charcoal transition-colors">
                  Show {filteredProducts.length} Result{filteredProducts.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Reusable small components ──────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/35 mb-2.5">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold transition-all border ${
        active
          ? 'bg-bisat-black text-white border-bisat-black'
          : 'bg-transparent border-bisat-border text-bisat-black/55 hover:border-bisat-black/30 hover:text-bisat-black'
      }`}>
      {active && <Check size={10} />}
      {label}
    </button>
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-bisat-cream border border-bisat-border text-bisat-black/60 text-[11px] font-semibold">
      {label}
      <button onClick={onRemove} className="hover:text-bisat-black transition-colors ml-0.5"><X size={11} /></button>
    </span>
  );
}
