import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import ApiMessage from '../components/ui/ApiMessage';
import Button from '../components/ui/Button';
import { useProducts } from '../context/ProductContext';
import {
  BADGE_BY_SLUG,
  COLLECTION_SLUGS,
  PRODUCT_SLUGS,
  RANK_SLUGS,
} from '../data/storefrontConfig';
import { getSellingPrice } from '../data/business';
import { resolveBySlugs } from '../data/productDisplay';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'View All' },
  { id: 'individual', label: 'Individual Products', param: 'type', value: 'individual' },
  { id: 'combo', label: 'Combos', param: 'type', value: 'combo' },
  { id: 'face-wash', label: 'Face Wash', param: 'category', value: 'face-wash' },
  { id: 'serum', label: 'Serum', param: 'category', value: 'serum' },
  { id: 'moisturizer', label: 'Moisturizer', param: 'category', value: 'moisturizer' },
  { id: 'sunscreen', label: 'Sunscreen', param: 'category', value: 'sunscreen' },
  { id: 'blemish-cream', label: 'Blemish Cream', param: 'category', value: 'blemish-cream' },
  { id: 'concern', label: 'Shop by Concern', href: '/shop-by-concern' },
];

const COLLECTION_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New', value: 'new' },
  { id: 'best', label: 'Best Seller', value: 'best' },
  { id: 'limited', label: 'Limited Picks', value: 'limited' },
  { id: 'most-loved', label: 'Most Loved', value: 'most-loved' },
  { id: 'most-reordered', label: 'Most Reordered', value: 'most-reordered' },
];

/** Sort options backed by price, flags, badges, or approved RANK_SLUGS — no invented metrics. */
const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
  { id: 'best-seller', label: 'Best Seller' },
  { id: 'most-loved', label: 'Most Loved' },
  { id: 'most-reordered', label: 'Most Ordered' },
];

const CATEGORY_MATCH = {
  'face-wash': (p) =>
    p.slug === PRODUCT_SLUGS.facewash || /face\s*wash/i.test(p.category || ''),
  serum: (p) => p.slug === PRODUCT_SLUGS.serum || /serum/i.test(p.category || ''),
  moisturizer: (p) =>
    p.slug === PRODUCT_SLUGS.moisturizer || /moistur/i.test(p.category || ''),
  sunscreen: (p) =>
    p.slug === PRODUCT_SLUGS.sunscreen || /sunscreen/i.test(p.category || ''),
  'blemish-cream': (p) =>
    p.slug === PRODUCT_SLUGS.repairCream ||
    /repair\s*cream|blemish\s*cream/i.test(p.category || ''),
};

function chipClass(active) {
  return `rounded-full px-4 py-2.5 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal md:text-[15px] ${
    active
      ? 'bg-teal text-white'
      : 'bg-[#eef8f6] text-[#26313D] hover:bg-[#e0f2ef]'
  }`;
}

