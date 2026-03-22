/**
 * Analytics event helpers — Facebook Pixel, Google Analytics 4, TikTok Pixel.
 * Call these from any component. All calls are no-ops if the pixel isn't loaded.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    ttq?: { track: (...args: any[]) => void; page: () => void };
  }
}

// ── Facebook Pixel ───────────────────────────────────────────────────────────
export const fbTrack = (event: string, params?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
};

// ── Google Analytics 4 ───────────────────────────────────────────────────────
export const gaEvent = (name: string, params?: object) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
};

// ── TikTok Pixel ─────────────────────────────────────────────────────────────
export const ttTrack = (event: string, params?: object) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params);
  }
};

// ── Composite events (fire all pixels at once) ───────────────────────────────

export const trackPageView = (url: string) => {
  fbTrack('PageView');
  gaEvent('page_view', { page_location: url });
  if (typeof window !== 'undefined' && window.ttq) window.ttq.page();
};

export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  fbTrack('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'EUR',
  });
  gaEvent('view_item', {
    currency: 'EUR',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, item_category: product.category, price: product.price }],
  });
  ttTrack('ViewContent', {
    content_id: product.id,
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'EUR',
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity?: number;
}) => {
  const qty = product.quantity ?? 1;
  fbTrack('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * qty,
    currency: 'EUR',
    num_items: qty,
  });
  gaEvent('add_to_cart', {
    currency: 'EUR',
    value: product.price * qty,
    items: [{ item_id: product.id, item_name: product.name, item_category: product.category, price: product.price, quantity: qty }],
  });
  ttTrack('AddToCart', {
    content_id: product.id,
    content_name: product.name,
    quantity: qty,
    value: product.price * qty,
    currency: 'EUR',
  });
};

export const trackAddToWishlist = (product: {
  id: string;
  name: string;
  price: number;
}) => {
  fbTrack('AddToWishlist', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: 'EUR',
  });
  gaEvent('add_to_wishlist', {
    currency: 'EUR',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  });
  ttTrack('AddToWishlist', { content_id: product.id, value: product.price, currency: 'EUR' });
};

export const trackInitiateCheckout = (value: number, itemCount: number) => {
  fbTrack('InitiateCheckout', { value, currency: 'EUR', num_items: itemCount });
  gaEvent('begin_checkout', { currency: 'EUR', value });
  ttTrack('InitiateCheckoutEvent', { value, currency: 'EUR' });
};

export const trackSearch = (query: string) => {
  fbTrack('Search', { search_string: query });
  gaEvent('search', { search_term: query });
  ttTrack('Search', { query });
};

export const trackPurchase = (orderId: string, value: number, items: any[]) => {
  fbTrack('Purchase', { value, currency: 'EUR', order_id: orderId });
  gaEvent('purchase', { transaction_id: orderId, value, currency: 'EUR', items });
  ttTrack('CompletePayment', { order_id: orderId, value, currency: 'EUR' });
};
