"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

const SHOP_MENU = [
  { label: 'All Products',   sub: 'Browse the full collection',  href: '/collections/rug' },
  { label: 'Authentic Rugs', sub: 'Hand-knotted heritage pieces', href: '/collections/authentic-rugs' },
  { label: 'Vintage',        sub: 'Archive & one-of-a-kind',      href: '/collections/vintage-rugs' },
  { label: 'Easy Rugs',      sub: 'Modern & easy-care',           href: '/collections/easy-rugs' },
  { label: 'Custom Size',    sub: 'Made-to-measure for your room', href: '/collections/custom-rugs' },
];

const NAV_LINKS = [
  { label: 'Shop',        href: '/collections/rug',      id: 'shop', hasMega: true },
  { label: 'Room Ideas',  href: '/pages/case-gallery',   id: 'rooms' },
  { label: 'Craftsmanship', href: '/craftsmanship',      id: 'craft' },
  { label: 'About',       href: '/pages/about',          id: 'about' },
];

export const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [megaOpen, setMegaOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  const { totalItems } = useCart();
  const { wishlist }   = useWishlist();
  const { user }       = useAuth();
  const pathname       = usePathname();
  const router         = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-focus search
  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => searchRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [searchOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openMega  = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true); };
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 110); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/collections/rug?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <>
      {/* ── Main nav ─────────────────────────────────── */}
      <nav
        className={`relative z-40 transition-all duration-300 ${
          scrolled
            ? 'h-[60px] border-b border-bisat-black/[0.08] bg-white/96 shadow-[0_4px_24px_rgba(0,0,0,0.05)] backdrop-blur-md'
            : 'h-20 border-b border-bisat-black/[0.06] bg-white/98'
        }`}
      >
        <div className="bisat-shell flex h-full items-center">

          {/* Logo */}
          <Link
            href="/"
            className={`shrink-0 font-rh font-light tracking-[-0.03em] text-bisat-black transition-all duration-300 hover:opacity-70 ${
              scrolled ? 'text-[1.65rem]' : 'text-[1.9rem]'
            }`}
          >
            Bisāṭim
          </Link>

          {/* Center nav — desktop */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex lg:gap-10">
            {NAV_LINKS.map(link =>
              link.hasMega ? (
                <div
                  key={link.id}
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  className="relative py-6"
                >
                  <button
                    className={`group relative text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 ${
                      megaOpen ? 'text-bisat-black' : 'text-bisat-black/60 hover:text-bisat-black'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-bisat-black transition-all duration-300 ${
                        megaOpen ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </button>

                  {/* Shop dropdown — anchored under this button */}
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-50 w-56 border border-bisat-black/[0.08] bg-white py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.10)]"
                      >
                        {SHOP_MENU.map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMegaOpen(false)}
                            className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#f7f5f2]"
                          >
                            <div>
                              <p className="text-[12px] font-medium text-bisat-black">{item.label}</p>
                              <p className="mt-0.5 text-[10px] text-bisat-black/40">{item.sub}</p>
                            </div>
                            <ArrowUpRight size={11} className="shrink-0 text-bisat-black/0 transition-colors group-hover:text-bisat-black/35" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className="group relative text-[11px] font-medium uppercase tracking-[0.18em] text-bisat-black/60 transition-colors duration-200 hover:text-bisat-black"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-bisat-black transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-0.5">
            {/* Search */}
            <IconBtn
              onClick={() => { setSearchOpen(o => !o); setMobileOpen(false); }}
              label="Search"
            >
              <Search size={17} strokeWidth={1.5} />
            </IconBtn>

            {/* Wishlist */}
            <Link href="/wishlist" className={iconBtnCls} aria-label={`Wishlist (${wishlist.length})`}>
              <Heart size={17} strokeWidth={1.5} />
              {wishlist.length > 0 && <Dot />}
            </Link>

            {/* Account */}
            <button
              onClick={() => user ? router.push('/account') : setShowAuthModal(true)}
              className={`${iconBtnCls} relative hidden sm:flex`}
              aria-label="Account"
            >
              <User size={17} strokeWidth={1.5} />
              {user && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-bisat-black" />}
            </button>

            {/* Cart */}
            <Link href="/cart" className={`${iconBtnCls} relative`} aria-label={`Cart (${totalItems})`}>
              <ShoppingBag size={17} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-bisat-black text-[8px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <IconBtn
              onClick={() => { setMobileOpen(o => !o); setSearchOpen(false); }}
              label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X size={19} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu size={19} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </IconBtn>
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full z-50 overflow-hidden border-t border-bisat-black/[0.06] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            >
              <form onSubmit={handleSearch} className="bisat-shell flex items-center gap-4 py-4">
                <Search size={14} className="shrink-0 text-bisat-black/25" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, material, or origin…"
                  className="flex-1 bg-transparent font-rh text-[1.1rem] font-light text-bisat-black placeholder:text-bisat-black/22 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="shrink-0 p-1 text-bisat-black/35 transition-colors hover:text-bisat-black"
                >
                  <X size={15} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* ── Mobile overlay ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-white md:hidden"
          >
            {/* Mobile header */}
            <div className="flex shrink-0 items-center justify-between border-b border-bisat-black/[0.07] px-6 py-5">
              <Link href="/" onClick={() => setMobileOpen(false)} className="font-rh text-[1.7rem] font-light tracking-tight text-bisat-black">
                Bisāṭim
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center text-bisat-black"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Main links */}
            <div className="flex flex-1 flex-col px-6 pt-8 pb-12">
              <div className="flex flex-col">
                {/* Shop accordion */}
                <MobileShopAccordion onClose={() => setMobileOpen(false)} />

                {/* Other nav links */}
                {NAV_LINKS.filter(l => !l.hasMega).map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.28 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-bisat-black/[0.06] py-5 font-rh text-[1.45rem] font-light text-bisat-black"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="text-bisat-black/25" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Secondary links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.28 }}
                className="mt-10 flex flex-col gap-5"
              >
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-bisat-black/30">Account</p>
                {[
                  { label: 'My Account',  href: '/account' },
                  { label: 'Wishlist',    href: '/wishlist' },
                  { label: 'Track Order', href: '/track-order' },
                  { label: 'FAQ',         href: '/faq' },
                  { label: 'Contact',     href: '/pages/contact' },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[13px] text-bisat-black/60 transition-colors hover:text-bisat-black"
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>

              {/* Cart CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.28 }}
                className="mt-12"
              >
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border border-bisat-black bg-bisat-black px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-bisat-charcoal"
                >
                  View Bag
                  {totalItems > 0 && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{totalItems}</span>}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} redirectTo="/account" />
      )}
    </>
  );
};

// ── Shared icon button ────────────────────────────────────────────────────────
const iconBtnCls =
  'relative flex h-9 w-9 items-center justify-center text-bisat-black/70 transition-colors duration-150 hover:text-bisat-black';

const IconBtn: React.FC<{
  onClick?: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, label, className = '', children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`${iconBtnCls} ${className}`}
  >
    {children}
  </button>
);

const Dot = () => (
  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-bisat-terracotta" />
);

// ── Mobile shop accordion ─────────────────────────────────────────────────────
const MobileShopAccordion: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05, duration: 0.28 }}
      className="border-b border-bisat-black/[0.06]"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-5 font-rh text-[1.45rem] font-light text-bisat-black"
      >
        Shop
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-bisat-black/25"
        >
          <ArrowUpRight size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pb-4 pl-4">
              {SHOP_MENU.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-bisat-black/[0.04] py-3 text-[14px] text-bisat-black/70 last:border-0 hover:text-bisat-black"
                >
                  {item.label}
                  <span className="text-[11px] text-bisat-black/25">{item.sub}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
