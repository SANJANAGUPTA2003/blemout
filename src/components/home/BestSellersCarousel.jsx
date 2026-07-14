import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';

export default function BestSellersCarousel({ products = [] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const el = trackRef.current;
    if (!el || products.length === 0) return undefined;

    let raf;
    const step = () => {
      if (!paused && !dragRef.current.active) {
        el.scrollLeft += 0.55;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, products.length]);

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

  if (!products.length) return null;

  const looped = [...products, ...products];

  return (
    <section
      className="relative py-16 md:py-24 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 mb-10 md:mb-12 flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] tracking-[0.16em] uppercase text-teal font-bold mb-3">
            Bestsellers
          </p>
          <h2 className="text-[36px] md:text-[44px] lg:text-[48px] font-bold text-[#222222] tracking-[-0.03em] leading-[1.1]">
            Best Sellers
          </h2>
          <p className="mt-3 text-[16px] text-[#4a5560] max-w-md leading-relaxed">
            The most-loved BLEMOUT formulas and routines, curated for everyday clarity.
          </p>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button
            type="button"
            aria-label="Scroll bestsellers left"
            onClick={() => scrollByCard(-1)}
            className="w-10 h-10 rounded-full bg-[#f6f7f6] flex items-center justify-center text-[#26313D] hover:text-dark-teal hover:bg-[#eef1f0] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Scroll bestsellers right"
            onClick={() => scrollByCard(1)}
            className="w-10 h-10 rounded-full bg-[#f6f7f6] flex items-center justify-center text-[#26313D] hover:text-dark-teal hover:bg-[#eef1f0] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

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
        {looped.map((product, i) => (
          <div
            key={`${product._id}-${i}`}
            data-carousel-item
            className="shrink-0 w-[82vw] sm:w-[46vw] lg:w-[min(420px,calc((100vw-6rem)/3))] xl:w-[min(430px,420px)]"
          >
            <ProductCard product={product} imageMode="promo" />
          </div>
        ))}
      </div>
    </section>
  );
}
