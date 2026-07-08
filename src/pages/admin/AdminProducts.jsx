import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import FadeUp from '../../components/ui/FadeUp';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { formatPrice } from '../../utils/format';
import api from '../../utils/api';

const categories = ['Face Wash', 'Serum', 'Moisturizer', 'Sunscreen', 'Blemishes Repair Cream', 'Combo'];

const emptyProduct = {
  name: '',
  price: '',
  mrp: '',
  description: '',
  category: 'Serum',
  stock: '',
  size: '',
  imageUrl: '',
  images: '',
  benefits: '',
  ingredients: '',
  howToUse: '',
  isFeatured: false,
  comboItems: '',
};

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
      price: product.price,
      mrp: product.mrp || '',
      description: product.description || '',
      category: product.category,
      stock: product.stock,
      size: product.size || '',
      imageUrl: product.imageUrl || '',
      images: product.images?.join('\n') || '',
      benefits: product.benefits?.join('\n') || '',
      ingredients: product.ingredients || '',
      howToUse: product.howToUse || '',
      isFeatured: Boolean(product.isFeatured),
      comboItems: product.comboItems?.join('\n') || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      stock: Number(form.stock),
      benefits: form.benefits.split('\n').filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      comboItems: form.comboItems.split('\n').filter(Boolean),
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
        <h1 className="text-2xl font-semibold text-text">Products</h1>
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
                    <th className="p-4 font-medium">MRP</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-mint-strong/20">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-mint-strong/30 flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt=""
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-[10px] text-soft-text">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-soft-text">{product.category}</td>
                      <td className="p-4 text-soft-text">{formatPrice(product.mrp || product.price)}</td>
                      <td className="p-4">{formatPrice(product.price)}</td>
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
              <h2 className="text-lg font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-soft-text hover:text-text">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="MRP (₹)" name="mrp" type="number" value={form.mrp} onChange={handleChange} />
                <Input label="Selling Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
                <Input label="Size / Quantity" name="size" value={form.size} onChange={handleChange} />
              </div>
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
              <label className="flex items-center gap-2 text-sm text-text">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-teal" />
                Featured product
              </label>
              <Input label="Primary Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              <Textarea label="Gallery Images (one URL per line)" name="images" value={form.images} onChange={handleChange} rows={3} />
              <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
              <Textarea label="Benefits (one per line)" name="benefits" value={form.benefits} onChange={handleChange} rows={3} />
              <Textarea label="Ingredients" name="ingredients" value={form.ingredients} onChange={handleChange} rows={3} />
              <Textarea label="How To Use" name="howToUse" value={form.howToUse} onChange={handleChange} rows={3} />
              {form.category === 'Combo' && (
                <Textarea label="Included Products (one per line)" name="comboItems" value={form.comboItems} onChange={handleChange} rows={3} />
              )}
              <Button type="submit" className="w-full">{editing ? 'Update Product' : 'Add Product'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
