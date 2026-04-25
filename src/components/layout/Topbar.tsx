'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  'Complimentary worldwide shipping on all rug orders',
  'New arrivals every week: vintage finds, custom sizes, and easy-care rugs',
  'Need help with scale or styling? Our team can guide room by room',
];

const STORAGE_KEY = 'bisat_topbar_dismissed';

export const Topbar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [mobileIdx, setMobileIdx] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
    if (dismissed) {
      setVisible(false);
      document.documentElement.style.setProperty('--topbar-h', '0px');
      return;
    }

    setVisible(true);
    document.documentElement.style.setProperty('--topbar-h', '2.25rem');
  }, []);

  useEffect(() => {
    if (!visible) return;

    const id = window.setInterval(() => {
      setMobileIdx(index => (index + 1) % MESSAGES.length);
    }, 4000);

    return () => window.clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
    document.documentElement.style.setProperty('--topbar-h', '0px');
  };

  if (!visible) return null;

  return (
    <div className="relative z-[60] flex h-9 shrink-0 items-center overflow-hidden border-b border-black/6 bg-bisat-topbar">
      <div className="hidden w-full overflow-hidden md:block">
        <div className="animate-topbar-marquee flex w-max whitespace-nowrap">
          {[...MESSAGES, ...MESSAGES].map((message, index) => (
            <span
              key={`${message}-${index}`}
              className="inline-flex shrink-0 items-center px-8 text-[9px] font-semibold uppercase tracking-[0.28em] text-bisat-black/54"
            >
              {message}
              <span className="ml-8 inline-block h-3 w-px bg-black/12" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <div className="px-10 text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-bisat-black/54 md:hidden">
        {MESSAGES[mobileIdx]}
      </div>

      <button
        onClick={dismiss}
        aria-label="Close announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black/25 transition-colors hover:text-black"
      >
        <X size={12} />
      </button>
    </div>
  );
};
