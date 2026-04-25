import React from 'react';
import Image from 'next/image';
import { ArrowRight, Instagram, Star } from 'lucide-react';
import Link from 'next/link';
import {
  getProducts,
  getSiteImages,
  getSiteSettings,
  getCategories,
  getTestimonials,
} from '../lib/db';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema, getWebSiteSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { ScrollReveal } from '../components/ScrollReveal';
import { NewsletterForm } from '../components/NewsletterForm';
import { HeroCarousel, type HeroSlide } from '../components/HeroCarousel';

const SHELL = 'mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-16';

const collectionPathFor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('vintage')) return '/collections/vintage-rugs';
  if (normalized.includes('machine') || normalized.includes('easy')) return '/collections/easy-rugs';
  if (normalized.includes('handmade') || normalized.includes('authentic')) return '/collections/authentic-rugs';
  if (normalized.includes('custom')) return '/collections/custom-rugs';
  return '/collections/rug';
};

const FALLBACK_TESTIMONIALS = [
  { id: 'f1', name: 'Sophie M.', location: 'London', title: 'Vintage Oushak', text: 'The rug arrived in perfect condition and the quality is exceptional. It completely transformed our living room.', date: '2025', rating: 5, category: 'Vintage' },
  { id: 'f2', name: 'Thomas K.', location: 'Berlin', title: 'Handmade rug', text: 'Beautiful craftsmanship. The texture and color are even better in person. Worth every penny.', date: '2025', rating: 5, category: 'Handmade' },
  { id: 'f3', name: 'Layla A.', location: 'Dubai', title: 'Custom size', text: 'The team was incredibly helpful. The custom dimensions were executed perfectly.', date: '2025', rating: 5, category: 'Modern' },
  { id: 'f4', name: 'Marc D.', location: 'Paris', title: 'Kilim', text: 'Ordered from France and the shipping was fast. The piece is exactly as described — stunning.', date: '2025', rating: 5, category: 'Kilim' },
];

