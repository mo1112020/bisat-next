
"use client";
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '../lib/analytics';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

/**
 * Drop this once inside <App> (needs to be inside a Router).
 * Handles pixel initialisation + automatic PageView on every route change.
 */
export const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialised = useRef(false);

  // Initialise pixels once
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    // ── Facebook Pixel ───────────────────────────────
    if (FB_PIXEL_ID) {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
      window.fbq?.('init', FB_PIXEL_ID);
    }

    // ── Google Analytics 4 ───────────────────────────
    if (GA_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      window.gtag = function gtag() {
        (window as any).dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { send_page_view: false });
    }

    // ── TikTok Pixel ─────────────────────────────────
    if (TIKTOK_PIXEL_ID) {
      (function (w: any, d: any, t: any) {
        w.TiktokAnalyticsObject = t;
        const ttq = (w[t] = w[t] || []);
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
        ttq.setAndDefer = function (obj: any, method: any) {
          obj[method] = function () { obj.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
        };
        ttq.methods.forEach((method: any) => ttq.setAndDefer(ttq, method));
        ttq.instance = function (id: any) {
          const ins = ttq._i[id] || [];
          ttq.methods.forEach((method: any) => ttq.setAndDefer(ins, method));
          return ins;
        };
        ttq.load = function (id: any, options: any) {
          const url = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          ttq._i = ttq._i || {};
          ttq._i[id] = [];
          ttq._i[id]._u = url;
          ttq._t = ttq._t || {};
          ttq._t[id] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[id] = options || {};
          const n = d.createElement('script');
          n.type = 'text/javascript';
          n.async = true;
          n.src = `${url}?sdkid=${id}&lib=${t}`;
          const a = d.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(n, a);
        };
        ttq.load(TIKTOK_PIXEL_ID);
      })(window, document, 'ttq');
    }
  }, []);

  // Track PageView on every route change
  useEffect(() => {
    trackPageView(pathname + (searchParams?.toString() ? '?' + searchParams.toString() : ''));
  }, [pathname, searchParams]);

  return null;
};
