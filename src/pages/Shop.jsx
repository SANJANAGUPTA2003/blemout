import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import { categories } from '../data/constants';
import api from '../utils/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('default');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => {
        setProducts([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, category, query, sort]);

  const updateCategory = (value) => {
    setCategory(value);
    const next = new URLSearchParams(searchParams);
    if (value === 'All') next.delete('category');
    else next.set('category', value);
    setSearchParams(next);
  };

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-20">
        <FadeUp>
          <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-3">Shop</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-text tracking-tight">All Products</h1>
          <p className="mt-4 text-soft-text max-w-xl">
            Explore approved BLEMOUT formulas and curated combos in a clean, spacious grid.
          </p>
        </FadeUp>

        <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="lg:w-56 shrink-0 space-y-8">
            <div>
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-text mb-4">Category</h2>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateCategory(cat)}
                    className={`text-left text-sm px-0 py-1.5 transition-colors ${
                      category === cat ? 'text-teal font-semibold' : 'text-soft-text hover:text-dark-teal'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-text mb-4">Sort</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-teal/40"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-text mb-4">Search</h2>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  const next = new URLSearchParams(searchParams);
                  if (e.target.value) next.set('q', e.target.value);
                  else next.delete('q');
                  setSearchParams(next);
                }}
                placeholder="Search..."
                className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-teal/40"
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner className="py-24" />
            ) : error ? (
              <ApiMessage type="offline" message="Unable to load products." onRetry={fetchProducts} />
            ) : filtered.length === 0 ? (
              <ApiMessage type="empty" message="No products match your filters." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filtered.map((product) => (
                  <FadeUp key={product._id}>
                    <ProductCard product={product} />
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
