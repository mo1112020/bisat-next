import type { SiteImageKey } from './db';

/** Stored in `site_settings.key` = `lifestyle_quad_json` */
export const LIFESTYLE_QUAD_SETTINGS_KEY = 'lifestyle_quad_json' as const;

export type RughausLifestyleCardData = {
  href: string;
  kicker: string;
  title: string;
  heroSrc: string;
  thumbSrc: string;
  bullets: readonly [string, string, string];
};

export type LifestyleQuadPayload = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: Array<{
    kicker: string;
    title: string;
    href: string;
    bullets: [string, string, string];
  }>;
};

export const LIFESTYLE_SLOT_IMAGE_KEYS: SiteImageKey[] = [
  'lifestyle_1_hero',
  'lifestyle_1_thumb',
  'lifestyle_2_hero',
  'lifestyle_2_thumb',
  'lifestyle_3_hero',
  'lifestyle_3_thumb',
  'lifestyle_4_hero',
  'lifestyle_4_thumb',
];

const HERO_FB = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=85&w=1100&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548199973-03f0f5fc9730?q=85&w=1100&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600166898405-da9535204843?q=85&w=1100&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4ddf4c?q=85&w=1100&auto=format&fit=crop',
] as const;

const THUMB_FB = [
  'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585412727339-54e4be3f3467?q=80&w=400&auto=format&fit=crop',
] as const;

export const DEFAULT_LIFESTYLE_QUAD_PAYLOAD: LifestyleQuadPayload = {
  eyebrow: 'Shop the edit',
  title: 'Choose rugs for the way you live',
  subtitle: 'Texture, care, rarity, and scale — four ways in.',
  cards: [
    {
      kicker: 'Plush, high-pile rugs',
      title: 'Find a rich, premium rug',
      href: '/collections/authentic-rugs',
      bullets: ['Refined texture and hand-feel', 'Dense, full pile construction', 'Mid to high price range'],
    },
    {
      kicker: 'Easy-care rugs for family life',
      title: 'Live beautifully with kids and pets',
      href: '/collections/easy-rugs',
      bullets: ['Washable and simple to maintain', 'Shorter pile, practical underfoot', 'Low to mid price range'],
    },
    {
      kicker: 'One-of-a-kind vintage',
      title: 'Meet a singular vintage piece',
      href: '/collections/vintage-rugs',
      bullets: ['Buyer-curated one-off finds', 'Persian and Anatolian character', 'High price range'],
    },
    {
      kicker: 'Made-to-measure for your room',
      title: 'Cover the whole floor plan',
      href: '/collections/custom-rugs',
      bullets: ['Flexible bespoke sizing', 'Tailored to your layout', 'High price range'],
    },
  ],
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function parsePayload(raw: string | undefined): LifestyleQuadPayload {
  if (!raw?.trim()) return DEFAULT_LIFESTYLE_QUAD_PAYLOAD;
  try {
    const j = JSON.parse(raw) as unknown;
    if (!isRecord(j)) return DEFAULT_LIFESTYLE_QUAD_PAYLOAD;
    const eyebrow = typeof j.eyebrow === 'string' ? j.eyebrow : DEFAULT_LIFESTYLE_QUAD_PAYLOAD.eyebrow;
    const title = typeof j.title === 'string' ? j.title : DEFAULT_LIFESTYLE_QUAD_PAYLOAD.title;
    const subtitle = typeof j.subtitle === 'string' ? j.subtitle : DEFAULT_LIFESTYLE_QUAD_PAYLOAD.subtitle;
    const rawCards = Array.isArray(j.cards) ? j.cards : [];
    const cards: LifestyleQuadPayload['cards'] = [];
    for (let i = 0; i < 4; i++) {
      const d = DEFAULT_LIFESTYLE_QUAD_PAYLOAD.cards[i]!;
      const c = rawCards[i];
      if (!isRecord(c)) {
        cards.push({ ...d });
        continue;
      }
      const bulletsIn = Array.isArray(c.bullets) ? c.bullets : [];
      const bullets: [string, string, string] = [
        typeof bulletsIn[0] === 'string' ? bulletsIn[0] : d.bullets[0],
        typeof bulletsIn[1] === 'string' ? bulletsIn[1] : d.bullets[1],
        typeof bulletsIn[2] === 'string' ? bulletsIn[2] : d.bullets[2],
      ];
      cards.push({
        kicker: typeof c.kicker === 'string' ? c.kicker : d.kicker,
        title: typeof c.title === 'string' ? c.title : d.title,
        href: typeof c.href === 'string' ? c.href : d.href,
        bullets,
      });
    }
    return { eyebrow, title, subtitle, cards };
  } catch {
    return DEFAULT_LIFESTYLE_QUAD_PAYLOAD;
  }
}

export function getLifestyleQuadPayload(settings: Record<string, string>): LifestyleQuadPayload {
  return parsePayload(settings[LIFESTYLE_QUAD_SETTINGS_KEY]);
}

export function buildLifestyleQuadCards(
  settings: Record<string, string>,
  siteImages: Record<SiteImageKey, string>
): { eyebrow: string; title: string; subtitle: string; cards: RughausLifestyleCardData[] } {
  const payload = getLifestyleQuadPayload(settings);
  const cards: RughausLifestyleCardData[] = payload.cards.map((c, i) => {
    const heroKey = `lifestyle_${i + 1}_hero` as SiteImageKey;
    const thumbKey = `lifestyle_${i + 1}_thumb` as SiteImageKey;
    const heroSrc = siteImages[heroKey] || HERO_FB[i]!;
    const thumbSrc = siteImages[thumbKey] || THUMB_FB[i]!;
    return {
      href: c.href,
      kicker: c.kicker,
      title: c.title,
      heroSrc,
      thumbSrc,
      bullets: c.bullets as readonly [string, string, string],
    };
  });
  return {
    eyebrow: payload.eyebrow,
    title: payload.title,
    subtitle: payload.subtitle,
    cards,
  };
}

export function serializeLifestyleQuadPayload(p: LifestyleQuadPayload): string {
  return JSON.stringify(p, null, 2);
}
