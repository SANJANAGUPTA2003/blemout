/**
 * Central storefront collection + media configuration.
 * Does not modify MongoDB; resolves display from existing product documents by slug.
 */

export const PRODUCT_SLUGS = {
  facewash: 'blemout-skin-glow-age-defying-facewash',
  serum: 'blemout-advanced-blemishes-repair-serum-30ml',
  moisturizer: 'blemout-hydra-glow-water-creme',
  sunscreen: 'blemout-enviro-shield-sunscreen',
  repairCream: 'blemout-blemishes-repair-cream',
};

export const COMBO_SLUGS = {
  fwSerumMoist: 'face-wash-serum-moisturizer-combo',
  fwSerumMoistSs: 'face-wash-serum-moisturizer-sunscreen-combo',
  creamSsMoist: 'blemish-cream-sunscreen-moisturizer-combo',
  creamSs: 'repair-cream-sunscreen-duo',
  fwCreamSs: 'repair-protect-cleanse-trio',
  complete: 'complete-blemish-routine',
};

/** White = cards; colourful = hover / promo / gallery lead */
export const COMBO_MEDIA = {
  [COMBO_SLUGS.fwSerumMoist]: {
    white: '/products/combos/face-wash-serum-moisturizer-combo-white.jpg',
    creative: '/products/combos/face-wash-serum-moisturizer-combo-creative.jpg',
    included: [PRODUCT_SLUGS.facewash, PRODUCT_SLUGS.serum, PRODUCT_SLUGS.moisturizer],
  },
  [COMBO_SLUGS.fwSerumMoistSs]: {
    white: '/products/combos/face-wash-serum-moisturizer-sunscreen-combo-white.jpg',
    creative: '/products/combos/face-wash-serum-moisturizer-sunscreen-combo-creative.jpg',
    included: [
      PRODUCT_SLUGS.facewash,
      PRODUCT_SLUGS.serum,
      PRODUCT_SLUGS.moisturizer,
      PRODUCT_SLUGS.sunscreen,
    ],
  },
  [COMBO_SLUGS.creamSsMoist]: {
    white: '/products/combos/blemish-cream-sunscreen-moisturizer-combo-white.jpg',
    creative: '/products/combos/blemish-cream-sunscreen-moisturizer-combo-creative.jpg',
    included: [PRODUCT_SLUGS.repairCream, PRODUCT_SLUGS.sunscreen, PRODUCT_SLUGS.moisturizer],
  },
  [COMBO_SLUGS.creamSs]: {
    white: '/products/combos/blemish-cream-sunscreen-combo-white.jpg',
    creative: '/products/combos/blemish-cream-sunscreen-combo-creative.jpg',
    included: [PRODUCT_SLUGS.repairCream, PRODUCT_SLUGS.sunscreen],
  },
  [COMBO_SLUGS.fwCreamSs]: {
    white: '/products/combos/facewash-blemish-cream-sunscreen-combo-white.jpg',
    creative: '/products/combos/facewash-blemish-cream-sunscreen-combo-creative.jpg',
    included: [PRODUCT_SLUGS.facewash, PRODUCT_SLUGS.repairCream, PRODUCT_SLUGS.sunscreen],
  },
  [COMBO_SLUGS.complete]: {
    white: '/products/combos/complete-routine-combo-white.jpg',
    creative: '/products/combos/complete-routine-combo-creative.jpg',
    included: [
      PRODUCT_SLUGS.facewash,
      PRODUCT_SLUGS.serum,
      PRODUCT_SLUGS.moisturizer,
      PRODUCT_SLUGS.sunscreen,
      PRODUCT_SLUGS.repairCream,
    ],
  },
};

const FOLDER_BY_SLUG = {
  [PRODUCT_SLUGS.facewash]: '/products/facewash',
  [PRODUCT_SLUGS.serum]: '/products/serum',
  [PRODUCT_SLUGS.moisturizer]: '/products/moisturizer',
  [PRODUCT_SLUGS.sunscreen]: '/products/sunscreen',
  [PRODUCT_SLUGS.repairCream]: '/products/repair-cream',
};

