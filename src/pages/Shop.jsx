import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import ApiMessage from '../components/ui/ApiMessage';
import { useProducts } from '../context/ProductContext';
import { COLLECTION_SLUGS } from '../data/storefrontConfig';
import { resolveBySlugs } from '../data/productDisplay';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'individual', label: 'Individual Products' },
  { id: 'combos', label: 'Combos' },
  { id: 'best', label: 'Best Sellers' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, slow, retry } = useProducts();
  const filter = searchParams.get('filter') || 'all';
  const query = searchParams.get('q') || '';
  const [sort, setSort] = useState('default');

  const catalog = useMemo(
    () => resolveBySlugs(products, COLLECTION_SLUGS.shopAll),
    [products]
  );

  const filtered = useMemo(() => {
    let result = [...catalog];
    if (filter === 'individual') result = result.filter((p) => !p.isCombo);
    if (filter === 'combos') result = result.filter((p) => p.isCombo || p.category === 'Combo');
    if (filter === 'best') result = result.filter((p) => p.isBestSeller);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-low') {
      result.sort((a, b) => (a.sellingPrice || a.price) - (b.sellingPrice || b.price));
    }
    if (sort === 'price-high') {
      result.sort((a, b) => (b.sellingPrice || b.price) - (a.sellingPrice || a.price));
    }
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [catalog, filter, query, sort]);

  const setFilter = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('filter');
    else next.set('filter', id);
    setSearchParams(next);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <FadeUp>
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-teal">Shop</p>
          <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222]">
            All Products
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#4a5560] md:text-[18px]">
            Five individual formulas and six curated combos — eleven essentials in one place.
          </p>
        </FadeUp>

        <div className="mt-10 flex flex-wrap gap-2 md:gap-3">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors md:text-[15px] ${
                filter === item.id
                  ? 'bg-teal text-white'
                  : 'bg-[#f6f7f6] text-[#26313D] hover:bg-[#eef1f0]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-auto rounded-full border-0 bg-[#f6f7f6] px-5 py-2.5 text-[14px] text-[#222222] md:text-[15px]"
          >
            <option value="default">Featured order</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="mt-10 md:mt-12">
          {loading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <ApiMessage
              type="offline"
              message={
                slow
                  ? 'Products are taking a little longer to load. Please wait or retry.'
                  : 'Unable to load products.'
              }
              onRetry={retry}
            />
          ) : filtered.length === 0 ? (
            <ApiMessage type="empty" message="No products match your filters." />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16">
              {filtered.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
