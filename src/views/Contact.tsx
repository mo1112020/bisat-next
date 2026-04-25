"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { Meta } from '../components/Meta';

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z"/>
  </svg>
);

export const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full border border-bisat-black/[0.12] bg-transparent px-4 py-3.5 text-[14px] text-bisat-black placeholder:text-bisat-black/25 focus:border-bisat-black/35 focus:outline-none transition-colors";

  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Contact | Bisatim"
        description="Get in touch with the Bisatim team for custom orders, care advice, or general inquiries about our artisanal rugs."
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-bisat-black px-5 py-28 text-white sm:py-40 lg:py-52">
        <div className="mx-auto max-w-[1000px] text-center">
          <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
            Get in Touch
          </p>
          <h1 className="font-rh text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] text-white">
            We&apos;re here.
          </h1>
          <p className="mx-auto mt-8 max-w-[480px] text-[15px] leading-[1.9] text-white/40">
            Whether you need guidance on a piece, a custom size, or care advice — reach us below.
          </p>
        </div>
      </section>

      {/* ── Contact body ─────────────────────────────── */}
      <section className="bg-white px-5 py-20 sm:py-32">
        <div className="mx-auto max-w-[980px]">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[220px_1fr] lg:gap-24">

            {/* Info column */}
            <div className="space-y-10">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-bisat-black/30">
                  Email
                </p>
                <p className="mt-3 text-[15px] text-bisat-black">heritage@bisatim.com</p>
              </div>
              <div className="border-t border-bisat-black/[0.07] pt-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-bisat-black/30">
                  Response
                </p>
                <p className="mt-3 text-[14px] leading-[1.85] text-bisat-black/50">
                  Within 24 hours<br />Monday – Saturday
                </p>
              </div>
              <div className="border-t border-bisat-black/[0.07] pt-10">
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-bisat-black/30">
                  Social
                </p>
                <div className="flex gap-2.5">
                  {[
                    { icon: <Instagram size={14} strokeWidth={1.5} />, label: 'Instagram', href: 'https://www.instagram.com/bisatim_/' },
                    { icon: <PinterestIcon />, label: 'Pinterest', href: 'https://tr.pinterest.com/bisatim_/' },
                    { icon: <TikTokIcon />, label: 'TikTok', href: 'https://www.tiktok.com/@bisatim_' },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center border border-bisat-black/[0.12] text-bisat-black/45 transition-colors hover:border-bisat-black/30 hover:text-bisat-black">
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form column */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-16 text-center"
                >
                  <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.38em] text-bisat-black/30">
                    Thank you
                  </p>
                  <h3 className="font-rh text-[2.5rem] font-light leading-[1.1] text-bisat-black">
                    Message received.
                  </h3>
                  <p className="mx-auto mt-5 max-w-[320px] text-[15px] leading-[1.85] text-bisat-black/45">
                    We'll be in touch within 24 hours, Monday to Saturday.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-bisat-black/35">
                        Name
                      </label>
                      <input type="text" required placeholder="Your name"
                        value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-bisat-black/35">
                        Email
                      </label>
                      <input type="email" required placeholder="your@email.com"
                        value={formState.email} onChange={e => setFormState({ ...formState, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-bisat-black/35">
                      Subject
                    </label>
                    <input type="text" required placeholder="How can we help?"
                      value={formState.subject} onChange={e => setFormState({ ...formState, subject: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-bisat-black/35">
                      Message
                    </label>
                    <textarea rows={6} required placeholder="Tell us about your inquiry..."
                      value={formState.message} onChange={e => setFormState({ ...formState, message: e.target.value })}
                      className={inputClass + ' resize-none'}
                    />
                  </div>
                  <div className="pt-1">
                    <button type="submit"
                      className="inline-flex items-center gap-3 bg-bisat-black px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-bisat-black/85">
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