/** Build combo gallery: colourful → white → each product 1.jpg + 6.jpg */
export function getComboGallery(slug) {
  const media = COMBO_MEDIA[slug];
  if (!media) return [];
  const images = [media.creative, media.white];
  for (const productSlug of media.included) {
    const folder = FOLDER_BY_SLUG[productSlug];
    if (!folder) continue;
    images.push(`${folder}/1.jpg`, `${folder}/6.jpg`);
  }
  return images;
}

export function getComboCardImage(slug) {
  return COMBO_MEDIA[slug]?.white || '';
}

export function getComboHoverImage(slug) {
  return COMBO_MEDIA[slug]?.creative || '';
}

/** Explicit collection membership — never rely on Mongo order. */
export const COLLECTION_SLUGS = {
  shopAll: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.moisturizer,
    PRODUCT_SLUGS.sunscreen,
    PRODUCT_SLUGS.repairCream,
    COMBO_SLUGS.fwSerumMoist,
    COMBO_SLUGS.fwSerumMoistSs,
    COMBO_SLUGS.creamSsMoist,
    COMBO_SLUGS.creamSs,
    COMBO_SLUGS.fwCreamSs,
    COMBO_SLUGS.complete,
  ],
  new: [
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.sunscreen,
    PRODUCT_SLUGS.repairCream,
    COMBO_SLUGS.fwSerumMoist,
    COMBO_SLUGS.fwSerumMoistSs,
    COMBO_SLUGS.creamSs,
  ],
  bestSellers: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.moisturizer,
    PRODUCT_SLUGS.sunscreen,
    PRODUCT_SLUGS.repairCream,
    COMBO_SLUGS.complete,
    COMBO_SLUGS.fwCreamSs,
    COMBO_SLUGS.fwSerumMoistSs,
  ],
  limitedPicks: [
    COMBO_SLUGS.fwSerumMoist,
    COMBO_SLUGS.fwSerumMoistSs,
    COMBO_SLUGS.creamSsMoist,
    COMBO_SLUGS.creamSs,
    COMBO_SLUGS.fwCreamSs,
    COMBO_SLUGS.complete,
  ],
};

export const BADGE_BY_SLUG = {
  [PRODUCT_SLUGS.facewash]: 'Top Rated',
  [PRODUCT_SLUGS.serum]: 'Most Loved',
  [PRODUCT_SLUGS.moisturizer]: 'Most Reordered',
  [PRODUCT_SLUGS.sunscreen]: 'Trending',
  [PRODUCT_SLUGS.repairCream]: 'Best Seller',
  [COMBO_SLUGS.complete]: 'Best Seller',
  [COMBO_SLUGS.fwCreamSs]: 'Limited Pick',
  [COMBO_SLUGS.fwSerumMoist]: 'New',
  [COMBO_SLUGS.fwSerumMoistSs]: 'New',
  [COMBO_SLUGS.creamSsMoist]: 'Limited Pick',
  [COMBO_SLUGS.creamSs]: 'New',
};

