import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';

const FW = '/products/facewash';
const RC = '/products/repair-cream';
const MO = '/products/moisturizer';
const SS = '/products/sunscreen';
const SR = '/products/serum';

function imgs(base) {
  return [1, 2, 3, 4, 5, 6].map((n) => `${base}/${n}.jpg`);
}

function priced(mrp, discountPercentage) {
  const sellingPrice = Math.round(mrp * (1 - discountPercentage / 100));
  return { mrp, sellingPrice, price: sellingPrice, discountPercentage };
}

const singles = [
  {
    name: 'BLEMOUT Skin Glow & Age Defying Facewash',
    slug: 'blemout-skin-glow-age-defying-facewash',
    ...priced(389, 5),
    category: 'Face Wash',
    stock: 120,
    size: '75ml',
    skinType: 'Oily, Normal, Combination',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isLimitedPick: false,
    isCombo: false,
    imageUrl: `${FW}/1.jpg`,
    hoverImage: `${FW}/2.jpg`,
    images: imgs(FW),
    summary:
      'A deep-cleansing brightening face wash for glowing, even-looking skin.',
    description:
      'BLEMOUT Skin Glow & Age Defying Facewash is a deep-cleansing brightening cleanser created to support radiance, clarity, and a smoother-looking complexion. Suitable for Oily, Normal, and Combination skin.',
    benefits: [
      'Helps improve skin radiance and clarity',
      'Balances excess oil',
      'Refines pores',
      'Smooths skin texture',
      'Helps reduce breakouts',
      'Supports hydration and softness',
    ],
    ingredients:
      'Japanese Clair Blanche II; Glutathione; Niacinamide / Vitamin B3; Vitamin C; Salicylic Acid / BHA; Hydrolysed Milk Peptides',
    howToUse:
      'Wet face, apply a small amount, gently massage in circular motions, then rinse thoroughly. Use twice daily for best results.',
    precautions:
      'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children.',
    ingredientHighlights: [
      { name: 'Niacinamide', icon: 'Sparkles', explanation: 'Helps improve the look of uneven skin tone.' },
      { name: 'Vitamin C', icon: 'Sun', explanation: 'Supports brighter-looking skin.' },
      { name: 'Salicylic Acid / BHA', icon: 'Droplet', explanation: 'Helps refine pores and smooth texture.' },
      { name: 'Glutathione', icon: 'Shield', explanation: 'Antioxidant support for clearer-looking skin.' },
    ],
    faqs: [
      {
        question: 'How often should I use the facewash?',
        answer: 'Use morning and night on damp skin, then follow with the rest of your BLEMOUT routine.',
      },
    ],
  },
  {
    name: 'BLEMOUT Advanced Blemishes Repair Serum – 30ml',
    slug: 'blemout-advanced-blemishes-repair-serum-30ml',
    ...priced(699, 5),
    category: 'Serum',
    stock: 80,
    size: '30ml',
    skinType: 'Acne Prone, Oily, Normal, Combination',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isLimitedPick: false,
    isCombo: false,
    imageUrl: `${SR}/1.jpg`,
    hoverImage: `${SR}/2.jpg`,
    images: imgs(SR),
    summary:
      'A targeted serum step designed to support clearer-looking, more even-toned skin.',
    description:
      'BLEMOUT Advanced Blemishes Repair Serum – 30ml is a lightweight treat step formulated to support the look of blemish-prone and uneven skin as part of a daily routine.',
    benefits: [
      'Supports blemish-prone skin',
      'Helps improve the look of uneven tone',
      'Lightweight daily serum texture',
      'Pairs with the full BLEMOUT routine',
    ],
    ingredients: 'See product packaging for the full ingredient list.',
    howToUse:
      'After cleansing, apply a few drops to face and neck. Follow with moisturizer. Use sunscreen during the day.',
    precautions:
      'For external use only. Patch test before first use. Discontinue if irritation occurs.',
    ingredientHighlights: [
      { name: 'Repair Actives', icon: 'FlaskConical', explanation: 'Supports the look of blemish-prone skin.' },
      { name: 'Lightweight Texture', icon: 'Droplet', explanation: 'Absorbs easily in morning or evening routines.' },
      { name: 'Even Tone Support', icon: 'Sparkles', explanation: 'Helps improve the appearance of uneven tone.' },
    ],
    faqs: [
      {
        question: 'When should I apply the serum?',
        answer: 'Apply after cleansing and before moisturizer. Always follow with sunscreen in the morning.',
      },
    ],
  },
  {
    name: 'BLEMOUT Enviro Shield Sunscreen',
    slug: 'blemout-enviro-shield-sunscreen',
    ...priced(559, 5),
    category: 'Sunscreen',
    stock: 110,
    size: '50gm',
    skinType: 'Acne Prone, Oily, Dry, Normal, Combination',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isLimitedPick: false,
    isCombo: false,
    imageUrl: `${SS}/1.jpg`,
    hoverImage: `${SS}/2.jpg`,
    images: imgs(SS),
    summary:
      'Lightweight SPF 50+ PA++++ protection with a no-white-cast finish.',
    description:
      'BLEMOUT Enviro Shield Sunscreen offers broad spectrum SPF 50+ PA++++ protection in an ultra-lightweight texture designed for everyday wear with no white cast.',
    benefits: [
      'SPF 50+ PA++++',
      'No white cast',
      'Broad spectrum protection',
      'Ultra lightweight formula',
      'Brightening antioxidants',
      'Protects against UV-induced ageing',
      'Hydrating care',
      'Water resistant',
      'Non-greasy finish',
    ],
    ingredients:
      'SunCat; Clair Blanche II; Alpha Arbutin; N-Acetyl L-Tyrosine; Scutellaria Extract; Glutathione',
    howToUse:
      'Apply generously to clean, dry skin 15–20 minutes before sun exposure. Reapply every 2 hours and after swimming, sweating, or towel drying.',
    precautions:
      'For external use only. Avoid eye contact. Reapply regularly for continued protection.',
    ingredientHighlights: [
      { name: 'Broad Spectrum Filters', icon: 'Sun', explanation: 'Helps protect skin from UVA and UVB exposure.' },
      { name: 'Alpha Arbutin', icon: 'Sparkles', explanation: 'Supports a brighter, more even-looking complexion.' },
      { name: 'Glutathione', icon: 'Shield', explanation: 'Antioxidant support within the daily shield formula.' },
      { name: 'Clair Blanche II', icon: 'Leaf', explanation: 'Brightening support for everyday wear.' },
    ],
    faqs: [
      {
        question: 'Does it leave a white cast?',
        answer: 'It is formulated for a no-white-cast, lightweight finish suitable for daily use.',
      },
    ],
  },
  {
    name: 'BLEMOUT Hydra Glow Water Crème',
    slug: 'blemout-hydra-glow-water-creme',
    ...priced(499, 5),
    category: 'Moisturizer',
    stock: 100,
    size: '50gm',
    skinType: 'Acne Prone, Oily, Normal, Combination',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isLimitedPick: false,
    isCombo: false,
    imageUrl: `${MO}/1.jpg`,
    hoverImage: `${MO}/2.jpg`,
    images: imgs(MO),
    summary:
      'A refreshing water-based moisturizer for lasting hydration and barrier comfort.',
    description:
      'BLEMOUT Hydra Glow Water Crème is a refreshing water-based moisturizer that hydrates, supports the skin barrier, and helps maintain a brighter complexion.',
    benefits: [
      'Up to 48 hours hydration',
      'Helps lock in moisture',
      'Reduces water loss',
      'Supports long-lasting hydration',
      'Barrier repair',
      'Textured skin support',
      'Brightening',
      'Soothing',
    ],
    ingredients:
      'Aquaxyl; Japanese Clair Blanche II; Glutathione; Alpha Arbutin; Vitamin B5 / Panthenol; Aloe Vera',
    howToUse:
      'Cleanse your face. Massage a small amount onto face and neck. Follow with sunscreen during the day.',
    precautions:
      'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs.',
    ingredientHighlights: [
      { name: 'Aquaxyl', icon: 'Droplet', explanation: 'Helps support lasting hydration and moisture balance.' },
      { name: 'Panthenol', icon: 'Heart', explanation: 'Supports soft, comforted-feeling skin.' },
      { name: 'Aloe Vera', icon: 'Leaf', explanation: 'Adds a soothing, refreshed finish.' },
      { name: 'Alpha Arbutin', icon: 'Sparkles', explanation: 'Supports a brighter-looking complexion.' },
    ],
    faqs: [
      {
        question: 'Can I use this under sunscreen?',
        answer: 'Yes. Apply moisturizer first, then finish with BLEMOUT Enviro Shield Sunscreen in the morning.',
      },
    ],
  },
  {
    name: 'BLEMOUT Blemishes Repair Cream',
    slug: 'blemout-blemishes-repair-cream',
    ...priced(449, 5),
    category: 'Blemishes Repair Cream',
    stock: 90,
    size: '15gm',
    skinType: 'Acne Prone, Oily, Normal, Combination',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isLimitedPick: false,
    isCombo: false,
    imageUrl: `${RC}/1.jpg`,
    hoverImage: `${RC}/2.jpg`,
    images: imgs(RC),
    summary:
      'Targeted cream for dark spots, post-acne marks, uneven tone, and visible redness.',
    description:
      'BLEMOUT Blemishes Repair Cream is a targeted formula for dark spots, post-acne marks, uneven tone, pigmentation, and visible redness.',
    benefits: [
      'Helps reduce dark spots',
      'Targets stubborn pigmentation',
      'Helps even skin tone',
      'Calms visible redness',
      'Gently exfoliates',
      'Supports clearer, brighter skin',
    ],
    ingredients:
      'Tyrostat-09; Tranexamic Acid 5%; Azelaic Acid 5%; Niacinamide 4%; Glycolic Acid 3%; Kojic Acid 2%; Alpha Arbutin 1.5%',
    howToUse:
      'Apply a pea-sized amount to clean, dry skin at night. Gently massage over the face or affected areas using upward circular motions until fully absorbed.',
    precautions:
      'For external use only. Use sunscreen during the day. Avoid contact with eyes. Discontinue if irritation occurs. Not recommended during pregnancy without medical advice.',
    ingredientHighlights: [
      { name: 'Tranexamic Acid', icon: 'Sparkles', explanation: 'Supports the look of uneven tone and stubborn marks.' },
      { name: 'Azelaic Acid', icon: 'Shield', explanation: 'Helps calm the appearance of redness-prone areas.' },
      { name: 'Niacinamide', icon: 'Droplet', explanation: 'Supports clearer-looking skin and barrier comfort.' },
      { name: 'Kojic Acid', icon: 'Leaf', explanation: 'Helps reduce the look of pigmentation.' },
      { name: 'Alpha Arbutin', icon: 'Sun', explanation: 'Supports a brighter, more even appearance.' },
    ],
    faqs: [
      {
        question: 'Should I use sunscreen with this cream?',
        answer: 'Yes. Use sunscreen every morning, especially when including leave-on brightening or exfoliating formulas.',
      },
    ],
  },
];

