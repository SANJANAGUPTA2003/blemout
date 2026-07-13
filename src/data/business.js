export const BUSINESS = {
  email: 'glowways2026@gmail.com',
  addressLines: [
    '#166 B, HUDA R-2,',
    'Cheeka (Kaithal),',
    'District Kaithal,',
    'Haryana - 136034',
  ],
  address: '#166 B, HUDA R-2, Cheeka (Kaithal), District Kaithal, Haryana - 136034',
};

export function calcDiscountPercent(mrp, sellingPrice) {
  if (!mrp || !sellingPrice || mrp <= sellingPrice) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

export function getSellingPrice(product) {
  if (!product) return 0;
  return Number(product.sellingPrice ?? product.price ?? 0);
}