export const Home = async () => {
  const [featured, siteImgs, settings, dbCategories, testimonials] = await Promise.all([
    getProducts().then(p => p.slice(0, 8)),
    getSiteImages(),
    getSiteSettings(),
    getCategories(),
    getTestimonials(),
  ]);

  const categories = dbCategories.length > 0
    ? dbCategories.map(cat => ({
        label: cat.name,
        badge: cat.badge ?? '',
        img: cat.imageUrl,
        href: collectionPathFor(cat.name),
      }))
    : [
        { label: 'Handmade', badge: 'Hand-knotted artisan pieces', img: siteImgs.lifestyle_1_hero, href: '/collections/authentic-rugs' },
        { label: 'Vintage', badge: 'Archive & one-of-a-kind', img: siteImgs.lifestyle_3_hero, href: '/collections/vintage-rugs' },
        { label: 'Kilim', badge: 'Flatweave tradition', img: siteImgs.lifestyle_4_hero, href: '/collections/rug' },
        { label: 'Modern', badge: 'Contemporary design', img: siteImgs.lifestyle_2_hero, href: '/collections/easy-rugs' },
      ];

  const findCategory = (...needles: string[]) =>
    dbCategories.find(cat => needles.some(n => cat.name.toLowerCase().includes(n)));

  const easyCategory = findCategory('easy', 'machine');
  const vintageCategory = findCategory('vintage');

  const heroSlides: HeroSlide[] = [
    {
      image: siteImgs.hero,
      title: [settings.hero_title, settings.hero_title_italic].filter(Boolean).join(' ') || 'Artisan Masterpieces',
      subtitle: settings.hero_subtitle || 'Elevate your home with our curated selection of authentic, hand-knotted pieces rooted in cultural heritage.',
      cta: 'Explore Collection',
      href: '/collections/rug',
    },
    {
      image: easyCategory?.imageUrl || siteImgs.promo_split,
      title: easyCategory ? `${easyCategory.name} Collection` : 'Easy Living Collection',
      subtitle: 'Softer palettes and quieter pile for spaces made for rest.',
      cta: 'Shop Now',
      href: easyCategory ? collectionPathFor(easyCategory.name) : '/collections/easy-rugs',
    },
    {
      image: vintageCategory?.imageUrl || siteImgs.lifestyle_3_hero,
      title: 'Vintage Archive',
      subtitle: 'One-of-a-kind Persian and Anatolian pieces with singular character.',
      cta: 'View Archive',
      href: '/collections/vintage-rugs',
    },
  ];

  const reviewCards = testimonials.length > 0 ? testimonials.slice(0, 4) : FALLBACK_TESTIMONIALS;
  const reviewCount = testimonials.length > 0 ? testimonials.length : 132;

  return (
    <div className="bg-white">
      <Meta
        title="Bisatim | Authentic Turkish Rugs & Carpets"
        description="Shop our extensive collection of premium vintage, handmade, and modern Turkish rugs."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      {/* ── Hero ──────────────────────────────────────── */}
      <HeroCarousel slides={heroSlides} />

      {/* ── Collections — full-width, edge-to-edge ────── */}
      <section className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden"
              style={{ minHeight: 'clamp(340px, 55vw, 720px)' }}
            >
              {cat.img && (
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={i < 2}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              {/* Right border between tiles */}
              {i < 3 && <div className="absolute right-0 inset-y-0 w-px bg-white/15" />}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <p className="font-rh text-[2rem] font-light leading-[1.1] text-white sm:text-[2.5rem] lg:text-[3rem]">
                  {cat.label}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/55 transition-all duration-300 group-hover:text-white/90">
                  Shop <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Brand Manifesto ───────────────────────────── */}
      <section className="bg-white px-5 py-24 text-center sm:py-36 lg:py-44">
        <div className="mx-auto max-w-[900px]">
          <p className="font-rh text-[clamp(1.875rem,5vw,4.25rem)] font-light italic leading-[1.25] tracking-[0.005em] text-bisat-black">
            &ldquo;Colour and fibre, brought into everyday rooms &mdash; the way you actually live.&rdquo;
          </p>
          <div className="mx-auto mt-10 flex items-center gap-6 max-w-[220px]">
            <div className="h-px flex-1 bg-bisat-black/10" />
            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-bisat-black/30">Bisāṭim</p>
            <div className="h-px flex-1 bg-bisat-black/10" />
          </div>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────── */}
      <section className="bg-bisat-paper py-20 sm:py-28">
        <div className={SHELL}>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-bisat-black/35">
                New in
              </p>
              <h2 className="font-rh text-[2.25rem] font-light leading-[1.1] text-bisat-black sm:text-[3rem]">
                Latest arrivals
              </h2>
            </div>
            <Link
              href="/collections/rug"
              className="hidden items-center gap-2 border-b border-bisat-black/25 pb-px text-[11px] font-medium uppercase tracking-[0.22em] text-bisat-black/55 transition-colors hover:border-bisat-black hover:text-bisat-black sm:inline-flex"
            >
              View all
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-4 lg:gap-4">
              {featured.slice(0, 4).map((product, index) => (
                <div key={product.id} className="w-[72vw] shrink-0 sm:w-auto">
                  <ScrollReveal delay={index * 80}>
                    <ProductCard product={product} priority={index < 2} newArrival />
                  </ScrollReveal>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-10 text-center sm:hidden">
            <Link href="/collections/rug" className="bisat-button-secondary">
              View all rugs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Full-Bleed Editorial — Room Ideas ─────────── */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden sm:h-[80vh]">
        <Image
          src={siteImgs.promo_split}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="p-8 pb-12 sm:p-14 sm:pb-16 lg:p-20 lg:pb-20 max-w-xl">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
              Styling
            </p>
            <h2 className="font-rh text-[2.5rem] font-light leading-[1.12] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
              See it in your room first.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.85] text-white/55">
              Browse real installations and room ideas before you decide. Every piece, in context.
            </p>
            <Link
              href="/pages/case-gallery"
              className="mt-9 inline-flex items-center gap-3 border border-white/30 bg-white/10 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-bisat-black"
            >
              Room ideas <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────── */}
      <section className="bg-bisat-paper py-20 sm:py-28">
        <div className={SHELL}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-rh text-[2.25rem] font-light leading-[1.1] text-bisat-black sm:text-[3rem]">
              What customers say
            </h2>
            <p className="flex items-center gap-2.5 text-[11px] text-bisat-black/40">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} strokeWidth={0} className="fill-bisat-black" />
                ))}
              </span>
              4.9 · {reviewCount}+ verified reviews
            </p>
          </div>

          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-5">
            {reviewCards.map(review => (
              <article
                key={review.id}
                className="flex h-full w-[78vw] shrink-0 flex-col border border-bisat-black/[0.07] bg-white p-7 sm:w-auto"
              >
                <div className="font-rh text-[3.5rem] leading-[0.75] text-bisat-sand select-none" aria-hidden>
                  &#8220;
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-[1.75] text-bisat-black/60 line-clamp-5">
                  {review.text}
                </p>
                <div className="mt-6 flex items-end justify-between border-t border-bisat-black/[0.06] pt-5">
                  <div>
                    <p className="text-[12px] font-medium text-bisat-black">{review.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-bisat-black/32">{review.title}</p>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={11}
                        strokeWidth={1}
                        className={si < review.rating ? 'fill-bisat-black text-bisat-black' : 'fill-transparent text-bisat-black/15'}
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {/* ── Newsletter ────────────────────────────────── */}
      <section className="bg-bisat-black py-24 sm:py-36">
        <div className="mx-auto max-w-[560px] px-5 text-center">
          <h2 className="font-rh text-[2.5rem] font-light leading-[1.15] text-white sm:text-[3.25rem]">
            First access.<br />Always.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.85] text-white/38">
            Private drops, archive finds, and new arrivals — delivered quietly to your inbox.
          </p>
          <div className="mt-10">
            <NewsletterForm />
          </div>
          <a
            href={settings.social_instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-white/28 transition-colors hover:text-white/60"
          >
            <Instagram size={13} />
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};
