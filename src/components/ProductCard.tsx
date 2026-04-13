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
        className="relative block overflow-hidden bg-[#F5F2EC] aspect-[4/5] sm:aspect-square transition-all duration-500"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04] ${isSoldOut ? 'opacity-60 grayscale-[0.3]' : ''}`}
          priority={priority}
        />

        {product.images[1] && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out bg-[#F5F2EC]">
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
            <span className="text-[8px] uppercase tracking-[0.25em] font-semibold text-white bg-bisat-black px-2.5 py-1">
              Sold Out
            </span>
          ) : isOnSale ? (
            <span className="text-[8px] uppercase tracking-[0.25em] font-semibold text-white bg-bisat-terracotta px-2.5 py-1">
              Sale
            </span>
          ) : null}
        </div>

        {/* Wishlist — top-right */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 z-10 flex items-center justify-center transition-all duration-300 ${
            isFavorite
              ? 'opacity-100 text-bisat-terracotta'
              : 'opacity-0 group-hover:opacity-100 text-white'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 1.5} />
        </button>

        {/* Add to bag — slides up from bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`w-full py-3 text-[9px] uppercase tracking-[0.3em] font-semibold flex items-center justify-center gap-2 transition-colors duration-200 ${
              justAdded
                ? 'bg-bisat-black/90 text-white'
                : isSoldOut
                ? 'bg-bisat-black/70 text-white cursor-not-allowed'
                : 'bg-white text-bisat-black hover:bg-bisat-black hover:text-white'
            }`}
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            {justAdded ? 'Added to Bag' : isSoldOut ? 'Unavailable' : 'Quick Add'}
          </button>
        </div>
      </Link>

      {/* ── Text block ──────────────────────────────────────────── */}
      <div className="pt-3 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-3 mb-1">
          <Link href={`/product/${product.id}`} className="block flex-grow">
            <h3 className="text-[0.95rem] font-normal text-bisat-black leading-snug hover:text-bisat-gold transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end text-right flex-shrink-0 pt-0.5">
            <span className={`text-[0.95rem] font-normal leading-none ${isOnSale ? 'text-bisat-terracotta' : 'text-bisat-black'}`}>
              ${displayPrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-[10px] text-bisat-black/30 line-through mt-1">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-2.5 flex flex-col gap-0.5 border-t border-bisat-border">
          <p className="text-[9px] uppercase tracking-[0.25em] text-bisat-black/35 font-medium">
            {product.origin.split(',')[0]} · {product.category}
          </p>
          <p className="text-[10px] text-bisat-black/30 font-light">{product.dimensions}</p>
        </div>
      </div>
    </div>
  );
};
