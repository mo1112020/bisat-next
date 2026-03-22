import { products } from '../data/products';
import { BLOG_POSTS } from '../data/blogPosts';

interface RouteMeta {
  title: string;
  description: string;
  robots?: string;
}

const DEFAULT_DESC =
  'Bisāṭ – Premium hand-woven rugs & carpets from Turkey. Hereke silk, Oushak vintage, Kilim and more. Shop authentic artisanal heritage for your home.';

export function getMetaForRoute(url: string): RouteMeta {
  const path = url.split('?')[0].replace(/\/$/, '') || '/';

  // Dynamic product pages
  const productMatch = path.match(/^\/product\/(.+)$/);
  if (productMatch) {
    const product = products.find((p) => p.id === productMatch[1]);
    if (product) {
      return {
        title: `${product.name} | Bisāṭ`,
        description: `${product.description.slice(0, 155)}… Hand-woven in ${product.origin}.`,
      };
    }
  }

  // Dynamic blog post pages
  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const post = BLOG_POSTS.find((p) => p.id === blogMatch[1]);
    if (post) {
      return {
        title: `${post.title} | Bisāṭ Journal`,
        description: post.metaDescription || post.excerpt,
      };
    }
  }

  const staticRoutes: Record<string, RouteMeta> = {
    '/': {
      title: 'Bisāṭ | Artisanal Turkish Rugs & Carpets',
      description: DEFAULT_DESC,
    },
    '/shop': {
      title: 'Shop Rugs & Carpets | Bisāṭ',
      description:
        'Browse our curated collection of handmade, vintage, kilim and machine-woven Turkish rugs. Filter by size, room, material and origin.',
    },
    '/about': {
      title: 'Our Story | Bisāṭ',
      description:
        'Learn how Bisāṭ connects centuries-old Turkish weaving traditions with modern homes around the world.',
    },
    '/blog': {
      title: 'Journal – Rug Heritage & Design | Bisāṭ',
      description:
        'Stories on rug care, weaving history, interior design, and sustainability from the Bisāṭ artisan community.',
    },
    '/faq': {
      title: 'FAQ – Shipping, Care & Authenticity | Bisāṭ',
      description:
        'Answers to common questions about shipping, rug care, returns, and the authenticity of Bisāṭ artisanal pieces.',
    },
    '/contact': {
      title: 'Contact Us | Bisāṭ',
      description:
        'Get in touch with the Bisāṭ team for custom orders, care advice, or general inquiries.',
    },
    '/reviews': {
      title: 'Customer Reviews | Bisāṭ',
      description:
        'Read verified reviews from customers around the world who brought a piece of Turkish heritage into their homes.',
    },
    '/craftsmanship': {
      title: 'Craftsmanship & Weaving Tradition | Bisāṭ',
      description:
        'Discover the ancient techniques behind every Bisāṭ rug – from loom to living room.',
    },
    '/shipping': {
      title: 'Shipping & Delivery | Bisāṭ',
      description:
        'Worldwide shipping on all orders. Learn about delivery times, tracking, and our secure packaging process.',
    },
    '/track-order': {
      title: 'Track Your Order | Bisāṭ',
      description: "Follow your artisanal rug's journey from our workshops to your home.",
    },
    '/cart': {
      title: 'Shopping Cart | Bisāṭ',
      description: 'Review your selected rugs and proceed to checkout.',
      robots: 'noindex, nofollow',
    },
    '/wishlist': {
      title: 'My Wishlist | Bisāṭ',
      description: 'Your saved rugs and carpets at Bisāṭ.',
      robots: 'noindex, nofollow',
    },
    '/account': {
      title: 'My Account | Bisāṭ',
      description: 'Manage your Bisāṭ account, orders, and preferences.',
      robots: 'noindex, nofollow',
    },
    '/privacy': {
      title: 'Privacy Policy | Bisāṭ',
      description: "Bisāṭ's privacy policy outlining how we collect, use and protect your data.",
    },
    '/terms': {
      title: 'Terms & Conditions | Bisāṭ',
      description: 'Terms and conditions governing use of the Bisāṭ online store.',
    },
    '/kvkk': {
      title: 'KVKK Aydınlatma Metni | Bisāṭ',
      description: 'Kişisel verilerin korunması kanunu kapsamında Bisāṭ aydınlatma metni.',
    },
  };

  return (
    staticRoutes[path] || {
      title: 'Bisāṭ | Artisanal Turkish Rugs & Carpets',
      description: DEFAULT_DESC,
    }
  );
}