function comboFrom(parts, fields) {
  const included = singles.filter((p) => parts.includes(p.slug));
  const combinedMrp = included.reduce((sum, p) => sum + p.mrp, 0);
  const combinedSelling = included.reduce((sum, p) => sum + p.sellingPrice, 0);
  const discountPercentage = fields.discountPercentage ?? 12;
  const sellingPrice =
    fields.sellingPrice ?? Math.round(combinedSelling * (1 - discountPercentage / 100));
  const names = included.map((p) => p.name);

  return {
    size: 'Bundle',
    stock: 50,
    category: 'Combo',
    isCombo: true,
    skinType: '',
    ingredients: 'See individual included products.',
    precautions: 'Follow usage guidance for each included product. Patch test new formulas before first use.',
    ingredientHighlights: [],
    faqs: [],
    mrp: fields.mrp ?? combinedMrp,
    sellingPrice,
    price: sellingPrice,
    discountPercentage,
    includedProducts: names,
    comboItems: names,
    imageUrl: fields.imageUrl,
    hoverImage: fields.hoverImage,
    images: fields.images,
    ...fields,
    mrp: fields.mrp ?? combinedMrp,
    sellingPrice,
    price: sellingPrice,
    discountPercentage,
    includedProducts: names,
    comboItems: names,
  };
}

