"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface MetaProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  robots?: string;
  keywords?: string;
}

export const Meta = ({
  title,
  description = 'Premium artisanal rugs and carpets from around the world. Hand-woven heritage for your modern home.',
  image = 'https://bisat-store.com/og-default.jpg',
  type = 'website',
  robots,
  keywords,
}: MetaProps) => {
  const location = ({ pathname: usePathname() });
  const siteName = 'Bisāṭ';
  const fullTitle = title.includes('Bisāṭ') ? title : `${title} | ${siteName}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bisat-store.com';
  const canonicalUrl = `${origin}${location.pathname}`;

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);
    if (robots) updateMeta('robots', robots);

    // Open Graph
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:url', canonicalUrl, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:image:width', '1200', 'property');
    updateMeta('og:image:height', '630', 'property');
    updateMeta('og:locale', 'en_US', 'property');
    updateMeta('og:site_name', siteName, 'property');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // html lang attribute
    document.documentElement.lang = document.documentElement.lang || 'en';

  }, [title, description, image, type, robots, keywords, location, fullTitle, canonicalUrl]);

  return null;
};
