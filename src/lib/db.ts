import { supabase } from './supabase';
import { Product, Review } from '../data/products';
import { BlogPostData } from '../data/blogPosts';

// Suppress PGRST205 "table not found" — expected before migration is run
function logError(error: unknown) {
  if (error && typeof error === 'object' && (error as Record<string, unknown>).code === 'PGRST205') return;
  console.error(error);
}

function toReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    userName: row.user_name as string,
    rating: row.rating as number,
    comment: row.comment as string,
    date: row.date as string,
  };
}

function toProduct(row: Record<string, unknown>): Product {
  const reviews = Array.isArray(row.product_reviews)
    ? (row.product_reviews as Record<string, unknown>[]).map(toReview)
    : [];
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Product['category'],
    price: row.price as number,
    salePrice: row.sale_price != null ? (row.sale_price as number) : undefined,
    description: row.description as string,
    images: (row.images as string[]) || [],
    dimensions: row.dimensions as string,
    sizeCategory: row.size_category as Product['sizeCategory'],
    rooms: (row.rooms as Product['rooms'][number][]) || [],
    material: row.material as string,
    origin: row.origin as string,
    stock: row.stock as number,
    reviews,
  };
}

function toBlogPost(row: Record<string, unknown>): BlogPostData {
  return {
    id: row.id as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    image: row.image as string,
    date: row.date as string,
    author: row.author as string,
    category: row.category as string,
    metaDescription: row.meta_description as string | undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError(error); return []; }
  return (data || []).map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_reviews(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return toProduct(data);
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(4);
  if (error) return [];
  return (data || []).map(toProduct);
}

export async function getBlogPosts(): Promise<BlogPostData[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError(error); return []; }
  return (data || []).map(toBlogPost);
}

export async function getBlogPost(id: string): Promise<BlogPostData | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return toBlogPost(data);
}

export async function getOrder(id: string): Promise<{
  id: string; status: string; date: string;
  items: string[]; estimatedDelivery: string; location: string;
} | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id.toUpperCase())
    .single();
  if (error) return null;
  return {
    id: data.id,
    status: data.status,
    date: data.date,
    items: data.items || [],
    estimatedDelivery: data.estimated_delivery,
    location: data.location,
  };
}

export async function getTestimonials(): Promise<{
  id: string; name: string; location: string; title: string;
  text: string; date: string; rating: number; category: string;
}[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { logError(error); return []; }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    location: row.location,
    title: row.title,
    text: row.text,
    date: row.date,
    rating: row.rating,
    category: row.category,
  }));
}

export async function addProductReview(
  productId: string,
  review: { userName: string; rating: number; comment: string }
): Promise<void> {
  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    user_name: review.userName,
    rating: review.rating,
    comment: review.comment,
  });
  if (error) logError(error);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  badge: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
}

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    badge: (row.badge as string) || '',
    imageUrl: (row.image_url as string) || '',
    sortOrder: (row.sort_order as number) || 0,
    active: (row.active as boolean) ?? true,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error) { logError(error); return []; }
  return (data || []).map(toCategory);
}

// ─── Room Types ───────────────────────────────────────────────────────────────

export interface RoomType {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

function toRoomType(row: Record<string, unknown>): RoomType {
  return {
    id: row.id as string,
    name: row.name as string,
    sortOrder: (row.sort_order as number) || 0,
    active: (row.active as boolean) ?? true,
  };
}

export async function getRoomTypes(): Promise<RoomType[]> {
  const { data, error } = await supabase
    .from('room_types')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error) { logError(error); return []; }
  return (data || []).map(toRoomType);
}

// ─── Size Categories ──────────────────────────────────────────────────────────

