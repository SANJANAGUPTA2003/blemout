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
          <p className="text-[12px] tracking-[0.16em] uppercase text-teal font-bold mb-3">{eyebrow}</p>
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.1]">
            {title}
          </h1>
          <p className="mt-4 text-[16px] text-[#4a5560] max-w-xl leading-relaxed">{subtitle}</p>
        </FadeUp>

        <div className="mt-12 md:mt-14">
          {loading ? (
            <LoadingSpinner className="py-24" />
          ) : error ? (
            <ApiMessage type="offline" message="Unable to load this collection." onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <ApiMessage type="empty" message="No products in this collection yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12 md:gap-y-16">
              {products.map((product) => (
                <FadeUp key={product._id}>
                  <div className="w-full max-w-[440px] mx-auto sm:mx-0 sm:max-w-none">
                    <ProductCard product={product} imageMode="promo" />
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
