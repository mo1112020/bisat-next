'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  <>Free worldwide shipping over <span className="text-bisat-gold font-semibold">$500</span></>,
  <>Handmade in Turkey — Certificate of Authenticity included</>,
  <>30-day easy returns · No questions asked</>,
  <>Over 100 master artisan partners worldwide</>,
];

const Diamond = () => (
  <span
    className="inline-block w-[4px] h-[4px] bg-bisat-gold rotate-45 mx-3 shrink-0 opacity-60"
    aria-hidden
  />
);

const STORAGE_KEY = 'bisat_topbar_dismissed';

export const Topbar: React.FC = () => {
  // Start visible so SSR includes the HTML (trust signals visible on first paint).
  // The inline script in layout.tsx adds .topbar-dismissed to <html> before paint
  // for users who already dismissed, so CSS hides it with zero flash.
  const [visible, setVisible] = useState(true);
  const [mobileIdx, setMobileIdx] = useState(0);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      setVisible(false);
    }
  }, []);

  // Rotate mobile message every 4 seconds
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
    <div id="topbar-bar" className="h-9 bg-bisat-black flex items-center justify-center relative overflow-hidden shrink-0">
      {/* Desktop: all messages with separators */}
      <div className="hidden md:flex items-center text-bisat-sand text-[10px] uppercase tracking-[0.25em] font-medium">
        {MESSAGES.map((msg, i) => (
          <React.Fragment key={i}>
            <span>{msg}</span>
            {i < MESSAGES.length - 1 && <Diamond />}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: rotating single message */}
      <div className="md:hidden text-bisat-sand text-[10px] uppercase tracking-[0.2em] font-medium text-center px-8">
        {MESSAGES[mobileIdx]}
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Close announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-bisat-sand/40 hover:text-bisat-sand transition-colors p-1"
      >
        <X size={12} />
      </button>
    </div>
  );
};
