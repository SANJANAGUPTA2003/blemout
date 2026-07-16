import mongoose from 'mongoose';
import Product from '../models/Product.js';

const SUMMARY_FIELDS = [
  '_id',
  'slug',
  'name',
  'category',
  'mrp',
  'price',
  'sellingPrice',
  'discountPercentage',
  'summary',
  'imageUrl',
  'hoverImage',
  'images',
  'stock',
  'size',
  'isFeatured',
  'isBestSeller',
  'isNewArrival',
  'isLimitedPick',
  'isCombo',
  'benefits',
  'howToUse',
  'ingredientHighlights',
].join(' ');

function slugify(text = '') {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function ensureUniqueSlug(base, excludeId) {
  let slug = base || 'product';
  let n = 1;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Product.findOne(query).select('_id');
    if (!existing) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function toSummary(product) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const imageUrl = product.imageUrl || images[0] || '';
  const hoverImage = product.hoverImage || images[1] || '';
  return {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    mrp: product.mrp,
    price: product.price,
    sellingPrice: product.sellingPrice || product.price,
    discountPercentage: product.discountPercentage || 0,
    summary: product.summary || '',
    imageUrl,
    hoverImage,
    // Keep only the first two slots for list/card surfaces
    images: [imageUrl, hoverImage].filter(Boolean),
    stock: product.stock,
    size: product.size || '',
    isFeatured: Boolean(product.isFeatured),
    isBestSeller: Boolean(product.isBestSeller),
    isNewArrival: Boolean(product.isNewArrival),
    isLimitedPick: Boolean(product.isLimitedPick),
    isCombo: Boolean(product.isCombo),
    benefits: Array.isArray(product.benefits) ? product.benefits.slice(0, 4) : [],
    howToUse: product.howToUse || '',
    ingredientHighlights: Array.isArray(product.ingredientHighlights)
      ? product.ingredientHighlights.slice(0, 5)
      : [],
  };
}

export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.collection === 'best-sellers') filter.isBestSeller = true;
    if (req.query.collection === 'new') filter.isNewArrival = true;
    if (req.query.collection === 'limited-picks') filter.isLimitedPick = true;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;

    const summary = req.query.view === 'summary';
    const query = Product.find(filter).sort({ createdAt: -1 });

    if (summary) {
      const products = await query.select(SUMMARY_FIELDS).lean();
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(products.map(toSummary));
    }

    const products = await query;
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.sellingPrice != null && body.price == null) body.price = body.sellingPrice;
    if (body.price != null && body.sellingPrice == null) body.sellingPrice = body.price;
    if (body.mrp && body.sellingPrice && body.mrp > body.sellingPrice && body.discountPercentage == null) {
      body.discountPercentage = Math.round(((body.mrp - body.sellingPrice) / body.mrp) * 100);
    }
    const base = slugify(body.slug || body.name);
    body.slug = await ensureUniqueSlug(base);
    const product = await Product.create(body);
    res.set('Cache-Control', 'no-store');
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.sellingPrice != null && body.price == null) body.price = body.sellingPrice;
    if (body.price != null && body.sellingPrice == null) body.sellingPrice = body.price;
    if (body.mrp && body.sellingPrice && body.mrp > body.sellingPrice && body.discountPercentage == null) {
      body.discountPercentage = Math.round(((body.mrp - body.sellingPrice) / body.mrp) * 100);
    }
    if (body.slug || body.name) {
      const base = slugify(body.slug || body.name);
      body.slug = await ensureUniqueSlug(base, req.params.id);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.set('Cache-Control', 'no-store');
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.set('Cache-Control', 'no-store');
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
