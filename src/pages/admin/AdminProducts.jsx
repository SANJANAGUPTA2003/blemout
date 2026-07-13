import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import FadeUp from '../../components/ui/FadeUp';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { formatPrice } from '../../utils/format';
import { calcDiscountPercent } from '../../data/business';
import api from '../../utils/api';

const categories = ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen', 'Blemishes Repair Cream', 'Combo'];

const emptyProduct = {
  name: '',
  slug: '',
  price: '',
  sellingPrice: '',
  mrp: '',
  discountPercentage: '',
  summary: '',
  description: '',
  category: 'Serum',
  stock: '',
  size: '',
  skinType: '',
  imageUrl: '',
  hoverImage: '',
  images: '',
  benefits: '',
  ingredients: '',
  howToUse: '',
  precautions: '',
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
  isLimitedPick: false,
  isCombo: false,
  includedProducts: '',
};

function slugify(text = '') {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const fetchProducts = () => {
    api.get('/products').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug || '',
      price: product.sellingPrice || product.price,
      sellingPrice: product.sellingPrice || product.price,
      mrp: product.mrp || '',
      discountPercentage: product.discountPercentage || '',
      summary: product.summary || '',
      description: product.description || '',
      category: product.category,
      stock: product.stock,
      size: product.size || '',
      skinType: product.skinType || '',
      imageUrl: product.imageUrl || '',
      hoverImage: product.hoverImage || '',
      images: product.images?.join('\n') || '',
      benefits: product.benefits?.join('\n') || '',
      ingredients: product.ingredients || '',
      howToUse: product.howToUse || '',
      precautions: product.precautions || '',
      isFeatured: Boolean(product.isFeatured),
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival),
      isLimitedPick: Boolean(product.isLimitedPick),
      isCombo: Boolean(product.isCombo || product.category === 'Combo'),
      includedProducts: (product.includedProducts || product.comboItems || []).join('\n'),
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = { ...form, [name]: type === 'checkbox' ? checked : value };
    if (name === 'name' && !editing) next.slug = slugify(value);
    if (name === 'category') next.isCombo = value === 'Combo';
    if (name === 'mrp' || name === 'sellingPrice' || name === 'price') {
      const mrp = Number(name === 'mrp' ? value : next.mrp);
      const selling = Number(
        name === 'sellingPrice' || name === 'price' ? value : next.sellingPrice || next.price
      );
      if (name === 'price') next.sellingPrice = value;
      if (name === 'sellingPrice') next.price = value;
      if (mrp && selling && mrp > selling) {
        next.discountPercentage = String(calcDiscountPercent(mrp, selling));
      }
    }
    setForm(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellingPrice = Number(form.sellingPrice || form.price);
    const mrp = Number(form.mrp) || sellingPrice;
    const included = form.includedProducts.split('\n').filter(Boolean);
    const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: sellingPrice,
      sellingPrice,
      mrp,
      discountPercentage:
        Number(form.discountPercentage) || calcDiscountPercent(mrp, sellingPrice),
      stock: Number(form.stock),
      benefits: form.benefits.split('\n').filter(Boolean),
      images,
      imageUrl: form.imageUrl || images[0] || '',
      hoverImage: form.hoverImage || images[1] || '',
      isCombo: form.isCombo || form.category === 'Combo',
      includedProducts: included,
      comboItems: included,
    };

    if (editing) {
      await api.put(`/products/${editing._id}`, payload);
    } else {
      await api.post('/products', payload);
    }

    setModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text">Products</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <FadeUp>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-soft-text">
                    <th className="p-4 font-medium w-16">Image</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Flags</th>
                    <th className="p-4 font-medium">MRP</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Disc.</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-mint-strong/20">
                      <td className="p-4">
                        <div className="w-12 h-12 aspect-square rounded-lg bg-[#f5f8f7] flex items-center justify-center overflow-hidden p-1">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-soft-text">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-text">{product.name}</p>
                        <p className="text-xs text-soft-text mt-0.5">{product.slug}</p>
                      </td>
                      <td className="p-4 text-soft-text">{product.category}</td>
                      <td className="p-4 text-xs text-soft-text">
                        {[
                          product.isBestSeller && 'Best',
                          product.isNewArrival && 'New',
                          product.isLimitedPick && 'Limited',
                          product.isFeatured && 'Featured',
                          product.isCombo && 'Combo',
                        ]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </td>
                      <td className="p-4 text-soft-text">{formatPrice(product.mrp || product.price)}</td>
                      <td className="p-4 font-semibold">{formatPrice(product.sellingPrice || product.price)}</td>
                      <td className="p-4 text-teal font-semibold">
                        {product.discountPercentage ? `${product.discountPercentage}%` : '—'}
                      </td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(product)} className="p-1.5 text-soft-text hover:text-teal">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-1.5 text-soft-text hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-soft-text hover:text-text">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
              <Input label="Slug" name="slug" value={form.slug} onChange={handleChange} placeholder="auto-from-name" />
              <div className="grid grid-cols-3 gap-3">
                <Input label="MRP (₹)" name="mrp" type="number" value={form.mrp} onChange={handleChange} />
                <Input label="Selling Price (₹)" name="sellingPrice" type="number" value={form.sellingPrice || form.price} onChange={handleChange} required />
                <Input label="Discount %" name="discountPercentage" type="number" value={form.discountPercentage} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
                <Input label="Size / Quantity" name="size" value={form.size} onChange={handleChange} />
              </div>
              <Input label="Suitable Skin Type" name="skinType" value={form.skinType} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-text">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-teal" />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} className="accent-teal" />
                  Best Seller
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} className="accent-teal" />
                  New
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isLimitedPick" checked={form.isLimitedPick} onChange={handleChange} className="accent-teal" />
                  Limited Pick
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isCombo" checked={form.isCombo} onChange={handleChange} className="accent-teal" />
                  Combo
                </label>
              </div>
              <Input label="Primary Image URL (image 1)" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              <Input label="Hover Image URL (image 2)" name="hoverImage" value={form.hoverImage} onChange={handleChange} />
              <Textarea label="Gallery Images 1–6 (one URL per line, in order)" name="images" value={form.images} onChange={handleChange} rows={4} />
              <Textarea label="Summary" name="summary" value={form.summary} onChange={handleChange} rows={2} />
              <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
              <Textarea label="Benefits (one per line)" name="benefits" value={form.benefits} onChange={handleChange} rows={3} />
              <Textarea label="Ingredients" name="ingredients" value={form.ingredients} onChange={handleChange} rows={3} />
              <Textarea label="How To Use" name="howToUse" value={form.howToUse} onChange={handleChange} rows={3} />
              <Textarea label="Precautions" name="precautions" value={form.precautions} onChange={handleChange} rows={2} />
              {(form.isCombo || form.category === 'Combo') && (
                <Textarea label="Included Products (one per line)" name="includedProducts" value={form.includedProducts} onChange={handleChange} rows={3} />
              )}
              <Button type="submit" className="w-full">{editing ? 'Update Product' : 'Add Product'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
