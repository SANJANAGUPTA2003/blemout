import { useMemo } from 'react';
import FadeUp from '../ui/FadeUp';
import HomeProductCard from '../ui/HomeProductCard';
import HomeProductPager from './HomeProductPager';
import ApiMessage from '../ui/ApiMessage';
import { HOMEPAGE_EXPLORE_SLUGS } from '../../data/homepageConfig';
import { COLLECTION_SLUGS } from '../../data/storefrontConfig';
import { useProducts } from '../../context/ProductContext';

export default function ExploreMoreProducts() {
  const { loading, error, slow, retry, getBySlug } = useProducts();

  const products = useMemo(() => {
    const seen = new Set();
    const ordered = [...HOMEPAGE_EXPLORE_SLUGS, ...COLLECTION_SLUGS.shopAll];
    return ordered
      .map((slug) => getBySlug(slug))
      .filter(Boolean)
      .filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      });
  }, [getBySlug]);

  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1520px] px-5 md:px-8 lg:px-10 xl:px-12">
        <FadeUp>
          <div className="mb-10 text-center md:mb-12">
            <h2 className="section-heading">Explore More Products</h2>
          </div>
        </FadeUp>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`explore-skeleton-${index}`} className="animate-pulse">
                <div className="aspect-[4/5] w-full rounded-sm bg-[#eef2f1]" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#e8eceb]" />
                <div className="mt-3 h-10 w-full rounded-full bg-[#eef2f1]" />
              </div>
            ))}
          </div>
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
        ) : (
          <HomeProductPager>
            {products.map((product) => (
              <HomeProductCard key={product._id || product.slug} product={product} />
            ))}
          </HomeProductPager>
        )}
      </div>
    </section>
  );
}
