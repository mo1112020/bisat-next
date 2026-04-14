"use client";
import React from 'react';

export const NewsletterForm: React.FC = () => {
  return (
    <form
      className="flex flex-col sm:flex-row gap-0 overflow-hidden border border-bisat-border bg-white"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="bisat-input border-0 bg-transparent px-5 w-full"
      />
      <button className="border-l border-bisat-border bg-white px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-bisat-black transition-colors hover:bg-bisat-cream whitespace-nowrap">
        Sign Up
      </button>
    </form>
  );
};