export const CONCERNS = [
  {
    id: 'blemishes-acne',
    name: 'Blemishes & Acne',
    description:
      'Formulas designed to support clearer-looking, blemish-prone skin as part of a daily routine.',
    image: '/home/concerns/blemishes-acne.jpg',
    productSlugs: [
      PRODUCT_SLUGS.facewash,
      PRODUCT_SLUGS.serum,
      PRODUCT_SLUGS.repairCream,
      COMBO_SLUGS.fwCreamSs,
      COMBO_SLUGS.complete,
    ],
  },
  {
    id: 'dark-spots-pigmentation',
    name: 'Dark Spots & Pigmentation',
    description:
      'Targeted care that helps improve the appearance of uneven tone and visible dark spots.',
    image: '/home/concerns/dark-spots-pigmentation.jpg',
    productSlugs: [
      PRODUCT_SLUGS.serum,
      PRODUCT_SLUGS.repairCream,
      PRODUCT_SLUGS.sunscreen,
      COMBO_SLUGS.creamSs,
      COMBO_SLUGS.creamSsMoist,
    ],
  },
  {
    id: 'dryness-dehydration',
    name: 'Dryness & Dehydration',
    description: 'Hydrating steps that support comfortable, softer-feeling skin.',
    image: '/home/concerns/dryness-dehydration.webp',
    productSlugs: [
      PRODUCT_SLUGS.moisturizer,
      PRODUCT_SLUGS.facewash,
      COMBO_SLUGS.fwSerumMoist,
      COMBO_SLUGS.creamSsMoist,
    ],
  },
  {
    id: 'dullness-uneven-tone',
    name: 'Dullness & Uneven Skin Tone',
    description:
      'Brightening-support routines designed for a more even-looking, radiant appearance.',
    image: '/home/concerns/dullness-uneven-tone.webp',
    productSlugs: [
      PRODUCT_SLUGS.serum,
      PRODUCT_SLUGS.facewash,
      PRODUCT_SLUGS.moisturizer,
      COMBO_SLUGS.fwSerumMoist,
      COMBO_SLUGS.fwSerumMoistSs,
    ],
  },
  {
    id: 'enlarged-pores-excess-oil',
    name: 'Enlarged Pores & Excess Oil',
    description: 'Lightweight cleanse and protect steps suited to oilier-looking skin.',
    image: '/home/concerns/enlarged-pores-excess-oil.jpg',
    productSlugs: [
      PRODUCT_SLUGS.facewash,
      PRODUCT_SLUGS.sunscreen,
      PRODUCT_SLUGS.serum,
      COMBO_SLUGS.fwCreamSs,
    ],
  },
];

export const MEGA_MENUS = {
  shop: {
    label: 'SHOP',
    to: '/shop',
    links: [
      { label: 'Shop All', to: '/shop' },
      { label: 'Individual Products', to: '/shop?filter=individual' },
      { label: 'Combos', to: '/shop?filter=combos' },
      { label: 'Shop by Concern', to: '/shop-by-concern' },
    ],
    cards: [],
  },
  new: {
    label: 'NEW',
    to: '/new',
    links: [{ label: 'View All New', to: '/new' }],
    cards: [
      {
        label: 'Sunscreen',
        to: `/shop/${PRODUCT_SLUGS.sunscreen}`,
        image: '/products/sunscreen/1.jpg',
      },
      {
        label: 'Serum',
        to: `/shop/${PRODUCT_SLUGS.serum}`,
        image: '/products/serum/1.jpg',
      },
    ],
  },
  bestSellers: {
    label: 'BEST SELLERS',
    to: '/best-sellers',
    links: [{ label: 'View All Best Sellers', to: '/best-sellers' }],
    cards: [
      {
        label: 'Face Wash',
        to: `/shop/${PRODUCT_SLUGS.facewash}`,
        image: '/products/facewash/1.jpg',
      },
      {
        label: 'Blemish Cream',
        to: `/shop/${PRODUCT_SLUGS.repairCream}`,
        image: '/products/repair-cream/1.jpg',
      },
      {
        label: 'Facewash + Cream + Sunscreen',
        to: `/shop/${COMBO_SLUGS.fwCreamSs}`,
        image: '/products/combos/facewash-blemish-cream-sunscreen-combo-creative.jpg',
      },
    ],
  },
  limitedPicks: {
    label: 'LIMITED PICKS',
    to: '/limited-picks',
    links: [{ label: 'View All Limited Picks', to: '/limited-picks' }],
    cards: [
      {
        label: 'Face Wash + Serum + Moisturizer',
        to: `/shop/${COMBO_SLUGS.fwSerumMoist}`,
        image: '/products/combos/face-wash-serum-moisturizer-combo-creative.jpg',
      },
      {
        label: 'Complete Daily Routine',
        to: `/shop/${COMBO_SLUGS.complete}`,
        image: '/products/combos/complete-routine-combo-creative.jpg',
      },
    ],
  },
};
