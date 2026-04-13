"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Meta } from '../components/Meta';
import { Schema, getBlogPostingSchema, getBreadcrumbSchema } from '../components/Schema';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { BlogPostData } from '../data/blogPosts';
import { getBlogPost } from '../lib/db';

export const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBlogPost(id as string).then(data => { setPost(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="pb-16 text-center pt-32">
        <p className="text-bisat-black/30 text-lg font-serif">Loading…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pb-16 text-center">
        <h1 className="text-4xl font-serif">Story not found</h1>
        <Link href="/blog" className="text-bisat-gold mt-4 inline-block">Return to Journal</Link>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-bisat-ivory min-h-screen">
      <Meta
        title={`${post.title} | The Journal | Bisāṭ`}
        description={post.metaDescription || post.excerpt}
        image={post.image}
        type="article"
      />
      <Schema data={getBlogPostingSchema(post)} />
      <Schema data={getBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Journal', path: '/blog' },
        { name: post.title, path: `/blog/${post.id}` },
      ])} />

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bisat-black via-bisat-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-24">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-bisat-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-8 block">
                {post.category}
              </span>
              <h1 className="text-5xl md:text-8xl font-serif text-bisat-ivory leading-[0.9] mb-12 tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-12 text-bisat-ivory/60 text-[10px] uppercase tracking-[0.2em] font-bold">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-3 text-bisat-gold" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-3 text-bisat-gold" />
                  {post.author}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-24">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Sidebar */}
          <aside className="lg:w-1/4 order-2 lg:order-1">
            <div className="sticky top-32 space-y-16">
              <Link href="/blog" className="group inline-flex items-center text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-black/60 hover:text-bisat-gold transition-colors">
                <ArrowLeft size={14} className="mr-4 group-hover:-translate-x-2 transition-transform" />
                Back to Journal
              </Link>

              <div className="pt-12 border-t border-bisat-black/5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/60 mb-8 block">Share Story</span>
                <div className="flex space-x-6">
                  <button className="text-bisat-black/60 hover:text-bisat-gold transition-colors">
                    <Share2 size={20} />
                  </button>
                  <button className="text-bisat-black/60 hover:text-bisat-gold transition-colors">
                    <Bookmark size={20} />
                  </button>
                </div>
              </div>

              <div className="pt-12 border-t border-bisat-black/5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/60 mb-8 block">Reading Time</span>
                <p className="text-sm font-light text-bisat-black/60 italic">Approx. 6 minutes</p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:w-3/4 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="prose prose-brand max-w-none"
            >
              <div
                className="text-bisat-black/90 text-xl leading-[1.8] space-y-12 font-light first-letter:text-7xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-bisat-gold"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.div>

            {/* Author Bio */}
            <div className="mt-24 pt-16 border-t border-bisat-black/5 flex items-center space-x-8">
              <div className="w-20 h-20 rounded-full bg-bisat-gold/10 flex items-center justify-center text-bisat-gold font-serif text-3xl">
                {post.author[0]}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-bisat-black/60 font-bold block mb-2">Written By</span>
                <h4 className="text-2xl font-serif">{post.author}</h4>
                <p className="text-base text-bisat-black/60 mt-2 font-light">Heritage specialist and contributor to the Bisāṭ journal.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
