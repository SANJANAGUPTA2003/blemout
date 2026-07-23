import { useMemo } from 'react';
import FadeUp from '../ui/FadeUp';
import HomeProductCard from '../ui/HomeProductCard';
import HomeProductMarquee from './HomeProductMarquee';
import { HOMEPAGE_BEST_SELLERS } from '../../data/homepageConfig';
import { useProducts } from '../../context/ProductContext';

export default function HomeBestSellers() {
  const { loading, getBySlug } = useProducts();

  const cards = useMemo(() => {
    return HOMEPAGE_BEST_SELLERS.map((entry) => {
      const product = getBySlug(entry.slug);
      if (!product) return null;
      return {
        product,
        cartProducts: [product],
        image: entry.image || product.imageUrl,
        hoverImage: entry.hoverImage || product.hoverImage || '',
        badge: entry.badge,
        benefit: entry.benefit,
        displayName: entry.displayName || product.name,
      };
    }).filter(Boolean);
  }, [getBySlug]);

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto mb-10 max-w-[1400px] px-5 md:px-8 lg:px-10 md:mb-12">
          <div className="h-10 w-56 animate-pulse rounded bg-[#eef2f1]" />
        </div>
        <div className="flex gap-4 overflow-hidden px-5 md:px-8 lg:px-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[46vw] shrink-0 animate-pulse sm:w-[30vw] lg:w-[240px]">
              <div className="aspect-square rounded-sm bg-[#eef2f1]" />
              <div className="mt-4 h-4 w-3/4 rounded bg-[#e8eceb]" />
              <div className="mt-3 h-10 w-full rounded-full bg-[#eef2f1]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!cards.length) return null;

  return (
    <section className="relative z-10 bg-white py-16 md:py-24">
      <div className="mx-auto mb-10 max-w-[1400px] px-5 md:px-8 lg:px-10 md:mb-12">
        <FadeUp>
          <div className="max-w-xl">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
              Bestsellers
            </p>
            <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#222222] md:text-[44px] lg:text-[48px]">
              Best Sellers
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#4a5560]">
              Five most-loved BLEMOUT picks — curated combos and everyday essentials.
            </p>
          </div>
        </FadeUp>
      </div>

      <HomeProductMarquee className="px-5 md:px-8 lg:px-10" speed={30}>
        {cards.map((card) => (
          <HomeProductCard
            key={card.displayName}
            product={card.product}
            image={card.image}
            hoverImage={card.hoverImage}
            badge={card.badge}
            benefit={card.benefit}
            displayName={card.displayName}
            cartProducts={card.cartProducts}
          />
        ))}
      </HomeProductMarquee>
    </section>
  );
}
