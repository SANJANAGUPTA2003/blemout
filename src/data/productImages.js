/** Product image paths — synced with public/products/ assets */
export const FACEWASH_IMAGES = {
  primary: '/products/facewash/tube.jpg',
  hero: '/products/facewash/hero-lifestyle.jpg',
  gallery: [
    '/products/facewash/tube.jpg',
    '/products/facewash/box-tube.jpg',
    '/products/facewash/application.jpg',
    '/products/facewash/how-to-use.jpg',
    '/products/facewash/backside.jpg',
    '/products/facewash/hero-lifestyle.jpg',
  ],
};

export const REPAIR_CREAM_IMAGES = [
  '/products/repair-cream/tube.jpg',
  '/products/repair-cream/box.jpg',
  '/products/repair-cream/application.jpg',
  '/products/repair-cream/back.jpg',
  '/products/repair-cream/texture.jpg',
  '/products/repair-cream/lifestyle.jpg',
];

export const MOISTURIZER_IMAGES = [
  '/products/moisturizer/jar.jpg',
  '/products/moisturizer/box.jpg',
  '/products/moisturizer/texture.jpg',
  '/products/moisturizer/back.jpg',
  '/products/moisturizer/application.jpg',
  '/products/moisturizer/lifestyle.jpg',
];

export const SUNSCREEN_IMAGES = [
  '/products/sunscreen/tube.jpg',
  '/products/sunscreen/box.jpg',
  '/products/sunscreen/application.jpg',
  '/products/sunscreen/back.jpg',
  '/products/sunscreen/texture.jpg',
  '/products/sunscreen/lifestyle.jpg',
];

export const SERUM_PLACEHOLDER = '/products/serum/placeholder.jpg';

export function getProductImages(product) {
  if (product?.images?.length) return product.images;
  if (product?.category === 'Face Wash') return FACEWASH_IMAGES.gallery;
  if (product?.category === 'Blemishes Repair Cream' || product?.category === 'Repair Cream') {
    return REPAIR_CREAM_IMAGES;
  }
  if (product?.category === 'Moisturizer') return MOISTURIZER_IMAGES;
  if (product?.category === 'Sunscreen') return SUNSCREEN_IMAGES;
  if (product?.category === 'Serum') return [SERUM_PLACEHOLDER];
  if (product?.imageUrl) return [product.imageUrl];
  return [];
}
