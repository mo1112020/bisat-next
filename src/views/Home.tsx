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
        { label: 'Vintage Collections', badge: 'Authentic',  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', href: '/shop?category=Vintage' },
        { label: 'Modern Pieces',       badge: 'Minimalist', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', href: '/shop?category=Modern' },
        { label: 'Nomadic Kilims',      badge: 'Heritage',   img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed', href: '/shop?category=Kilim' },
      ];

  return (
    <div className="bg-bisat-ivory">
      <Meta
        title="Bisāṭ | Authentic Turkish Rugs & Carpets"
        description="Shop our extensive collection of premium vintage, handmade, and modern Turkish rugs."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      {/* ── PROMO BANNER ──────────────────────────────────────────── */}
      <div className="bg-bisat-black text-white text-[10px] uppercase font-bold tracking-widest py-2.5 w-full">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 text-center flex items-center justify-center gap-3">
          <span>{settings.promo_text}</span>
          <span className="opacity-40">·</span>
          <Link href="/shop" className="underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity">Shop Now</Link>
        </div>
      </div>

      {/* ── HERO — full-bleed ─────────────────────────────────────── */}
      <section className="relative w-full min-h-[92vh] flex items-end bg-bisat-black overflow-hidden">
        <Image
          src={siteImgs.hero}
          alt="Luxurious interior with authentic handmade rug"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/80 via-bisat-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bisat-black/50 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pb-16 sm:pb-24 pt-48">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="block w-6 h-[1px] bg-bisat-gold" />
              <span className="text-white/80 text-[9px] uppercase tracking-[0.3em] font-bold">{settings.hero_badge}</span>
            </div>
            <h1 className="text-[2.6rem] sm:text-6xl lg:text-[5.5rem] font-display text-white leading-[1.0] tracking-tight mb-5">
              {settings.hero_title}
              <br />
              <span className="italic font-light text-bisat-gold">{settings.hero_title_italic}</span>
            </h1>
            <p className="text-white/55 text-base sm:text-lg mb-9 font-light leading-relaxed max-w-lg">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link href="/shop" className="bg-white text-bisat-black px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-bisat-black hover:text-white transition-colors duration-300 shadow-lg shadow-black/20">
                Shop the Collection
              </Link>
              <Link href="/shop?category=Vintage" className="border border-white/30 text-white px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:border-bisat-gold hover:text-bisat-gold transition-colors duration-300">
                Discover Vintage
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-30">
          <span className="text-white text-[8px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="block w-[1px] h-7 bg-white animate-pulse" />
        </div>
      </section>

      {/* ── TRUST MARKERS ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-bisat-border">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-5 first:pl-0">
                <Icon size={17} className="text-bisat-black/35 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[11px] font-semibold text-bisat-black leading-tight">{label}</p>
                  <p className="text-[10px] text-bisat-black/40 mt-0.5 font-light">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AS SEEN IN ────────────────────────────────────────────── */}
      <section className="py-5 bg-white border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-bisat-black/30 flex-shrink-0">As Seen In</p>
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

      {/* ── CATEGORIES ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-2">Collections</p>
              <h2 className="text-3xl sm:text-4xl font-light text-bisat-black">Shop by Category</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-bisat-black/40 hover:text-bisat-gold transition-colors">
              View All <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 80}>
                <Link href={cat.href} className="group block relative overflow-hidden aspect-[3/4] transition-all duration-500">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/65 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-bisat-black text-[8px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
                      {cat.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-base font-light text-white mb-1.5 leading-snug">{cat.label}</p>
                    <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-white/70 flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-white transition-all duration-300">
                      Shop Now <ArrowRight size={9} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FFF7E8]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-2">New Arrivals</p>
              <h2 className="text-3xl sm:text-4xl font-light text-bisat-black">Trending Now</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-bisat-black/40 hover:text-bisat-gold transition-colors">
              View All <ChevronRight size={13} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-y-12">
              {featured.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 40}>
                  <ProductCard product={product} priority={i < 4} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-bisat-border bg-white">
              <p className="text-bisat-black/30 text-sm font-light">New arrivals coming soon.</p>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-bisat-black text-white px-10 py-3.5 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors duration-200">
              Shop All Rugs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STORY / CRAFTSMANSHIP STRIP ───────────────────────────── */}
      <section className="py-16 sm:py-24 bg-bisat-cream border-y border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={siteImgs.promo_split}
                alt="Master weavers at work"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-5">Members Exclusive</p>
              <h3 className="text-3xl sm:text-4xl font-light text-bisat-black mb-4 leading-tight">
                {settings.promo_members_title}
              </h3>
              <p className="text-bisat-black/50 text-sm sm:text-base mb-8 font-light leading-relaxed max-w-sm">
                {settings.promo_members_sub}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENTLY VIEWED ───────────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── BLOG ──────────────────────────────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#FFF7E8] border-t border-bisat-border">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-2">Stories & Guides</p>
                <h2 className="text-3xl sm:text-4xl font-light text-bisat-black">From the Journal</h2>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-bisat-black/40 hover:text-bisat-gold transition-colors">
                Read All <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {blogPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 100}>
                  <article className="group h-full flex flex-col bg-white overflow-hidden transition-shadow duration-500 border border-bisat-border">
                    <Link href={`/blog/${post.id}`} className="block relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[8px] uppercase tracking-[0.2em] font-bold text-bisat-black shadow-sm">
                        {post.category}
                      </div>
                    </Link>
                    <div className="flex flex-col flex-grow p-5">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-bisat-black/35 font-bold mb-2.5">{post.date}</p>
                      <h3 className="text-lg font-normal mb-3 group-hover:text-bisat-black transition-colors duration-300 leading-snug flex-grow">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-bisat-black/50 line-clamp-2 mb-4 font-light">{post.excerpt}</p>
                      )}
                      <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] font-bold text-bisat-black group-hover:text-bisat-gold transition-colors">
                        Read Article <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INSTAGRAM CTA ─────────────────────────────────────────── */}
      <section className="bg-bisat-ivory border-t border-bisat-border py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Follow Along</p>
          <h2 className="text-2xl sm:text-3xl font-light mb-3 text-bisat-black">@BisatRugs</h2>
          <p className="text-bisat-black/45 text-sm mb-8 max-w-sm mx-auto font-light">
            Daily design inspiration, behind-the-scenes weaving stories, and exclusive previews.
          </p>
          <a
            href={settings.social_instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-bisat-black text-bisat-black px-8 py-3 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-black hover:text-white transition-all duration-300"
          >
            <Instagram size={14} />
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};
