import { useMemo } from 'react';
import FadeUp from '../ui/FadeUp';
import HomeProductCard from '../ui/HomeProductCard';
import HomeProductPager from './HomeProductPager';
import ApiMessage from '../ui/ApiMessage';
import { HOMEPAGE_BEST_SELLERS } from '../../data/homepageConfig';
import { COLLECTION_SLUGS } from '../../data/storefrontConfig';
import { useProducts } from '../../context/ProductContext';
import { getListingHoverImage, getListingImage } from '../../data/productDisplay';

function BestSellerSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] rounded-sm bg-[#eef2f1]" />
          <div className="mt-4 h-4 w-3/4 rounded bg-[#e8eceb]" />
          <div className="mt-3 h-10 w-full rounded-full bg-[#eef2f1]" />
        </div>
      ))}
    </div>
  );
}

export default function HomeBestSellers() {
  const { loading, error, slow, retry, getBySlug } = useProducts();

  const cards = useMemo(() => {
    const featured = HOMEPAGE_BEST_SELLERS.map((entry) => {
      const product = getBySlug(entry.slug);
      if (!product) return null;
      return {
        key: entry.key || entry.slug,
        product,
        cartProducts: [product],
        image: entry.image || product.imageUrl,
        hoverImage: entry.hoverImage || product.hoverImage || '',
        badge: entry.badge,
        benefit: entry.benefit,
        displayName: entry.displayName || product.name,
      };
    }).filter(Boolean);

    const featuredSlugs = new Set(featured.map((c) => c.product.slug));
    const extras = COLLECTION_SLUGS.bestSellers
      .map((slug) => getBySlug(slug))
      .filter(Boolean)
      .filter((p) => !featuredSlugs.has(p.slug))
      .map((product) => ({
        key: product.slug,
        product,
        cartProducts: [product],
        image: getListingImage(product),
        hoverImage: getListingHoverImage(product),
        badge: undefined,
        benefit: product.summary || '',
        displayName: product.name,
      }));

    return [...featured, ...extras];
  }, [getBySlug]);

  return (
    <section className="relative z-10 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1520px] px-5 md:px-8 lg:px-10 xl:px-12">
        <FadeUp>
          <div className="mb-10 text-center md:mb-12">
            <h2 className="section-heading">Best Sellers</h2>
          </div>
        </FadeUp>

        {cards.length ? (
          <HomeProductPager>
            {cards.map((card, i) => (
              <HomeProductCard
                key={card.key}
                product={card.product}
                image={card.image}
                hoverImage={card.hoverImage}
                badge={card.badge}
                benefit={card.benefit}
                displayName={card.displayName}
                cartProducts={card.cartProducts}
                priority={i < 2}
              />
            ))}
          </HomeProductPager>
        ) : loading ? (
          <BestSellerSkeleton />
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
        ) : null}
      </div>
    </section>
  );
}
