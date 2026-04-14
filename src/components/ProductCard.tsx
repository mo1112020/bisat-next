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
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden border border-bisat-border bg-bisat-cream"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${isSoldOut ? 'opacity-55 grayscale-[0.2]' : ''}`}
          priority={priority}
        />

        {product.images[1] && (
          <div className="absolute inset-0 bg-bisat-cream opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {isSoldOut ? (
            <span className="bg-white px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-bisat-black">
              Sold Out
            </span>
          ) : isOnSale ? (
            <span className="bg-white px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-bisat-black">
              Sale
            </span>
          ) : null}
        </div>

        <button
          onClick={handleWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-white/60 bg-white/85 transition-all duration-200 ${
            isFavorite
              ? 'opacity-100 text-bisat-black'
              : 'opacity-0 text-bisat-black/55 group-hover:opacity-100'
          }`}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 1.5} />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full transition-transform duration-250 ease-out group-hover:translate-y-0">
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`flex w-full items-center justify-center gap-2 border-t border-bisat-border py-3 text-[9px] font-semibold uppercase tracking-[0.24em] transition-colors duration-150 ${
              justAdded
                ? 'bg-bisat-black text-white'
                : isSoldOut
                ? 'cursor-not-allowed bg-white/80 text-bisat-black/35'
                : 'bg-white text-bisat-black hover:bg-bisat-black hover:text-white'
            }`}
          >
            <ShoppingBag size={12} strokeWidth={1.5} />
            {justAdded ? 'Added to Bag' : isSoldOut ? 'Unavailable' : 'Quick Add'}
          </button>
        </div>
      </Link>

      <div className="flex flex-grow flex-col border-x border-b border-bisat-border bg-white px-4 pb-4 pt-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-bisat-black/38">
          {product.category} · {product.origin.split(',')[0]}
        </p>
        <div className="mb-2 flex items-start justify-between gap-3">
          <Link href={`/products/${product.id}`} className="block flex-grow">
            <h3 className="font-serif text-[1.05rem] font-light leading-snug text-bisat-black transition-colors duration-150 group-hover:text-bisat-gold-dark line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-shrink-0 flex-col items-end text-right">
            <span className={`text-[13px] font-medium leading-none ${isOnSale ? 'text-bisat-terracotta' : 'text-bisat-black'}`}>
              ${displayPrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="mt-1 text-[11px] text-bisat-black/30 line-through">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-bisat-black/48">
          {product.material} · {product.dimensions}
        </p>
      </div>
    </div>
  );
};
