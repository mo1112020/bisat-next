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
    // Force visible for design review
    setVisible(true);
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
      className="relative z-[60] flex min-h-[40px] md:h-9 shrink-0 items-center justify-center overflow-hidden border-b border-black/5 bg-[#F2F2F2]"
    >
      {/* Desktop: all messages with separators */}
      <div className="hidden items-center text-[10px] font-medium uppercase tracking-[0.26em] text-[#666666] md:flex">
        {MESSAGES.map((msg, i) => (
          <React.Fragment key={i}>
            <span>{msg}</span>
            {i < MESSAGES.length - 1 && (
              <span className="inline-block h-3 w-px bg-black/10 mx-4 shrink-0" aria-hidden />
            )}
          </React.Fragment>
        ))}
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
