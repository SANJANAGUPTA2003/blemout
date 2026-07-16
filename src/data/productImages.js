/** Product image paths — synced with public/products/ numbered 1–6 assets */

function numbered(base) {
  return [1, 2, 3, 4, 5, 6].map((n) => `${base}/${n}.jpg`);
}

export const FACEWASH_IMAGES = {
  primary: '/products/facewash/1.jpg',
  hover: '/products/facewash/2.jpg',
  gallery: numbered('/products/facewash'),
};

export const SERUM_IMAGES = numbered('/products/serum');
export const REPAIR_CREAM_IMAGES = numbered('/products/repair-cream');
export const MOISTURIZER_IMAGES = numbered('/products/moisturizer');
export const SUNSCREEN_IMAGES = numbered('/products/sunscreen');

export function getProductImages(product) {
  if (product?.images?.length) return product.images.filter(Boolean);
  if (product?.category === 'Face Wash') return FACEWASH_IMAGES.gallery;
  if (product?.category === 'Blemishes Repair Cream' || product?.category === 'Repair Cream') {
    return REPAIR_CREAM_IMAGES;
  }
  if (product?.category === 'Moisturizer') return MOISTURIZER_IMAGES;
  if (product?.category === 'Sunscreen') return SUNSCREEN_IMAGES;
  if (product?.category === 'Serum') return SERUM_IMAGES;
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

function derivative(src, role) {
  if (!/^\/products\/.+\/\d+\.jpg$/i.test(src || '')) return '';
  return src.replace(/\.jpg$/i, `-${role}.webp`);
}

export function getResponsiveImage(src, role = 'card') {
  if (!src) return { src: '', webpSrc: '', srcSet: '' };
  if (!derivative(src, role)) return { src, webpSrc: '', srcSet: '' };

  if (role === 'thumb') {
    const webpSrc = derivative(src, 'thumb');
    return { src, webpSrc, srcSet: `${webpSrc} 160w` };
  }

  const card = derivative(src, 'card');
  const main = derivative(src, 'main');
  return {
    src,
    webpSrc: role === 'main' ? main : card,
    srcSet: `${card} 640w, ${main} 1200w`,
  };
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
