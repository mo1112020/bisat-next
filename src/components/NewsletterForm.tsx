"use client";

import React from 'react';

export const NewsletterForm: React.FC = () => {
  return (
    <form
      className="flex flex-col gap-0 overflow-hidden border border-white/25 sm:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full bg-transparent px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none border-0"
      />
      <button className="whitespace-nowrap border-t border-white/20 bg-white/10 px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-bisat-black sm:border-l sm:border-t-0">
        Sign Up
      </button>
    </form>
  );
};
