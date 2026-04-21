import React from 'react';
import Image from 'next/image';
import { ArrowRight, Instagram, Star } from 'lucide-react';
import Link from 'next/link';
import {
  getProducts,
  getBlogPosts,
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
import { RughausLifestyleQuad } from '../components/RughausLifestyleQuad';
import { buildLifestyleQuadCards } from '../lib/lifestyleQuad';

const collectionPathFor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('vintage')) return '/collections/vintage-rugs';
  if (normalized.includes('machine') || normalized.includes('easy')) return '/collections/easy-rugs';
  if (normalized.includes('handmade') || normalized.includes('authentic')) return '/collections/authentic-rugs';
  if (normalized.includes('custom')) return '/collections/custom-rugs';
  return '/collections/rug';
};

const FALLBACK_TESTIMONIALS = [
  {
    id: 'f1',
    name: 'Customer',
    location: 'Istanbul',
    title: 'Vintage Oushak',
    text: 'The rug arrived quickly and matches the photos. Texture is firm underfoot but pleasant barefoot — very happy with the purchase.',
    date: '2025',
    rating: 5,
    category: 'Vintage',
  },
  {
    id: 'f2',
    name: 'Customer',
    location: 'Berlin',
    title: 'Living room',
    text: 'Beautiful pattern and quality beyond expectations. It ties the whole room together.',
    date: '2025',
    rating: 5,
    category: 'Handmade',
  },
  {
    id: 'f3',
    name: 'Customer',
    location: 'Dubai',
    title: 'Custom size',
    text: 'Team helped with dimensions and the piece fits perfectly. Communication was excellent.',
    date: '2025',
    rating: 5,
    category: 'Modern',
  },
];