const combos = [
  comboFrom(
    [
      'blemout-skin-glow-age-defying-facewash',
      'blemout-advanced-blemishes-repair-serum-30ml',
      'blemout-hydra-glow-water-creme',
      'blemout-enviro-shield-sunscreen',
      'blemout-blemishes-repair-cream',
    ],
    {
      name: 'Complete Blemish Routine',
      slug: 'complete-blemish-routine',
      discountPercentage: 12,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isLimitedPick: true,
      summary: 'Full 5-step blemish care routine with cleanse, treat, repair, moisturise, and protect.',
      description:
        'Full 5-step blemish care routine with cleanse, treat, repair, moisturise, and protect.',
      benefits: ['Complete daily routine', 'Save vs buying separately', 'Best value starter kit'],
      howToUse: 'Cleanse → Serum → Repair Cream → Moisturizer → Sunscreen. Use daily for best results.',
      imageUrl: `${FW}/1.jpg`,
      hoverImage: `${SR}/1.jpg`,
      images: [`${FW}/1.jpg`, `${SR}/1.jpg`, `${RC}/1.jpg`, `${MO}/1.jpg`, `${SS}/1.jpg`],
    }
  ),
  comboFrom(
    ['blemout-blemishes-repair-cream', 'blemout-enviro-shield-sunscreen'],
    {
      name: 'Repair Cream + Sunscreen Duo',
      slug: 'repair-cream-sunscreen-duo',
      discountPercentage: 12,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      isLimitedPick: true,
      summary: 'Treat pigmented zones and protect from further UV damage.',
      description: 'Treat pigmented zones and protect from further UV damage.',
      benefits: ['Treat + protect duo', 'Bundle savings', 'Ideal for targeted areas'],
      howToUse: 'Apply repair cream to affected areas, then sunscreen on all exposed skin each morning.',
      imageUrl: `${RC}/1.jpg`,
      hoverImage: `${SS}/1.jpg`,
      images: [`${RC}/1.jpg`, `${SS}/1.jpg`, `${RC}/2.jpg`, `${SS}/2.jpg`],
    }
  ),
  comboFrom(
    [
      'blemout-blemishes-repair-cream',
      'blemout-enviro-shield-sunscreen',
      'blemout-skin-glow-age-defying-facewash',
    ],
    {
      name: 'Repair + Protect + Cleanse Trio',
      slug: 'repair-protect-cleanse-trio',
      discountPercentage: 15,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isLimitedPick: true,
      summary: 'Cleanse, repair, and protect — a focused 3-step routine.',
      description: 'Cleanse, repair, and protect — a focused 3-step routine.',
      benefits: ['3-step targeted routine', 'Bundle savings', 'Great for neck & body zones'],
      howToUse: 'Cleanse → Repair Cream → Sunscreen (AM).',
      imageUrl: `${RC}/1.jpg`,
      hoverImage: `${FW}/1.jpg`,
      images: [`${RC}/1.jpg`, `${SS}/1.jpg`, `${FW}/1.jpg`],
    }
  ),
];

async function seed() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blemout.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ email: adminEmail, password: adminPassword });
      console.log(`Admin created: ${adminEmail}`);
    } else {
      console.log('Admin already exists');
    }

    await Product.deleteMany({});
    const inserted = await Product.insertMany([...singles, ...combos]);
    console.log(`${inserted.length} products seeded (${singles.length} singles + ${combos.length} combos)`);
    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
