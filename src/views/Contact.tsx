"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, Clock, Instagram } from 'lucide-react';
import { Meta } from '../components/Meta';

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z"/>
  </svg>
);

const inputClass = "w-full bg-white border border-bisat-border px-5 py-3.5 text-sm focus:outline-none focus:border-bisat-black/30 transition-colors placeholder:text-bisat-black/25 text-bisat-black";

export const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta
        title="Contact Us"
        description="Get in touch with the Bisāṭ team for custom orders, care advice, or general inquiries about our artisanal rugs."
      />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-light text-bisat-black mb-4 leading-tight">Contact Us</h1>
          <p className="text-bisat-black/50 text-sm font-light leading-relaxed max-w-lg">
            Whether you're looking for a specific vintage piece or need guidance on rug care, our team is here to help.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ── Contact info ─────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-5">Direct Contact</p>
              <div className="space-y-6 divide-y divide-bisat-border">
                <div className="flex items-start gap-4 pb-6">
                  <Mail size={16} className="text-bisat-black/35 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-bisat-black/40 mb-1">Email</p>
                    <p className="text-sm font-light text-bisat-black">heritage@bisat-store.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-6">
                  <Clock size={16} className="text-bisat-black/35 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-bisat-black/40 mb-1">Response Time</p>
                    <p className="text-sm font-light text-bisat-black">Within 24 hours, Mon–Sat</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-5">Follow Along</p>
              <div className="flex gap-2">
                {[
                  { icon: <Instagram size={16} strokeWidth={1.5} />, label: 'Instagram', href: 'https://www.instagram.com/bisat.store/' },
                  { icon: <PinterestIcon />, label: 'Pinterest', href: 'https://tr.pinterest.com/bisattstore/' },
                  { icon: <TikTokIcon />, label: 'TikTok', href: 'https://www.tiktok.com/@bisattstore' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 border border-bisat-border flex items-center justify-center text-bisat-black/40 hover:text-bisat-black hover:border-bisat-black/30 transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Form ─────────────────────────────────────────────── */}
          <div className="lg:col-span-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bisat-cream border border-bisat-border p-10 text-center"
              >
                <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-3">Thank you</p>
                <h3 className="text-xl font-light text-bisat-black mb-2">Message received.</h3>
                <p className="text-bisat-black/45 text-sm font-light">We'll be in touch within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-6">Send a Message</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-bisat-black/35">Full Name</label>
                    <input type="text" required className={inputClass} placeholder="John Doe"
                      value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-bisat-black/35">Email Address</label>
                    <input type="email" required className={inputClass} placeholder="john@example.com"
                      value={formState.email} onChange={e => setFormState({ ...formState, email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-bisat-black/35">Subject</label>
                  <input type="text" required className={inputClass} placeholder="How can we help?"
                    value={formState.subject} onChange={e => setFormState({ ...formState, subject: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-bisat-black/35">Message</label>
                  <textarea rows={6} required className={inputClass + ' resize-none'} placeholder="Tell us about your project or inquiry..."
                    value={formState.message} onChange={e => setFormState({ ...formState, message: e.target.value })} />
                </div>

                <button type="submit"
                  className="w-full bg-bisat-black text-white py-4 text-[10px] uppercase tracking-widest font-semibold hover:bg-bisat-charcoal transition-colors flex items-center justify-center gap-2 group">
                  Send Message
                  <Send size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