export const Home = async () => {
  const [featured, blogPosts, siteImgs, settings, dbCategories, testimonials] = await Promise.all([
    getProducts().then(p => p.slice(0, 12)),
    getBlogPosts().then(p => p.slice(0, 3)),
    getSiteImages(),
    getSiteSettings(),
    getCategories(),
    getTestimonials(),
  ]);

  const categories = dbCategories.length > 0
    ? dbCategories.map(cat => ({
        label: `${cat.name} Rugs`,
        name: cat.name,
        badge: cat.badge,
        img: cat.imageUrl,
        href: collectionPathFor(cat.name),
      }))
    : [
        { label: 'Handmade Rugs', name: 'Handmade', badge: 'Artisanal', img: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1200&auto=format&fit=crop', href: '/collections/authentic-rugs' },
        { label: 'Vintage Rugs', name: 'Vintage', badge: 'Archive', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop', href: '/collections/vintage-rugs' },
        { label: 'Kilim Rugs', name: 'Kilim', badge: 'Flatweave', img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200&auto=format&fit=crop', href: '/collections/rug' },
        { label: 'Modern Rugs', name: 'Modern', badge: 'Contemporary', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop', href: '/collections/easy-rugs' },
      ];

  const lifestyleQuad = buildLifestyleQuadCards(settings, siteImgs);

  const reviewCards = testimonials.length > 0 ? testimonials.slice(0, 8) : FALLBACK_TESTIMONIALS;
  const reviewCount = testimonials.length > 0 ? testimonials.length : 132;

  return (
    <div className="bg-bisat-paper">
      <Meta
        title="Bisāṭ | Authentic Turkish Rugs & Carpets"
        description="Shop our extensive collection of premium vintage, handmade, and modern Turkish rugs."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      {/* ── Full-bleed hero (Rughaus-style editorial) ─────────────────────── */}
      <section className="relative min-h-[min(92svh,920px)] w-full overflow-hidden bg-bisat-black">
        <Image
          src={siteImgs.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-88"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="relative z-10 mx-auto flex min-h-[min(92svh,920px)] max-w-[1320px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <p className="hero-animate mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-white/65">
            {settings.hero_badge}
          </p>
          <h1 className="hero-animate-2 max-w-[18ch] font-rh text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.98] tracking-[-0.02em] text-white">
            {settings.hero_title}
            <span className="block text-white/78">{settings.hero_title_italic}</span>
          </h1>
          <p className="hero-animate-3 mt-6 max-w-md text-[15px] leading-7 text-white/72">
            {settings.hero_subtitle}
          </p>
          <div className="hero-animate-3 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/collections/rug"
              className="inline-flex w-fit items-center justify-center gap-2 border border-white bg-white px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-bisat-black transition-colors hover:bg-transparent hover:text-white"
            >
              Shop all
              <ArrowRight size={12} />
            </Link>
            <Link
              href="/size-guide"
              className="inline-flex w-fit items-center justify-center gap-2 border border-white/40 bg-transparent px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Rug size guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── Intro line ───────────────────────────────────────────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-bisat-paper py-14 sm:py-16">
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-bisat-black/38">Bisāṭ interiors</p>
          <p className="mt-5 font-rh text-[clamp(1.75rem,4.2vw,2.65rem)] font-light leading-snug tracking-[-0.02em] text-bisat-black">
            Colour and fibre, brought into everyday rooms — the way you actually live.
          </p>
        </div>
      </section>

      {/* ── Personal rug guide (quiz / diagnosis analogue) ──────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 lg:grid-cols-2">
          <Link
            href="/size-guide"
            className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden border-b border-bisat-black/[0.06] p-8 sm:min-h-[340px] sm:p-12 lg:border-b-0 lg:border-r"
          >
            <Image
              src={siteImgs.promo_split}
              alt=""
              fill
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="relative z-10 max-w-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">Guide</p>
              <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-white sm:text-[2.75rem]">
                Find the right rug for your space
              </h2>
              <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Open size guide
                <ArrowRight size={11} />
              </span>
            </div>
          </Link>
          <div className="flex flex-col justify-center bg-bisat-paper px-8 py-12 sm:px-12 sm:py-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-bisat-black/38">Styling</p>
            <h2 className="mt-4 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black sm:text-[2.65rem]">
              Virtual placement and room ideas
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-bisat-black/52">
              See how texture and scale read in your own layout before you commit — or browse real installs for inspiration.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pages/virtual-coordinate" className="bisat-button">
                Try virtual coordinate
                <ArrowRight size={12} />
              </Link>
              <Link href="/pages/case-gallery" className="bisat-button-secondary">
                Case gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW RELEASE — collection spotlight ───────────────────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">New release</p>
              <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black sm:text-5xl">
                Bedroom collection
              </h2>
              <p className="mt-3 max-w-lg text-[15px] text-bisat-black/50">
                Softer palettes and quieter pile for spaces made for rest.
              </p>
            </div>
            <Link
              href="/collections/rug?room=Bedroom"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/45 transition-colors hover:text-bisat-black"
            >
              Shop bedroom
              <ArrowRight size={11} />
            </Link>
          </div>
          <Link href="/collections/rug?room=Bedroom" className="group relative block aspect-[21/9] min-h-[200px] overflow-hidden bg-bisat-cream sm:min-h-[280px]">
            <Image
              src={categories[1]?.img ?? siteImgs.hero}
              alt="Bedroom rugs"
              fill
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1320px) 100vw, 1320px"
            />
            <div className="absolute left-5 top-5 bg-bisat-black px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white">
              New release
            </div>
          </Link>
        </div>
      </section>

      {/* ── Dual editorial tiles — “Always wanted” / “Discovery” ───────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-bisat-paper">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 md:grid-cols-2">
          {[
            {
              kicker: 'Curated',
              title: 'Always wanted',
              sub: 'Pieces we return to — texture, tone, and longevity.',
              href: '/collections/vintage-rugs',
              img: categories[2]?.img ?? siteImgs.hero,
            },
            {
              kicker: 'Explore',
              title: 'Your next discovery',
              sub: 'Fresh arrivals and unexpected colour stories.',
              href: '/collections/rug',
              img: categories[0]?.img ?? siteImgs.promo_split,
            },
          ].map((tile, i) => (
            <Link
              key={tile.title}
              href={tile.href}
              className={`group relative flex min-h-[420px] flex-col justify-end overflow-hidden p-8 sm:min-h-[480px] sm:p-12 ${i === 1 ? 'border-t border-bisat-black/[0.06] md:border-l md:border-t-0' : ''}`}
            >
              <Image src={tile.img} alt="" fill className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/2 to-transparent" />
              <div className="relative z-10 max-w-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">{tile.kicker}</p>
                <h2 className="mt-3 font-rh text-[2.25rem] font-light tracking-[-0.02em] text-white sm:text-5xl">{tile.title}</h2>
                <p className="mt-4 text-[14px] leading-relaxed text-white/75">{tile.sub}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                  View collection
                  <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <RughausLifestyleQuad
        eyebrow={lifestyleQuad.eyebrow}
        title={lifestyleQuad.title}
        subtitle={lifestyleQuad.subtitle}
        cards={lifestyleQuad.cards}
      />

      {/* ── NEW ARRIVAL — product strip ───────────────────────────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-bisat-paper py-14 sm:py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">New arrival</p>
              <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black sm:text-5xl">
                Latest pieces
              </h2>
            </div>
            <Link
              href="/collections/rug"
              className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/45 transition-colors hover:text-bisat-black sm:inline-flex sm:items-center sm:gap-2"
            >
              View all
              <ArrowRight size={11} />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-5">
              {featured.slice(0, 5).map((product, index) => (
                <div key={product.id} className="w-[72vw] shrink-0 sm:w-auto">
                  <ScrollReveal delay={index * 50}>
                    <ProductCard product={product} priority={index < 2} newArrival />
                  </ScrollReveal>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-bisat-black/[0.08] bg-white px-6 py-16 text-center text-bisat-black/45">
              New products are coming soon.
            </div>
          )}
        </div>
      </section>

      {/* ── Reviews — Judge.me style band ───────────────────────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Reviews</p>
              <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black sm:text-5xl">
                Let customers speak for us
              </h2>
            </div>
            <p className="text-[13px] text-bisat-black/45">
              from {reviewCount}+ reviews
            </p>
          </div>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {reviewCards.map(r => (
              <article
                key={r.id}
                className="w-[85vw] shrink-0 border border-bisat-black/[0.08] bg-bisat-paper p-6 sm:w-auto"
              >
                <div className="mb-3 flex gap-0.5 text-bisat-black">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      strokeWidth={1.2}
                      className={si < r.rating ? 'fill-bisat-black text-bisat-black' : 'fill-transparent text-bisat-black/18'}
                    />
                  ))}
                </div>
                <p className="text-[14px] leading-relaxed text-bisat-black/62 line-clamp-6">{r.text}</p>
                <div className="mt-5 border-t border-bisat-black/[0.06] pt-4">
                  <p className="text-[11px] font-medium text-bisat-black">{r.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-bisat-black/38">{r.title}</p>
                  <p className="mt-1 text-[10px] text-bisat-black/32">{r.date}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center sm:text-left">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/45 transition-colors hover:text-bisat-black"
            >
              All reviews
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Room visualizer CTA ───────────────────────────────────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-bisat-black text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col justify-center px-8 py-14 sm:px-12 sm:py-20 lg:py-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45">Preview</p>
            <h2 className="mt-4 font-rh text-4xl font-light leading-tight tracking-[-0.02em] sm:text-5xl">
              How will this piece feel in your room?
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-white/58">
              Project scale and mood before you order — so choosing a rug stays simple and confident.
            </p>
            <Link
              href="/pages/virtual-coordinate"
              className="mt-10 inline-flex w-fit items-center gap-2 border border-white bg-white px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-bisat-black transition-colors hover:bg-transparent hover:text-white"
            >
              Try it
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="relative min-h-[280px] lg:min-h-0">
            <Image src={siteImgs.hero} alt="" fill className="object-cover opacity-90" sizes="(max-width: 1024px) 100vw, 45vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-bisat-black/80 to-transparent lg:bg-gradient-to-t" />
          </div>
        </div>
      </section>

      {/* ── About split ───────────────────────────────────────────────────── */}
      <section className="border-b border-bisat-black/[0.06] bg-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-bisat-cream lg:min-h-[520px]">
            <Image src={siteImgs.promo_split} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center border-bisat-black/[0.06] px-8 py-12 sm:px-12 lg:border-l lg:py-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">About Bisāṭ</p>
            <h2 className="mt-4 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black sm:text-5xl">
              Heritage craft, edited for contemporary rooms.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-bisat-black/52">
              We work with weavers and archives to offer rugs with material honesty and quiet character — selected for how they live with light, furniture, and daily use.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pages/about" className="bisat-button">
                Our story
              </Link>
              <Link href="/pages/for-business" className="bisat-button-secondary">
                Trade and projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {blogPosts.length > 0 && (
        <section className="border-b border-bisat-black/[0.06] bg-bisat-paper py-14 sm:py-20">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Journal</p>
                <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black sm:text-5xl">
                  Stories and guides
                </h2>
              </div>
              <Link
                href="/pages/articles"
                className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/45 transition-colors hover:text-bisat-black sm:inline-flex sm:items-center sm:gap-2"
              >
                View all
                <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {blogPosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index * 70}>
                  <article className="h-full border border-bisat-black/[0.08] bg-white">
                    <Link href={`/blog/${post.id}`} className="relative block aspect-[16/11] overflow-hidden bg-bisat-cream">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      />
                    </Link>
                    <div className="border-t border-bisat-black/[0.06] px-5 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/35">{post.category}</p>
                      <h3 className="mt-3 font-rh text-2xl font-light tracking-[-0.02em] text-bisat-black">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-3 text-[14px] leading-6 text-bisat-black/50 line-clamp-3">{post.excerpt}</p>
                      <Link
                        href={`/blog/${post.id}`}
                        className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/45 hover:text-bisat-black"
                      >
                        Read
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter (Rughaus closes with email + social) ──────────────── */}
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Instagram</p>
            <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black">Follow the edit</h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-bisat-black/52">
              Room installs, sourcing trips, and weekly drops from the archive.
            </p>
            <a
              href={settings.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black transition-colors hover:text-bisat-gold-dark"
            >
              <Instagram size={12} />
              Follow on Instagram
            </a>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Email</p>
            <h2 className="mt-3 font-rh text-4xl font-light tracking-[-0.02em] text-bisat-black">Private previews</h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-bisat-black/52">
              First access to arrivals and one-of-a-kind pieces.
            </p>
            <div className="mt-8 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
