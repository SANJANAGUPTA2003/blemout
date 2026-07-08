import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import SectionHeading from '../components/ui/SectionHeading';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import { categories } from '../data/constants';
import api from '../utils/api';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState('all');
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
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    if (priceRange === 'under500') {
      result = result.filter((p) => p.price < 500);
    } else if (priceRange === '500-1000') {
      result = result.filter((p) => p.price >= 500 && p.price <= 1000);
    } else if (priceRange === 'over1000') {
      result = result.filter((p) => p.price > 1000);
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, category, priceRange, sort]);

  return (
    <div className="py-16 md:py-24 bg-soft-blue/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <FadeUp>
          <SectionHeading
            title="Shop All"
            subtitle="Discover our complete range of blemish care products."
            align="left"
            className="mb-10"
          />
        </FadeUp>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="lg:w-52 shrink-0">
            <FadeUp>
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-soft-text mb-4 font-medium">Category</h3>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                          className="accent-teal"
                        />
                        <span className={`text-sm font-medium transition-colors duration-300 ${category === cat ? 'text-teal' : 'text-soft-text group-hover:text-dark-teal'}`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-soft-text mb-4 font-medium">Price</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'under500', label: 'Under ₹500' },
                      { value: '500-1000', label: '₹500 – ₹1,000' },
                      { value: 'over1000', label: 'Over ₹1,000' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === opt.value}
                          onChange={() => setPriceRange(opt.value)}
                          className="accent-teal"
                        />
                        <span className={`text-sm font-medium transition-colors duration-300 ${priceRange === opt.value ? 'text-teal' : 'text-soft-text group-hover:text-dark-teal'}`}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <p className="text-sm text-soft-text">
                {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border-0 bg-transparent text-soft-text focus:outline-none focus:text-teal cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ApiMessage
                type="offline"
                message="Could not connect to the server. Please ensure MongoDB and the backend are running."
                onRetry={fetchProducts}
              />
            ) : filtered.length === 0 ? (
              <ApiMessage type="empty" message="No products found for the selected filters." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filtered.map((product, i) => (
                  <FadeUp key={product._id} delay={i * 0.04}>
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
