export const BUSINESS = {
  name: 'BLEMOUT',
  foundedYear: 2023,
  email: 'glowways2026@gmail.com',
  addressLines: [
    '#166 B, HUDA R-2,',
    'Cheeka,',
    'District Kaithal,',
    'Haryana - 136034,',
    'India',
  ],
  address: '#166 B, HUDA R-2, Cheeka, District Kaithal, Haryana - 136034, India',
};

export const FREE_SHIPPING_MIN_PRODUCTS = 3;
export const STANDARD_SHIPPING_CHARGE = 49;

export function getShippingCharge(items = []) {
  const productCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  return productCount >= FREE_SHIPPING_MIN_PRODUCTS ? 0 : STANDARD_SHIPPING_CHARGE;
}

export function calcDiscountPercent(mrp, sellingPrice) {
  if (!mrp || !sellingPrice || mrp <= sellingPrice) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

export function getSellingPrice(product) {
  if (!product) return 0;
  return Number(product.sellingPrice ?? product.price ?? 0);
}
