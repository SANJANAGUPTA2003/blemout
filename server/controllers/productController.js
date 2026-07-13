import mongoose from 'mongoose';
import Product from '../models/Product.js';

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

export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.collection === 'best-sellers') filter.isBestSeller = true;
    if (req.query.collection === 'new') filter.isNewArrival = true;
    if (req.query.collection === 'limited-picks') filter.isLimitedPick = true;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
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
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
