import {
  COMBO_SLUGS,
  PRODUCT_SLUGS,
} from './storefrontConfig';

/** Three combos shown on every individual-product PDP. */
export const FEATURED_RECOMMEND_COMBOS = [
  COMBO_SLUGS.fwSerumMoist,
  COMBO_SLUGS.fwCreamSs,
  COMBO_SLUGS.complete,
];

/**
 * Contextual individual recommendations by product slug.
 * Face Wash → Moisturizer, Sunscreen, Serum, etc.
 */
export const RELATED_SINGLES_BY_SLUG = {
  [PRODUCT_SLUGS.facewash]: [
    PRODUCT_SLUGS.moisturizer,
    PRODUCT_SLUGS.sunscreen,
    PRODUCT_SLUGS.serum,
  ],
  [PRODUCT_SLUGS.sunscreen]: [PRODUCT_SLUGS.moisturizer, PRODUCT_SLUGS.serum],
  [PRODUCT_SLUGS.serum]: [PRODUCT_SLUGS.facewash, PRODUCT_SLUGS.moisturizer],
  [PRODUCT_SLUGS.moisturizer]: [PRODUCT_SLUGS.serum, PRODUCT_SLUGS.sunscreen],
  [PRODUCT_SLUGS.repairCream]: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.sunscreen,
  ],
};

function bySlugMap(products) {
  const map = new Map();
  for (const p of products || []) {
    if (p?.slug) map.set(p.slug, p);
  }
  return map;
}

function resolveSlugs(map, slugs, excludeId) {
  const out = [];
  const seen = new Set();
  for (const slug of slugs) {
    const p = map.get(slug);
    if (!p) continue;
    const id = String(p._id || p.slug);
    if (excludeId && id === String(excludeId)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

/**
 * Build ordered recommendation list for a PDP.
 * - Individual: 3 fixed combos, then contextual singles
 * - Combo: relevant individuals only (never the current combo)
 */
export function getRecommendedProducts(product, allProducts) {
  if (!product) return [];
  const map = bySlugMap(allProducts);
  const excludeId = product._id || product.slug;
  const isCombo = Boolean(product.isCombo || product.category === 'Combo');

  if (isCombo) {
    const included =
      COMBO_MEDIA_INCLUDED[product.slug] ||
      RELATED_SINGLES_BY_SLUG[PRODUCT_SLUGS.facewash];
    const singlesOnly = [
      ...resolveSlugs(map, included || [], excludeId),
      ...resolveSlugs(
        map,
        [
          PRODUCT_SLUGS.facewash,
          PRODUCT_SLUGS.serum,
          PRODUCT_SLUGS.moisturizer,
          PRODUCT_SLUGS.sunscreen,
          PRODUCT_SLUGS.repairCream,
        ],
        excludeId
      ),
    ];
    const seen = new Set();
    return singlesOnly.filter((p) => {
      const id = String(p._id || p.slug);
      if (seen.has(id)) return false;
      if (p.isCombo || p.category === 'Combo') return false;
      seen.add(id);
      return true;
    });
  }

  const combos = resolveSlugs(map, FEATURED_RECOMMEND_COMBOS, excludeId);
  const relatedSlugs =
    RELATED_SINGLES_BY_SLUG[product.slug] || [
      PRODUCT_SLUGS.moisturizer,
      PRODUCT_SLUGS.serum,
      PRODUCT_SLUGS.sunscreen,
    ];
  const related = resolveSlugs(map, relatedSlugs, excludeId);
  return [...combos, ...related];
}

/** Included product slugs for each combo (for combo PDP recommendations). */
const COMBO_MEDIA_INCLUDED = {
  [COMBO_SLUGS.fwSerumMoist]: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.moisturizer,
  ],
  [COMBO_SLUGS.fwSerumMoistSs]: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.moisturizer,
    PRODUCT_SLUGS.sunscreen,
  ],
  [COMBO_SLUGS.creamSsMoist]: [
    PRODUCT_SLUGS.repairCream,
    PRODUCT_SLUGS.sunscreen,
    PRODUCT_SLUGS.moisturizer,
  ],
  [COMBO_SLUGS.creamSs]: [PRODUCT_SLUGS.repairCream, PRODUCT_SLUGS.sunscreen],
  [COMBO_SLUGS.fwCreamSs]: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.repairCream,
    PRODUCT_SLUGS.sunscreen,
  ],
  [COMBO_SLUGS.complete]: [
    PRODUCT_SLUGS.facewash,
    PRODUCT_SLUGS.serum,
    PRODUCT_SLUGS.moisturizer,
    PRODUCT_SLUGS.sunscreen,
    PRODUCT_SLUGS.repairCream,
  ],
};
