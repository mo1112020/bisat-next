"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

export const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-bisat-black text-bisat-ivory">
      {/* Top bar CTA */}
      <div className="border-b border-bisat-cream/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div>
            <p className="text-bisat-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-1">Free Worldwide Shipping</p>
            <p className="text-bisat-cream/50 text-sm">Every rug is hand-packed and insured for complimentary delivery.</p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-3 bg-bisat-gold/10 hover:bg-bisat-gold px-8 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-gold hover:text-white transition-all duration-400 border border-bisat-gold/20 hover:border-bisat-gold flex-shrink-0"
          >
            Shop the Collection
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-16 sm:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="font-sans text-3xl font-bold tracking-tight mb-6 block text-bisat-ivory hover:text-bisat-gold transition-colors duration-300">
              Bisāṭ
            </Link>
            <p className="text-bisat-ivory/50 text-sm leading-relaxed mb-8 max-w-xs font-light">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2 text-bisat-ivory/30 text-sm mb-2">
              <MapPin size={14} className="flex-shrink-0" />
              <span>Grand Bazaar Quarter, Istanbul, Turkey</span>
            </div>
            <div className="flex items-center gap-2 text-bisat-ivory/30 text-sm mb-8">
              <Phone size={14} className="flex-shrink-0" />
              <span>+90 212 000 0000</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/bisat.store/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-bisat-ivory/10 flex items-center justify-center text-bisat-ivory/30 hover:text-bisat-gold hover:border-bisat-gold transition-all duration-300">
                <Instagram size={15} />
              </a>
              <a href="https://tr.pinterest.com/bisattstore/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="w-9 h-9 rounded-full border border-bisat-ivory/10 flex items-center justify-center text-bisat-ivory/30 hover:text-bisat-gold hover:border-bisat-gold transition-all duration-300">
                <PinterestIcon />
              </a>
              <a href="https://www.tiktok.com/@bisattstore" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full border border-bisat-ivory/10 flex items-center justify-center text-bisat-ivory/30 hover:text-bisat-gold hover:border-bisat-gold transition-all duration-300">
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-ivory/40 mb-6">Collections</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Handmade Rugs', href: '/shop?category=Handmade' },
                { label: 'Vintage Rugs', href: '/shop?category=Vintage' },
                { label: 'Kilim', href: '/shop?category=Kilim' },
                { label: 'Machine Woven', href: '/shop?category=Machine' },
                { label: 'New Arrivals', href: '/shop' },
                { label: 'Sale', href: '/shop' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-bisat-ivory/50 text-sm font-light hover:text-bisat-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-ivory/40 mb-6">Company</h4>
            <ul className="space-y-3.5">
              {[
                { label: t('footer.comp_l1'), href: '/about' },
                { label: t('footer.comp_l2'), href: '/craftsmanship' },
                { label: 'Journal', href: '/blog' },
                { label: 'Reviews', href: '/reviews' },
                { label: t('footer.comp_l5'), href: '/contact' },
                { label: t('footer.comp_l3'), href: '/track-order' },
                { label: t('footer.comp_l4'), href: '/shipping' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-bisat-ivory/50 text-sm font-light hover:text-bisat-gold transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-ivory/40 mb-6">Newsletter</h4>
            <p className="text-bisat-ivory/40 text-sm font-light mb-6 leading-relaxed">
              {t('footer.news_desc')}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-bisat-gold">
                <span className="w-5 h-5 rounded-full bg-bisat-gold/20 flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </span>
                <span className="text-sm font-medium">You're subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('footer.placeholder')}
                  className="w-full bg-white/5 border border-bisat-ivory/10 rounded-xl px-4 py-3 text-sm text-bisat-ivory placeholder:text-bisat-ivory/25 focus:outline-none focus:border-bisat-gold/50 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-bisat-gold text-white py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-bisat-gold/80 transition-colors flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <Mail size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-bisat-ivory/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-bisat-ivory/25 font-medium">
          <p>{t('footer.rights')}</p>
          <div className="flex items-center gap-8">
            <Link href="/kvkk" className="hover:text-bisat-gold transition-colors duration-300">KVKK</Link>
            <Link href="/privacy" className="hover:text-bisat-gold transition-colors duration-300">Privacy</Link>
            <Link href="/terms" className="hover:text-bisat-gold transition-colors duration-300">Terms</Link>
            <Link href="/faq" className="hover:text-bisat-gold transition-colors duration-300">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
