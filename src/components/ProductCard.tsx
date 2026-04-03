"use client";
import React from 'react';
import Link from 'next/link';
import { Product } from '../data/products';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const isFavorite = isInWishlist(product.id);
  const isSoldOut = product.stock === 0;

  // Let's pretend some products are on sale for that "e-commerce" feel
  const isOnSale = product.id === '1' || product.id === '3' || product.id === '5';
  const originalPrice = isOnSale ? Math.floor(product.price * 1.3) : product.price;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSoldOut) addToCart(product);
  };

  const categoryColor: Record<string, string> = {
    Handmade: 'bg-bisat-gold text-white',
    Vintage: 'bg-indigo-900 text-white',
    Machine: 'bg-bisat-teal text-white',
    Kilim: 'bg-bisat-terracotta text-white',
  };

  return (
    <motion.div layout className="group flex flex-col h-full bg-white rounded-2xl md:rounded-3xl border border-bisat-black/5 hover:border-bisat-gold/20 hover:shadow-2xl hover:shadow-bisat-gold/5 overflow-hidden transition-all duration-500">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-bisat-cream" aria-label={t('product.viewDetails', { name: product.name })}>
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05] ${isSoldOut ? 'grayscale-[0.4] opacity-75' : ''}`}
          referrerPolicy="no-referrer"
        />

        {/* Hover image (simulated if product had a 2nd image) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name + " alternate"}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {isSoldOut ? (
            <span className="px-3 py-1 bg-bisat-black text-white text-[10px] uppercase tracking-widest font-bold rounded-sm">
              {t('product.soldOut')}
            </span>
          ) : isOnSale ? (
            <span className="px-3 py-1 bg-[#E43D30] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-md">
              SALE
            </span>
          ) : (
            <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm ${categoryColor[product.category] ?? 'bg-bisat-gold text-white'}`}>
              {t(`product.categories.${product.category}`)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlistToggle}
            aria-label="Toggle wishlist"
            className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
              isFavorite
                ? 'bg-bisat-deep-red text-white scale-110'
                : 'bg-white/80 text-bisat-black hover:bg-bisat-deep-red hover:text-white'
            }`}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </Link>

      {/* Content & Action */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex-1">
          {/* Brand/Origin */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-bisat-black/40 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">
              {product.origin.split(',')[0]}
            </p>
            {/* Reviews */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-bisat-gold text-[12px]">★</span>
                <span className="text-bisat-black/60 text-[10px] font-semibold">
                  {(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)}
                </span>
                <span className="text-bisat-black/30 text-[9px]">({product.reviews.length})</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-base font-semibold leading-snug mb-1 group-hover:text-bisat-gold transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          {/* Meta */}
          <p className="text-bisat-black/50 text-[11px] mb-3">
            {product.dimensions} · {product.material}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-end gap-2 mb-4">
            <p className={`font-serif text-lg sm:text-xl font-medium ${isOnSale ? 'text-[#E43D30]' : 'text-bisat-black'}`}>
              ${product.price.toLocaleString()}
            </p>
            {isOnSale && (
              <p className="font-serif text-sm text-bisat-black/30 line-through pb-[2px]">
                ${originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className="w-full bg-bisat-black text-white py-3 rounded-lg text-[11px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-bisat-gold transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed group/btn hover:shadow-lg"
          >
            <ShoppingCart size={14} className="group-hover/btn:-rotate-12 transition-transform" />
            {isSoldOut ? t('product.soldOut') : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
