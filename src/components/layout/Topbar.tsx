'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  <>Complimentary worldwide shipping on all rug orders</>,
  <>New arrivals — curated vintage and hand-woven pieces weekly</>,
  <>Size, material, and room styling — ask our team anytime</>,
];

const Diamond = () => (
  <span className="inline-block h-3 w-px bg-bisat-black/12 mx-4 shrink-0" aria-hidden />
);

const STORAGE_KEY = 'bisat_topbar_dismissed';

export const Topbar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [mobileIdx, setMobileIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('bisat_topbar_dismissed') === '1';
    if (dismissed) {
      setVisible(false);
      document.documentElement.style.setProperty('--topbar-h', '0px');
    } else {
      setVisible(true);
      document.documentElement.style.setProperty('--topbar-h', '2.5rem');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setMobileIdx(i => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
    document.documentElement.style.setProperty('--topbar-h', '0px');
  };

  if (!visible) return null;

  return (
    <div 
      id="topbar-bar"
      className="relative z-[60] flex h-10 shrink-0 items-center justify-center overflow-hidden border-b border-black/5 bg-[#F2F2F2]"
    >
      {/* Desktop: sliding marquee */}
      <div className="hidden md:block overflow-hidden w-full">
        <div className="animate-topbar-marquee flex whitespace-nowrap w-max">
          {[...MESSAGES, ...MESSAGES].map((msg, i) => (
            <span key={i} className="inline-flex items-center shrink-0 text-[10px] font-medium uppercase tracking-[0.26em] text-[#666666] px-8">
              {msg}
              <span className="inline-block h-3 w-px bg-black/10 ml-8 shrink-0" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      {/* Mobile: rotating single message */}
      <div className="px-12 py-2.5 text-center text-[9px] font-medium uppercase tracking-[0.16em] text-[#666666] md:hidden leading-normal">
        {MESSAGES[mobileIdx]}
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Close announcement"
        className="absolute right-2 top-1/2 p-2 -translate-y-1/2 text-black/20 transition-colors hover:text-black"
      >
        <X size={12} />
      </button>
    </div>
  );
};
