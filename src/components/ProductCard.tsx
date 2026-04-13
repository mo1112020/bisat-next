"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../data/products';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFavorite = isInWishlist(product.id);
  const isSoldOut = product.stock === 0;
  const isOnSale = product.salePrice != null && product.salePrice < product.price;
  const displayPrice = isOnSale ? product.salePrice! : product.price;
  const [justAdded, setJustAdded] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isSoldOut) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col h-full">

      {/* ── Image block ─────────────────────────────────────────── */}
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden bg-[#F9F9F8] aspect-[4/5] sm:aspect-square rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-500"
      >
        {/* Primary image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04] ${isSoldOut ? 'opacity-60 grayscale-[0.3]' : ''}`}
          priority={priority}
        />

        {/* Swap image on hover */}
        {product.images[1] && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out bg-[#F9F9F8]">
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Scrim for text visibility on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-bisat-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Badge — top-left */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isSoldOut ? (
            <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-white bg-bisat-black px-3 py-1.5 shadow-sm">
              Sold Out
            </span>
          ) : isOnSale ? (
            <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-white bg-bisat-deep-red px-3 py-1.5 shadow-sm">
              Sale
            </span>
          ) : null}
        </div>

        {/* Wishlist — top-right */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-4 right-4 z-10 flex items-center justify-center transition-all duration-300 ${
            isFavorite
              ? 'opacity-100 text-bisat-deep-red'
              : 'opacity-0 group-hover:opacity-100 text-white hover:text-bisat-gold drop-shadow-md'
          }`}
        >
          <Heart size={20} className={isFavorite ? "fill-current" : ""} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 1.5} />
        </button>

        {/* Add to bag — Full width absolute bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] px-2 pb-2">
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`w-full py-3.5 text-[9px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-2.5 transition-colors duration-300 rounded-xl ${
              justAdded
                ? 'bg-green-700/95 backdrop-blur-md text-white'
                : isSoldOut
                ? 'bg-bisat-black/80 backdrop-blur-md text-white cursor-not-allowed'
                : 'bg-white/95 backdrop-blur-md text-bisat-black hover:bg-bisat-black hover:text-white'
            }`}
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            {justAdded ? 'Added to Bag' : isSoldOut ? 'Unavailable' : 'Quick Add'}
          </button>
        </div>
      </Link>

      {/* ── Text block ──────────────────────────────────────────── */}
      <div className="pt-4 pb-2 px-1 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-1">
          {/* Name */}
          <Link href={`/product/${product.id}`} className="block flex-grow">
            <h3 className="font-serif text-[1.1rem] text-bisat-black leading-snug hover:text-bisat-gold transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          {/* Price — Aligned right */}
          <div className="flex flex-col items-end text-right flex-shrink-0 pt-0.5">
            <span className={`font-serif text-[1.05rem] font-medium leading-none ${isOnSale ? 'text-bisat-deep-red' : 'text-bisat-black'}`}>
              ${displayPrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-[10px] text-bisat-black/30 line-through mt-1">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Details row (Origin, Category, Dimensions) */}
        <div className="mt-auto pt-3 flex flex-col gap-1 border-t border-bisat-black/5">
          <p className="text-[9px] uppercase tracking-[0.25em] text-bisat-black/40 font-medium">
            {product.origin.split(',')[0]} &middot; {product.category}
          </p>
          <p className="text-[10px] text-bisat-black/30 font-light tracking-wide">{product.dimensions}</p>
        </div>
      </div>
    </div>
  );
};
