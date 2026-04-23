"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Heart, User, ChevronDown, ArrowRight, Instagram } from 'lucide-react';
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
    { label: 'Items',        href: '/collections/rug', id: 'shop', hasDropdown: true },
    { label: 'Room Ideas',   href: '/pages/case-gallery' },
    { label: 'Quiz',        href: '/pages/virtual-coordinate' },
    { label: 'About',        href: '/pages/about' },
  ];

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <nav
        className={`relative z-50 h-20 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-white border-b border-bisat-black/[0.06] py-0' 
            : 'bg-transparent border-b border-white/10 py-2'
        }`}
        style={{ boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.04)' : 'none' }}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-full">
          <div className="relative flex items-center h-full">
 
            {/* ── Logo (left) ─────────────────────────────────────── */}
            <Link
              href="/"
              className={`flex-shrink-0 font-rh text-[1.8rem] sm:text-[2.1rem] font-light tracking-[-0.03em] transition-colors duration-500 ${
                scrolled ? 'text-bisat-black' : 'text-white'
              }`}
            >
              Bisāṭim
            </Link>
 
            {/* ── Desktop nav (centered absolutely) ───────────────── */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="flex items-center gap-10 pointer-events-auto">
                {NAV_LINKS.map(link => (
                  <DesktopNavItem
                    key={link.label}
                    id={link.id || link.label.toLowerCase()}
                    label={link.label}
                    href={link.href}
                    hasDropdown={link.hasDropdown}
                    scrolled={scrolled}
                    activeDropdown={activeDropdown}
                    onOpen={openDropdown}
                    onClose={closeDropdown}
                  />
                ))}
              </div>
            </div>

            {/* ── Right icons ─────────────────────────────────────── */}
            <div className={`flex items-center gap-0 ml-auto transition-colors duration-500 ${scrolled ? 'text-bisat-black' : 'text-white'}`}>

              {/* Trade Button (法人窓口 analogue) */}
              <Link
                href="/pages/for-business"
                className={`mr-4 hidden px-4 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.2em] transition-all duration-500 lg:block ${
                  scrolled ? 'bg-bisat-black text-white' : 'bg-white text-bisat-black'
                }`}
              >
                Trade
              </Link>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className="p-2.5 transition-colors duration-150 hover:opacity-70"
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.5} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 transition-colors duration-150 hover:opacity-70"
                aria-label={`Wishlist${wishlist.length > 0 ? ` (${wishlist.length})` : ''}`}
              >
                <Heart size={17} strokeWidth={1.5} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden p-2.5 transition-colors duration-150 hover:opacity-70 sm:flex"
                aria-label="Account"
              >
                <User size={17} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 transition-colors duration-150 hover:opacity-70"
                aria-label={`Cart${totalItems > 0 ? ` (${totalItems})` : ''}`}
              >
                <ShoppingBag size={17} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className={`absolute right-1 top-1.5 flex h-3.5 w-3.5 items-center justify-center border text-[8px] font-medium ${
                    scrolled ? 'border-bisat-black bg-white text-bisat-black' : 'border-white bg-bisat-black text-white'
                  }`}>
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="ml-1 p-2.5 transition-colors duration-150 hover:opacity-70 md:hidden"
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
            transition={{ type: 'spring', damping: 35, stiffness: 280 }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-bisat-paper md:hidden"
          >
            {/* Top Bar with X */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-bisat-black/5">
              <span className="font-rh text-2xl font-light tracking-tight text-bisat-black">Bisāṭim</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-bisat-black/40 hover:text-bisat-black"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="px-6 py-8 flex flex-col min-h-[calc(100vh-80px)]">
              {/* Main Sections */}
              <div className="flex flex-col gap-0 border-t border-bisat-black/5">
                {/* Products Accordion */}
                <MobileAccordion title="Items" id="shop" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                  <div className="pb-6 flex flex-col pl-4">
                    {STATIC_FEATURED.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="py-3.5 text-[14px] text-bisat-black/70 border-b border-bisat-black/[0.04] last:border-0"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </MobileAccordion>

                <Link
                  href="/pages/case-gallery"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between border-b border-bisat-black/5 py-5 text-[16px] text-bisat-black/85"
                >
                  Room Ideas
                  <ChevronDown size={14} className="-rotate-90 text-bisat-black/20" />
                </Link>

                <Link
                  href="/pages/virtual-coordinate"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between border-b border-bisat-black/5 py-5 text-[16px] text-bisat-black/85"
                >
                  Virtual Coordinate
                  <ChevronDown size={14} className="-rotate-90 text-bisat-black/20" />
                </Link>

                <MobileAccordion title="About" id="about" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                  <div className="pb-6 flex flex-col pl-4">
                    {[
                      { label: 'Our Story', href: '/pages/about' },
                      { label: 'Living With Rugs', href: '/pages/living-with-rugs' },
                      { label: 'Articles', href: '/pages/articles' },
                      { label: 'Contact', href: '/pages/contact' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="py-3.5 text-[14px] text-bisat-black/70 border-b border-bisat-black/[0.04] last:border-0"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </MobileAccordion>

                <Link
                  href="/pages/for-business"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between border-b border-bisat-black/5 py-5 text-[16px] text-bisat-black/85"
                >
                  Trade
                  <ChevronDown size={14} className="-rotate-90 text-bisat-black/20" />
                </Link>
              </div>

              {/* Account/Utility links at bottom of list */}
              <div className="mt-8 flex flex-col gap-6">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="text-[14px] text-bisat-black/50 hover:text-bisat-black"
                >
                  Account
                </Link>
                
                {/* Social Icons at bottom */}
                <div className="pt-12 mt-auto flex items-center gap-8">
                  <a href="https://www.instagram.com/bisat.store/" target="_blank" rel="noopener noreferrer" className="text-bisat-black/40 hover:text-bisat-black">
                    <Instagram size={20} strokeWidth={1.5} />
                  </a>
                  <a href="https://tr.pinterest.com/bisattstore/" target="_blank" rel="noopener noreferrer" className="text-bisat-black/40 hover:text-bisat-black">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@bisattstore" target="_blank" rel="noopener noreferrer" className="text-bisat-black/40 hover:text-bisat-black">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z"/></svg>
                  </a>
                </div>
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
  id: string; label: string; href?: string; hasDropdown?: boolean; scrolled: boolean;
  activeDropdown: string | null; onOpen: (id: string) => void; onClose: () => void;
}> = ({ id, label, href, hasDropdown, scrolled, activeDropdown, onOpen, onClose }) => {
  const isDropOpen = activeDropdown === id;
  const textColor = scrolled ? 'text-bisat-black' : 'text-white';
  const inactiveColor = scrolled ? 'text-bisat-black/50' : 'text-white/60';

  if (!hasDropdown && href) {
    return (
      <Link href={href} className={`relative group text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${inactiveColor} hover:${textColor}`}>
        {label}
        <span className={`absolute -bottom-1.5 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-200 ${scrolled ? 'bg-bisat-black' : 'bg-white'}`} />
      </Link>
    );
  }
  return (
    <div className="relative" onMouseEnter={() => onOpen(id)} onMouseLeave={onClose}>
      <button
        className={`relative group flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${
          isDropOpen ? textColor : `${inactiveColor} hover:${textColor}`
        }`}
      >
        {label}
        <ChevronDown size={10} strokeWidth={2.5} className={`transition-transform duration-200 mt-px ${isDropOpen ? 'rotate-180' : ''}`} />
        <span className={`absolute -bottom-1.5 left-0 h-[1.5px] transition-all duration-200 ${
          isDropOpen ? 'w-[calc(100%-12px)]' : 'w-0 group-hover:w-[calc(100%-12px)]'
        } ${scrolled ? 'bg-bisat-black' : 'bg-white'}`} />
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
