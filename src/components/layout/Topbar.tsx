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

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      setVisible(false);
    }
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
    <div id="topbar-bar" className="relative flex h-9 shrink-0 items-center justify-center overflow-hidden border-b border-bisat-black/[0.06] bg-bisat-paper">
      {/* Desktop: all messages with separators */}
      <div className="hidden items-center text-[10px] font-medium uppercase tracking-[0.26em] text-bisat-black/48 md:flex">
        {MESSAGES.map((msg, i) => (
          <React.Fragment key={i}>
            <span>{msg}</span>
            {i < MESSAGES.length - 1 && <Diamond />}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: rotating single message */}
      <div className="px-8 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-bisat-black/48 md:hidden">
        {MESSAGES[mobileIdx]}
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Close announcement"
        className="absolute right-3 top-1/2 p-1 -translate-y-1/2 text-bisat-black/25 transition-colors hover:text-bisat-black"
      >
        <X size={11} />
      </button>
    </div>
  );
};
