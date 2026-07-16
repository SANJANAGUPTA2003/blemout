import mongoose from 'mongoose';

const ingredientHighlightSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: 'Sparkles' },
    image: { type: String, default: '' },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen', 'Blemishes Repair Cream', 'Combo'],
      required: true,
    },
    stock: { type: Number, default: 0 },
    size: { type: String, default: '' },
    skinType: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    hoverImage: { type: String, default: '' },
    images: [{ type: String }],
    benefits: [{ type: String }],
    ingredients: { type: String, default: '' },
    howToUse: { type: String, default: '' },
    precautions: { type: String, default: '' },
    ingredientHighlights: [ingredientHighlightSchema],
    faqs: [faqSchema],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isLimitedPick: { type: Boolean, default: false },
    isCombo: { type: Boolean, default: false },
    includedProducts: [{ type: String }],
    comboItems: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ isFeatured: 1, createdAt: -1 });
productSchema.index({ isBestSeller: 1, createdAt: -1 });
productSchema.index({ isNewArrival: 1, createdAt: -1 });
productSchema.index({ isLimitedPick: 1, createdAt: -1 });
productSchema.index({ category: 1, createdAt: -1 });

productSchema.pre('validate', function syncPricing(next) {
  if (!this.sellingPrice && this.price) this.sellingPrice = this.price;
  if (this.sellingPrice && !this.price) this.price = this.sellingPrice;
  if (this.mrp && this.sellingPrice && this.mrp > this.sellingPrice && !this.discountPercentage) {
    this.discountPercentage = Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  }
  if (this.isCombo && (!this.includedProducts || this.includedProducts.length === 0) && this.comboItems?.length) {
    this.includedProducts = this.comboItems;
  }
  if ((!this.comboItems || this.comboItems.length === 0) && this.includedProducts?.length) {
    this.comboItems = this.includedProducts;
  }
  next();
});

export default mongoose.model('Product', productSchema);
