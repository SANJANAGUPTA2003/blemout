/**
 * Idempotent upsert for the three approved missing combo products only.
 * Does not modify singles or existing combos.
 * Run: node scripts/upsert-missing-combos.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const FW = '/products/facewash';
const SR = '/products/serum';
const MO = '/products/moisturizer';
const SS = '/products/sunscreen';
const RC = '/products/repair-cream';
const C = '/products/combos';

const NAMES = {
  fw: 'BLEMOUT Skin Glow & Age Defying Facewash',
  sr: 'BLEMOUT Advanced Blemishes Repair Serum – 30ml',
  mo: 'BLEMOUT Hydra Glow Water Crème',
  ss: 'BLEMOUT Enviro Shield Sunscreen',
  rc: 'BLEMOUT Blemishes Repair Cream',
};

function gallery(creative, white, productBases) {
  const images = [creative, white];
  for (const base of productBases) {
    images.push(`${base}/1.jpg`, `${base}/6.jpg`);
  }
  return images;
}

const combos = [
  {
    name: 'Face Wash + Serum + Moisturizer Combo',
    slug: 'face-wash-serum-moisturizer-combo',
    mrp: 1587,
    sellingPrice: 1327,
    price: 1327,
    discountPercentage: 12,
    stock: 50,
    size: 'Bundle',
    category: 'Combo',
    isCombo: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isLimitedPick: true,
    includedProducts: [NAMES.fw, NAMES.sr, NAMES.mo],
    comboItems: [NAMES.fw, NAMES.sr, NAMES.mo],
    summary: 'Cleanse, treat and hydrate — a three-step daily glow set.',
    description: 'Cleanse, treat and hydrate — a three-step daily glow set.',
    benefits: [
      'Core 3-step ritual',
      'Bundle vs buying separately',
      'Ideal everyday starter set',
    ],
    ingredients: 'See individual included products.',
    howToUse: 'Cleanse → Serum → Moisturizer. Add sunscreen in the morning.',
    precautions:
      'Follow usage guidance for each included product. Patch test new formulas before first use.',
    ingredientHighlights: [],
    faqs: [],
    skinType: '',
    imageUrl: `${C}/face-wash-serum-moisturizer-combo-white.jpg`,
    hoverImage: `${C}/face-wash-serum-moisturizer-combo-creative.jpg`,
    images: gallery(
      `${C}/face-wash-serum-moisturizer-combo-creative.jpg`,
      `${C}/face-wash-serum-moisturizer-combo-white.jpg`,
      [FW, SR, MO]
    ),
  },
  {
    name: 'Face Wash + Serum + Moisturizer + Sunscreen Combo',
    slug: 'face-wash-serum-moisturizer-sunscreen-combo',
    mrp: 2146,
    sellingPrice: 1774,
    price: 1774,
    discountPercentage: 13,
    stock: 50,
    size: 'Bundle',
    category: 'Combo',
    isCombo: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isLimitedPick: true,
    includedProducts: [NAMES.fw, NAMES.sr, NAMES.mo, NAMES.ss],
    comboItems: [NAMES.fw, NAMES.sr, NAMES.mo, NAMES.ss],
    summary: 'Four-step daily routine: cleanse, treat, hydrate and protect.',
    description: 'Four-step daily routine: cleanse, treat, hydrate and protect.',
    benefits: [
      'Day-ready 4-step routine',
      'Bundle savings',
      'Cleanse through SPF',
    ],
    ingredients: 'See individual included products.',
    howToUse: 'Cleanse → Serum → Moisturizer → Sunscreen (AM).',
    precautions:
      'Follow usage guidance for each included product. Patch test new formulas before first use.',
    ingredientHighlights: [],
    faqs: [],
    skinType: '',
    imageUrl: `${C}/face-wash-serum-moisturizer-sunscreen-combo-white.jpg`,
    hoverImage: `${C}/face-wash-serum-moisturizer-sunscreen-combo-creative.jpg`,
    images: gallery(
      `${C}/face-wash-serum-moisturizer-sunscreen-combo-creative.jpg`,
      `${C}/face-wash-serum-moisturizer-sunscreen-combo-white.jpg`,
      [FW, SR, MO, SS]
    ),
  },
  {
    name: 'Blemish Cream + Sunscreen + Moisturizer Combo',
    slug: 'blemish-cream-sunscreen-moisturizer-combo',
    mrp: 1507,
    sellingPrice: 1260,
    price: 1260,
    discountPercentage: 12,
    stock: 50,
    size: 'Bundle',
    category: 'Combo',
    isCombo: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isLimitedPick: true,
    includedProducts: [NAMES.rc, NAMES.ss, NAMES.mo],
    comboItems: [NAMES.rc, NAMES.ss, NAMES.mo],
    summary: 'Repair, hydrate and protect pigment-prone areas.',
    description: 'Repair, hydrate and protect pigment-prone areas.',
    benefits: [
      'Treat + hydrate + protect',
      'Bundle savings',
      'Day and night friendly',
    ],
    ingredients: 'See individual included products.',
    howToUse:
      'Apply moisturizer and repair cream as needed, then sunscreen on exposed skin each morning.',
    precautions:
      'Follow usage guidance for each included product. Patch test new formulas before first use.',
    ingredientHighlights: [],
    faqs: [],
    skinType: '',
    imageUrl: `${C}/blemish-cream-sunscreen-moisturizer-combo-white.jpg`,
    hoverImage: `${C}/blemish-cream-sunscreen-moisturizer-combo-creative.jpg`,
    images: gallery(
      `${C}/blemish-cream-sunscreen-moisturizer-combo-creative.jpg`,
      `${C}/blemish-cream-sunscreen-moisturizer-combo-white.jpg`,
      [RC, SS, MO]
    ),
  },
];

async function upsertCombo(data) {
  const existing = await Product.findOne({ slug: data.slug });
  if (existing) {
    if (!existing.isCombo) {
      throw new Error(`Slug ${data.slug} exists but is not a combo — aborting`);
    }
    Object.assign(existing, data);
    await existing.save();
    return { action: 'updated', doc: existing };
  }

  // Extra safety: avoid duplicate by exact included-product set name match
  const byName = await Product.findOne({ name: data.name, isCombo: true });
  if (byName) {
    Object.assign(byName, data);
    await byName.save();
    return { action: 'updated-by-name', doc: byName };
  }

  const doc = await Product.create(data);
  return { action: 'created', doc };
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  await mongoose.connect(uri);
  console.log('Connected');

  const results = [];
  for (const combo of combos) {
    const { action, doc } = await upsertCombo(combo);
    results.push({
      action,
      id: String(doc._id),
      slug: doc.slug,
      price: doc.sellingPrice || doc.price,
      mrp: doc.mrp,
      stock: doc.stock,
      imageUrl: doc.imageUrl,
      hoverImage: doc.hoverImage,
      galleryCount: (doc.images || []).length,
      isNewArrival: doc.isNewArrival,
      isLimitedPick: doc.isLimitedPick,
      isBestSeller: doc.isBestSeller,
    });
    console.log(action.toUpperCase(), doc.slug, doc._id.toString());
  }

  const total = await Product.countDocuments();
  const comboCount = await Product.countDocuments({ isCombo: true });
  console.log(JSON.stringify({ total, comboCount, results }, null, 2));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
