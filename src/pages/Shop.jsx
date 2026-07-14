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
          <p className="text-[12px] tracking-[0.16em] uppercase text-teal font-bold mb-3">Shop</p>
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.1]">
            All Products
          </h1>
          <p className="mt-4 text-[16px] text-[#4a5560] max-w-xl leading-relaxed">
            Explore approved BLEMOUT formulas and curated combos in a clean, spacious grid.
          </p>
        </FadeUp>

        <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="lg:w-52 shrink-0 space-y-8">
            <div>
              <h2 className="text-xs tracking-[0.14em] uppercase font-bold text-[#222222] mb-4">Category</h2>
              <div className="flex flex-wrap lg:flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateCategory(cat)}
                    className={`text-left text-[15px] px-0 py-1.5 transition-colors ${
                      category === cat
                        ? 'text-teal font-semibold'
                        : 'text-[#4a5560] hover:text-dark-teal'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.14em] uppercase font-bold text-[#222222] mb-4">Sort</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-0 py-2 border-0 border-b border-gray-200 rounded-none text-[15px] text-[#222222] focus:outline-none focus:border-teal/50 bg-transparent"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <h2 className="text-xs tracking-[0.14em] uppercase font-bold text-[#222222] mb-4">Search</h2>
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
                className="w-full px-0 py-2 border-0 border-b border-gray-200 rounded-none text-[15px] text-[#222222] placeholder:text-[#6b7280] focus:outline-none focus:border-teal/50 bg-transparent"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12 md:gap-y-16">
                {filtered.map((product) => (
                  <FadeUp key={product._id}>
                    <div className="w-full max-w-[440px] mx-auto sm:mx-0 sm:max-w-none">
                      <ProductCard product={product} />
                    </div>
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
