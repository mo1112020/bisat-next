"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, ArrowRight, Instagram } from 'lucide-react';

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z"/>
  </svg>
);
import { PageHeader } from '../components/PageHeader';
import { Meta } from '../components/Meta';

export const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pb-16 bg-white min-h-screen">
      <Meta
        title="Contact Us"
        description="Get in touch with the Bisāṭ team for custom orders, care advice, or general inquiries about our artisanal rugs."
      />
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        <PageHeader
          badge="Get in Touch"
          title="Connect with Our Heritage Experts"
          description="Whether you're looking for a specific vintage piece or need guidance on rug care, our team is here to help you find the perfect addition to your sanctuary."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-4">
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-serif mb-6">Our Studio</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-bisat-ivory rounded-xl text-bisat-gold group-hover:bg-bisat-gold group-hover:text-white transition-all duration-300">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-widest mb-1">Address</p>
                      <p className="text-bisat-black/60 leading-relaxed">
                        Galata Tower Square, No: 12<br />
                        Beyoğlu, Istanbul, Turkiye
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-bisat-ivory rounded-xl text-bisat-gold group-hover:bg-bisat-gold group-hover:text-white transition-all duration-300">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-widest mb-1">Email</p>
                      <p className="text-bisat-black/60">heritage@bisat-store.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-bisat-ivory rounded-xl text-bisat-gold group-hover:bg-bisat-gold group-hover:text-white transition-all duration-300">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-bisat-black/60">+90 (212) 555 0123</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif mb-5">Follow Our Journey</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Instagram size={20} strokeWidth={1.5} />, label: 'Instagram', href: 'https://www.instagram.com/bisat.store/' },
                    { icon: <PinterestIcon />, label: 'Pinterest', href: 'https://tr.pinterest.com/bisattstore/' },
                    { icon: <TikTokIcon />, label: 'TikTok', href: 'https://www.tiktok.com/@bisattstore' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-12 h-12 rounded-full border border-bisat-black/10 flex items-center justify-center hover:bg-bisat-black hover:text-white transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-bisat-ivory p-8 md:p-12 rounded-3xl shadow-sm border border-bisat-black/5">
              <h3 className="text-2xl font-serif mb-8">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white border border-bisat-black/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-bisat-gold/20 transition-all"
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-white border border-bisat-black/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-bisat-gold/20 transition-all"
                      placeholder="john@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 ml-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border border-bisat-black/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-bisat-gold/20 transition-all"
                    placeholder="How can we help?"
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 ml-1">Message</label>
                  <textarea 
                    rows={6}
                    required
                    className="w-full bg-white border border-bisat-black/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-bisat-gold/20 transition-all resize-none"
                    placeholder="Tell us about your project or inquiry..."
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-bisat-black text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-bisat-gold transition-all duration-500 flex items-center justify-center group"
                >
                  Send Inquiry
                  <Send size={16} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
