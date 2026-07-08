import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';

const FW = '/products/facewash';
const RC = '/products/repair-cream';
const MO = '/products/moisturizer';
const SS = '/products/sunscreen';

const singles = [
  {
    name: 'Skin Glow & Age Defying Facewash',
    mrp: 389,
    price: 350,
    category: 'Face Wash',
    stock: 120,
    size: '75ml',
    isFeatured: true,
    imageUrl: `${FW}/tube.jpg`,
    images: [
      `${FW}/tube.jpg`,
      `${FW}/box-tube.jpg`,
      `${FW}/application.jpg`,
      `${FW}/how-to-use.jpg`,
      `${FW}/backside.jpg`,
      `${FW}/hero-lifestyle.jpg`,
    ],
    description:
      'A deep-cleansing brightening face wash for glowing, even-looking skin. Suitable for Oily, Normal, Combination skin.',
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
  },
  {
    name: 'Enviro Shield Sunscreen',
    mrp: 559,
    price: 503,
    category: 'Sunscreen',
    stock: 110,
    size: '50gm',
    isFeatured: true,
    imageUrl: `${SS}/tube.jpg`,
    images: [`${SS}/tube.jpg`, `${SS}/box.jpg`, `${SS}/application.jpg`, `${SS}/back.jpg`, `${SS}/texture.jpg`, `${SS}/lifestyle.jpg`],
    description:
      'A lightweight SPF 50+ PA++++ sunscreen with broad spectrum protection and no white cast. Suitable for Acne Prone, Oily, Dry, Normal, Combination skin.',
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
  },
  {
    name: 'Hydra Glow Water Moist Crème',
    mrp: 499,
    price: 449,
    category: 'Moisturizer',
    stock: 100,
    size: '50gm',
    isFeatured: true,
    imageUrl: `${MO}/jar.jpg`,
    images: [`${MO}/jar.jpg`, `${MO}/box.jpg`, `${MO}/texture.jpg`, `${MO}/back.jpg`, `${MO}/application.jpg`, `${MO}/lifestyle.jpg`],
    description:
      'A refreshing water-based moisturizer that hydrates, repairs the skin barrier, and supports a brighter complexion. Suitable for Acne Prone, Oily, Normal, Combination skin.',
    benefits: [
      'Up to 48 hours hydration',
      'Helps lock in moisture',
      'Reduces water loss',
      'Supports long-lasting hydration',
      'Barrier repair',
      'Textured skin support',
      'Acne control',
      'Brightening',
      'Soothing',
    ],
    ingredients:
      'Aquaxyl; Japanese Clair Blanche II; Glutathione; Alpha Arbutin; Vitamin B5 / Panthenol; Aloe Vera',
    howToUse:
      'Cleanse your face. Massage a small amount of Hydra Glow Water Moist Crème onto face and neck. Follow with sunscreen during the day.',
  },
  {
    name: 'Advanced Blemishes Repair Cream',
    mrp: 449,
    price: 404,
    category: 'Blemishes Repair Cream',
    stock: 90,
    size: '15gm',
    isFeatured: true,
    imageUrl: `${RC}/tube.jpg`,
    images: [`${RC}/tube.jpg`, `${RC}/box.jpg`, `${RC}/application.jpg`, `${RC}/back.jpg`, `${RC}/texture.jpg`, `${RC}/lifestyle.jpg`],
    description:
      'A targeted blemish repair cream for dark spots, post-acne marks, uneven tone, pigmentation, and visible redness. Suitable for Acne Prone, Oily, Normal, Combination skin.',
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
  },
  {
    name: 'BLEMOUT Serum',
    mrp: 699,
    price: 629,
    category: 'Serum',
    stock: 80,
    size: 'TBD',
    isFeatured: true,
    imageUrl: '/products/serum/placeholder.jpg',
    images: ['/products/serum/placeholder.jpg'],
    description: 'Placeholder serum content until final serum images/details are provided.',
    benefits: ['Coming soon — final formula details pending'],
    ingredients: 'Details coming soon.',
    howToUse: 'Details coming soon.',
  },
];

function combo(name, mrp, price, items, description, benefits, howToUse, imageUrl, images) {
  return {
    name,
    mrp,
    price,
    category: 'Combo',
    stock: 50,
    size: 'Bundle',
    isFeatured: name.includes('Complete'),
    imageUrl,
    images,
    comboItems: items,
    description,
    benefits,
    howToUse,
    ingredients: 'See individual included products.',
  };
}

const combos = [
  combo(
    'Complete Blemish Routine',
    2595,
    1868,
    [
      'Skin Glow & Age Defying Facewash',
      'BLEMOUT Serum',
      'Hydra Glow Water Moist Crème',
      'Enviro Shield Sunscreen',
      'Advanced Blemishes Repair Cream',
    ],
    'Full 5-step blemish care routine with cleanse, treat, repair, moisturise, and protect.',
    ['Complete daily routine', 'Save 20% vs buying separately', 'Best value starter kit'],
    'Cleanse → Serum → Repair Cream → Moisturizer → Sunscreen. Use daily for best results.',
    `${FW}/box-tube.jpg`,
    [`${FW}/box-tube.jpg`, `${FW}/hero-lifestyle.jpg`]
  ),
  combo(
    'Repair Cream + Sunscreen Combo',
    1008,
    771,
    ['Advanced Blemishes Repair Cream', 'Enviro Shield Sunscreen'],
    'Treat pigmented zones and protect from further UV damage.',
    ['Treat + protect duo', '15% bundle savings', 'Ideal for targeted areas'],
    'Apply repair cream to affected areas, then sunscreen on all exposed skin each morning.',
    `${RC}/tube.jpg`,
    [`${RC}/tube.jpg`, `${SS}/tube.jpg`]
  ),
  combo(
    'Repair Cream + Sunscreen + Face Wash Combo',
    1397,
    1006,
    [
      'Advanced Blemishes Repair Cream',
      'Enviro Shield Sunscreen',
      'Skin Glow & Age Defying Facewash',
    ],
    'Cleanse, repair, and protect — a focused 3-step routine.',
    ['3-step targeted routine', '20% bundle savings', 'Great for neck & body zones'],
    'Cleanse → Repair Cream → Sunscreen (AM).',
    `${RC}/box.jpg`,
    [`${RC}/box.jpg`, `${SS}/tube.jpg`, `${FW}/tube.jpg`]
  ),
  combo(
    'Moisturizer + Sunscreen + Face Wash Combo',
    1447,
    1042,
    [
      'Hydra Glow Water Moist Crème',
      'Enviro Shield Sunscreen',
      'Skin Glow & Age Defying Facewash',
    ],
    'Essential daily hydration and sun protection with a gentle cleanser.',
    ['Daily hydration + SPF', '20% bundle savings', 'Simple morning routine'],
    'Cleanse → Moisturizer → Sunscreen each morning.',
    `${MO}/jar.jpg`,
    [`${MO}/jar.jpg`, `${SS}/tube.jpg`, `${FW}/tube.jpg`]
  ),
  combo(
    'Moisturizer + Serum + Face Wash Combo',
    1587,
    1142,
    [
      'Hydra Glow Water Moist Crème',
      'BLEMOUT Serum',
      'Skin Glow & Age Defying Facewash',
    ],
    'Cleanse, treat, and hydrate for brighter, more even-looking skin.',
    ['Brightening daily routine', '20% bundle savings', 'Ideal evening + morning base'],
    'Cleanse → Serum → Moisturizer. Add sunscreen in the morning.',
    `${MO}/box.jpg`,
    [`${MO}/box.jpg`, `${FW}/tube.jpg`]
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
