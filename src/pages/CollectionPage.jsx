import { useState, useEffect, useCallback } from 'react';
import FadeUp from '../components/ui/FadeUp';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ApiMessage from '../components/ui/ApiMessage';
import api from '../utils/api';

export default function CollectionPage({
  collection,
  title,
  subtitle,
  eyebrow = 'Collection',
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);
    api
      .get('/products', { params: { collection } })
      .then(({ data }) => setProducts(data))
      .catch(() => {
        setProducts([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [collection]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-20">
        <FadeUp>
          <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-3">{eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-text tracking-tight">{title}</h1>
          <p className="mt-4 text-soft-text max-w-xl">{subtitle}</p>
        </FadeUp>

        <div className="mt-12">
          {loading ? (
            <LoadingSpinner className="py-24" />
          ) : error ? (
            <ApiMessage type="offline" message="Unable to load this collection." onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <ApiMessage type="empty" message="No products in this collection yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product) => (
                <FadeUp key={product._id}>
                  <ProductCard product={product} imageMode="promo" />
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
