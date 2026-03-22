/**
 * Returns the site's base URL in both browser and server (SSR) environments.
 * Set NEXT_PUBLIC_SITE_URL in your .env for production.
 */
export const getSiteUrl = (): string => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env?.NEXT_PUBLIC_SITE_URL || 'https://bisat-store.com';
};
