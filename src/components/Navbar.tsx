"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Heart, User, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AnimatePresence, motion } from 'motion/react';

const STATIC_SIZE_LINKS = [
  { label: 'Small (under 4m²)', href: '/collections/rug?size=Small' },
  { label: 'Medium (4–8m²)',    href: '/collections/rug?size=Medium' },
  { label: 'Large (8–12m²)',    href: '/collections/rug?size=Large' },
  { label: 'Runner',            href: '/collections/rug?size=Runner' },
];

const STATIC_FEATURED = [
  { label: 'All Products',    href: '/collections/rug',            highlight: true  },
  { label: 'Authentic Rugs',  href: '/collections/authentic-rugs', highlight: false },
  { label: 'Easy Rugs',       href: '/collections/easy-rugs',      highlight: false },
  { label: 'Vintage Rugs',    href: '/collections/vintage-rugs',   highlight: false },
  { label: 'Custom Rugs',     href: '/collections/custom-rugs',    highlight: false },
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
      router.push(`/collections/rug?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const shopMega = [
    {
      title: 'By Category',
      links: [
        ...STATIC_FEATURED,
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
    { label: 'Journal',      href: '/pages/articles' },
    { label: 'Gallery',      href: '/pages/case-gallery' },
    { label: 'About',        href: '/pages/about' },
  ];

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <nav
        className="relative z-40 h-[4.75rem] border-b border-bisat-border bg-white transition-shadow duration-300"
        style={{ boxShadow: scrolled ? '0 10px 24px rgba(17,17,17,0.04)' : 'none' }}
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 h-full">
          <div className="relative flex items-center h-full">

            {/* ── Logo (left) ─────────────────────────────────────── */}
            <Link
              href="/"
              className="flex-shrink-0 font-serif text-[1.9rem] font-medium tracking-[-0.04em] text-bisat-black"
            >
              Bisāṭ
            </Link>

            {/* ── Desktop nav (centered absolutely) ───────────────── */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="flex items-center gap-9 pointer-events-auto">

                <DesktopNavItem
                  id="shop" label="Items" hasDropdown
                  activeDropdown={activeDropdown} onOpen={openDropdown} onClose={closeDropdown}
                />
                <DesktopNavItem
                  id="rooms" label="Room Ideas" hasDropdown
                  activeDropdown={activeDropdown} onOpen={openDropdown} onClose={closeDropdown}
                />

                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative group text-[9px] font-semibold uppercase tracking-[0.28em] transition-colors duration-150 ${
                      pathname === link.href ? 'text-bisat-black' : 'text-bisat-black/45 hover:text-bisat-black'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-px bg-bisat-black transition-all duration-300 ${
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
                className="p-2.5 text-bisat-black/48 transition-colors duration-150 hover:text-bisat-black"
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.5} />
              </button>

              {/* Wishlist — no badge, clean icon */}
              <Link
                href="/wishlist"
                className="p-2.5 text-bisat-black/48 transition-colors duration-150 hover:text-bisat-black"
                aria-label={`Wishlist${wishlist.length > 0 ? ` (${wishlist.length})` : ''}`}
              >
                <Heart size={17} strokeWidth={1.5} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden p-2.5 text-bisat-black/48 transition-colors duration-150 hover:text-bisat-black sm:flex"
                aria-label="Account"
              >
                <User size={17} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 text-bisat-black/48 transition-colors duration-150 hover:text-bisat-black"
                aria-label={`Cart${totalItems > 0 ? ` (${totalItems})` : ''}`}
              >
                <ShoppingBag size={17} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute right-1 top-1.5 flex h-3.5 w-3.5 items-center justify-center border border-bisat-black bg-white text-[8px] font-medium text-bisat-black">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="ml-1 p-2.5 text-bisat-black/48 transition-colors duration-150 hover:text-bisat-black md:hidden"
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
              className="absolute left-0 right-0 z-50 overflow-hidden border-b border-bisat-border bg-white"
            >
              <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3.5">
                <Search size={15} className="flex-shrink-0 text-bisat-black/25" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search rugs by name, material, origin..."
                  className="flex-1 bg-transparent text-[13px] text-bisat-black placeholder:text-bisat-black/25 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="flex-shrink-0 border border-bisat-black bg-bisat-black px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-bisat-gold-dark hover:bg-bisat-gold-dark"
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
              className="absolute left-0 right-0 z-50 hidden border-b border-bisat-border bg-white md:block"
              style={{ boxShadow: '0 18px 34px rgba(17,17,17,0.05)' }}
              onMouseEnter={() => openDropdown('shop')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
                <div className="grid grid-cols-3 divide-x divide-bisat-border">
                  {shopMega.map((col, colIdx) => (
                    <div key={col.title} className={colIdx > 0 ? 'pl-10' : 'pr-10'}>
                      <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/35">
                        {col.title}
                      </p>
                      <ul>
                        {col.links.map(link => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              onClick={closeAll}
                              className="group flex items-center border-b border-bisat-border/60 py-2.5 text-[13px] text-bisat-black/62 transition-colors duration-150 last:border-0 hover:text-bisat-black"
                            >
                              <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <ArrowRight size={10} className="text-bisat-black" />
                              </span>
                              <span className={link.highlight ? 'font-semibold text-bisat-black' : ''}>{link.label}</span>
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
              className="absolute left-0 right-0 z-50 hidden border-b border-bisat-border bg-white md:block"
              style={{ boxShadow: '0 18px 34px rgba(17,17,17,0.05)' }}
              onMouseEnter={() => openDropdown('rooms')}
              onMouseLeave={closeDropdown}
            >
              <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/35">Service</p>
                <div className="grid grid-cols-5 divide-x divide-bisat-border">
                  {[
                    { label: 'About', href: '/pages/about' },
                    { label: 'Living With Rugs', href: '/pages/living-with-rugs' },
                    { label: 'Articles', href: '/pages/articles' },
                    { label: 'Case Gallery', href: '/pages/case-gallery' },
                    { label: 'Contact', href: '/pages/contact' },
                    { label: 'For Business', href: '/pages/for-business' },
                  ].map((item, i) => (
                    <div key={item.href} className={i > 0 ? 'pl-8' : 'pr-8'}>
                      <Link
                        href={item.href}
                        onClick={closeAll}
                        className="group flex items-center py-2.5 text-[13px] text-bisat-black/62 transition-colors duration-150 hover:text-bisat-black"
                      >
                        <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                          <ArrowRight size={10} className="text-bisat-black" />
                        </span>
                        {item.label}
                      </Link>
                    </div>
                  ))}
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
            className="fixed inset-0 z-30 overflow-y-auto bg-white md:hidden"
            style={{ top: 68 }}
          >
            <div className="px-6 pt-5 pb-20">

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-2 flex items-center gap-2 border-b border-bisat-border pb-4">
                <Search size={14} className="flex-shrink-0 text-bisat-black/25" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rugs…"
                  className="flex-1 bg-transparent text-[13px] text-bisat-black placeholder:text-bisat-black/25 focus:outline-none"
                />
              </form>

              {/* Shop accordion */}
              <MobileAccordion title="Products" id="shop" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                <div className="pb-4 flex flex-col">
                  {STATIC_FEATURED.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="border-b border-bisat-border/40 py-3 text-[13px] text-bisat-black/55 transition-colors last:border-0 hover:text-bisat-black"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <p className="mb-1 mt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-bisat-black/25">By Size</p>
                  {STATIC_SIZE_LINKS.map(l => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setIsOpen(false)}
                      className="border-b border-bisat-border/30 py-2.5 text-[13px] text-bisat-black/50 transition-colors last:border-0 hover:text-bisat-black"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              {/* Rooms accordion */}
              <MobileAccordion title="Service" id="rooms" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                <div className="pb-4 flex flex-col">
                  {[
                    { label: 'About', href: '/pages/about' },
                    { label: 'Living With Rugs', href: '/pages/living-with-rugs' },
                    { label: 'Articles', href: '/pages/articles' },
                    { label: 'Case Gallery', href: '/pages/case-gallery' },
                    { label: 'Virtual Coordinate', href: '/pages/virtual-coordinate' },
                    { label: 'Contact', href: '/pages/contact' },
                    { label: 'For Business', href: '/pages/for-business' },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="border-b border-bisat-border/40 py-3 text-[13px] text-bisat-black/50 transition-colors last:border-0 hover:text-bisat-black"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </MobileAccordion>

              {/* Direct links */}
              {[
                { label: 'Shipping and Payment', href: '/pages/shipping-and-payment' },
                { label: 'Cart',                 href: '/cart' },
                { label: 'Checkout',             href: '/checkout' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center border-b border-bisat-border py-4 text-[15px] text-bisat-black/70 transition-colors hover:text-bisat-black"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-6 grid grid-cols-2 gap-3 mt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 border border-bisat-black bg-bisat-black py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white"
                >
                  <ShoppingBag size={13} strokeWidth={1.5} />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                <Link
                  href="/pages/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center border border-bisat-border py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/60 transition-colors hover:bg-bisat-cream hover:text-bisat-black"
                >
                  Contact
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
      <Link href={href} className="relative group text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black/52 transition-colors duration-150 hover:text-bisat-black">
        {label}
        <span className="absolute -bottom-0.5 left-0 h-px bg-bisat-black w-0 group-hover:w-full transition-all duration-200" />
      </Link>
    );
  }
  return (
    <div className="relative" onMouseEnter={() => onOpen(id)} onMouseLeave={onClose}>
      <button
        className={`relative group flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-150 ${
          isDropOpen ? 'text-bisat-black' : 'text-bisat-black/52 hover:text-bisat-black'
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
        className="flex w-full items-center justify-between py-4 text-[15px] text-bisat-black/70"
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
