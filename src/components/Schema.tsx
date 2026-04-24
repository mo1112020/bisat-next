import Script from 'next/script';
import { getSiteUrl } from '../lib/siteUrl';

interface SchemaProps {
  data: object;
}

export const Schema = ({ data }: SchemaProps) => (
  <Script
    id={`schema-${Math.random().toString(36).substr(2, 9)}`}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

// ── Organization ────────────────────────────────────────────────────────────
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${getSiteUrl()}/#organization`,
  name: 'Bisatim',
  url: getSiteUrl(),
  logo: {
    '@type': 'ImageObject',
    url: `${getSiteUrl()}/logo.png`,
  },
  description: 'Premium artisanal rugs and carpets from Turkey.',
  sameAs: [
    'https://www.instagram.com/bisatim_/',
    'https://tr.pinterest.com/bisatim_/',
    'https://www.tiktok.com/@bisatim_',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'heritage@bisatim.com',
    contactType: 'customer service',
    availableLanguage: ['English', 'Turkish', 'Arabic'],
  },
});

// ── WebSite with SearchAction ────────────────────────────────────────────────
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${getSiteUrl()}/#website`,
  url: getSiteUrl(),
  name: 'Bisatim',
  publisher: { '@id': `${getSiteUrl()}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${getSiteUrl()}/shop?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

// ── Product ─────────────────────────────────────────────────────────────────
export const getProductSchema = (product: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.images,
  description: product.description,
  sku: `BISATIM-${product.id}`,
  brand: { '@type': 'Brand', name: 'Bisatim' },
  material: product.material,
  countryOfOrigin: product.origin,
  offers: {
    '@type': 'Offer',
    url: `${getSiteUrl()}/product/${product.id}`,
    priceCurrency: 'USD',
    price: product.price,
    availability:
      product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': `${getSiteUrl()}/#organization` },
  },
  ...(product.reviews.length > 0 && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (
        product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
        product.reviews.length
      ).toFixed(1),
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: product.reviews.map((r: any) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.userName },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.comment,
      datePublished: r.date,
    })),
  }),
});

// ── BreadcrumbList ───────────────────────────────────────────────────────────
export const getBreadcrumbSchema = (
  crumbs: { name: string; path: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: `${getSiteUrl()}${crumb.path}`,
  })),
});

// ── BlogPosting ──────────────────────────────────────────────────────────────
export const getBlogPostingSchema = (post: any) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.metaDescription || post.excerpt,
  image: post.image,
  datePublished: post.date,
  dateModified: post.date,
  author: {
    '@type': 'Person',
    name: post.author,
  },
  publisher: { '@id': `${getSiteUrl()}/#organization` },
  url: `${getSiteUrl()}/blog/${post.id}`,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${getSiteUrl()}/blog/${post.id}`,
  },
  articleSection: post.category,
  inLanguage: 'en',
});

// ── FAQPage ──────────────────────────────────────────────────────────────────
export const getFAQSchema = (
  faqs: { category: string; questions: { q: string; a: string }[] }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((group) =>
    group.questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
});

// ── ItemList (for Shop / Blog listing) ──────────────────────────────────────
export const getItemListSchema = (
  items: { id: string; name: string; url: string; image?: string }[],
  listName: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: listName,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    url: item.url,
    ...(item.image && { image: item.image }),
  })),
});
