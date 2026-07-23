import { useMemo } from 'react';
import FadeUp from '../ui/FadeUp';
import HomeProductCard from '../ui/HomeProductCard';
import HomeProductMarquee from './HomeProductMarquee';
import ApiMessage from '../ui/ApiMessage';
import { HOMEPAGE_EXPLORE_SLUGS } from '../../data/homepageConfig';
import { useProducts } from '../../context/ProductContext';

export default function ExploreMoreProducts() {
  const { loading, error, slow, retry, getBySlug } = useProducts();

  const products = useMemo(() => {
    const seen = new Set();
    return HOMEPAGE_EXPLORE_SLUGS.map((slug) => getBySlug(slug))
      .filter(Boolean)
      .filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      });
  }, [getBySlug]);

  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="mx-auto mb-10 max-w-[1400px] px-5 md:px-8 lg:px-10 md:mb-12">
        <FadeUp>
          <div className="max-w-xl">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
              Discover
            </p>
            <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] md:text-[44px] lg:text-[48px]">
              Explore More Products
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#4a5560]">
              The complete BLEMOUT lineup — five individual formulas.
            </p>
          </div>
        </FadeUp>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden px-5 md:px-8 lg:px-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`explore-skeleton-${index}`}
              className="w-[46vw] shrink-0 animate-pulse sm:w-[30vw] lg:w-[240px]"
            >
              <div className="aspect-square w-full rounded-sm bg-[#eef2f1]" />
              <div className="mt-4 h-4 w-3/4 rounded bg-[#e8eceb]" />
              <div className="mt-3 h-10 w-full rounded-full bg-[#eef2f1]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-5 md:px-8 lg:px-10">
          <ApiMessage
            type="offline"
            message={
              slow
                ? 'Products are taking a little longer to load. Please wait or retry.'
                : 'Unable to load products.'
            }
            onRetry={retry}
          />
        </div>
      ) : (
        <HomeProductMarquee className="px-5 md:px-8 lg:px-10" speed={28}>
          {products.map((product) => (
            <HomeProductCard key={product._id || product.slug} product={product} />
          ))}
        </HomeProductMarquee>
      )}
    </section>
  );
}
