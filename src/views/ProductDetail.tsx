"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { products, Review } from '../data/products';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, Truck, ShieldCheck, RotateCcw,
  Star, Plus, Minus, Heart, ChevronRight, Check,
} from 'lucide-react';
import { Meta } from '../components/Meta';
import { Schema, getProductSchema, getBreadcrumbSchema } from '../components/Schema';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { useLanguage } from '../context/LanguageContext';

export const ProductDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addView } = useRecentlyViewed();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

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

  useEffect(() => {
    if (product) { setLocalReviews(product.reviews); addView(product); }
  }, [product, addView]);

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-serif mb-4 text-bisat-black">Product not found</p>
        <Link href="/shop" className="text-bisat-gold text-sm underline">Back to Shop</Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const avgRating = localReviews.length
    ? (localReviews.reduce((a, r) => a + r.rating, 0) / localReviews.length).toFixed(1)
    : null;
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setLocalReviews(prev => [{
        id: `r-${Date.now()}`, userName: reviewName,
        rating: reviewRating, comment: reviewComment,
        date: new Date().toISOString().split('T')[0]
      }, ...prev]);
      setReviewName(''); setReviewRating(5); setReviewComment('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="bg-bisat-ivory min-h-screen">
      <Meta title={product.name} description={product.description} image={product.images[0]} type="product" />
      <Schema data={getProductSchema(product)} />
      <Schema data={getBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: product.category, path: `/shop?category=${product.category}` },
        { name: product.name, path: `/product/${product.id}` },
      ])} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-bisat-black/40 mb-6 font-medium">
          <Link href="/" className="hover:text-bisat-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-bisat-gold transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${product.category}`} className="hover:text-bisat-gold transition-colors">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-bisat-black/70 truncate max-w-48">{product.name}</span>
        </nav>

        {/* Main product area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

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
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-bisat-gold' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                className="flex-1 aspect-square rounded-2xl overflow-hidden bg-bisat-cream cursor-zoom-in relative"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  }}
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-bisat-black/40 flex items-center justify-center">
                    <span className="bg-white text-bisat-black px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold">Sold Out</span>
                  </div>
                )}
                <div className="hidden sm:block">
                  {!isZoomed && (
                    <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold text-bisat-black/40">
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
                    className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-bisat-gold' : 'border-transparent opacity-50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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
                className="text-[10px] uppercase tracking-[0.25em] font-bold text-white bg-bisat-gold px-3 py-1 rounded-full hover:bg-bisat-black transition-colors"
              >
                {product.category}
              </Link>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bisat-black/35">{product.origin}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-bisat-black leading-tight mb-3">
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
              <p className="text-3xl font-serif text-bisat-black">${product.price.toLocaleString()}</p>
              <p className="text-sm text-bisat-black/35">Free worldwide shipping</p>
            </div>

            {/* Description */}
            <p className="text-bisat-black/60 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Dimensions', value: product.dimensions },
                { label: 'Material', value: product.material },
                { label: 'Origin', value: product.origin },
                { label: 'Rooms', value: product.rooms.slice(0,2).join(', ') },
              ].map(spec => (
                <div key={spec.label} className="bg-bisat-cream/60 rounded-xl px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-bisat-black/35 mb-1">{spec.label}</p>
                  <p className="text-sm font-medium text-bisat-black">{spec.value}</p>
                </div>
              ))}
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
                <div className="flex items-center border border-bisat-black/10 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-bisat-black/40 hover:text-bisat-black hover:bg-bisat-cream/50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-bisat-black">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    className="px-4 py-3 text-bisat-black/40 hover:text-bisat-black hover:bg-bisat-cream/50 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`flex-1 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold ${
                    isFavorite
                      ? 'bg-bisat-gold/10 border-bisat-gold text-bisat-gold'
                      : 'border-bisat-black/10 text-bisat-black/35 hover:border-bisat-gold hover:text-bisat-gold bg-white'
                  }`}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                  <span className="text-[11px] font-bold uppercase tracking-wide">{isFavorite ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Add to cart — full width */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || added}
                className={`w-full rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 py-4 ${
                  added
                    ? 'bg-green-600 text-white'
                    : product.stock === 0
                    ? 'bg-bisat-black/10 text-bisat-black/30 cursor-not-allowed'
                    : 'bg-bisat-black text-white hover:bg-bisat-gold shadow-md shadow-bisat-black/10'
                }`}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={16} /> {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</>
                )}
              </button>
            </div>

            {/* Secondary CTA */}
            {product.stock > 0 && (
              <Link
                href="/checkout"
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
                className="w-full border border-bisat-black/15 text-bisat-black rounded-xl py-3.5 text-sm font-semibold text-center hover:border-bisat-gold hover:text-bisat-gold transition-all duration-300 mb-6"
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
              <h2 className="text-xl font-serif mb-1">Write a Review</h2>
              <p className="text-sm text-bisat-black/40 mb-6">Share your experience with this rug</p>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-bisat-black/40 mb-1.5">Your Name</label>
                  <input
                    type="text" required value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    className="w-full bg-white border border-bisat-black/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bisat-gold/50 transition-all"
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
                    className="w-full bg-white border border-bisat-black/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bisat-gold/50 transition-all resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-bisat-gold text-white py-3 rounded-xl text-sm font-semibold hover:bg-bisat-black transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting…' : 'Post Review'}
                </button>
              </form>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif">
                  Customer Reviews
                  {localReviews.length > 0 && (
                    <span className="ml-2 text-sm font-sans font-normal text-bisat-black/35">({localReviews.length})</span>
                  )}
                </h2>
                {avgRating && (
                  <div className="flex items-center gap-2">
                    <Star size={16} fill="#B8944F" color="#B8944F" />
                    <span className="text-lg font-serif">{avgRating}</span>
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
                      className="bg-white rounded-2xl p-5 border border-bisat-black/5"
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
                    <div className="bg-bisat-cream/40 rounded-2xl py-12 text-center border-2 border-dashed border-bisat-black/8">
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
              <h2 className="text-xl font-serif">More {product.category} Rugs</h2>
              <Link href={`/shop?category=${product.category}`} className="text-[11px] uppercase tracking-widest font-bold text-bisat-black/40 hover:text-bisat-gold transition-colors">
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
