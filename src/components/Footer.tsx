"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Instagram, ArrowRight } from 'lucide-react';

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z"/>
  </svg>
);

interface CollectionLink { label: string; href: string; }

export const Footer = () => {
  const [collections, setCollections] = useState<CollectionLink[]>([
    { label: 'Handmade Rugs', href: '/collections/rug?category=Handmade' },
    { label: 'Vintage Rugs', href: '/collections/rug?category=Vintage' },
    { label: 'Kilim', href: '/collections/rug?category=Kilim' },
    { label: 'Machine Woven', href: '/collections/rug?category=Machine' },
  ]);
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/bisatim_/');
  const [pinterestUrl, setPinterestUrl] = useState('https://tr.pinterest.com/bisatim_/');
  const [tiktokUrl, setTiktokUrl] = useState('https://www.tiktok.com/@bisatim_');

  useEffect(() => {
    fetch('/api/store-config')
      .then(response => response.json())
      .then(data => {
        if (data.categories?.length) {
          setCollections((data.categories as string[]).map((name: string) => ({
            label: `${name} Rugs`,
            href: `/collections/rug?category=${encodeURIComponent(name)}`,
          })));
        }
      })
      .catch(() => {});

    fetch('/api/site-settings-public')
      .then(response => response.json())
      .then(data => {
        if (data.social_instagram) setInstagramUrl(data.social_instagram as string);
        if (data.social_pinterest) setPinterestUrl(data.social_pinterest as string);
        if (data.social_tiktok) setTiktokUrl(data.social_tiktok as string);
      })
      .catch(() => {});
  }, []);

  const socials = [
    { href: instagramUrl, label: 'Instagram', icon: <Instagram size={15} /> },
    { href: pinterestUrl, label: 'Pinterest', icon: <PinterestIcon /> },
    { href: tiktokUrl, label: 'TikTok', icon: <TikTokIcon /> },
  ];

  const companyLinks = [
    { label: 'About', href: '/pages/about' },
    { label: 'Living With Rugs', href: '/pages/living-with-rugs' },
    { label: 'Articles', href: '/pages/articles' },
    { label: 'Case Gallery', href: '/pages/case-gallery' },
    { label: 'Virtual Coordinate', href: '/pages/virtual-coordinate' },
    { label: 'Contact', href: '/pages/contact' },
  ];

  const supportLinks = [
    { label: 'All Products', href: '/collections/rug' },
    { label: 'Authentic Rugs', href: '/collections/authentic-rugs' },
    { label: 'Easy Rugs', href: '/collections/easy-rugs' },
    { label: 'Vintage Rugs', href: '/collections/vintage-rugs' },
    { label: 'Custom Rugs', href: '/collections/custom-rugs' },
    { label: 'Shipping and Payment', href: '/pages/shipping-and-payment' },
    { label: 'FAQ', href: '/faq' },
    { label: 'For Business', href: '/pages/for-business' },
  ];

  return (
    <footer className="bg-[#f7f5f2] text-bisat-black">

      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-14 grid grid-cols-2 gap-10 sm:gap-12 md:grid-cols-12 sm:mb-20">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="mb-4 block font-rh text-[1.9rem] font-light tracking-[-0.03em] text-bisat-black">
              Bisāṭim
            </Link>
            <p className="mb-7 max-w-[260px] text-[13px] leading-relaxed text-bisat-black/48" suppressHydrationWarning>
              Curating the world&apos;s finest hand-woven rugs and carpets. Each piece tells a story of heritage and craftsmanship.
            </p>

            <div className="flex items-center gap-2.5">
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center border border-bisat-black/[0.12] text-bisat-black/40 transition-colors hover:border-bisat-black/30 hover:text-bisat-black"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h4 className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-bisat-black/40">Product</h4>
            <ul className="space-y-3">
              {collections.slice(0, 5).map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block text-[13px] text-bisat-black/58 transition-colors hover:text-bisat-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-bisat-black/40">Service</h4>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-block text-[13px] text-bisat-black/58 transition-colors hover:text-bisat-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-bisat-black/40">Information</h4>
            <ul className="space-y-3">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-block text-[13px] text-bisat-black/58 transition-colors hover:text-bisat-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-bisat-black/[0.07] pt-8 sm:flex-row">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-bisat-black/34" suppressHydrationWarning>
            © 2026 Bisāṭim. All Rights Reserved.
          </p>
          <Link
            href="/collections/rug"
            className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-bisat-black"
          >
            Browse All Products
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </footer>
  );
};
