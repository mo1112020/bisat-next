"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCcw, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Product } from '../data/products';
import { BlogPostData } from '../data/blogPosts';
import { getProducts, getBlogPosts } from '../lib/db';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema, getWebSiteSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { ScrollReveal } from '../components/ScrollReveal';

const TRUST = [
  { icon: ShieldCheck, label: 'Verified Integrity', sub: 'Every rug certified' },
  { icon: Truck, label: 'Free Shipping', sub: 'Worldwide, fully insured' },
  { icon: RefreshCcw, label: '30-Day Returns', sub: 'Hassle-free policy' },
  { icon: Award, label: 'Direct from Makers', sub: 'No middlemen' },
];

const CATEGORIES = [
  { label: 'Vintage Rugs', badge: 'Trending', img: 'https://placehold.co/800x800', href: '/shop?category=Vintage' },
  { label: 'Handmade Knots', badge: 'New Arrivals', img: 'https://placehold.co/800x800', href: '/shop?category=Handmade' },
  { label: 'Flatweave Kilims', badge: 'Save 20%', img: 'https://placehold.co/800x800', href: '/shop?category=Kilim' },
  { label: 'Machine-Made', badge: 'Everyday Value', img: 'https://placehold.co/800x800', href: '/shop?category=Machine' },
];

