"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product, Review } from '../data/products';
import { getProduct, getRelatedProducts, addProductReview } from '../lib/db';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, Truck, ShieldCheck, RotateCcw,
  Star, Plus, Minus, Heart, ChevronRight, Check, Mail,
} from 'lucide-react';
import { Meta } from '../components/Meta';
import { Schema, getProductSchema, getBreadcrumbSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { useLanguage } from '../context/LanguageContext';
import { StickyAtcBar } from '../components/StickyAtcBar';
import { SizeGuide } from '../components/SizeGuide';

export const ProductDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addView } = useRecentlyViewed();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSent, setWaitlistSent] = useState(false);
  const atcRef = useRef<HTMLButtonElement>(null);

  // Zoom
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  };

  // Review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Must be declared before any early returns — hooks must run unconditionally
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [qty, product, addToCart]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id as string).then(data => {
      if (data) {
        setProduct(data);
        setLocalReviews(data.reviews);
        addView(data);
        getRelatedProducts(data.category, data.id).then(setRelatedProducts);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex flex-col items-center justify-center">
        <p className="text-bisat-black/30 text-lg font-sans">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-sans mb-4 text-bisat-black">Product not found</p>
        <Link href="/shop" className="text-bisat-gold text-sm underline">Back to Shop</Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const avgRating = localReviews.length
    ? (localReviews.reduce((a, r) => a + r.rating, 0) / localReviews.length).toFixed(1)
    : null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setIsSubmitting(true);
    const newReview = { userName: reviewName, rating: reviewRating, comment: reviewComment };
    await addProductReview(product.id, newReview);
    setLocalReviews(prev => [{
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newReview,
    }, ...prev]);
    setReviewName(''); setReviewRating(5); setReviewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <StickyAtcBar product={product} anchorRef={atcRef} onAddToCart={handleAddToCart} added={added} />
      <Meta title={product.name} description={product.description} image={product.images[0]} type="product" />
      <Schema data={getProductSchema(product)} />
      <Schema data={getBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: product.category, path: `/shop?category=${product.category}` },
        { name: product.name, path: `/product/${product.id}` },
      ])} />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-bisat-black/40 mb-6 font-medium">
          <Link href="/" className="hover:text-bisat-black transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-bisat-black transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${product.category}`} className="hover:text-bisat-black transition-colors">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-bisat-black/70 truncate max-w-48">{product.name}</span>
        </nav>

        {/* Main product area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-20">

          {/* ── Images ── */}
          <div>
            {/* Main image + desktop thumbnail rail side by side */}
            <div className="flex gap-3">
              {/* Thumbnail rail — desktop only */}
              {product.images.length > 1 && (
                <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-bisat-gold' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                className="flex-1 aspect-square overflow-hidden bg-[#F6F3EE] cursor-zoom-in relative"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 ease-out"
                  priority
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  }}
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-bisat-black/40 flex items-center justify-center">
                    <span className="bg-white text-bisat-black px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium">Sold Out</span>
                  </div>
                )}
                <div className="hidden sm:block">
                  {!isZoomed && (
                    <div className="absolute bottom-3 right-3 bg-white/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-medium text-bisat-black/35">
                      Hover to zoom
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile thumbnail strip — horizontal scroll */}
            {product.images.length > 1 && (
              <div className="sm:hidden flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-all relative ${
                      activeImage === i ? 'border-bisat-gold' : 'border-transparent opacity-50'
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col">

            {/* Category + origin */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/shop?category=${product.category}`}
                className="text-[9px] uppercase tracking-[0.2em] font-medium text-bisat-black/60 bg-[#f7f5f2] px-3 py-1 border border-bisat-black/[0.07] hover:bg-bisat-black hover:text-white transition-colors"
              >
                {product.category}
              </Link>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/35">{product.origin}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-sans font-medium text-bisat-black leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              {avgRating ? (
                <>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} fill={s <= Math.round(Number(avgRating)) ? '#B8944F' : 'none'} color="#B8944F" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-bisat-black">{avgRating}</span>
                  <span className="text-sm text-bisat-black/35">({localReviews.length} {localReviews.length === 1 ? 'review' : 'reviews'})</span>
                </>
              ) : (
                <span className="text-sm text-bisat-black/35">No reviews yet</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-bisat-black/8">
              <p className="text-3xl font-sans text-bisat-black">${product.price.toLocaleString()}</p>
              <p className="text-sm text-bisat-black/35">Free worldwide shipping</p>
            </div>

            {/* Description */}
            <p className="text-bisat-black/60 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: 'Dimensions', value: product.dimensions },
                { label: 'Material', value: product.material },
                { label: 'Origin', value: product.origin },
                { label: 'Rooms', value: product.rooms.slice(0,2).join(', ') },
              ].map(spec => (
                <div key={spec.label} className="bg-[#f7f5f2]/60 border border-bisat-black/[0.07] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-bisat-black/35 mb-1">{spec.label}</p>
                  <p className="text-sm font-medium text-bisat-black">{spec.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-5">
              <SizeGuide />
            </div>

            {/* Stock indicator */}
            {product.stock > 0 && product.stock <= 3 && (
              <p className="text-xs font-semibold text-bisat-terracotta mb-4">
                Only {product.stock} left in stock
              </p>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex flex-col gap-3 mb-4">
              {/* Top row: qty + wishlist */}
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-bisat-black/[0.07] overflow-hidden bg-white">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-bisat-black/40 hover:text-bisat-black hover:bg-[#f7f5f2]/50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-bisat-black">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    className="px-4 py-3 text-bisat-black/40 hover:text-bisat-black hover:bg-[#f7f5f2]/50 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`flex-1 border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                    isFavorite
                      ? 'bg-[#f7f5f2] border-bisat-warm-gray text-bisat-warm-gray'
                      : 'border-bisat-black/[0.07] text-bisat-black/40 hover:border-bisat-black/30 hover:text-bisat-black bg-white'
                  }`}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                  <span className="text-[11px] font-bold uppercase tracking-wide">{isFavorite ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Add to cart — full width */}
              <button
                ref={atcRef}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || added}
                className={`w-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-200 flex items-center justify-center gap-2.5 py-4 ${
                  added
                    ? 'bg-bisat-warm-gray text-white'
                    : product.stock === 0
                    ? 'bg-bisat-black/10 text-bisat-black/30 cursor-not-allowed'
                    : 'bg-bisat-black text-white hover:bg-bisat-charcoal'
                }`}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={16} /> {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}</>
                )}
              </button>

              {/* Waitlist for sold-out */}
              {product.stock === 0 && !waitlistSent && (
                <div className="bg-[#f7f5f2] border border-bisat-black/[0.07] p-4">
                  <p className="text-[10px] font-medium text-bisat-black/50 uppercase tracking-[0.18em] mb-2.5 flex items-center gap-2">
                    <Mail size={11} /> Notify me when back in stock
                  </p>
                  <form
                    onSubmit={e => { e.preventDefault(); setWaitlistSent(true); }}
                    className="flex gap-0 border border-bisat-black/[0.07] overflow-hidden"
                  >
                    <input
                      type="email" required
                      value={waitlistEmail}
                      onChange={e => setWaitlistEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-bisat-black text-white text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-bisat-charcoal transition-colors">
                      Notify
                    </button>
                  </form>
                </div>
              )}
              {waitlistSent && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-3">
                  <Check size={14} className="text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700 font-medium">You're on the list — we'll email you when it's back.</p>
                </div>
              )}
            </div>

            {/* Secondary CTA */}
            {product.stock > 0 && (
              <Link
                href="/checkout"
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
                className="w-full border border-bisat-black/[0.07] text-bisat-black/60 py-3.5 text-[11px] uppercase tracking-[0.2em] font-medium text-center hover:border-bisat-black hover:text-bisat-black transition-all duration-200 mb-6"
              >
                Buy Now
              </Link>
            )}

            {/* Trust row */}
            <div className="border-t border-bisat-black/6 pt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: ShieldCheck, text: 'Authenticated' },
                { icon: RotateCcw, text: '14-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon size={16} className="text-bisat-gold" />
                  <p className="text-[10px] font-semibold text-bisat-black/45">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="border-t border-bisat-black/8 pt-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Form */}
            <div>
              <h2 className="text-xl font-sans mb-1">Write a Review</h2>
              <p className="text-sm text-bisat-black/40 mb-6">Share your experience with this rug</p>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 mb-1.5">Your Name</label>
                  <input
                    type="text" required value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    className="w-full bg-white border border-bisat-black/[0.07] px-4 py-3 text-sm focus:outline-none transition-all"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 mb-1.5">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} className="p-0.5">
                        <Star size={22} fill={reviewRating >= star ? '#B8944F' : 'none'} color="#B8944F" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 mb-1.5">Review</label>
                  <textarea
                    required value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-bisat-black/[0.07] px-4 py-3 text-sm focus:outline-none transition-all resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-bisat-black text-white py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-bisat-charcoal transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting…' : 'Post Review'}
                </button>
              </form>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-sans">
                  Customer Reviews
                  {localReviews.length > 0 && (
                    <span className="ml-2 text-sm font-sans font-normal text-bisat-black/35">({localReviews.length})</span>
                  )}
                </h2>
                {avgRating && (
                  <div className="flex items-center gap-2">
                    <Star size={16} fill="#B8944F" color="#B8944F" />
                    <span className="text-lg font-sans">{avgRating}</span>
                    <span className="text-sm text-bisat-black/35">/ 5</span>
                  </div>
                )}
              </div>
              <div className="space-y-5">
                <AnimatePresence mode="popLayout">
                  {localReviews.length > 0 ? localReviews.map(review => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 border border-bisat-black/[0.07]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm text-bisat-black">{review.userName}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={12} fill={s <= review.rating ? '#B8944F' : 'none'} color="#B8944F" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-bisat-black/25 font-medium">{review.date}</span>
                      </div>
                      <p className="text-sm text-bisat-black/60 leading-relaxed mt-2">"{review.comment}"</p>
                    </motion.div>
                  )) : (
                    <div className="bg-[#f7f5f2]/40 py-12 text-center border border-bisat-black/[0.07]">
                      <p className="text-bisat-black/30 text-sm">No reviews yet. Be the first!</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-bisat-black/8 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-sans">More {product.category} Rugs</h2>
              <Link href={`/shop?category=${product.category}`} className="text-[11px] uppercase tracking-widest font-bold text-bisat-black/40 hover:text-bisat-black transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <RecentlyViewed />
      </div>
    </div>
  );
};
