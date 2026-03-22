"use client";
import React from 'react';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCcw, Award } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { products } from '../data/products';
import { BLOG_POSTS } from '../data/blogPosts';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema, getWebSiteSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { ScrollReveal } from '../components/ScrollReveal';

const CATEGORIES = [
  { label: 'Handmade', desc: 'Hand-knotted by artisans', img: 'https://placehold.co/600x800', href: '/shop?category=Handmade' },
  { label: 'Vintage', desc: 'Authentic antique pieces', img: 'https://placehold.co/600x800', href: '/shop?category=Vintage' },
  { label: 'Kilim', desc: 'Flat-woven tribal art', img: 'https://placehold.co/600x800', href: '/shop?category=Kilim' },
  { label: 'Machine', desc: 'Precision-crafted modern', img: 'https://placehold.co/600x800', href: '/shop?category=Machine' },
];

const ROOMS = [
  { label: 'Living Room', img: 'https://placehold.co/600x700', href: '/shop?room=Living+Room' },
  { label: 'Bedroom', img: 'https://placehold.co/600x700', href: '/shop?room=Bedroom' },
  { label: 'Dining Room', img: 'https://placehold.co/600x700', href: '/shop?room=Dining+Room' },
  { label: 'Office', img: 'https://placehold.co/600x700', href: '/shop?room=Office' },
];

const TRUST = [
  { icon: ShieldCheck, label: 'Certificate of Authenticity', sub: 'Every rug verified' },
  { icon: Truck, label: 'Free Worldwide Shipping', sub: 'Insured & tracked' },
  { icon: RefreshCcw, label: '30-Day Returns', sub: 'No questions asked' },
  { icon: Award, label: '100+ Master Artisans', sub: 'Directly sourced' },
];

const BRAND_PILLARS = [
  { title: 'Ethical Sourcing', desc: 'We work directly with weaving communities to ensure fair wages and safe working conditions.' },
  { title: 'Natural Dyes', desc: 'Plant-based indigo, pomegranate, and madder root dyes that deepen beautifully with age.' },
  { title: 'Sustainable Fiber', desc: 'Only hand-spun wool, raw silk, and organic cotton — no synthetic shortcuts.' },
  { title: 'Cultural Preservation', desc: 'Every purchase funds the next generation of master weavers and their ancient craft.' },
];

