"use client";
import React from 'react';

export const NewsletterForm: React.FC = () => {
  return (
    <form
      className="flex flex-col sm:flex-row relative z-10 gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3.5 rounded-sm focus:outline-none focus:border-bisat-gold text-sm w-full outline-hidden"
      />
      <button className="bg-bisat-gold text-white px-8 py-3.5 text-[11px] uppercase tracking-widest font-bold hover:bg-white hover:text-bisat-black transition-colors rounded-sm whitespace-nowrap">
        Sign Up
      </button>
    </form>
  );
};
