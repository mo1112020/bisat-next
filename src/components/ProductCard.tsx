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
        className="relative block overflow-hidden bg-[#F6F3EE] aspect-[4/5] sm:aspect-square"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-opacity duration-500 ${isSoldOut ? 'opacity-50 grayscale-[0.2]' : ''}`}
          priority={priority}
        />

        {product.images[1] && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-[#F6F3EE]">
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Badge — top-left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {isSoldOut ? (
            <span className="text-[8px] uppercase tracking-[0.2em] font-medium text-white bg-bisat-black px-2.5 py-1">
              Sold Out
            </span>
          ) : isOnSale ? (
            <span className="text-[8px] uppercase tracking-[0.2em] font-medium text-white bg-bisat-terracotta px-2.5 py-1">
              Sale
            </span>
          ) : null}
        </div>

        {/* Wishlist — top-right */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-10 flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? 'opacity-100 text-bisat-terracotta'
              : 'opacity-0 group-hover:opacity-100 text-bisat-black/60'
          }`}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 1.5} />
        </button>

        {/* Add to bag — slides up from bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-250 ease-out">
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`w-full py-3 text-[9px] uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-2 transition-colors duration-150 ${
              justAdded
                ? 'bg-bisat-black text-white'
                : isSoldOut
                ? 'bg-bisat-black/60 text-white cursor-not-allowed'
                : 'bg-white text-bisat-black hover:bg-bisat-black hover:text-white'
            }`}
          >
            <ShoppingBag size={12} strokeWidth={1.5} />
            {justAdded ? 'Added to Bag' : isSoldOut ? 'Unavailable' : 'Quick Add'}
          </button>
        </div>
      </Link>

      {/* ── Text block ──────────────────────────────────────────── */}
      <div className="pt-3 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline gap-3 mb-2">
          <Link href={`/product/${product.id}`} className="block flex-grow">
            <h3 className="text-[13px] font-normal text-bisat-black leading-snug hover:text-bisat-warm-gray transition-colors duration-150 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end text-right flex-shrink-0">
            <span className={`text-[13px] font-normal leading-none ${isOnSale ? 'text-bisat-terracotta' : 'text-bisat-black'}`}>
              ${displayPrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-[11px] text-bisat-black/30 line-through mt-1">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-bisat-black/35 font-medium">
          {product.origin.split(',')[0]} · {product.category}
        </p>
      </div>
    </div>
  );
};
