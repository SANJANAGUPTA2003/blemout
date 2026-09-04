/** Product image paths — synced with public/products/ numbered 1–6 assets (repair cream includes 7). */

import { PRODUCT_SLUGS } from './storefrontConfig';

function numbered(base) {
  return [1, 2, 3, 4, 5, 6].map((n) => `${base}/${n}.jpg`);
}

export const FACEWASH_IMAGES = {
  primary: '/products/facewash/1.jpg',
  hover: '/products/facewash/2.jpg',
  gallery: numbered('/products/facewash'),
};

export const SERUM_IMAGES = numbered('/products/serum');
export const REPAIR_CREAM_IMAGES = [
  ...numbered('/products/repair-cream'),
  '/products/repair-cream/7.jpg',
];
export const MOISTURIZER_IMAGES = numbered('/products/moisturizer');
export const SUNSCREEN_IMAGES = numbered('/products/sunscreen');

const GALLERY_BY_SLUG = {
  [PRODUCT_SLUGS.facewash]: FACEWASH_IMAGES.gallery,
  [PRODUCT_SLUGS.serum]: SERUM_IMAGES,
  [PRODUCT_SLUGS.repairCream]: REPAIR_CREAM_IMAGES,
  [PRODUCT_SLUGS.moisturizer]: MOISTURIZER_IMAGES,
  [PRODUCT_SLUGS.sunscreen]: SUNSCREEN_IMAGES,
};

export function getProductImages(product) {
  if (product?.isCombo || product?.category === 'Combo') {
    return (product?.images || []).filter(Boolean);
  }
  if (product?.slug && GALLERY_BY_SLUG[product.slug]) {
    return GALLERY_BY_SLUG[product.slug];
  }
  if (product?.images?.length) return product.images.filter(Boolean);
  if (product?.imageUrl) return [product.imageUrl];
  return [];
}

/** Shop / PDP default: image 1 */
export function getMainImage(product) {
  const images = getProductImages(product);
  return product?.imageUrl || images[0] || '';
}

/** Promo surfaces (Home, About, Concern, editorial): prefer image 2 */
export function getPromoImage(product) {
  const images = getProductImages(product);
  if (images[1]) return images[1];
  if (product?.hoverImage) return product.hoverImage;
  return getMainImage(product);
}

export function getHoverImage(product) {
  if (product?.hoverImage && product.hoverImage !== product.imageUrl) {
    return product.hoverImage;
  }
  const images = getProductImages(product);
  const primary = product?.imageUrl || images[0];
  return images[1] && images[1] !== primary ? images[1] : '';
}

function variant(src, role) {
  if (!src || src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return '';
  }
  if (!/\.(jpe?g|png)$/i.test(src)) return '';
  return src.replace(/\.(jpe?g|png)$/i, `-${role}.webp`);
}

export function getResponsiveImage(src, role = 'card') {
  if (!src) return { src: '', webpSrc: '', srcSet: '' };

  const thumb = variant(src, 'thumb');
  const card = variant(src, 'card');
  const main = variant(src, 'main');

  if (!card) return { src, webpSrc: '', srcSet: '' };

  if (role === 'thumb') {
    return { src, webpSrc: thumb || card, srcSet: `${thumb || card} 160w` };
  }

  if (role === 'hero' || role === 'banner') {
    return {
      src,
      webpSrc: main || card,
      srcSet: `${card} 720w, ${main} 1200w`,
    };
  }

  return {
    src,
    webpSrc: role === 'main' ? main : card,
    srcSet: `${card} 720w, ${main} 1200w`,
  };
}

export function getOptimizedSrc(src, role = 'card') {
  const image = getResponsiveImage(src, role);
  return image.webpSrc || image.src || src || '';
}

export function getCardImage(product) {
  return getMainImage(product);
}

export function getPdpMainImage(product, index = 0) {
  return getProductImages(product)[index] || getMainImage(product);
}

export function getThumbnailImage(product, index = 0) {
  return getProductImages(product)[index] || getMainImage(product);
}

export function productPath(product) {
  if (!product) return '/shop';
  return `/shop/${product.slug || product._id}`;
}

/** Normalize API product content fields for safe UI rendering */
export function normalizeProductContent(product = {}) {
  const toList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim()) {
      return value.split(/\n|;/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  return {
    ...product,
    summary: product.summary || product.description || '',
    description: product.description || product.summary || '',
    benefits: toList(product.benefits),
    ingredients: product.ingredients || '',
    howToUse: product.howToUse || '',
    precautions: product.precautions || '',
    ingredientHighlights: Array.isArray(product.ingredientHighlights)
      ? product.ingredientHighlights
      : [],
    faqs: Array.isArray(product.faqs) ? product.faqs : [],
    images: getProductImages(product),
  };
}