export const Home = () => {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);

  useEffect(() => {
    // For e-commerce layout, show more products in a grid
    getProducts().then(data => setFeatured(data.slice(0, 8)));
    getBlogPosts().then(data => setBlogPosts(data.slice(0, 3)));
  }, []);

  return (
    <div className="bg-white">
      <Meta
        title="Bisāṭ | Authentic Turkish Rugs & Carpets"
        description="Shop our extensive collection of premium vintage, handmade, and modern Turkish rugs."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      {/* ── 0. PROMO BANNER ──────────────────────────────────────── */}
      <div className="bg-bisat-gold text-white text-[10px] uppercase font-bold tracking-widest text-center py-2 px-4 shadow-sm z-50 relative">
        <span className="inline-flex items-center gap-2">
          🔥 Mid-Season Sale: Up to 40% off Vintage Collections! <Link href="/shop" className="underline underline-offset-2 ml-1">Shop Now</Link>
        </span>
      </div>

      {/* ── 1. HERO BANNER (E-COMMERCE PREMIUM) ──────────────────────── */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-bisat-ivory overflow-hidden">
        {/* Background image on mobile, right-aligned image on desktop */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[55%] h-full z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxurious interior with authentic handmade rug" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for mobile readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/90 via-bisat-black/50 to-transparent lg:hidden"></div>
          {/* Gradient fade to integrate with the ivory background on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-bisat-ivory via-bisat-ivory/20 to-transparent hidden lg:block"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center h-full">
          <div className="max-w-xl hero-animate mt-auto lg:mt-0 pt-32 lg:pt-0">
            <span className="inline-flex items-center gap-3 text-white lg:text-bisat-deep-red text-[11px] uppercase tracking-[0.25em] font-bold mb-6">
              <span className="w-8 h-[2px] bg-bisat-gold"></span>
              The Summer Edit
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-display text-white lg:text-bisat-black leading-[1.05] tracking-tight mb-6">
               Artisan <br className="hidden sm:block" />
               <span className="italic font-light text-bisat-gold">Masterpieces</span>
            </h1>
            <p className="text-white/80 lg:text-bisat-black/60 text-base sm:text-lg mb-10 max-w-lg font-light leading-relaxed">
              Elevate your home with our curated selection of strictly authentic, hand-knotted pieces deeply rooted in cultural heritage. Directly sourced, ethically made.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto bg-bisat-gold text-white px-10 py-4.5 text-[11px] uppercase tracking-widest font-bold hover:bg-bisat-black transition-colors duration-400 text-center shadow-2xl rounded-sm"
              >
                Shop The Collection
              </Link>
              <Link
                href="/shop?category=Vintage"
                className="w-full sm:w-auto bg-transparent border border-white/30 lg:border-bisat-black/20 text-white lg:text-bisat-black px-10 py-4.5 text-[11px] uppercase tracking-widest font-bold hover:border-bisat-gold hover:text-bisat-gold transition-colors duration-400 text-center rounded-sm"
              >
                Discover Vintage
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST MARKERS ──────────────────────────────────────── */}
      <section className="border-b border-bisat-black/5 bg-bisat-cream/40 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 text-center md:divide-x md:divide-bisat-black/5">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-2 group px-2">
                <Icon size={24} className="text-bisat-gold group-hover:-translate-y-1 transition-transform" />
                <div>
                  <p className="text-[11px] uppercase font-bold text-bisat-black tracking-widest">{label}</p>
                  <p className="text-[10px] text-bisat-black/50 mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CATEGORIES CAROUSEL/GRID ───────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif text-bisat-black">Shop by Category</h2>
            <Link href="/shop" className="text-[10px] uppercase font-bold tracking-widest text-bisat-black/50 hover:text-bisat-gold flex items-center gap-1 transition-colors">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 100}>
                <Link href={cat.href} className="group block relative rounded-2xl md:rounded-3xl overflow-hidden aspect-square border border-bisat-black/5">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-bisat-black text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & CTA */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm sm:text-base font-serif font-bold text-bisat-black mb-1">{cat.label}</p>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-bisat-gold flex items-center gap-1">
                      Shop Now <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED PRODUCTS (BEST SELLERS) ───────────────────── */}
      <section className="py-12 sm:py-20 bg-bisat-cream/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif text-bisat-black mb-3">Trending Now</h2>
            <p className="text-sm text-bisat-black/50 max-w-lg mx-auto">
              Our most sought-after designs this week. Hand-selected for exceptional quality and timeless style.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 50}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop?sort=bestselling"
              className="inline-flex items-center justify-center bg-transparent border-2 border-bisat-black text-bisat-black px-10 py-3.5 text-[11px] uppercase tracking-widest font-bold hover:bg-bisat-black hover:text-white transition-all duration-300 rounded-sm"
            >
              Shop All Best Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. SPLIT PROMO (IMAGE + TEXT CTA) ─────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-bisat-black rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
               <div className="md:w-1/2 relative min-h-[400px]">
                 <img src="https://placehold.co/800x800" alt="Special Collection" className="absolute inset-0 w-full h-full object-cover opacity-80" />
               </div>
               <div className="md:w-1/2 flex flex-col justify-center p-10 lg:p-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-bisat-gold/20 to-transparent opacity-50"></div>
                  <span className="text-bisat-gold text-[10px] uppercase tracking-widest font-bold mb-4 relative z-10">Members Exclusive</span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-white mb-4 relative z-10 leading-tight">Join our Rewards Club & Get $50 Off Your First Order.</h3>
                  <p className="text-white/60 text-sm mb-8 max-w-md relative z-10">
                     Unlock early access to sales, exclusive vintage drops, and earn points on every purchase.
                  </p>
                  <form className="flex flex-col sm:flex-row relative z-10 gap-3" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3.5 rounded-sm focus:outline-none focus:border-bisat-gold text-sm w-full outline-hidden"
                    />
                    <button className="bg-bisat-gold text-white px-8 py-3.5 text-[11px] uppercase tracking-widest font-bold hover:bg-white hover:text-bisat-black transition-colors rounded-sm whitespace-nowrap">
                       Sign Up
                    </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* ── 6. RECENTLY VIEWED ──────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── 7. LATEST JOURNAL ENTRIES ─────────────────────────────── */}
      <section className="py-12 sm:py-20 border-t border-bisat-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif text-bisat-black">From the Journal</h2>
            <Link href="/blog" className="text-[10px] uppercase font-bold tracking-widest text-bisat-black/50 hover:text-bisat-gold flex items-center gap-1 transition-colors">
              Read All Entries <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 100}>
                <article className="group h-full flex flex-col">
                  <Link href={`/blog/${post.id}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-in-out" />
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-sm shadow-sm text-[9px] uppercase tracking-widest font-bold text-bisat-black">
                      {post.category}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-bisat-black/40 font-bold mb-2">
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-serif mb-2 group-hover:text-bisat-gold transition-colors duration-300 leading-snug">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-bisat-black/60 line-clamp-2 mb-4">
                     Learn about the intricate details of hand-woven rugs and how to style them perfectly in your own space.
                  </p>
                  <Link href={`/blog/${post.id}`} className="mt-auto inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black group-hover:text-bisat-gold transition-colors">
                    Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. INSTAGRAM FEED SIMULATION ───────────────────────────── */}
      <section className="w-full overflow-hidden bg-bisat-black text-white">
        <div className="py-12 border-b border-white/10">
          <div className="text-center mb-8">
             <h2 className="text-2xl sm:text-3xl font-serif mb-2">@BisatRugs</h2>
             <p className="text-sm text-white/50">Follow us on Instagram for daily inspiration</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-[200px] sm:h-[250px] w-full">
            {[1, 2, 3, 4, 5, 6].map((img, i) => (
              <a href="#" key={i} className={`block relative group overflow-hidden ${i > 3 ? 'hidden lg:block' : ''} ${i === 3 ? 'hidden md:block' : ''}`}>
                 <img src={`https://placehold.co/400x400`} alt="Instagram Feed" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                 <div className="absolute inset-0 bg-bisat-black/0 group-hover:bg-bisat-black/40 transition-colors flex items-center justify-center">
                    <Star size={24} className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                 </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
