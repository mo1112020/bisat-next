import type { Metadata } from 'next';
import Script from 'next/script';
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
    default: 'Bisāṭim | Artisanal Turkish Rugs & Carpets',
    template: '%s | Bisāṭim',
  },
  description: 'Bisāṭim – Premium hand-woven rugs & carpets from Turkey. Hereke silk, Oushak vintage, Kilim and more. Shop authentic artisanal heritage for your home.',
  keywords: ['Turkish rugs', 'artisanal carpets', 'hand-woven rugs', 'Hereke silk rug', 'Oushak rug', 'Kilim', 'vintage rugs', 'luxury carpets'],
  openGraph: {
    type: 'website',
    siteName: 'Bisāṭim',
    locale: 'en_US',
    images: [{ url: 'https://bisatim.com/og-default.jpg', width: 1200, height: 630, alt: 'Bisāṭim — Premium Turkish Rugs' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bisatim',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="topbar-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem('bisat_topbar_dismissed');if(d==='1'){document.documentElement.style.setProperty('--topbar-h','0px');document.documentElement.classList.add('topbar-dismissed');}else{document.documentElement.style.setProperty('--topbar-h','2.25rem');}}catch(e){}})();`,
          }}
        />
        <link rel="alternate" hrefLang="en" href="https://bisatim.com" />
        <link rel="alternate" hrefLang="x-default" href="https://bisatim.com" />
      </head>
      <body suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-bisat-black focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Providers>
          <Suspense>
            <Analytics />
          </Suspense>
          <Heatmap />
          <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
            <Topbar />
            <Navbar />
          </header>
          <div className="flex flex-col min-h-screen">
            <main
              id="main-content"
              className="flex-grow"
              style={{ paddingTop: 'calc(var(--topbar-h, 2.25rem) + 5rem)' }}
            >
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
