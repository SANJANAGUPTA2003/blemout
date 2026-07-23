/**
 * Homepage-only display configuration.
 * Does not modify MongoDB or backend product records.
 * Product content/pricing is resolved from existing ProductContext data by slug.
 */

export const HOMEPAGE_ANNOUNCEMENTS = [
  'FREE SHIPPING ON SELECTED ORDERS',
  'STEROID-FREE FORMULATIONS',
  'SECURE PAYMENTS',
  'CASH ON DELIVERY AVAILABLE',
  'SKINCARE MADE FOR EVERYDAY CONCERNS',
];

export const HOMEPAGE_HERO_SLIDES = [
  {
    id: 'hero-landing',
    image: '/hero/blemout-landing-hero.png',
    alt: 'BLEMOUT Advanced Sun Defence everyday — SPF 50+ moisturiser radiance',
    to: '/shop/blemout-enviro-shield-sunscreen',
    fit: 'contain',
    position: 'center',
  },
];

/** Exactly five Best Sellers entries for the homepage. */
export const HOMEPAGE_BEST_SELLERS = [
  {
    key: 'fw-serum-moist-combo',
    mode: 'slug',
    slug: 'face-wash-serum-moisturizer-combo',
    displayName: 'Face Wash + Serum + Moisturizer Combo',
    image: '/products/combos/face-wash-serum-moisturizer-combo-white.jpg',
    hoverImage: '/products/combos/face-wash-serum-moisturizer-combo-creative.jpg',
    badge: 'MOST LOVED',
    benefit: 'Cleanse, treat and hydrate in one curated set.',
  },
  {
    key: 'fw-cream-ss-combo',
    mode: 'slug',
    slug: 'repair-protect-cleanse-trio',
    displayName: 'Face Wash + Blemish Cream + Sunscreen Combo',
    image: '/products/combos/facewash-blemish-cream-sunscreen-combo-white.jpg',
    hoverImage: '/products/combos/facewash-blemish-cream-sunscreen-combo-creative.jpg',
    badge: 'BEST SELLER',
    benefit: 'Cleanse, repair and protect in three focused steps.',
  },
  {
    key: 'facewash',
    mode: 'slug',
    slug: 'blemout-skin-glow-age-defying-facewash',
    badge: 'TOP RATED',
    benefit: 'Deep-cleansing brightening care for everyday glow.',
  },
  {
    key: 'sunscreen',
    mode: 'slug',
    slug: 'blemout-enviro-shield-sunscreen',
    badge: 'TRENDING',
    benefit: 'Lightweight SPF 50+ PA++++ with no white cast.',
  },
  {
    key: 'moisturizer',
    mode: 'slug',
    slug: 'blemout-hydra-glow-water-creme',
    badge: 'MOST REORDERED',
    benefit: 'Water-based moisture for lasting barrier comfort.',
  },
];

export const HOMEPAGE_CONCERNS = [
  {
    id: 'blemishes-acne',
    name: 'Blemishes & Acne',
    image: '/home/concerns/blemishes-acne.jpg',
    to: '/shop/blemout-skin-glow-age-defying-facewash',
  },
  {
    id: 'dark-spots-pigmentation',
    name: 'Dark Spots & Pigmentation',
    image: '/home/concerns/dark-spots-pigmentation.jpg',
    to: '/shop/blemout-blemishes-repair-cream',
  },
  {
    id: 'dryness-dehydration',
    name: 'Dryness & Dehydration',
    image: '/home/concerns/dryness-dehydration.webp',
    to: '/shop/blemout-hydra-glow-water-creme',
  },
  {
    id: 'dullness-uneven-tone',
    name: 'Dullness & Uneven Skin Tone',
    image: '/home/concerns/dullness-uneven-tone.webp',
    to: '/shop/blemout-advanced-blemishes-repair-serum-30ml',
  },
  {
    id: 'enlarged-pores-excess-oil',
    name: 'Enlarged Pores & Excess Oil',
    image: '/home/concerns/enlarged-pores-excess-oil.jpg',
    to: '/shop/blemout-skin-glow-age-defying-facewash',
  },
];

export const HOMEPAGE_EDITORIAL = [
  {
    slug: 'blemout-skin-glow-age-defying-facewash',
    promotionalImage: '/home/product-details/facewash-feature.jpg',
    imagePosition: 'left',
    eyebrow: 'Cleanse',
  },
  {
    slug: 'blemout-blemishes-repair-cream',
    promotionalImage: '/home/product-details/repair-cream-feature.jpg',
    imagePosition: 'right',
    eyebrow: 'Repair',
  },
  {
    slug: 'blemout-advanced-blemishes-repair-serum-30ml',
    promotionalImage: '/home/product-details/serum-feature.jpg',
    imagePosition: 'left',
    eyebrow: 'Treat',
  },
];

export const HOMEPAGE_EXPLORE_SLUGS = [
  'blemout-skin-glow-age-defying-facewash',
  'blemout-advanced-blemishes-repair-serum-30ml',
  'blemout-hydra-glow-water-creme',
  'blemout-enviro-shield-sunscreen',
  'blemout-blemishes-repair-cream',
];

// Placeholder testimonials – replace with client-approved customer reviews before production launch.
export const HOMEPAGE_TESTIMONIALS = [
  {
    id: 1,
    name: 'Ananya',
    concern: 'Uneven tone',
    rating: 5,
    text: 'My routine feels simpler and my skin looks calmer after a few weeks of consistent use.',
  },
  {
    id: 2,
    name: 'Riya',
    concern: 'Blemish-prone skin',
    rating: 5,
    text: 'The face wash and cream combo fits my day-to-day care without feeling heavy.',
  },
  {
    id: 3,
    name: 'Meera',
    concern: 'Dullness',
    rating: 5,
    text: 'I like how lightweight everything feels. The sunscreen is easy to wear under makeup.',
  },
  {
    id: 4,
    name: 'Kavya',
    concern: 'Dark spots',
    rating: 5,
    text: 'Still early days, but the repair cream has become the step I never skip at night.',
  },
  {
    id: 5,
    name: 'Ishita',
    concern: 'Dehydration',
    rating: 5,
    text: 'The moisturizer layers well and keeps my skin comfortable through long workdays.',
  },
  {
    id: 6,
    name: 'Sneha',
    concern: 'Everyday glow',
    rating: 5,
    text: 'Clean packaging, clear steps, and products that feel thoughtful for Indian weather.',
  },
];
