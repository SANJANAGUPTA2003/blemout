import { useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FadeUp from '../ui/FadeUp';
import ProductCard from '../ui/ProductCard';
import ApiMessage from '../ui/ApiMessage';
import { useProducts } from '../../context/ProductContext';

export default function ExploreMoreProducts() {
  const { products: allProducts, loading, error, slow, retry } = useProducts();
  const products = useMemo(
    () => allProducts.filter((p) => !p.isCombo).slice(0, 8),
    [allProducts]
  );
  const trackRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const scrollByCard = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-carousel-item]');
    const amount = card ? card.getBoundingClientRect().width + 32 : 360;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, []);

  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    };
  };

  const onPointerMove = (e) => {
    const el = trackRef.current;
    if (!el || !dragRef.current.active) return;
    e.preventDefault();
    el.scrollLeft = dragRef.current.scrollLeft - (e.clientX - dragRef.current.startX);
  };

  const endDrag = () => {
    dragRef.current.active = false;
  };

  return (
    <section className="relative py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 mb-10 md:mb-12 flex items-end justify-between gap-4">
        <FadeUp>
          <div className="max-w-xl">
            <p className="text-[12px] tracking-[0.16em] uppercase text-teal font-bold mb-3">
              Discover
            </p>
            <h2 className="text-[36px] md:text-[44px] lg:text-[48px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.1]">
              Explore More Products
            </h2>
            <p className="mt-4 text-[16px] text-[#4a5560] leading-relaxed">
              Shop the complete BLEMOUT lineup in one smooth product row.
            </p>
          </div>
        </FadeUp>
        {!loading && products.length > 0 && (
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              aria-label="Scroll discover products left"
              onClick={() => scrollByCard(-1)}
              className="w-10 h-10 rounded-full bg-[#f6f7f6] flex items-center justify-center text-[#26313D] hover:text-dark-teal hover:bg-[#eef1f0] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Scroll discover products right"
              onClick={() => scrollByCard(1)}
              className="w-10 h-10 rounded-full bg-[#f6f7f6] flex items-center justify-center text-[#26313D] hover:text-dark-teal hover:bg-[#eef1f0] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex gap-6 md:gap-8 overflow-hidden px-5 md:px-8 lg:px-10">
          {[0, 1, 2].map((index) => (
            <div
              key={`explore-skeleton-${index}`}
              className="shrink-0 w-[82vw] sm:w-[46vw] lg:w-[min(420px,calc((100vw-6rem)/3))] animate-pulse"
            >
              <div className="aspect-square w-full rounded-sm bg-[#eef2f1]" />
              <div className="mt-4 mx-auto h-4 w-3/4 rounded bg-[#e8eceb]" />
              <div className="mt-3 mx-auto h-3 w-1/2 rounded bg-[#eef2f1]" />
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
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 overflow-x-auto px-5 md:px-8 lg:px-10 pb-2 scrollbar-none cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          {products.map((product) => (
            <div
              key={product._id}
              data-carousel-item
              className="shrink-0 w-[82vw] sm:w-[46vw] lg:w-[min(420px,calc((100vw-6rem)/3))] xl:w-[min(430px,420px)]"
            >
              <ProductCard product={product} imageMode="promo" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
