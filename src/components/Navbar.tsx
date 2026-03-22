"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Heart, User, Globe, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

// ── Navigation data ──────────────────────────────────────────────────────────
const SHOP_MEGA = [
  {
    title: 'By Craft',
    links: [
      { label: 'Hand-knotted', href: '/shop?category=Handmade' },
      { label: 'Kilims', href: '/shop?category=Kilim' },
      { label: 'Machine-made', href: '/shop?category=Machine' },
      { label: 'Vintage', href: '/shop?category=Vintage' },
      { label: 'Overdyed', href: '/shop?style=Overdyed' },
      { label: 'Runners', href: '/shop?size=Runner' },
      { label: 'All Rugs', href: '/shop', highlight: true },
    ],
  },
  {
    title: 'By Size',
    links: [
      { label: 'Small (under 4m²)', href: '/shop?size=Small' },
      { label: 'Medium (4–8m²)', href: '/shop?size=Medium' },
      { label: 'Large (8–12m²)', href: '/shop?size=Large' },
      { label: 'Oversized (12m²+)', href: '/shop?size=Large' },
      { label: 'Runner', href: '/shop?size=Runner' },
      { label: 'Round', href: '/shop?style=Round' },
      { label: 'Custom size', href: '/contact' },
    ],
  },
  {
    title: 'By Color',
    links: [
      { label: 'Red', href: '/shop?color=Red' },
      { label: 'Blue', href: '/shop?color=Blue' },
      { label: 'Neutral / Beige', href: '/shop?color=Neutral' },
      { label: 'Green', href: '/shop?color=Green' },
      { label: 'Ivory / Cream', href: '/shop?color=Ivory' },
      { label: 'Multi', href: '/shop?color=Multi' },
      { label: 'Black', href: '/shop?color=Black' },
    ],
  },
  {
    title: 'Featured',
    links: [
      { label: 'New Arrivals', href: '/shop' },
      { label: 'Best Sellers', href: '/shop?sort=bestselling' },
      { label: 'Under $500', href: '/shop?maxPrice=500' },
      { label: 'Sale', href: '/shop?sale=true' },
      { label: 'AI Room Preview', href: '/shop', highlight: true },
    ],
  },
];

const COLLECTIONS_LINKS = [
  { label: 'Oushak', href: '/shop?collection=Oushak' },
  { label: 'Cappadocia', href: '/shop?collection=Cappadocia' },
  { label: 'Hereke Silk', href: '/shop?collection=Hereke' },
  { label: 'Bergama Heritage', href: '/shop?collection=Bergama' },
  { label: 'Konya Traditional', href: '/shop?collection=Konya' },
  { label: 'Modern Minimalist', href: '/shop?style=Modern' },
  { label: 'Bohemian Edit', href: '/shop?style=Bohemian' },
  { label: 'The Neutral Edit', href: '/shop?color=Neutral' },
  { label: 'Under $500', href: '/shop?maxPrice=500' },
];

