"use client";
import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { motion } from 'motion/react';
import { Meta } from '../components/Meta';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';

export const Blog = () => {
  return (
    <div className="pb-16 bg-bisat-cream min-h-screen">
      <Meta 
        title="Artisanal Stories | Blog" 
        description="Explore the world of hand-woven rugs, interior design tips, and stories from our global artisan partners."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          badge="The Journal"
          title={<>Artisanal <span className="italic text-bisat-gold">Stories</span></>}
          description="A curated collection of insights, design guides, and stories from the looms of our global partners."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {BLOG_POSTS.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col"
            >
              <Link href={`/blog/${post.id}`} className="block aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative shadow-sm border border-bisat-black/5">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-bisat-black/20 group-hover:bg-bisat-black/40 transition-colors duration-500" />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-bisat-black px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg">
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Read Article</p>
                  <ArrowRight size={20} />
                </div>
              </Link>
              
              <div className="flex items-center gap-4 mb-6 text-[10px] uppercase tracking-[0.2em] text-bisat-black/30 font-bold">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-2 text-bisat-gold" />
                  {post.date}
                </div>
                <span className="w-1 h-1 rounded-full bg-bisat-black/10" />
                <div className="flex items-center">
                  <User size={12} className="mr-2 text-bisat-gold" />
                  {post.author}
                </div>
              </div>

              <h2 className="text-3xl font-serif mb-4 group-hover:text-bisat-gold transition-colors duration-300 leading-[1.2] text-bisat-black">
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-bisat-black/50 leading-relaxed mb-8 font-light line-clamp-3 italic">
                {post.excerpt}
              </p>
              
              <Link 
                href={`/blog/${post.id}`} 
                className="mt-auto inline-flex items-center text-[10px] uppercase tracking-[0.3em] font-bold text-bisat-black group/link"
              >
                <span className="relative">
                  Explore Story
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bisat-gold group-hover/link:w-full transition-all duration-300" />
                </span>
                <ArrowRight size={14} className="ml-3 group-hover/link:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-bisat-black text-bisat-cream rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-bisat-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">The Inner Circle</span>
            <h2 className="text-3xl md:text-4xl font-serif mb-4 tracking-tight">Join our <span className="italic">Heritage</span></h2>
            <p className="text-bisat-cream/50 mb-8 leading-relaxed text-base font-light">
              Receive exclusive previews of new collections, artisan interviews, and interior styling guides directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto p-2 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-grow bg-transparent border-none rounded-2xl px-6 py-4 text-sm focus:outline-none placeholder:text-bisat-cream/20 text-bisat-cream"
              />
              <button className="bg-bisat-gold text-white px-10 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-bisat-black transition-all duration-500 shadow-xl">
                Subscribe
              </button>
            </form>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bisat-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-bisat-teal/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px]" />
        </motion.div>
      </div>
    </div>
  );
};
