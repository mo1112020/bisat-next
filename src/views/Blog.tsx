"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '../components/PageHeader';
import { motion } from 'motion/react';
import { Meta } from '../components/Meta';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Check } from 'lucide-react';
import { BlogPostData } from '../data/blogPosts';
import { getBlogPosts } from '../lib/db';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  useEffect(() => {
    getBlogPosts().then(setPosts);
  }, []);

  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta
        title="Journal | Bisāṭ"
        description="Explore the world of hand-woven rugs, interior design tips, and stories from our global artisan partners."
      />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="border-b border-bisat-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">The Journal</p>
          <h1 className="text-4xl sm:text-5xl font-light text-bisat-black mb-4 leading-tight">Stories & Guides</h1>
          <p className="text-bisat-black/50 text-sm font-light leading-relaxed max-w-lg">
            A curated collection of insights, design guides, and stories from the looms of our global partners.
          </p>
        </div>
      </div>

      {/* ── Post grid ─────────────────────────────────────────────── */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-bisat-border">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              viewport={{ once: true }}
              className="group flex flex-col bg-bisat-ivory hover:bg-white transition-colors duration-300"
            >
              <Link href={`/blog/${post.id}`} className="block aspect-[4/3] overflow-hidden relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-bisat-black px-2.5 py-1 text-[8px] uppercase tracking-[0.2em] font-semibold">
                    {post.category}
                  </span>
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4 text-[9px] uppercase tracking-[0.2em] text-bisat-black/30 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={10} />
                    {post.date}
                  </div>
                  <span className="w-1 h-1 bg-bisat-border" />
                  <div className="flex items-center gap-1.5">
                    <User size={10} />
                    {post.author}
                  </div>
                </div>

                <h2 className="text-lg font-normal text-bisat-black mb-3 leading-snug group-hover:text-bisat-gold transition-colors duration-200 line-clamp-2">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-[12px] text-bisat-black/45 leading-relaxed font-light line-clamp-3 mb-5 flex-grow">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-semibold text-bisat-black/50 hover:text-bisat-black transition-colors group/link"
                >
                  Read Article
                  <ArrowRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Newsletter ────────────────────────────────────────── */}
        <div className="mt-px bg-bisat-cream border border-bisat-border p-10 md:p-16 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-bisat-black/30 mb-4">The Inner Circle</p>
          <h2 className="text-2xl sm:text-3xl font-light text-bisat-black mb-3">Stay in the loop</h2>
          <p className="text-bisat-black/45 text-sm font-light mb-8 max-w-md mx-auto leading-relaxed">
            Exclusive previews, artisan interviews, and interior styling guides — straight to your inbox.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-bisat-black/60">
              <Check size={14} />
              <span className="text-sm font-light">You're subscribed — thank you!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow border border-bisat-border bg-white px-5 py-3 text-sm focus:outline-none focus:border-bisat-black/30 transition-colors placeholder:text-bisat-black/25"
              />
              <button className="bg-bisat-black text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-bisat-charcoal transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
