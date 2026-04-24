interface RouteMeta {
  title: string;
  description: string;
  robots?: string;
}

const DEFAULT_DESC =
  'Bisatim – Premium hand-woven rugs & carpets from Turkey. Hereke silk, Oushak vintage, Kilim and more. Shop authentic artisanal heritage for your home.';

export function getMetaForRoute(url: string): RouteMeta {
  const path = url.split('?')[0].replace(/\/$/, '') || '/';

  // Dynamic pages — metadata is handled by each page's generateMetadata
  if (path.match(/^\/product\//)) {
    return { title: 'Rug Details | Bisatim', description: DEFAULT_DESC };
  }
  if (path.match(/^\/blog\//)) {
    return { title: 'Journal | Bisatim', description: DEFAULT_DESC };
  }

  const staticRoutes: Record<string, RouteMeta> = {
    '/': {
      title: 'Bisatim | Artisanal Turkish Rugs & Carpets',
      description: DEFAULT_DESC,
    },
    '/shop': {
      title: 'Shop Rugs & Carpets | Bisatim',
      description:
        'Browse our curated collection of handmade, vintage, kilim and machine-woven Turkish rugs. Filter by size, room, material and origin.',
    },
    '/about': {
      title: 'Our Story | Bisatim',
      description:
        'Learn how Bisatim connects centuries-old Turkish weaving traditions with modern homes around the world.',
    },
    '/blog': {
      title: 'Journal – Rug Heritage & Design | Bisatim',
      description:
        'Stories on rug care, weaving history, interior design, and sustainability from the Bisatim artisan community.',
    },
    '/faq': {
      title: 'FAQ – Shipping, Care & Authenticity | Bisatim',
      description:
        'Answers to common questions about shipping, rug care, returns, and the authenticity of Bisatim artisanal pieces.',
    },
    '/contact': {
      title: 'Contact Us | Bisatim',
      description:
        'Get in touch with the Bisatim team for custom orders, care advice, or general inquiries.',
    },
    '/reviews': {
      title: 'Customer Reviews | Bisatim',
      description:
        'Read verified reviews from customers around the world who brought a piece of Turkish heritage into their homes.',
    },
    '/craftsmanship': {
      title: 'Craftsmanship & Weaving Tradition | Bisatim',
      description:
        'Discover the ancient techniques behind every Bisatim rug – from loom to living room.',
    },
    '/shipping': {
      title: 'Shipping & Delivery | Bisatim',
      description:
        'Worldwide shipping on all orders. Learn about delivery times, tracking, and our secure packaging process.',
    },
    '/track-order': {
      title: 'Track Your Order | Bisatim',
      description: "Follow your artisanal rug's journey from our workshops to your home.",
    },
    '/cart': {
      title: 'Shopping Cart | Bisatim',
      description: 'Review your selected rugs and proceed to checkout.',
      robots: 'noindex, nofollow',
    },
    '/wishlist': {
      title: 'My Wishlist | Bisatim',
      description: 'Your saved rugs and carpets at Bisatim.',
      robots: 'noindex, nofollow',
    },
    '/account': {
      title: 'My Account | Bisatim',
      description: 'Manage your Bisatim account, orders, and preferences.',
      robots: 'noindex, nofollow',
    },
    '/privacy': {
      title: 'Privacy Policy | Bisatim',
      description: "Bisatim's privacy policy outlining how we collect, use and protect your data.",
    },
    '/terms': {
      title: 'Terms & Conditions | Bisatim',
      description: 'Terms and conditions governing use of the Bisatim online store.',
    },
    '/kvkk': {
      title: 'KVKK Aydınlatma Metni | Bisatim',
      description: 'Kişisel verilerin korunması kanunu kapsamında Bisatim aydınlatma metni.',
    },
  };

  return (
    staticRoutes[path] || {
      title: 'Bisatim | Artisanal Turkish Rugs & Carpets',
      description: DEFAULT_DESC,
    }
  );
}
