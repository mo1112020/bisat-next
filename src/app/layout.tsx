import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Analytics } from '../components/Analytics';
import { Heatmap } from '../components/Heatmap';
import { Topbar } from '../components/layout/Topbar';

export const metadata: Metadata = {
  title: {
    default: 'Bisāṭ | Artisanal Turkish Rugs & Carpets',
    template: '%s | Bisāṭ',
  },
  description: 'Bisāṭ – Premium hand-woven rugs & carpets from Turkey. Hereke silk, Oushak vintage, Kilim and more. Shop authentic artisanal heritage for your home.',
  keywords: ['Turkish rugs', 'artisanal carpets', 'hand-woven rugs', 'Hereke silk rug', 'Oushak rug', 'Kilim', 'vintage rugs', 'luxury carpets'],
  openGraph: {
    type: 'website',
    siteName: 'Bisāṭ',
    locale: 'en_US',
    images: [{ url: 'https://placehold.co/1200x630', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bisatrugs',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set --topbar-h from localStorage before first paint to avoid layout shift */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem('bisat_topbar_dismissed');if(d==='1'){document.documentElement.style.setProperty('--topbar-h','0px');document.documentElement.classList.add('topbar-dismissed');}else{document.documentElement.style.setProperty('--topbar-h','2.25rem');}}catch(e){}})();`,
          }}
        />
        {/* Hreflang */}
        <link rel="alternate" hrefLang="en" href="https://bisat-store.com" />
        <link rel="alternate" hrefLang="tr" href="https://bisat-store.com/tr" />
        <link rel="alternate" hrefLang="ar" href="https://bisat-store.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://bisat-store.com" />
      </head>
      <body>
        {/* Accessibility skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-bisat-gold focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Skip to main content
        </a>

        <Providers>
          <Suspense>
            <Analytics />
          </Suspense>
          <Heatmap />

          {/* Fixed header: Topbar + Navbar stacked */}
          <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
            <Topbar />
            <Navbar />
          </header>

          <div className="flex flex-col min-h-screen" style={{ paddingTop: 'calc(4rem + var(--topbar-h, 2.25rem))' }}>
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
