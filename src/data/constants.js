export const trustItems = [
  'Dermatologically Tested',
  'Safe for Sensitive Skin',
  'Targeted for Pigmented Areas',
  'Clean & Effective Ingredients',
  'Cruelty Free & Vegan',
];

export const concerns = [
  {
    id: 'dark-neck',
    name: 'Dark Neck',
    description: 'Gentle formulas to even tone on the neck area.',
  },
  {
    id: 'underarms',
    name: 'Underarms',
    description: 'Targeted care for underarm pigmentation.',
  },
  {
    id: 'elbows-knees',
    name: 'Elbows & Knees',
    description: 'Nourishing solutions for rough, dark patches.',
  },
  {
    id: 'pigmentation',
    name: 'Pigmentation',
    description: 'Brightening actives for uneven skin tone.',
  },
];

export const combos = [
  {
    id: 'serum-sunscreen',
    name: 'Serum + Sunscreen',
    description: 'Treat and protect your skin daily.',
    price: 1299,
    products: ['Niacinamide Brightening Serum', 'SPF 50 PA+++ Sunscreen'],
  },
  {
    id: 'moisturizer-sunscreen',
    name: 'Moisturizer + Sunscreen',
    description: 'Hydrate while shielding from UV damage.',
    price: 1199,
    products: ['Pigment Care Moisturizer', 'SPF 50 PA+++ Sunscreen'],
  },
  {
    id: 'facewash-serum',
    name: 'Face Wash + Serum',
    description: 'Cleanse and treat blemish-prone areas.',
    price: 999,
    products: ['Gentle Blemish Face Wash', 'Niacinamide Brightening Serum'],
  },
  {
    id: 'complete-routine',
    name: 'Complete Blemish Routine',
    description: 'Full 4-step routine for visible results.',
    price: 2499,
    products: ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen'],
  },
];

export const ingredients = [
  {
    name: 'Niacinamide',
    benefit: 'Reduces blemishes and evens skin tone while strengthening the skin barrier.',
  },
  {
    name: 'Alpha Arbutin',
    benefit: 'Targets hyperpigmentation and dark spots for a brighter complexion.',
  },
  {
    name: 'Kojic Acid',
    benefit: 'Inhibits melanin production to fade stubborn pigmentation.',
  },
  {
    name: 'Vitamin C',
    benefit: 'Antioxidant protection that brightens and revitalizes dull skin.',
  },
];

export const reviews = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Noticed visible improvement on my neck area within 4 weeks. The serum feels lightweight and absorbs quickly.',
  },
  {
    name: 'Ananya Reddy',
    location: 'Hyderabad',
    rating: 5,
    text: 'Finally found products that work on my underarms without irritation. Love the clean, premium packaging.',
  },
  {
    name: 'Meera Patel',
    location: 'Ahmedabad',
    rating: 4,
    text: 'The complete routine combo is worth every rupee. My elbow pigmentation has faded significantly.',
  },
  {
    name: 'Kavya Nair',
    location: 'Bangalore',
    rating: 5,
    text: 'Gentle on sensitive skin and actually delivers results. BLEMOUT has become my go-to brand.',
  },
];

export const faqs = [
  {
    question: 'How long before I see results?',
    answer: 'Most customers notice visible improvement within 4–6 weeks of consistent use. Results vary based on skin type and concern severity.',
  },
  {
    question: 'Are BLEMOUT products safe for sensitive skin?',
    answer: 'Yes. All formulas are dermatologically tested and free from harsh irritants. We recommend patch testing before full application.',
  },
  {
    question: 'Can I use these products on my face and body?',
    answer: 'Our products are designed for targeted areas including neck, underarms, elbows, knees, and other pigmented zones. Avoid contact with eyes.',
  },
  {
    question: 'What is your shipping policy?',
    answer: 'Orders are processed within 1–3 business days and usually arrive within 7–15 business days. Shipping is free when you purchase 3 or more products.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Use the Track Order page with your secure Order ID (e.g., BLM-A7K9Q2) and the phone number used at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Eligible unused, unopened products with the original seal intact can be returned within 7 days of delivery. Report damaged or incorrect orders within 48 hours.',
  },
];

export const categories = [
  'All',
  'Face Wash',
  'Serum',
  'Moisturizer',
  'Sunscreen',
  'Blemishes Repair Cream',
  'Combo',
];

export const orderStatuses = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export const routineSuggestions = {
  'dark-neck': ['BLEMOUT Skin Glow & Age Defying Facewash', 'BLEMOUT Advanced Blemishes Repair Serum – 30ml', 'BLEMOUT Hydra Glow Water Crème'],
  underarms: ['BLEMOUT Skin Glow & Age Defying Facewash', 'BLEMOUT Blemishes Repair Cream', 'BLEMOUT Hydra Glow Water Crème'],
  'elbows-knees': ['BLEMOUT Skin Glow & Age Defying Facewash', 'BLEMOUT Blemishes Repair Cream', 'BLEMOUT Hydra Glow Water Crème'],
  pigmentation: ['BLEMOUT Advanced Blemishes Repair Serum – 30ml', 'BLEMOUT Blemishes Repair Cream', 'BLEMOUT Enviro Shield Sunscreen'],
};
