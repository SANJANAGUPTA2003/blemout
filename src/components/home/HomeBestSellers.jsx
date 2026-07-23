import { useMemo } from 'react';
import FadeUp from '../ui/FadeUp';
import HomeProductCard from '../ui/HomeProductCard';
import HomeProductPager from './HomeProductPager';
import { HOMEPAGE_BEST_SELLERS } from '../../data/homepageConfig';
import { COLLECTION_SLUGS } from '../../data/storefrontConfig';
import { useProducts } from '../../context/ProductContext';
import { getListingHoverImage, getListingImage } from '../../data/productDisplay';

export default function HomeBestSellers() {
  const { loading, getBySlug } = useProducts();

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

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
          <div className="mb-10 h-10 w-56 animate-pulse rounded bg-[#eef2f1]" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[5/6] rounded-sm bg-[#eef2f1]" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#e8eceb]" />
                <div className="mt-3 h-10 w-full rounded-full bg-[#eef2f1]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!cards.length) return null;

  return (
    <section className="relative z-10 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-10">
        <FadeUp>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
              Bestsellers
            </p>
            <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] md:text-[44px] lg:text-[48px]">
              Best Sellers
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#4a5560]">
              Five most-loved BLEMOUT picks — browse calmly, one page at a time.
            </p>
          </div>
        </FadeUp>

        <HomeProductPager>
          {cards.map((card) => (
            <HomeProductCard
              key={card.key}
              product={card.product}
              image={card.image}
              hoverImage={card.hoverImage}
              badge={card.badge}
              benefit={card.benefit}
              displayName={card.displayName}
              cartProducts={card.cartProducts}
            />
          ))}
        </HomeProductPager>
      </div>
    </section>
  );
}
