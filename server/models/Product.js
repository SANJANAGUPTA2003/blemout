import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen', 'Blemishes Repair Cream', 'Combo'],
      required: true,
    },
    stock: { type: Number, default: 0 },
    size: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    images: [{ type: String }],
    benefits: [{ type: String }],
    ingredients: { type: String, default: '' },
    howToUse: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    comboItems: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