const ROOMS_LINKS = [
  { label: 'Living Room', href: '/shop?room=Living+Room' },
  { label: 'Bedroom', href: '/shop?room=Bedroom' },
  { label: 'Dining Room', href: '/shop?room=Dining+Room' },
  { label: 'Kitchen', href: '/shop?room=Kitchen' },
  { label: 'Hallway & Entryway', href: '/shop?room=Hallway' },
  { label: 'Office', href: '/shop?room=Office' },
  { label: 'Outdoor', href: '/shop?room=Outdoor' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'tr', name: 'Türkçe' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const NavDropdownLink: React.FC<{ href: string; label: string; highlight?: boolean; onClick: () => void }> = ({
  href, label, highlight, onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`block py-1.5 text-[12px] font-light transition-colors duration-150 nav-link-hover ${
      highlight ? 'text-bisat-gold font-semibold' : 'text-bisat-charcoal/80'
    }`}
  >
    {label}
  </Link>
);

// ── Main component ────────────────────────────────────────────────────────────
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); setMobileAccordion(null); }, [pathname]);

  const openDropdown = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(id);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setIsOpen(false);
  };

  // ── Desktop nav item ───────────────────────────────────────────────────────
  const DesktopNavItem: React.FC<{
    id: string;
    label: string;
    href?: string;
    hasDropdown?: boolean;
  }> = ({ id, label, href, hasDropdown }) => {
    const isActive = href ? pathname === href || pathname.startsWith(href + '?') : false;
    const isDropOpen = activeDropdown === id;

    if (!hasDropdown && href) {
      return (
        <Link
          href={href}
          className={`text-[10px] uppercase tracking-[0.22em] font-semibold transition-colors duration-200 relative group ${
            isActive ? 'text-bisat-gold' : 'text-bisat-black/65 hover:text-bisat-black'
          }`}
        >
          {label}
          <span className={`absolute -bottom-1 left-0 h-[1px] bg-bisat-gold transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </Link>
      );
    }

    return (
      <div
        className="relative"
        onMouseEnter={() => openDropdown(id)}
        onMouseLeave={closeDropdown}
      >
        <button
          className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] font-semibold transition-colors duration-200 relative group ${
            isDropOpen ? 'text-bisat-gold' : 'text-bisat-black/65 hover:text-bisat-black'
          }`}
        >
          {label}
          <ChevronDown
            size={11}
            strokeWidth={2.5}
            className={`transition-transform duration-200 ${isDropOpen ? 'rotate-180' : ''}`}
          />
          <span className={`absolute -bottom-1 left-0 h-[1px] bg-bisat-gold transition-all duration-300 ${isDropOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* ── Desktop navbar bar ────────────────────────────────────────────── */}
      <nav
        className={`relative h-16 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-bisat-black/8'
            : 'bg-white border-bisat-black/6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full">

            {/* Logo */}
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-bisat-black hover:text-bisat-gold transition-colors duration-300 flex-shrink-0 z-10"
            >
              Bisāṭ
            </Link>

            {/* Desktop nav — absolute center */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="flex items-center gap-7 pointer-events-auto">
                <DesktopNavItem id="shop" label="Shop" hasDropdown />
                <DesktopNavItem id="collections" label="Collections" hasDropdown />
                <DesktopNavItem id="rooms" label="Rooms" hasDropdown />
                <DesktopNavItem id="vintage" label="Vintage" href="/shop?category=Vintage" />
                <DesktopNavItem id="journal" label="Journal" href="/blog" />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 z-10">
              {/* Language switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="p-2 text-bisat-black/55 hover:text-bisat-black transition-colors flex items-center gap-1"
                >
                  <Globe size={17} strokeWidth={1.5} />
                  <span className="text-[9px] uppercase font-bold">{i18n.language.split('-')[0]}</span>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-36 bg-white shadow-xl rounded-2xl border border-bisat-black/5 overflow-hidden py-2 z-50"
                    >
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-bisat-cream transition-colors ${
                            i18n.language.startsWith(lang.code) ? 'text-bisat-gold' : 'text-bisat-black/55'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="hidden sm:flex p-2 text-bisat-black/55 hover:text-bisat-black transition-colors">
                <Search size={17} strokeWidth={1.5} />
              </button>

              <Link href="/wishlist" className="p-2 text-bisat-black/55 hover:text-bisat-black relative transition-colors">
                <Heart size={17} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-bisat-gold text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/account" className="hidden sm:flex p-2 text-bisat-black/55 hover:text-bisat-black transition-colors">
                <User size={17} strokeWidth={1.5} />
              </Link>

              <Link href="/cart" className="p-2 text-bisat-black/55 hover:text-bisat-black relative transition-colors">
                <ShoppingBag size={17} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-bisat-gold text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-bisat-black transition-transform active:scale-90"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop dropdown panels (inside nav so hover works) ─────────── */}

        {/* Shop mega-dropdown */}
        <AnimatePresence>
          {activeDropdown === 'shop' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="hidden md:block absolute left-0 right-0 bg-white border-t border-bisat-black/6 shadow-2xl z-50"
              onMouseEnter={() => openDropdown('shop')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-4 gap-10">
                {SHOP_MEGA.map(col => (
                  <div key={col.title}>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-bisat-gold mb-4">{col.title}</p>
                    {col.links.map(link => (
                      <NavDropdownLink key={link.href + link.label} {...link} onClick={closeAll} />
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collections dropdown */}
        <AnimatePresence>
          {activeDropdown === 'collections' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="hidden md:block absolute left-0 right-0 bg-white border-t border-bisat-black/6 shadow-2xl z-50"
              onMouseEnter={() => openDropdown('collections')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-bisat-gold mb-4">Collections</p>
                <div className="grid grid-cols-3 gap-x-8">
                  {COLLECTIONS_LINKS.map(link => (
                    <NavDropdownLink key={link.href} {...link} onClick={closeAll} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rooms dropdown */}
        <AnimatePresence>
          {activeDropdown === 'rooms' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="hidden md:block absolute left-0 right-0 bg-white border-t border-bisat-black/6 shadow-2xl z-50"
              onMouseEnter={() => openDropdown('rooms')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-bisat-gold mb-4">Shop by Room</p>
                <div className="grid grid-cols-4 gap-x-8">
                  {ROOMS_LINKS.map(link => (
                    <NavDropdownLink key={link.href} {...link} onClick={closeAll} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile menu drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="md:hidden fixed inset-0 bg-white z-40 overflow-y-auto"
            style={{ top: 'calc(var(--topbar-h, 2.25rem) + 4rem)' }}
          >
            <div className="px-6 pt-4 pb-20">

              {/* Shop accordion */}
              <MobileAccordion
                title="Shop"
                id="shop"
                active={mobileAccordion}
                onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}
              >
                <div className="grid grid-cols-2 gap-x-4 pb-4">
                  {SHOP_MEGA.map(col => (
                    <div key={col.title} className="mb-4">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-bisat-gold mb-2">{col.title}</p>
                      {col.links.map(link => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`block py-1.5 text-sm ${link.highlight ? 'text-bisat-gold font-semibold' : 'text-bisat-black/65'}`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </MobileAccordion>

              {/* Collections accordion */}
              <MobileAccordion
                title="Collections"
                id="collections"
                active={mobileAccordion}
                onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}
              >
                <div className="pb-4 columns-2 gap-x-4">
                  {COLLECTIONS_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-1.5 text-sm text-bisat-black/65 hover:text-bisat-gold transition-colors break-inside-avoid"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              {/* Rooms accordion */}
              <MobileAccordion
                title="Rooms"
                id="rooms"
                active={mobileAccordion}
                onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}
              >
                <div className="pb-4 columns-2 gap-x-4">
                  {ROOMS_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-1.5 text-sm text-bisat-black/65 hover:text-bisat-gold transition-colors break-inside-avoid"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              {/* Direct links */}
              {[
                { label: 'Vintage', href: '/shop?category=Vintage' },
                { label: 'Journal', href: '/blog' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-4 text-2xl font-serif border-b border-bisat-black/6 text-bisat-black hover:text-bisat-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Secondary links */}
              <div className="pt-8 mt-4 border-t border-bisat-black/8 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { label: 'Track Order', href: '/track-order' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'About', href: '/about' },
                  { label: 'Shipping', href: '/shipping' },
                ].map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] uppercase tracking-widest font-bold text-bisat-black/35 hover:text-bisat-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Mobile accordion helper ───────────────────────────────────────────────────
const MobileAccordion: React.FC<{
  title: string;
  id: string;
  active: string | null;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}> = ({ title, id, active, onToggle, children }) => {
  const isOpen = active === id;
  return (
    <div className="border-b border-bisat-black/6">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-4 text-2xl font-serif text-bisat-black"
      >
        {title}
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={`text-bisat-black/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
