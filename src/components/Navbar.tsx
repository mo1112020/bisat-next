"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Heart, User, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'tr', name: 'Türkçe' },
];

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
  { label: 'View All →',    href: '/shop',              highlight: true  },
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
  const [langOpen, setLangOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [config, setConfig]       = useState<StoreConfig>({ categories: [], rooms: [], sizes: [] });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  const { totalItems } = useCart();
  const { wishlist }   = useWishlist();
  const pathname       = usePathname();
  const router         = useRouter();
  const { i18n }       = useTranslation();

  // Fetch dynamic categories / rooms / sizes
  useEffect(() => {
    fetch('/api/store-config')
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setMobileAccordion(null); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const openDropdown  = (id: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActiveDropdown(id); };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setActiveDropdown(null), 120); };
  const changeLanguage = (lng: string) => { i18n.changeLanguage(lng); setLangOpen(false); document.dir = lng === 'ar' ? 'rtl' : 'ltr'; };
  const closeAll = () => { setActiveDropdown(null); setIsOpen(false); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Build dynamic shop mega columns
  const shopMega = [
    {
      title: 'By Category',
      links: [
        ...config.categories.map(c => ({ label: c, href: `/shop?category=${encodeURIComponent(c)}`, highlight: false })),
        { label: 'All Rugs →', href: '/shop', highlight: true },
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

  return (
    <>
      {/* ── Main bar ───────────────────────────────────────────────────────── */}
      <nav className={`relative h-[4.5rem] transition-all duration-300 border-b z-40 ${scrolled ? 'bg-bisat-ivory/98 backdrop-blur-xl shadow-sm border-bisat-border' : 'bg-bisat-ivory border-bisat-border'}`}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 h-full">
          <div className="relative flex items-center justify-between h-full">

            {/* Logo */}
            <Link href="/" className="font-display text-2xl md:text-[1.75rem] font-bold tracking-tight text-bisat-black hover:text-bisat-gold transition-colors duration-300 flex-shrink-0 z-10">
              Bisāṭ
            </Link>

            {/* Desktop nav — centered */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="flex items-center gap-7 pointer-events-auto">
                {/* Shop */}
                <DesktopNavItem id="shop" label="Shop" hasDropdown activeDropdown={activeDropdown} onOpen={openDropdown} onClose={closeDropdown} />
                {/* Rooms */}
                <DesktopNavItem id="rooms" label="Rooms" hasDropdown activeDropdown={activeDropdown} onOpen={openDropdown} onClose={closeDropdown} />
                <Link href="/lookbook" className={`nav-link text-[10px] uppercase tracking-[0.22em] font-semibold relative group ${pathname === '/lookbook' ? 'text-bisat-black' : 'text-bisat-black/65 hover:text-bisat-black'}`}>
                  Lookbook
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-bisat-black transition-all duration-300 ${pathname === '/lookbook' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
                <Link href="/blog" className={`nav-link text-[10px] uppercase tracking-[0.22em] font-semibold relative group ${pathname === '/blog' ? 'text-bisat-black' : 'text-bisat-black/65 hover:text-bisat-black'}`}>
                  Journal
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-bisat-black transition-all duration-300 ${pathname === '/blog' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
                <Link href="/about" className={`nav-link text-[10px] uppercase tracking-[0.22em] font-semibold relative group ${pathname === '/about' ? 'text-bisat-black' : 'text-bisat-black/65 hover:text-bisat-black'}`}>
                  Our Story
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-bisat-black transition-all duration-300 ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 z-10">
              {/* Language */}
              <div className="relative hidden sm:block">
                <button onClick={() => setLangOpen(!langOpen)} className="p-2 text-bisat-black/55 hover:text-bisat-black transition-colors flex items-center gap-1">
                  <Globe size={17} strokeWidth={1.5} />
                  <span className="text-[9px] uppercase font-bold">{i18n.language.split('-')[0]}</span>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1 w-36 bg-bisat-ivory shadow-xl rounded-2xl border border-bisat-border overflow-hidden py-2 z-50">
                      {LANGUAGES.map(lang => (
                        <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                          className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold hover:bg-bisat-cream transition-colors ${i18n.language.startsWith(lang.code) ? 'text-bisat-gold' : 'text-bisat-black/55'}`}>
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search */}
              <button onClick={() => setSearchOpen(s => !s)} className="p-2 text-bisat-black/55 hover:text-bisat-black transition-colors">
                <Search size={17} strokeWidth={1.5} />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 text-bisat-black/55 hover:text-bisat-black relative transition-colors">
                <Heart size={17} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-bisat-gold text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{wishlist.length}</span>
                )}
              </Link>

              <Link href="/account" className="hidden sm:flex p-2 text-bisat-black/55 hover:text-bisat-black transition-colors">
                <User size={17} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 text-bisat-black/55 hover:text-bisat-black relative transition-colors">
                <ShoppingBag size={17} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-bisat-gold text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{totalItems}</span>
                )}
              </Link>

              {/* Mobile menu */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-bisat-black transition-transform active:scale-90" aria-label={isOpen ? 'Close menu' : 'Open menu'}>
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Search bar (slides down) ───────────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 bg-bisat-ivory border-t border-bisat-border shadow-lg overflow-hidden z-50">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                <Search size={18} className="text-bisat-black/30 flex-shrink-0" />
                <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rugs by name, material, origin…"
                  className="flex-1 text-sm text-bisat-black placeholder:text-bisat-black/30 focus:outline-none bg-transparent"
                />
                {searchQuery && (
                  <button type="submit" className="flex-shrink-0 bg-bisat-black text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg hover:bg-bisat-charcoal transition-colors">
                    Search
                  </button>
                )}
                <button type="button" onClick={() => setSearchOpen(false)} className="text-bisat-black/30 hover:text-bisat-black transition-colors flex-shrink-0">
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Shop mega dropdown ─────────────────────────────────────────── */}
        <AnimatePresence>
          {activeDropdown === 'shop' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="hidden md:block absolute left-0 right-0 bg-bisat-ivory border-t border-bisat-border z-50"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              onMouseEnter={() => openDropdown('shop')} onMouseLeave={closeDropdown}
            >
              <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
                <div className={`grid divide-x divide-bisat-border ${shopMega.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                  {shopMega.map((col, colIdx) => (
                    <div key={col.title} className={colIdx > 0 ? 'pl-10' : 'pr-10'}>
                      <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-bisat-black/30 mb-5">
                        {col.title}
                      </p>
                      <ul className="space-y-0">
                        {col.links.map(link => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              onClick={closeAll}
                              className="group flex items-center gap-0 py-[9px] text-[13px] font-light text-bisat-black/65 hover:text-bisat-black transition-colors duration-150 border-b border-bisat-border/60 last:border-0"
                            >
                              <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <ArrowRight size={10} className="text-bisat-gold" />
                              </span>
                              <span className={link.highlight ? 'font-medium text-bisat-black' : ''}>{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {config.categories.length > 0 && (
                    <div className="pl-10">
                      <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-bisat-black/30 mb-5">Browse</p>
                      <ul className="space-y-0">
                        {[...config.categories, 'View All'].map((cat, i) => (
                          <li key={cat}>
                            <Link
                              href={i === config.categories.length ? '/shop' : `/shop?category=${encodeURIComponent(cat)}`}
                              onClick={closeAll}
                              className="group flex items-center gap-0 py-[9px] text-[13px] font-light text-bisat-black/65 hover:text-bisat-black transition-colors duration-150 border-b border-bisat-border/60 last:border-0"
                            >
                              <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <ArrowRight size={10} className="text-bisat-gold" />
                              </span>
                              <span className={i === config.categories.length ? 'font-medium text-bisat-black' : ''}>{cat}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Rooms dropdown ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {activeDropdown === 'rooms' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="hidden md:block absolute left-0 right-0 bg-bisat-ivory border-t border-bisat-border z-50"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              onMouseEnter={() => openDropdown('rooms')} onMouseLeave={closeDropdown}
            >
              <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
                <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-bisat-black/30 mb-5">Shop by Room</p>
                <div className="grid grid-cols-5 divide-x divide-bisat-border">
                  {(config.rooms.length ? config.rooms : ['Living Room','Bedroom','Dining Room','Hallway','Office']).map((room, i) => (
                    <div key={room} className={i > 0 ? 'pl-8' : 'pr-8'}>
                      <Link
                        href={`/shop?room=${encodeURIComponent(room)}`}
                        onClick={closeAll}
                        className="group flex items-center gap-0 py-[9px] text-[13px] font-light text-bisat-black/65 hover:text-bisat-black transition-colors duration-150"
                      >
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                          <ArrowRight size={10} className="text-bisat-gold" />
                        </span>
                        {room}
                      </Link>
                    </div>
                  ))}
                  <div className="pl-8">
                    <Link
                      href="/shop"
                      onClick={closeAll}
                      className="group flex items-center gap-0 py-[9px] text-[13px] font-medium text-bisat-black hover:text-bisat-gold transition-colors duration-150"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 flex-shrink-0">
                        <ArrowRight size={10} className="text-bisat-gold" />
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

      {/* ── Mobile menu drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="md:hidden fixed inset-0 bg-bisat-ivory z-40 overflow-y-auto" style={{ top: 64 }}>
            <div className="px-6 pt-4 pb-20">

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-bisat-cream rounded-2xl px-4 py-3 mb-6">
                <Search size={16} className="text-bisat-black/30 flex-shrink-0" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rugs…"
                  className="flex-1 text-sm bg-transparent focus:outline-none text-bisat-black placeholder:text-bisat-black/30"
                />
              </form>

              {/* Shop by Category */}
              <MobileAccordion title="Shop" id="shop" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                <div className="pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {config.categories.map(cat => (
                      <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-bisat-cream rounded-xl text-sm font-medium text-bisat-black hover:bg-bisat-gold hover:text-white transition-colors">
                        {cat}
                      </Link>
                    ))}
                    <Link href="/shop" onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-bisat-gold text-white rounded-xl text-sm font-semibold">
                      All Rugs
                    </Link>
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-bisat-black/30 mb-2">By Size</p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATIC_SIZE_LINKS.map(l => (
                      <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)}
                        className="text-sm text-bisat-black/65 hover:text-bisat-gold transition-colors py-1">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </MobileAccordion>

              {/* Rooms */}
              <MobileAccordion title="Rooms" id="rooms" active={mobileAccordion} onToggle={id => setMobileAccordion(mobileAccordion === id ? null : id)}>
                <div className="pb-4 grid grid-cols-2 gap-2">
                  {(config.rooms.length ? config.rooms : ['Living Room','Bedroom','Dining Room','Hallway','Office']).map(room => (
                    <Link key={room} href={`/shop?room=${encodeURIComponent(room)}`} onClick={() => setIsOpen(false)}
                      className="text-sm text-bisat-black/65 hover:text-bisat-gold transition-colors py-1.5">
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
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-4 text-2xl font-serif border-b border-bisat-black/6 text-bisat-black hover:text-bisat-gold transition-colors">
                  {link.label}
                </Link>
              ))}

              <div className="pt-6 grid grid-cols-2 gap-3 mt-4">
                <Link href="/cart" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-bisat-black text-white rounded-2xl py-4 text-sm font-bold">
                  <ShoppingBag size={16} />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                <Link href="/track-order" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-bisat-cream border border-bisat-border text-bisat-black rounded-2xl py-4 text-sm font-bold">
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

// ── Desktop nav item ───────────────────────────────────────────────────────────
const DesktopNavItem: React.FC<{
  id: string; label: string; href?: string; hasDropdown?: boolean;
  activeDropdown: string | null; onOpen: (id: string) => void; onClose: () => void;
}> = ({ id, label, href, hasDropdown, activeDropdown, onOpen, onClose }) => {
  const isDropOpen = activeDropdown === id;
  if (!hasDropdown && href) {
    return (
      <Link href={href} className="text-[10px] uppercase tracking-[0.22em] font-semibold text-bisat-black/65 hover:text-bisat-black relative group transition-colors">
        {label}
        <span className="absolute -bottom-1 left-0 h-[1px] bg-bisat-black w-0 group-hover:w-full transition-all duration-300" />
      </Link>
    );
  }
  return (
    <div className="relative" onMouseEnter={() => onOpen(id)} onMouseLeave={onClose}>
      <button className={`flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] font-semibold transition-colors relative group ${isDropOpen ? 'text-bisat-black' : 'text-bisat-black/65 hover:text-bisat-black'}`}>
        {label}
        <ChevronDown size={11} strokeWidth={2.5} className={`transition-transform duration-200 ${isDropOpen ? 'rotate-180' : ''}`} />
        <span className={`absolute -bottom-1 left-0 h-[1px] bg-bisat-black transition-all duration-300 ${isDropOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      </button>
    </div>
  );
};

// ── Mobile accordion ───────────────────────────────────────────────────────────
const MobileAccordion: React.FC<{ title: string; id: string; active: string | null; onToggle: (id: string) => void; children: React.ReactNode }> =
  ({ title, id, active, onToggle, children }) => {
    const isOpen = active === id;
    return (
      <div className="border-b border-bisat-black/6">
        <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between py-4 text-2xl font-serif text-bisat-black">
          {title}
          <ChevronDown size={18} strokeWidth={1.5} className={`text-bisat-black/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
