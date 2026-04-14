"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Heart, User, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AnimatePresence, motion } from 'motion/react';

const STATIC_SIZE_LINKS = [
  { label: 'Small (under 4m²)', href: '/shop?size=Small' },
  { label: 'Medium (4–8m²)',    href: '/shop?size=Medium' },
  { label: 'Large (8–12m²)',    href: '/shop?size=Large' },
  { label: 'Runner',            href: '/shop?size=Runner' },
];

const STATIC_FEATURED = [
  { label: 'New Arrivals',  href: '/shop',              highlight: false },
  { label: 'Best Sellers',  href: '/shop',              highlight: false },
  { label: 'Under $500',    href: '/shop?maxPrice=500', highlight: false },
  { label: 'Sale',          href: '/shop?sale=true',    highlight: false },
  { label: 'View All',      href: '/shop',              highlight: true  },
];

interface StoreConfig {
  categories: string[];
  rooms: string[];
  sizes: string[];
}

export const Navbar = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [config, setConfig]       = useState<StoreConfig>({ categories: [], rooms: [], sizes: [] });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  const { totalItems } = useCart();
  const { wishlist }   = useWishlist();
  const pathname       = usePathname();
  const router         = useRouter();

  useEffect(() => {
    fetch('/api/store-config')
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setMobileAccordion(null); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const openDropdown  = (id: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActiveDropdown(id); };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setActiveDropdown(null), 120); };
  const closeAll = () => { setActiveDropdown(null); setIsOpen(false); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const shopMega = [
    {
      title: 'By Category',
      links: [
        ...config.categories.map(c => ({ label: c, href: `/shop?category=${encodeURIComponent(c)}`, highlight: false })),
        { label: 'All Rugs', href: '/shop', highlight: true },
      ],
    },
    {
      title: 'By Size',
      links: STATIC_SIZE_LINKS.map(l => ({ ...l, highlight: false })),
    },
    {
      title: 'Featured',
      links: STATIC_FEATURED,
    },
  ];

  const NAV_LINKS = [
    { label: 'Lookbook',  href: '/lookbook' },
    { label: 'Journal',   href: '/blog' },
    { label: 'Our Story', href: '/about' },
  ];

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <nav
        className="relative h-[4.25rem] bg-bisat-ivory z-40 transition-shadow duration-300"
        style={{ boxShadow: scrolled ? '0 0 1px rgba(0,0,0,0.25), 0 1px 6px rgba(0,0,0,0.04)' : '0 0 1px rgba(0,0,0,0.15)' }}
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 h-full">
          <div className="relative flex items-center h-full">

            {/* ── Logo (left) ─────────────────────────────────────── */}
            <Link
              href="/"
              className="font-display text-[1.55rem] font-bold tracking-tight text-bisat-black hover:opacity-70 transition-opacity duration-200 flex-shrink-0"
            >
              Bisāṭ
            </Link>

            {/* ── Desktop nav (centered absolutely) ───────────────── */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="flex items-center gap-7 pointer-events-auto">

                <DesktopNavItem
                  id="shop" label="Shop" hasDropdown
                  activeDropdown={activeDropdown} onOpen={openDropdown} onClose={closeDropdown}
                />
                <DesktopNavItem
                  id="rooms" label="Rooms" hasDropdown
                  activeDropdown={activeDropdown} onOpen={openDropdown} onClose={closeDropdown}
                />

                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[11px] uppercase tracking-[0.18em] font-medium relative group transition-colors duration-150 ${
                      pathname === link.href ? 'text-bisat-black' : 'text-bisat-black/50 hover:text-bisat-black'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-0.5 left-0 h-px bg-bisat-black transition-all duration-200 ${
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Right icons ─────────────────────────────────────── */}
            <div className="flex items-center gap-0 ml-auto">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className="p-2.5 text-bisat-black/50 hover:text-bisat-black transition-colors duration-150"
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.5} />
              </button>

              {/* Wishlist — no badge, clean icon */}
              <Link
                href="/wishlist"
                className="p-2.5 text-bisat-black/50 hover:text-bisat-black transition-colors duration-150"
                aria-label={`Wishlist${wishlist.length > 0 ? ` (${wishlist.length})` : ''}`}
              >
                <Heart size={17} strokeWidth={1.5} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 text-bisat-black/50 hover:text-bisat-black transition-colors duration-150"
                aria-label="Account"
              >
                <User size={17} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2.5 text-bisat-black/50 hover:text-bisat-black relative transition-colors duration-150"
                aria-label={`Cart${totalItems > 0 ? ` (${totalItems})` : ''}`}
              >
                <ShoppingBag size={17} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1.5 right-1 bg-bisat-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2.5 text-bisat-black/50 hover:text-bisat-black transition-colors duration-150 ml-1"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Search bar (slides down) ─────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 bg-bisat-ivory border-b border-bisat-border overflow-hidden z-50"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-5 py-3.5 flex items-center gap-3">
                <Search size={15} className="text-bisat-black/25 flex-shrink-0" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rugs by name, material, origin…"
                  className="flex-1 text-[13px] text-bisat-black placeholder:text-bisat-black/25 focus:outline-none bg-transparent"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="flex-shrink-0 bg-bisat-black text-white text-[10px] uppercase tracking-[0.15em] font-medium px-5 py-2 hover:bg-bisat-charcoal transition-colors"
                  >
                    Search
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-bisat-black/25 hover:text-bisat-black transition-colors flex-shrink-0"
                >
                  <X size={15} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Shop mega dropdown ───────────────────────────────────── */}
        <AnimatePresence>
          {activeDropdown === 'shop' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="hidden md:block absolute left-0 right-0 bg-bisat-ivory border-t border-bisat-border z-50"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              onMouseEnter={() => openDropdown('shop')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
                <div className="grid grid-cols-3 divide-x divide-bisat-border">
                  {shopMega.map((col, colIdx) => (
                    <div key={col.title} className={colIdx > 0 ? 'pl-10' : 'pr-10'}>
                      <p className="text-[9px] uppercase tracking-[0.22em] font-medium text-bisat-black/30 mb-5">
                        {col.title}
                      </p>
                      <ul>
                        {col.links.map(link => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              onClick={closeAll}
                              className="group flex items-center py-2.5 text-[13px] font-light text-bisat-black/60 hover:text-bisat-black transition-colors duration-150 border-b border-bisat-border/50 last:border-0"
                            >
                              <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <ArrowRight size={10} className="text-bisat-warm-gray" />
                              </span>
                              <span className={link.highlight ? 'font-medium text-bisat-black' : ''}>{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Rooms dropdown ───────────────────────────────────────── */}
        <AnimatePresence>
          {activeDropdown === 'rooms' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="hidden md:block absolute left-0 right-0 bg-bisat-ivory border-t border-bisat-border z-50"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              onMouseEnter={() => openDropdown('rooms')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
                <p className="text-[9px] uppercase tracking-[0.22em] font-medium text-bisat-black/30 mb-5">Shop by Room</p>
                <div className="grid grid-cols-5 divide-x divide-bisat-border">
                  {(config.rooms.length ? config.rooms : ['Living Room','Bedroom','Dining Room','Hallway','Office']).map((room, i) => (
                    <div key={room} className={i > 0 ? 'pl-8' : 'pr-8'}>
                      <Link
                        href={`/shop?room=${encodeURIComponent(room)}`}
                        onClick={closeAll}
                        className="group flex items-center py-2.5 text-[13px] font-light text-bisat-black/60 hover:text-bisat-black transition-colors duration-150"
                      >
                        <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                          <ArrowRight size={10} className="text-bisat-warm-gray" />
                        </span>
                        {room}
                      </Link>
                    </div>
                  ))}
                  <div className="pl-8">
                    <Link
                      href="/shop"
                      onClick={closeAll}
                      className="group flex items-center py-2.5 text-[13px] font-medium text-bisat-black hover:text-bisat-warm-gray transition-colors duration-150"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                        <ArrowRight size={10} className="text-bisat-warm-gray" />
                      </span>
                      All Rooms
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 260 }}
            className="md:hidden fixed inset-0 bg-bisat-ivory z-30 overflow-y-auto"
            style={{ top: 68 }}
          >
            <div className="px-6 pt-5 pb-20">

              {/* Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 border-b border-bisat-border pb-4 mb-2">
                <Search size={14} className="text-bisat-black/25 flex-shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rugs…"
                  className="flex-1 text-[13px] bg-transparent focus:outline-none text-bisat-black placeholder:text-bisat-black/25"
                />
              </form>

              {/* Shop accordion */}
              <MobileAccordion title="Shop" id="shop" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                <div className="pb-4 flex flex-col">
                  {config.categories.map(cat => (
                    <Link
                      key={cat}
                      href={`/shop?category=${encodeURIComponent(cat)}`}
                      onClick={() => setIsOpen(false)}
                      className="py-3 text-[13px] text-bisat-black/55 hover:text-bisat-black border-b border-bisat-border/40 last:border-0 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="py-3 text-[13px] font-medium text-bisat-black"
                  >
                    All Rugs
                  </Link>
                  <p className="text-[9px] uppercase tracking-[0.18em] font-medium text-bisat-black/25 mt-4 mb-1">By Size</p>
                  {STATIC_SIZE_LINKS.map(l => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setIsOpen(false)}
                      className="py-2.5 text-[13px] text-bisat-black/50 hover:text-bisat-black border-b border-bisat-border/30 last:border-0 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              {/* Rooms accordion */}
              <MobileAccordion title="Rooms" id="rooms" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                <div className="pb-4 flex flex-col">
                  {(config.rooms.length ? config.rooms : ['Living Room','Bedroom','Dining Room','Hallway','Office']).map(room => (
                    <Link
                      key={room}
                      href={`/shop?room=${encodeURIComponent(room)}`}
                      onClick={() => setIsOpen(false)}
                      className="py-3 text-[13px] text-bisat-black/50 hover:text-bisat-black border-b border-bisat-border/40 last:border-0 transition-colors"
                    >
                      {room}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              {/* Direct links */}
              {[
                { label: 'Lookbook',  href: '/lookbook' },
                { label: 'Journal',   href: '/blog' },
                { label: 'Our Story', href: '/about' },
                { label: 'Contact',   href: '/contact' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center py-4 text-[15px] font-light border-b border-bisat-border text-bisat-black/70 hover:text-bisat-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-6 grid grid-cols-2 gap-3 mt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-bisat-black text-white py-4 text-[10px] uppercase tracking-[0.18em] font-medium"
                >
                  <ShoppingBag size={13} strokeWidth={1.5} />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center border border-bisat-border text-bisat-black/60 py-4 text-[10px] uppercase tracking-[0.18em] font-medium hover:text-bisat-black transition-colors"
                >
                  Track Order
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Desktop nav item ──────────────────────────────────────────────────────────
const DesktopNavItem: React.FC<{
  id: string; label: string; href?: string; hasDropdown?: boolean;
  activeDropdown: string | null; onOpen: (id: string) => void; onClose: () => void;
}> = ({ id, label, href, hasDropdown, activeDropdown, onOpen, onClose }) => {
  const isDropOpen = activeDropdown === id;
  if (!hasDropdown && href) {
    return (
      <Link href={href} className="text-[11px] uppercase tracking-[0.18em] font-medium text-bisat-black/50 hover:text-bisat-black relative group transition-colors duration-150">
        {label}
        <span className="absolute -bottom-0.5 left-0 h-px bg-bisat-black w-0 group-hover:w-full transition-all duration-200" />
      </Link>
    );
  }
  return (
    <div className="relative" onMouseEnter={() => onOpen(id)} onMouseLeave={onClose}>
      <button
        className={`flex items-center gap-0.5 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-150 relative group ${
          isDropOpen ? 'text-bisat-black' : 'text-bisat-black/50 hover:text-bisat-black'
        }`}
      >
        {label}
        <ChevronDown size={10} strokeWidth={2} className={`transition-transform duration-200 mt-px ${isDropOpen ? 'rotate-180' : ''}`} />
        <span className={`absolute -bottom-0.5 left-0 h-px bg-bisat-black transition-all duration-200 ${isDropOpen ? 'w-[calc(100%-12px)]' : 'w-0 group-hover:w-[calc(100%-12px)]'}`} />
      </button>
    </div>
  );
};

// ── Mobile accordion ──────────────────────────────────────────────────────────
const MobileAccordion: React.FC<{
  title: string; id: string; active: string | null;
  onToggle: (id: string) => void; children: React.ReactNode;
}> = ({ title, id, active, onToggle, children }) => {
  const isOpen = active === id;
  return (
    <div className="border-b border-bisat-border">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-4 text-[15px] font-light text-bisat-black/70"
      >
        {title}
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`text-bisat-black/30 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
