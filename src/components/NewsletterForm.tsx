"use client";
import React from 'react';

export const NewsletterForm: React.FC = () => {
  return (
    <form
      className="flex flex-col sm:flex-row gap-0 border border-bisat-border overflow-hidden"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="bg-white/50 border-0 text-bisat-black placeholder:text-bisat-black/30 px-5 py-3.5 focus:outline-none text-sm w-full"
      />
      <button className="bg-bisat-black text-white px-8 py-3.5 text-[10px] uppercase tracking-[0.18em] font-medium hover:bg-bisat-charcoal transition-colors whitespace-nowrap">
        Sign Up
      </button>
    </form>
  );
};