export const Home = () => {
  const { t } = useTranslation();
  const featured = products.slice(0, 6);
  const topReviews = (t('home.reviewItems', { returnObjects: true }) as any[]).slice(0, 3);

  return (
    <div>
      <Meta
        title="Turkish Handmade & Vintage Rugs"
        description="Discover our curated collection of Turkish handmade, vintage, and machine-woven rugs. Anatolian heritage for your modern home."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-bisat-ivory overflow-hidden flex items-center">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-bisat-cream/60 rounded-l-[4rem] hidden lg:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text — CSS keyframe animation, visible by default */}
            <div className="hero-animate">
              <span className="inline-block text-bisat-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 border border-bisat-gold/30 rounded-full px-4 py-2">
                Artisan Turkish Rugs
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif font-bold leading-[1.05] mb-2 tracking-tight text-bisat-black">
                {t('home.hero.title').split('Heritage')[0]}
                <br />
                <span className="text-bisat-gold italic font-light">{t('home.hero.subtitle')}</span>
              </h1>
              <p className="text-bisat-gold/70 text-sm italic mb-4 font-serif">From Anatolia, for the world</p>
              <p className="text-bisat-black/55 text-base leading-relaxed mb-8 max-w-lg">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto justify-center bg-bisat-gold text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold hover:bg-bisat-black transition-all duration-400 flex items-center gap-3 group shadow-xl shadow-bisat-gold/20"
                >
                  {t('home.hero.cta')}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="text-bisat-black/60 text-xs uppercase tracking-[0.25em] font-bold hover:text-bisat-gold transition-colors border border-bisat-black/20 hover:border-bisat-gold px-6 py-4 rounded-full"
                >
                  {t('home.hero.secondary')}
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 sm:gap-8 mt-8 pt-8 border-t border-bisat-black/8">
                {[
                  { num: '200+', label: 'Unique Rugs' },
                  { num: '50+', label: 'Countries' },
                  { num: '100+', label: 'Artisans' },
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-3xl font-serif text-bisat-black mb-1">{stat.num}</p>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-bisat-black/35">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image grid — desktop only, CSS animation */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-[500px] hero-animate-2">
              <div className="col-span-1 row-span-2">
                <Link href="/shop" className="block h-full rounded-3xl overflow-hidden group">
                  <img src="https://placehold.co/600x800" alt="Featured rug" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.4s] ease-out" />
                </Link>
              </div>
              <div className="rounded-3xl overflow-hidden group">
                <Link href="/shop?category=Vintage" className="block h-full">
                  <img src="https://placehold.co/600x400" alt="Vintage collection" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.4s] ease-out" />
                </Link>
              </div>
              <div className="rounded-3xl overflow-hidden group relative">
                <Link href="/shop?category=Kilim" className="block h-full">
                  <img src="https://placehold.co/600x400" alt="Kilim collection" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.4s] ease-out" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2">
                    <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-bisat-black/50">New In</p>
                    <p className="text-sm font-serif text-bisat-black">Kilim Collection</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST BAR ────────────────────────────────────────── */}
      <section className="bg-bisat-black text-bisat-cream py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-0 md:divide-x md:divide-bisat-cream/10">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 md:px-6 md:first:pl-0 md:last:pr-0">
                <Icon size={18} className="text-bisat-gold flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold leading-snug">{label}</p>
                  <p className="text-[10px] text-bisat-cream/40 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-bisat-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-bisat-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-3 block">Just Arrived</span>
                <h2 className="text-3xl md:text-4xl font-serif text-bisat-black">New Arrivals</h2>
              </div>
              <Link href="/shop" className="group flex items-center gap-3 text-bisat-black/60 hover:text-bisat-gold transition-colors flex-shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">View All Rugs</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-12">
            {featured.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-14">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-bisat-black text-bisat-cream px-12 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold hover:bg-bisat-gold transition-all duration-400 group shadow-lg shadow-bisat-black/10"
            >
              Browse Full Collection
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. SHOP BY ROOM ─────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-bisat-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-bisat-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-3 block">Find Your Fit</span>
                <h2 className="text-3xl md:text-4xl font-serif text-bisat-black">Shop by Room</h2>
              </div>
              <Link href="/shop" className="group flex items-center gap-3 text-bisat-black/50 hover:text-bisat-gold transition-colors flex-shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">All Rooms</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {ROOMS.map((room, i) => (
              <ScrollReveal key={room.label} delay={i * 80}>
                <Link href={room.href} className="group block relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl">
                  <img src={room.img} alt={room.label} className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1.2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/75 via-bisat-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-white text-lg md:text-xl font-serif">{room.label}</h3>
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-white/70 text-[9px] uppercase tracking-[0.2em] font-bold">Shop Now</span>
                      <ArrowRight size={10} className="text-bisat-gold" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SHOP BY STYLE ────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-bisat-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3 sm:gap-4">
              <h2 className="text-3xl md:text-4xl font-serif text-bisat-black">Shop by Style</h2>
              <Link href="/shop" className="group flex items-center gap-3 text-bisat-black/50 hover:text-bisat-gold transition-colors flex-shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">All Styles</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 80}>
                <Link href={cat.href} className="group block relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1.2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/80 via-bisat-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <p className="text-bisat-gold text-[9px] uppercase tracking-[0.25em] font-bold mb-1">{cat.desc}</p>
                    <h3 className="text-white text-xl md:text-2xl font-serif">{cat.label}</h3>
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-white/70 text-[9px] uppercase tracking-[0.2em] font-bold">Shop Now</span>
                      <ArrowRight size={11} className="text-bisat-gold" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. RECENTLY VIEWED ──────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── 7. REVIEWS ──────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-bisat-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-bisat-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-3 block">{t('home.reviews.badge')}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-bisat-black">{t('home.reviews.title')}</h2>
              </div>
              <Link href="/reviews" className="group flex items-center gap-3 text-bisat-black/50 hover:text-bisat-gold transition-colors flex-shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('home.reviews.cta')}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {topReviews.map((review: any, i: number) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white rounded-3xl p-8 border border-bisat-black/5 flex flex-col h-full">
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(review.rating)].map((_: any, j: number) => (
                      <Star key={j} size={14} fill="#B8944F" color="#B8944F" />
                    ))}
                  </div>
                  <p className="text-bisat-black/70 leading-relaxed flex-grow mb-6 text-sm">"{review.text}"</p>
                  <div className="flex justify-between items-end pt-5 border-t border-bisat-black/5">
                    <div>
                      <p className="font-semibold text-bisat-black">{review.name}</p>
                      <p className="text-[11px] text-bisat-black/35 mt-0.5">{review.location}</p>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-bisat-black/25 font-medium">{review.date}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. BRAND STORY ──────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-bisat-black text-bisat-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <ScrollReveal className="aspect-[4/3] rounded-3xl overflow-hidden">
              <img src="https://placehold.co/800x600" alt="Artisan at work" className="w-full h-full object-cover" />
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <span className="text-bisat-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">{t('home.philosophy.badge')}</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-5 leading-tight">
                {t('home.philosophy.title').split('Slow')[0]}
                <span className="italic text-bisat-gold"> Slow Living</span>
              </h2>
              <p className="text-bisat-cream/55 text-base leading-relaxed mb-8">
                {t('home.philosophy.description')}
              </p>
              <div className="grid grid-cols-2 gap-5 mb-10">
                {BRAND_PILLARS.map(item => (
                  <div key={item.title}>
                    <h4 className="text-bisat-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5">{item.title}</h4>
                    <p className="text-bisat-cream/40 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 bg-white/8 hover:bg-bisat-gold px-7 py-3.5 rounded-full transition-all duration-400 text-xs uppercase tracking-[0.25em] font-bold text-white border border-white/10 hover:border-bisat-gold"
              >
                {t('home.philosophy.cta')}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 9. BLOG ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-bisat-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-3 sm:gap-4">
              <div>
                <span className="text-bisat-gold text-[10px] uppercase tracking-[0.35em] font-bold mb-3 block">{t('home.blog.badge')}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-bisat-black">{t('home.blog.title')}</h2>
              </div>
              <Link href="/blog" className="group flex items-center gap-3 text-bisat-black/50 hover:text-bisat-gold transition-colors flex-shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{t('home.blog.cta')}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 100}>
                <article className="group">
                  <Link href={`/blog/${post.id}`} className="block aspect-[16/10] overflow-hidden rounded-2xl mb-5 relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1.2s] ease-out" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-bisat-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold">{post.category}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-bisat-black/30 font-bold mb-3">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-bisat-black/15" />
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-serif mb-3 group-hover:text-bisat-gold transition-colors duration-300 leading-snug">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-bisat-black/50 hover:text-bisat-gold transition-colors group/link">
                    {t('home.blog.readMore')}
                    <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
