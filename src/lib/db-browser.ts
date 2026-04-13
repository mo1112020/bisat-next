/**
 * Browser-safe admin DB helpers.
 * All calls go through /api/admin/data (server-side Supabase) instead of
 * calling Supabase directly from the browser, which avoids TLS and CORS issues.
 */
import type * as db from './db';

// Re-export types from the server-side db so admin pages don't need two imports
export type { Category, RoomType, SizeCategory, SiteImageKey } from './db';
export { SITE_SETTING_DEFAULTS, SITE_IMAGE_DEFAULTS } from './db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function call<T = any>(op: string, args?: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/admin/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ op, ...args }),
  });
  if (!res.ok) throw new Error(`[admin/data] ${op} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Read ─────────────────────────────────────────────────────────────────────
export const getProducts            = () => call<Awaited<ReturnType<typeof db.getProducts>>>('getProducts');
export const getDashboardStats      = () => call<Awaited<ReturnType<typeof db.getDashboardStats>>>('getDashboardStats');
export const adminGetOrders         = () => call<Awaited<ReturnType<typeof db.adminGetOrders>>>('adminGetOrders');
export const adminGetAllReviews     = () => call<Awaited<ReturnType<typeof db.adminGetAllReviews>>>('adminGetAllReviews');
export const getBlogPosts           = () => call<Awaited<ReturnType<typeof db.getBlogPosts>>>('getBlogPosts');
export const getTestimonials        = () => call<Awaited<ReturnType<typeof db.getTestimonials>>>('getTestimonials');
export const getSiteSettings        = () => call<Awaited<ReturnType<typeof db.getSiteSettings>>>('getSiteSettings');
export const getSiteImages          = () => call<Awaited<ReturnType<typeof db.getSiteImages>>>('getSiteImages');
export const adminGetCategories     = () => call<Awaited<ReturnType<typeof db.adminGetCategories>>>('adminGetCategories');
export const adminGetRoomTypes      = () => call<Awaited<ReturnType<typeof db.adminGetRoomTypes>>>('adminGetRoomTypes');
export const adminGetSizeCategories = () => call<Awaited<ReturnType<typeof db.adminGetSizeCategories>>>('adminGetSizeCategories');

// ── Products ─────────────────────────────────────────────────────────────────
export const adminCreateProduct  = (data: Parameters<typeof db.adminCreateProduct>[0])                         => call<Awaited<ReturnType<typeof db.adminCreateProduct>>>('adminCreateProduct', { data });
export const adminUpdateProduct  = (id: string, data: Parameters<typeof db.adminUpdateProduct>[1])             => call<Awaited<ReturnType<typeof db.adminUpdateProduct>>>('adminUpdateProduct', { id, data });
export const adminDeleteProduct  = (id: string)                                                                 => call<boolean>('adminDeleteProduct', { id });

// ── Orders ───────────────────────────────────────────────────────────────────
export const adminUpdateOrderStatus = (id: string, status: string)                                             => call<boolean>('adminUpdateOrderStatus', { id, status });

// ── Reviews ──────────────────────────────────────────────────────────────────
export const adminDeleteReview      = (id: string)                                                             => call<boolean>('adminDeleteReview', { id });

// ── Blog ─────────────────────────────────────────────────────────────────────
export const adminCreateBlogPost    = (data: Parameters<typeof db.adminCreateBlogPost>[0])                     => call<boolean>('adminCreateBlogPost', { data });
export const adminUpdateBlogPost    = (id: string, data: Parameters<typeof db.adminUpdateBlogPost>[1])         => call<boolean>('adminUpdateBlogPost', { id, data });
export const adminDeleteBlogPost    = (id: string)                                                             => call<boolean>('adminDeleteBlogPost', { id });

// ── Testimonials ─────────────────────────────────────────────────────────────
export const adminCreateTestimonial = (data: Parameters<typeof db.adminCreateTestimonial>[0])                  => call<boolean>('adminCreateTestimonial', { data });
export const adminDeleteTestimonial = (id: string)                                                             => call<boolean>('adminDeleteTestimonial', { id });

// ── Site settings / images ───────────────────────────────────────────────────
export const adminUpsertSiteSetting = (key: string, value: string)                                            => call<boolean>('adminUpsertSiteSetting', { key, value });
export const adminUpsertSiteImage   = (key: string, url: string)                                              => call<boolean>('adminUpsertSiteImage', { key, url });

// ── Categories ───────────────────────────────────────────────────────────────
export const adminCreateCategory    = (data: Parameters<typeof db.adminCreateCategory>[0])                     => call<Awaited<ReturnType<typeof db.adminCreateCategory>>>('adminCreateCategory', { data });
export const adminUpdateCategory    = (id: string, data: Parameters<typeof db.adminUpdateCategory>[1])         => call<boolean>('adminUpdateCategory', { id, data });
export const adminDeleteCategory    = (id: string)                                                             => call<boolean>('adminDeleteCategory', { id });

// ── Room types ───────────────────────────────────────────────────────────────
export const adminCreateRoomType    = (data: Parameters<typeof db.adminCreateRoomType>[0])                     => call<boolean>('adminCreateRoomType', { data });
export const adminUpdateRoomType    = (id: string, data: Parameters<typeof db.adminUpdateRoomType>[1])         => call<boolean>('adminUpdateRoomType', { id, data });
export const adminDeleteRoomType    = (id: string)                                                             => call<boolean>('adminDeleteRoomType', { id });

// ── Size categories ──────────────────────────────────────────────────────────
export const adminCreateSizeCategory = (data: Parameters<typeof db.adminCreateSizeCategory>[0])                => call<boolean>('adminCreateSizeCategory', { data });
export const adminUpdateSizeCategory = (id: string, data: Parameters<typeof db.adminUpdateSizeCategory>[1])    => call<boolean>('adminUpdateSizeCategory', { id, data });
export const adminDeleteSizeCategory = (id: string)                                                            => call<boolean>('adminDeleteSizeCategory', { id });