export interface SizeCategory {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

function toSizeCategory(row: Record<string, unknown>): SizeCategory {
  return {
    id: row.id as string,
    name: row.name as string,
    sortOrder: (row.sort_order as number) || 0,
    active: (row.active as boolean) ?? true,
  };
}

export async function getSizeCategories(): Promise<SizeCategory[]> {
  const { data, error } = await supabase
    .from('size_categories')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error) { logError(error); return []; }
  return (data || []).map(toSizeCategory);
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSetting {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'textarea' | 'url';
}

export const SITE_SETTING_DEFAULTS: Record<string, { label: string; value: string; type: 'text' | 'textarea' | 'url'; group: string }> = {
  promo_text:            { label: 'Promo Banner Text',       value: 'Mid-Season Sale: Up to 40% off Vintage Collections!', type: 'text',     group: 'Home' },
  hero_badge:            { label: 'Hero Badge',              value: 'The Summer Edit',                                     type: 'text',     group: 'Home' },
  hero_title:            { label: 'Hero Title',              value: 'Artisan',                                             type: 'text',     group: 'Home' },
  hero_title_italic:     { label: 'Hero Title (italic)',     value: 'Masterpieces',                                        type: 'text',     group: 'Home' },
  hero_subtitle:         { label: 'Hero Subtitle',           value: 'Elevate your home with our curated selection of strictly authentic, hand-knotted pieces deeply rooted in cultural heritage. Directly sourced, ethically made.', type: 'textarea', group: 'Home' },
  promo_members_title:   { label: 'Promo Members Title',     value: 'Join our Rewards Club & Get $50 Off Your First Order.', type: 'text',   group: 'Home' },
  promo_members_sub:     { label: 'Promo Members Subtitle',  value: 'Unlock early access to sales, exclusive vintage drops, and earn points on every purchase.', type: 'textarea', group: 'Home' },
  trust_1_label:         { label: 'Trust 1 Label',           value: 'Verified Integrity',   type: 'text', group: 'Trust' },
  trust_1_sub:           { label: 'Trust 1 Subtext',         value: 'Every rug certified',  type: 'text', group: 'Trust' },
  trust_2_label:         { label: 'Trust 2 Label',           value: 'Free Shipping',        type: 'text', group: 'Trust' },
  trust_2_sub:           { label: 'Trust 2 Subtext',         value: 'Worldwide, fully insured', type: 'text', group: 'Trust' },
  trust_3_label:         { label: 'Trust 3 Label',           value: '30-Day Returns',       type: 'text', group: 'Trust' },
  trust_3_sub:           { label: 'Trust 3 Subtext',         value: 'Hassle-free policy',   type: 'text', group: 'Trust' },
  trust_4_label:         { label: 'Trust 4 Label',           value: 'Direct from Makers',   type: 'text', group: 'Trust' },
  trust_4_sub:           { label: 'Trust 4 Subtext',         value: 'No middlemen',         type: 'text', group: 'Trust' },
  contact_address:       { label: 'Address',                 value: 'Grand Bazaar Quarter, Istanbul, Turkey', type: 'text', group: 'Contact' },
  contact_phone:         { label: 'Phone',                   value: '+90 212 000 0000',     type: 'text', group: 'Contact' },
  social_instagram:      { label: 'Instagram URL',           value: 'https://www.instagram.com/bisatim_/', type: 'url', group: 'Social' },
  social_pinterest:      { label: 'Pinterest URL',           value: 'https://tr.pinterest.com/bisatim_/', type: 'url', group: 'Social' },
  social_tiktok:         { label: 'TikTok URL',              value: 'https://www.tiktok.com/@bisatim_',    type: 'url', group: 'Social' },
  footer_shipping_title: { label: 'Footer Shipping Title',   value: 'Free Worldwide Shipping', type: 'text', group: 'Footer' },
  footer_shipping_desc:  { label: 'Footer Shipping Description', value: 'Every rug is hand-packed and insured for complimentary delivery.', type: 'text', group: 'Footer' },
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  // start with defaults
  for (const [key, def] of Object.entries(SITE_SETTING_DEFAULTS)) {
    map[key] = def.value;
  }
  const { data } = await supabase.from('site_settings').select('key, value');
  for (const row of data ?? []) {
    if (row.value != null) map[row.key as string] = row.value as string;
  }
  return map;
}

// ─── Site Images ─────────────────────────────────────────────────────────────

export type SiteImageKey =
  | 'hero'
  | 'promo_split'
  | 'about_artisan'
  | 'lifestyle_1_hero'
  | 'lifestyle_1_thumb'
  | 'lifestyle_2_hero'
  | 'lifestyle_2_thumb'
  | 'lifestyle_3_hero'
  | 'lifestyle_3_thumb'
  | 'lifestyle_4_hero'
  | 'lifestyle_4_thumb';

export interface SiteImage {
  key: SiteImageKey;
  url: string;
  label: string;
}

export const SITE_IMAGE_DEFAULTS: Record<SiteImageKey, { label: string; fallback: string }> = {
  hero:          { label: 'Home — Hero Background', fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
  promo_split:   { label: 'Home — Promo Section',   fallback: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop' },
  about_artisan: { label: 'About — Artisan Section', fallback: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1200&auto=format&fit=crop' },
  lifestyle_1_hero:  { label: 'Home — Lifestyle card 1 (hero)',  fallback: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=85&w=1100&auto=format&fit=crop' },
  lifestyle_1_thumb: { label: 'Home — Lifestyle card 1 (thumb)', fallback: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=400&auto=format&fit=crop' },
  lifestyle_2_hero:  { label: 'Home — Lifestyle card 2 (hero)',  fallback: 'https://images.unsplash.com/photo-1548199973-03f0f5fc9730?q=85&w=1100&auto=format&fit=crop' },
  lifestyle_2_thumb: { label: 'Home — Lifestyle card 2 (thumb)', fallback: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=400&auto=format&fit=crop' },
  lifestyle_3_hero:  { label: 'Home — Lifestyle card 3 (hero)',  fallback: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=85&w=1100&auto=format&fit=crop' },
  lifestyle_3_thumb: { label: 'Home — Lifestyle card 3 (thumb)', fallback: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop' },
  lifestyle_4_hero:  { label: 'Home — Lifestyle card 4 (hero)',  fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4ddf4c?q=85&w=1100&auto=format&fit=crop' },
  lifestyle_4_thumb: { label: 'Home — Lifestyle card 4 (thumb)', fallback: 'https://images.unsplash.com/photo-1585412727339-54e4be3f3467?q=80&w=400&auto=format&fit=crop' },
};

export async function getSiteImages(): Promise<Record<SiteImageKey, string>> {
  const { data } = await supabase.from('site_images').select('key, url');
  const map = {} as Record<SiteImageKey, string>;
  // Start with fallbacks
  for (const [key, { fallback }] of Object.entries(SITE_IMAGE_DEFAULTS)) {
    map[key as SiteImageKey] = fallback;
  }
  // Override with stored CDN URLs
  for (const row of data ?? []) {
    if (row.url && (row.key in SITE_IMAGE_DEFAULTS)) map[row.key as SiteImageKey] = row.url;
  }
  return map;
}

