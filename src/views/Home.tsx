import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Award, Instagram } from 'lucide-react';
import Link from 'next/link';
import { getProducts, getBlogPosts, getSiteImages, getSiteSettings, getCategories } from '../lib/db';
import { Meta } from '../components/Meta';
import { Schema, getOrganizationSchema, getWebSiteSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { ScrollReveal } from '../components/ScrollReveal';
import { NewsletterForm } from '../components/NewsletterForm';

const TRUST_ICONS = [ShieldCheck, Truck, RefreshCcw, Award];

const collectionPathFor = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('vintage')) return '/collections/vintage-rugs';
  if (normalized.includes('machine') || normalized.includes('easy')) return '/collections/easy-rugs';
  if (normalized.includes('handmade') || normalized.includes('authentic')) return '/collections/authentic-rugs';
  if (normalized.includes('custom')) return '/collections/custom-rugs';
  return '/collections/rug';
};

export const Home = async () => {
  const [featured, blogPosts, siteImgs, settings, dbCategories] = await Promise.all([
    getProducts().then(p => p.slice(0, 8)),
    getBlogPosts().then(p => p.slice(0, 3)),
    getSiteImages(),
    getSiteSettings(),
    getCategories(),
  ]);

  const trustItems = [
    { icon: TRUST_ICONS[0], label: settings.trust_1_label, sub: settings.trust_1_sub },
    { icon: TRUST_ICONS[1], label: settings.trust_2_label, sub: settings.trust_2_sub },
    { icon: TRUST_ICONS[2], label: settings.trust_3_label, sub: settings.trust_3_sub },
    { icon: TRUST_ICONS[3], label: settings.trust_4_label, sub: settings.trust_4_sub },
  ];

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

  const roomCards = [
    {
      title: 'Living Room',
      description: 'Anchor the room with oversized vintage and handmade pieces.',
      href: '/collections/rug?room=Living+Room',
      img: categories[0]?.img ?? siteImgs.hero,
    },
    {
      title: 'Bedroom',
      description: 'Soft palettes and natural materials for quieter interiors.',
      href: '/collections/rug?room=Bedroom',
      img: categories[1]?.img ?? siteImgs.promo_split,
    },
    {
      title: 'Hallway',
      description: 'Runners and slim silhouettes for long transitional spaces.',
      href: '/collections/rug?room=Hallway',
      img: categories[2]?.img ?? siteImgs.hero,
    },
  ];

  return (
    <div className="bg-white">
      <Meta
        title="Bisāṭ | Authentic Turkish Rugs & Carpets"
        description="Shop our extensive collection of premium vintage, handmade, and modern Turkish rugs."
      />
      <Schema data={getOrganizationSchema()} />
      <Schema data={getWebSiteSchema()} />

      <section className="border-b border-bisat-border bg-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:px-12 lg:py-14">
          <div className="flex flex-col justify-between gap-8">
            <div className="max-w-xl">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">
                {settings.hero_badge}
              </p>
              <h1 className="font-serif text-[3rem] leading-[0.95] tracking-[-0.06em] text-bisat-black sm:text-[4.6rem] lg:text-[5.5rem]">
                {settings.hero_title}
                <br />
                <span className="text-bisat-black/72">{settings.hero_title_italic}</span>
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-bisat-black/56">
                {settings.hero_subtitle}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/collections/rug" className="bisat-button">
                  All Products
                  <ArrowRight size={12} />
                </Link>
                <Link href="/collections/vintage-rugs" className="bisat-button-secondary">
                  New Arrivals
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-bisat-border sm:grid-cols-4">
              {trustItems.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-bisat-cream px-4 py-5">
                  <Icon size={16} className="mb-4 text-bisat-black/46" strokeWidth={1.5} />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bisat-black">{label}</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-bisat-black/50">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden border border-bisat-border bg-bisat-cream sm:min-h-[520px]">
            <Image
              src={siteImgs.hero}
              alt="Featured Bisāṭ rug collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black">
              New Arrival
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white/88 px-5 py-4 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-bisat-black/35">Editor’s Note</p>
              <p className="mt-2 max-w-md text-[14px] leading-6 text-bisat-black/65">
                A cleaner, softer storefront inspired by the Rughaus layout, adapted for Bisāṭ’s rug collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-bisat-border bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Featured Collections</p>
              <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
                Browse by category
              </h2>
            </div>
            <Link href="/collections/rug" className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/50 transition-colors hover:text-bisat-black sm:inline-flex sm:items-center sm:gap-2">
              View all
              <ArrowRight size={11} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.slice(0, 4).map((category, index) => (
              <ScrollReveal key={category.label} delay={index * 70}>
                <Link href={category.href} className="group block border border-bisat-border bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bisat-cream">
                    <Image
                      src={category.img}
                      alt={category.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="border-t border-bisat-border px-5 py-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/38">{category.badge}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/30">Collection</span>
                    </div>
                    <h3 className="font-serif text-[1.5rem] font-light leading-tight text-bisat-black">{category.label}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/55 transition-colors group-hover:text-bisat-black">
                      Shop now
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-bisat-border bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">New Arrivals</p>
              <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
                Latest additions
              </h2>
            </div>
            <Link href="/collections/rug" className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/50 transition-colors hover:text-bisat-black sm:inline-flex sm:items-center sm:gap-2">
              All products
              <ArrowRight size={11} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {featured.slice(0, 4).map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 60}>
                  <ProductCard product={product} priority={index < 2} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="border border-bisat-border bg-bisat-cream px-6 py-16 text-center text-bisat-black/50">
              New products are coming soon.
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-bisat-border bg-bisat-cream">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-0 px-5 py-0 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:px-12">
          <div className="relative min-h-[340px] overflow-hidden border-x border-bisat-border lg:min-h-[560px]">
            <Image
              src={siteImgs.promo_split}
              alt="Bisāṭ craftsmanship and weaving heritage"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center border border-bisat-border border-t-0 bg-white px-6 py-12 sm:px-10 lg:border-l-0 lg:border-t lg:px-14">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">About Us</p>
            <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
              Crafted with heritage, curated for modern homes.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-bisat-black/56">
              Bisāṭ connects traditional weaving ateliers with contemporary interiors. Each piece is selected for material honesty, character, and the story it brings into the room.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/pages/about" className="bisat-button">
                  Learn more
                </Link>
                <Link href="/pages/for-business" className="bisat-button-secondary">
                  For business
                </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-bisat-border bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Shop By Room</p>
              <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
                Rugs for every space
              </h2>
            </div>
            <Link href="/pages/case-gallery" className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/50 transition-colors hover:text-bisat-black sm:inline-flex sm:items-center sm:gap-2">
              View lookbook
              <ArrowRight size={11} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {roomCards.map((room, index) => (
              <ScrollReveal key={room.title} delay={index * 80}>
                <Link href={room.href} className="group block border border-bisat-border bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bisat-cream">
                    <Image
                      src={room.img}
                      alt={room.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="border-t border-bisat-border px-5 py-5">
                    <h3 className="font-serif text-[1.7rem] font-light tracking-[-0.04em] text-bisat-black">{room.title}</h3>
                    <p className="mt-3 text-[14px] leading-6 text-bisat-black/54">{room.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/55 transition-colors group-hover:text-bisat-black">
                      Shop room
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-bisat-border bg-bisat-cream py-14 sm:py-18">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-px bg-bisat-border lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-white px-6 py-10 sm:px-10 sm:py-14">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Custom Made Order</p>
              <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
                Looking for something specific?
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-bisat-black/56">
                We can help source one-of-a-kind vintage pieces, advise on scale, or guide you toward the right color family for your project.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/pages/contact" className="bisat-button">
                  Contact us
                </Link>
                <Link href="/pages/virtual-coordinate" className="bisat-button-secondary">
                  Virtual coordinate
                </Link>
              </div>
            </div>
            <div className="grid bg-white sm:grid-cols-2 lg:grid-cols-1">
              {featured.slice(4, 6).map((product, index) => (
                <div key={product.id} className={index === 0 ? 'border-b border-bisat-border' : ''}>
                  <div className="flex h-full flex-col gap-5 px-6 py-8 sm:px-8">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/36">{product.category}</span>
                    <h3 className="font-serif text-[1.8rem] font-light tracking-[-0.04em] text-bisat-black">{product.name}</h3>
                    <p className="text-[14px] leading-6 text-bisat-black/54">{product.description}</p>
                        <Link href={`/products/${product.id}`} className="mt-auto inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/55 transition-colors hover:text-bisat-black">
                      View product
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {blogPosts.length > 0 && (
        <section className="border-t border-bisat-border bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Blog / Journal</p>
                <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
                  Stories and guides
                </h2>
              </div>
              <Link href="/pages/articles" className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/50 transition-colors hover:text-bisat-black sm:inline-flex sm:items-center sm:gap-2">
                View all
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {blogPosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index * 80}>
                  <article className="h-full border border-bisat-border bg-white">
                    <Link href={`/blog/${post.id}`} className="relative block aspect-[16/11] overflow-hidden bg-bisat-cream">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      />
                    </Link>
                    <div className="border-t border-bisat-border px-5 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/35">{post.category}</p>
                      <h3 className="mt-3 font-serif text-[1.6rem] font-light tracking-[-0.04em] text-bisat-black">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-3 text-[14px] leading-6 text-bisat-black/54">{post.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/32">{post.date}</span>
                        <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/55 transition-colors hover:text-bisat-black">
                          Read more
                          <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-bisat-border bg-bisat-cream py-14 sm:py-18">
        <div className="mx-auto grid max-w-[1320px] gap-px bg-bisat-border px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div className="bg-white px-6 py-10 sm:px-10 sm:py-14">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Instagram</p>
            <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
              Follow the collection
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-bisat-black/56">
              Behind-the-scenes sourcing, new room edits, and weekly product spotlights from the Bisāṭ archive.
            </p>
            <a
              href={settings.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black transition-colors hover:text-bisat-gold-dark"
            >
              <Instagram size={12} />
              Follow on Instagram
            </a>
          </div>
          <div className="bg-white px-6 py-10 sm:px-10 sm:py-14">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-bisat-black/38">Email Newsletter</p>
            <h2 className="font-serif text-4xl font-light tracking-[-0.05em] text-bisat-black sm:text-5xl">
              Stay in the loop
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-bisat-black/56">
              Receive collection launches, sourcing notes, and subscriber-only previews.
            </p>
            <div className="mt-8 max-w-xl">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