function rankIndex(list, slug) {
  const i = list.indexOf(slug);
  return i === -1 ? 999 : i;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, slow, retry } = useProducts();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const collection = searchParams.get('collection') || '';
  const sort = searchParams.get('sort') || 'recommended';
  const legacyFilter = searchParams.get('filter') || '';
  const query = searchParams.get('q') || '';

  // Support older ?filter= links from prior mega menu
  const effectiveType =
    type ||
    (legacyFilter === 'individual'
      ? 'individual'
      : legacyFilter === 'combos'
        ? 'combo'
        : legacyFilter === 'best'
          ? ''
          : '');
  const effectiveCollection =
    collection || (legacyFilter === 'best' ? 'best' : '');

  const catalog = useMemo(
    () => resolveBySlugs(products, COLLECTION_SLUGS.shopAll),
    [products]
  );

  const filtered = useMemo(() => {
    let result = [...catalog];

    if (effectiveType === 'individual') {
      result = result.filter((p) => !p.isCombo && p.category !== 'Combo');
    }
    if (effectiveType === 'combo') {
      result = result.filter((p) => p.isCombo || p.category === 'Combo');
    }
    if (category && CATEGORY_MATCH[category]) {
      result = result.filter(CATEGORY_MATCH[category]);
    }

    if (effectiveCollection === 'new') {
      const set = new Set(COLLECTION_SLUGS.new);
      result = result.filter((p) => p.isNewArrival || set.has(p.slug));
    }
    if (effectiveCollection === 'best') {
      const set = new Set(COLLECTION_SLUGS.bestSellers);
      result = result.filter((p) => p.isBestSeller || set.has(p.slug));
    }
    if (effectiveCollection === 'limited') {
      const set = new Set(COLLECTION_SLUGS.limitedPicks);
      result = result.filter((p) => p.isLimitedPick || set.has(p.slug));
    }
    if (effectiveCollection === 'most-loved') {
      result = result.filter(
        (p) => BADGE_BY_SLUG[p.slug] === 'Most Loved' || RANK_SLUGS.mostLoved.includes(p.slug)
      );
    }
    if (effectiveCollection === 'most-reordered') {
      result = result.filter(
        (p) =>
          BADGE_BY_SLUG[p.slug] === 'Most Reordered' ||
          RANK_SLUGS.mostReordered.includes(p.slug)
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q)
      );
    }

    const byPrice = (a, b) => getSellingPrice(a) - getSellingPrice(b);

    if (sort === 'price-low') result.sort(byPrice);
    else if (sort === 'price-high') result.sort((a, b) => byPrice(b, a));
    else if (sort === 'newest') {
      const set = new Set(COLLECTION_SLUGS.new);
      result.sort((a, b) => {
        const aNew = a.isNewArrival || set.has(a.slug) ? 0 : 1;
        const bNew = b.isNewArrival || set.has(b.slug) ? 0 : 1;
        if (aNew !== bNew) return aNew - bNew;
        const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bT - aT;
      });
    } else if (sort === 'best-seller') {
      const set = COLLECTION_SLUGS.bestSellers;
      result.sort((a, b) => rankIndex(set, a.slug) - rankIndex(set, b.slug));
    } else if (sort === 'most-loved') {
      result.sort(
        (a, b) =>
          rankIndex(RANK_SLUGS.mostLoved, a.slug) - rankIndex(RANK_SLUGS.mostLoved, b.slug)
      );
    } else if (sort === 'most-reordered') {
      result.sort(
        (a, b) =>
          rankIndex(RANK_SLUGS.mostReordered, a.slug) -
          rankIndex(RANK_SLUGS.mostReordered, b.slug)
      );
    } else {
      // Recommended = explicit shopAll order
      result.sort(
        (a, b) =>
          rankIndex(COLLECTION_SLUGS.shopAll, a.slug) -
          rankIndex(COLLECTION_SLUGS.shopAll, b.slug)
      );
    }

    return result;
  }, [catalog, effectiveType, category, effectiveCollection, query, sort]);

  const patchParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    next.delete('filter'); // drop legacy key when using new params
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all' || value === 'recommended') next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    setSearchParams(next);
    setMobileFiltersOpen(false);
  };

  const activeCategoryId = category
    ? category
    : effectiveType === 'individual'
      ? 'individual'
      : effectiveType === 'combo'
        ? 'combo'
        : 'all';

  const hasActiveFilters =
    Boolean(effectiveType) ||
    Boolean(category) ||
    Boolean(effectiveCollection) ||
    (sort && sort !== 'recommended');

  const activeLabels = [
    CATEGORY_OPTIONS.find((c) => c.id === activeCategoryId && c.id !== 'all')?.label,
    COLLECTION_OPTIONS.find((c) => c.value === effectiveCollection)?.label,
    SORT_OPTIONS.find((s) => s.id === sort && s.id !== 'recommended')?.label,
  ].filter(Boolean);

  const FiltersBody = (
    <>
      <div>
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((item) => {
            if (item.href) {
              return (
                <Link key={item.id} to={item.href} className={chipClass(false)}>
                  {item.label}
                </Link>
              );
            }
            const active = activeCategoryId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={chipClass(active)}
                onClick={() => {
                  if (item.id === 'all') {
                    patchParams({ type: '', category: '' });
                  } else if (item.param === 'type') {
                    patchParams({ type: item.value, category: '' });
                  } else {
                    patchParams({ category: item.value, type: '' });
                  }
                  setMobileFiltersOpen(false);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
          Collection
        </p>
        <div className="flex flex-wrap gap-2">
          {COLLECTION_OPTIONS.map((item) => {
            const active =
              (item.id === 'all' && !effectiveCollection) ||
              item.value === effectiveCollection;
            return (
              <button
                key={item.id}
                type="button"
                className={chipClass(active)}
                onClick={() => {
                  patchParams({ collection: item.id === 'all' ? '' : item.value });
                  setMobileFiltersOpen(false);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

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

        {/* Desktop toolbar */}
        <div className="mt-10 hidden items-start justify-between gap-6 lg:flex">
          <div className="min-w-0 flex-1">{FiltersBody}</div>
          <div className="shrink-0 pt-7">
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => patchParams({ sort: e.target.value })}
              className="min-w-[220px] rounded-full border-0 bg-[#eef8f6] px-5 py-2.5 text-[15px] font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-teal/30"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile toolbar */}
        <div className="mt-8 flex gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#eef8f6] px-4 py-3 text-[15px] font-semibold text-[#222222]"
          >
            <SlidersHorizontal size={18} />
            Filter
          </button>
          <select
            value={sort}
            onChange={(e) => patchParams({ sort: e.target.value })}
            className="flex-1 rounded-full border-0 bg-[#eef8f6] px-4 py-3 text-[15px] font-semibold text-[#222222]"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#4a5560]">
            <span className="font-semibold text-[#222222]">Active:</span>
            {activeLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-[#e8f7f5] px-3 py-1 text-[13px] font-semibold text-dark-teal"
              >
                {label}
              </span>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 text-[14px] font-semibold text-teal underline-offset-2 hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}

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
            <div className="rounded-2xl bg-[#f7faf9] px-6 py-14 text-center">
              <p className="text-[18px] font-semibold text-[#222222]">
                No products match the selected filters.
              </p>
              <Button type="button" className="mt-6" onClick={clearAll}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 md:gap-x-8 md:gap-y-16">
              {filtered.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-5 py-6 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#222222]">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-2 text-[#4a5560]"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            {FiltersBody}
            <div className="mt-8 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={clearAll}>
                Reset
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
