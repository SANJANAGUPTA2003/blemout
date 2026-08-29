import { useMemo } from 'react';
import FadeUp from '../components/ui/FadeUp';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import ApiMessage from '../components/ui/ApiMessage';
import { useProducts } from '../context/ProductContext';
import { COLLECTION_SLUGS } from '../data/storefrontConfig';
import { resolveBySlugs } from '../data/productDisplay';

const SLUG_MAP = {
  new: COLLECTION_SLUGS.new,
  'best-sellers': COLLECTION_SLUGS.bestSellers,
  'limited-picks': COLLECTION_SLUGS.limitedPicks,
};

export default function CollectionPage({
  collection,
  title,
}) {
  const { products, loading, error, slow, retry } = useProducts();
  const list = useMemo(() => {
    const slugs = SLUG_MAP[collection];
    if (slugs) return resolveBySlugs(products, slugs);
    return [];
  }, [products, collection]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <FadeUp>
          <h1 className="text-center text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222]">
            {title}
          </h1>
        </FadeUp>

        <div className="mt-12 md:mt-14">
          {loading ? (
            <ProductSkeleton count={6} />
          ) : error ? (
            <ApiMessage
              type="offline"
              message={
                slow
                  ? 'Products are taking a little longer to load. Please wait or retry.'
                  : 'Unable to load this collection.'
              }
              onRetry={retry}
            />
          ) : list.length === 0 ? (
            <ApiMessage type="empty" message="No products in this collection yet." />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16">
              {list.map((product) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
