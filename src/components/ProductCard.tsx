"use client";
import React from 'react';
import Link from 'next/link';
import { Product } from '../data/products';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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
    Vintage: 'bg-indigo-900/80 text-white',
    Machine: 'bg-bisat-teal/80 text-white',
    Kilim: 'bg-bisat-terracotta/80 text-white',
  };

  return (
    <motion.div layout className="group">
      <Link href={`/product/${product.id}`} aria-label={t('product.viewDetails', { name: product.name })}>
        {/* Image container — aspect-[4/5] is a bit shorter than [3/4] */}
        <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-bisat-cream relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.08] ${isSoldOut ? 'grayscale-[0.4] opacity-75' : ''}`}
            referrerPolicy="no-referrer"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-bisat-black/0 group-hover:bg-bisat-black/15 transition-colors duration-500" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold backdrop-blur-md shadow-md ${
              isSoldOut ? 'bg-bisat-black/80 text-bisat-cream' : (categoryColor[product.category] ?? 'bg-bisat-gold text-white')
            }`}>
              {isSoldOut ? t('product.soldOut') : t(`product.categories.${product.category}`)}
            </span>
          </div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3 z-10">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleWishlistToggle}
              aria-label={isFavorite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all duration-300 ${
                isFavorite
                  ? 'bg-bisat-gold text-white scale-110'
                  : 'bg-bisat-black/20 text-white hover:bg-bisat-gold'
              }`}
            >
              <Heart size={13} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

          {/* Hover action buttons — desktop only (sm+) */}
          <div className="absolute bottom-0 left-0 right-0 p-3 hidden sm:flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleQuickAdd}
              disabled={isSoldOut}
              className="flex-1 bg-white/95 backdrop-blur-md py-3 rounded-xl text-[9px] uppercase tracking-[0.25em] font-bold shadow-xl text-bisat-black flex items-center justify-center gap-2 hover:bg-bisat-black hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={12} />
              {isSoldOut ? t('product.soldOut') : t('product.quickAdd')}
            </motion.button>
            <span
              aria-hidden="true"
              className="w-11 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl text-bisat-black group-hover:text-bisat-gold transition-all duration-300"
            >
              <Eye size={13} />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-0.5">
          <p className="text-bisat-gold text-[9px] uppercase tracking-[0.3em] font-bold mb-0.5">{product.origin.split(',')[0]}</p>
          <h3 className="text-sm sm:text-base font-serif leading-snug mb-0.5 group-hover:text-bisat-gold transition-colors duration-400">{product.name}</h3>
          <p className="text-bisat-black/35 text-[9px] sm:text-[10px] font-light mb-1.5 truncate">{product.dimensions} · {product.material}</p>
          <div className="flex items-center justify-between">
            <p className="font-serif text-base sm:text-xl text-bisat-black">${product.price.toLocaleString()}</p>
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-bisat-gold text-[11px]">★</span>
                <span className="text-bisat-black/40 text-[10px] sm:text-[11px] font-medium">
                  {(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Mobile-only quick add button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className="sm:hidden mt-2 w-full bg-bisat-black text-white py-2 rounded-xl text-[10px] uppercase tracking-[0.15em] font-bold flex items-center justify-center gap-1.5 hover:bg-bisat-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={11} />
            {isSoldOut ? t('product.soldOut') : t('product.quickAdd')}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};
