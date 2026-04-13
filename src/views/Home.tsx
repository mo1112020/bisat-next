import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Award, ChevronRight, Instagram } from 'lucide-react';
import Link from 'next/link';
import { getProducts, getBlogPosts, getSiteImages, getSiteSettings, getCategories } from '../lib/db';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema, getWebSiteSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { ScrollReveal } from '../components/ScrollReveal';
import { NewsletterForm } from '../components/NewsletterForm';

const TRUST_ICONS = [ShieldCheck, Truck, RefreshCcw, Award];

export const Home = async () => {
  const [featured, blogPosts, siteImgs, settings, dbCategories] = await Promise.all([
    getProducts().then(p => p.slice(0, 8)),
    getBlogPosts().then(p => p.slice(0, 3)),
    getSiteImages(),
    getSiteSettings(),
    getCategories(),
  ]);

  const TRUST = [
    { icon: TRUST_ICONS[0], label: settings.trust_1_label, sub: settings.trust_1_sub },
    { icon: TRUST_ICONS[1], label: settings.trust_2_label, sub: settings.trust_2_sub },
    { icon: TRUST_ICONS[2], label: settings.trust_3_label, sub: settings.trust_3_sub },
    { icon: TRUST_ICONS[3], label: settings.trust_4_label, sub: settings.trust_4_sub },
  ];

  const CATEGORIES = dbCategories.length > 0
    ? dbCategories.map(cat => ({
        label: cat.name + ' Rugs',
        badge: cat.badge,
        img: cat.imageUrl,
        href: '/shop?category=' + encodeURIComponent(cat.name),
      }))
    : [
        { label: 'Handmade Rugs',       badge: 'Artisanal', img: 'https://images.unsplash.com/photo-1600166898405-da9535204843', href: '/shop?category=Handmade' },
        { label: 'Vintage Collections', badge: 'Authentic', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', href: '/shop?category=Vintage' },
        { label: 'Modern Pieces',       badge: 'Minimalist', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', href: '/shop?category=Modern' },
        { label: 'Nomadic Kilims',      badge: 'Heritage',   img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed', href: '/shop?category=Kilim' },
      ];

  return (
    <div className="bg-white">
      <Meta
        title="Bisāṭ | Authentic Turkish Rugs & Carpets"
        description="Shop our extensive collection of premium vintage, handmade, and modern Turkish rugs."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      {/* ── 0. PROMO BANNER ──────────────────────────────────────── */}
      <div className="bg-bisat-gold text-white text-[10px] uppercase font-bold tracking-widest py-2 relative z-10 w-full">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>{settings.promo_text}</span>
          <Link href="/shop" className="underline underline-offset-2 hover:text-bisat-black transition-colors">Shop Now</Link>
        </div>
      </div>

      {/* ── 1. HERO — full-bleed editorial ─────────────────────────── */}
      <section className="relative w-full min-h-[90vh] flex items-end bg-bisat-black overflow-hidden">
        {/* Full-bleed image */}
        <Image
          src={siteImgs.hero}
          alt="Luxurious interior with authentic handmade rug"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />

        {/* Layered gradient — darkens bottom for text, leaves top breathing room */}
        <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/85 via-bisat-black/25 to-transparent" />
        {/* Subtle left vignette to anchor text */}
        <div className="absolute inset-0 bg-gradient-to-r from-bisat-black/40 via-transparent to-transparent" />

        {/* Content anchored bottom-left */}
        <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pb-20 pt-48">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-10 h-[1px] bg-bisat-gold" />
              <span className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">
                {settings.hero_badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.8rem] sm:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-display text-white leading-[1.0] tracking-tight mb-5">
              {settings.hero_title}
              <br />
              <span className="italic font-light text-bisat-gold">{settings.hero_title_italic}</span>
            </h1>

            {/* Subhead */}
            <p className="text-white/55 text-base sm:text-lg mb-9 font-light leading-relaxed">
              {settings.hero_subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/shop"
                className="bg-bisat-gold text-white px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-bisat-black transition-colors duration-300"
              >
                Shop the Collection
              </Link>
              <Link
                href="/shop?category=Vintage"
                className="border border-white/35 text-white px-10 py-4 text-[10px] uppercase tracking-widest font-bold hover:border-bisat-gold hover:text-bisat-gold transition-colors duration-300"
              >
                Discover Vintage
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue — thin line at bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <span className="text-white text-[8px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="block w-[1px] h-8 bg-white/60" />
        </div>
      </section>

      {/* ── 2. TRUST MARKERS ──────────────────────────────────────── */}
      <section className="border-b border-bisat-black/5 bg-white py-7">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 text-center md:divide-x md:divide-bisat-black/5">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-3 group px-4">
                <Icon size={24} className="text-bisat-gold group-hover:-translate-y-0.5 transition-transform" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-bisat-black tracking-[0.18em]">{label}</p>
                  <p className="text-[11px] text-bisat-black/40 mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2b. AS SEEN IN ────────────────────────────────────────── */}
      <section className="py-5 bg-white border-b border-bisat-black/5">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/20 flex-shrink-0">As Seen In</p>
            <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-14 flex-wrap">
              {[
                { name: 'Architectural Digest', style: 'font-serif italic tracking-tight text-[13px] sm:text-[14px]' },
                { name: 'VOGUE LIVING',         style: 'font-serif tracking-[0.18em] text-[11px] sm:text-xs' },
                { name: 'Elle Decor',           style: 'font-serif italic tracking-wide text-[13px] sm:text-[14px]' },
                { name: 'dezeen',               style: 'font-sans font-semibold tracking-[0.2em] text-[11px] sm:text-xs' },
                { name: 'WSJ.',                 style: 'font-serif font-bold tracking-tighter text-[13px] sm:text-[14px]' },
              ].map(pub => (
                <span key={pub.name} className={`text-bisat-black/30 hover:text-bisat-black/60 transition-colors cursor-default ${pub.style}`}>
                  {pub.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CATEGORIES GRID — editorial, no rounded corners ─────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/30 mb-2">Collections</p>
              <h2 className="text-3xl sm:text-4xl font-serif text-bisat-black">Shop by Category</h2>
            </div>
            <Link href="/shop" className="text-[10px] uppercase font-bold tracking-widest text-bisat-black/40 hover:text-bisat-gold flex items-center gap-1 transition-colors">
              View All <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 80}>
                <Link href={cat.href} className="group block relative overflow-hidden aspect-[3/4] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-in-out"
                  />
                  {/* Dark gradient bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/70 via-bisat-black/10 to-transparent rounded-2xl" />

                  {/* Badge top-left */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-bisat-black text-[8px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Label bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-base font-serif text-white mb-1.5 leading-snug">{cat.label}</p>
                    <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-bisat-gold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Shop <ArrowRight size={9} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-bisat-ivory/60 border-t border-bisat-black/5">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/30 mb-2">Curated Selection</p>
              <h2 className="text-3xl sm:text-4xl font-serif text-bisat-black">Trending Now</h2>
            </div>
            <Link
              href="/shop"
              className="text-[10px] uppercase font-bold tracking-widest text-bisat-black/40 hover:text-bisat-gold flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight size={13} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
              {featured.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 40}>
                  <ProductCard product={product} priority={i < 4} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-bisat-black/30 font-serif text-lg">New arrivals coming soon.</p>
            </div>
          )}

          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 border border-bisat-black text-bisat-black px-12 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-bisat-black hover:text-white transition-all duration-300"
            >
              Shop All Rugs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. FULL-BLEED SPLIT PROMO ─────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="bg-bisat-black overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[420px]">
              <Image
                src={siteImgs.promo_split}
                alt="Exclusive rug collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bisat-black/50 hidden md:block" />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center p-10 lg:p-16 relative">
              <span className="text-bisat-gold text-[9px] uppercase tracking-[0.3em] font-bold mb-5">Members Exclusive</span>
              <h3 className="text-3xl sm:text-4xl font-serif text-white mb-5 leading-tight">
                {settings.promo_members_title}
              </h3>
              <p className="text-white/45 text-sm sm:text-base mb-8 max-w-sm font-light leading-relaxed">
                {settings.promo_members_sub}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RECENTLY VIEWED ────────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── 7. BLOG ENTRIES ───────────────────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className="py-20 sm:py-28 border-t border-bisat-black/5 bg-white">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/30 mb-2">Stories & Guides</p>
                <h2 className="text-3xl sm:text-4xl font-serif text-bisat-black">From the Journal</h2>
              </div>
              <Link href="/blog" className="text-[10px] uppercase font-bold tracking-widest text-bisat-black/40 hover:text-bisat-gold flex items-center gap-1 transition-colors">
                Read All <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {blogPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 100}>
                  <article className="group h-full flex flex-col">
                    <Link href={`/blog/${post.id}`} className="block relative aspect-[4/3] overflow-hidden mb-5 rounded-2xl shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 text-[8px] uppercase tracking-[0.2em] font-bold text-bisat-black rounded-full">
                        {post.category}
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-bisat-black/35 font-bold mb-2.5">
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-serif mb-3 group-hover:text-bisat-gold transition-colors duration-300 leading-snug">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-bisat-black/50 line-clamp-2 mb-5 font-light">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.id}`}
                      className="mt-auto inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] font-bold text-bisat-black group-hover:text-bisat-gold transition-colors"
                    >
                      Read Article <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. INSTAGRAM CTA ──────────────────────────────────────── */}
      <section className="bg-bisat-black text-white py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <Instagram size={28} className="text-bisat-gold mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-serif mb-3">@BisatRugs</h2>
          <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto font-light">
            Daily design inspiration, behind-the-scenes weaving stories, and exclusive previews.
          </p>
          <a
            href={settings.social_instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-bisat-gold text-white px-10 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-bisat-black transition-all duration-300"
          >
            <Instagram size={14} />
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};
