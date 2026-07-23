import { calcDiscountPercent, getSellingPrice } from './business';
import {
  BADGE_BY_SLUG,
  getComboCardImage,
  getComboGallery,
  getComboHoverImage,
} from './storefrontConfig';
import { getHoverImage, getMainImage, getProductImages } from './productImages';

export function normalizePricing(product = {}) {
  const sellingPrice = getSellingPrice(product);
  const mrp =
    product.mrp && product.mrp > sellingPrice
      ? product.mrp
      : product.originalPrice && product.originalPrice > sellingPrice
        ? product.originalPrice
        : null;
  const discount =
    product.discountPercentage > 0
      ? product.discountPercentage
      : product.discount > 0
        ? product.discount
        : calcDiscountPercent(mrp, sellingPrice);
  return { sellingPrice, mrp, discount };
}

export function getProductBadge(product) {
  if (!product) return '';
  if (BADGE_BY_SLUG[product.slug]) return BADGE_BY_SLUG[product.slug];
  if (product.isNewArrival) return 'New';
  if (product.isLimitedPick || product.isCombo) return 'Limited Pick';
  if (product.isBestSeller) return 'Best Seller';
  return '';
}

export function getListingImage(product) {
  if (!product) return '';
  if (product.isCombo || product.category === 'Combo') {
    return getComboCardImage(product.slug) || getMainImage(product);
  }
  return getMainImage(product);
}

export function getListingHoverImage(product) {
  if (!product) return '';
  if (product.isCombo || product.category === 'Combo') {
    return getComboHoverImage(product.slug) || '';
  }
  return getHoverImage(product);
}

export function getDetailGallery(product) {
  if (!product) return [];
  if (product.isCombo || product.category === 'Combo') {
    const mapped = getComboGallery(product.slug);
    if (mapped.length) return mapped;
  }
  const images = getProductImages(product);
  return images.length ? images : [product.imageUrl].filter(Boolean);
}

export function getBenefitLine(product) {
  if (!product) return '';
  return product.summary || product.shortDescription || product.benefits?.[0] || '';
}

export function resolveBySlugs(allProducts, slugs) {
  const map = new Map((allProducts || []).map((p) => [p.slug, p]));
  return slugs.map((slug) => map.get(slug)).filter(Boolean);
}
