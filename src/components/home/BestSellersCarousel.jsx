import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';

function chunk(list, size) {
  const pages = [];
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size));
  }
  return pages.length ? pages : [[]];
}

export default function BestSellersCarousel({ products = [] }) {
  const pages = useMemo(() => chunk(products, 4), [products]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const go = useCallback(
    (next) => {
      if (!pages.length) return;
      setIndex((current) => (next + pages.length) % pages.length);
    },
    [pages.length]
  );

  useEffect(() => {
    if (paused || pages.length <= 1) return undefined;
    const timer = window.setInterval(() => go(index + 1), 5000);
    return () => window.clearInterval(timer);
  }, [paused, pages.length, index, go]);

  if (!products.length) return null;

  return (
    <section
      className="relative py-16 md:py-24 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] tracking-[0.22em] uppercase text-teal font-bold mb-3">
            Bestsellers
          </p>
          <h2 className="text-[34px] md:text-[42px] font-bold text-text tracking-tight">
            Best Sellers
          </h2>
          <p className="mt-3 text-[16px] text-soft-text max-w-md">
            The most-loved BLEMOUT formulas and routines, curated for everyday clarity.
          </p>
        </div>
        {pages.length > 1 && (
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => go(index - 1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-soft-text hover:text-dark-teal hover:border-teal/40 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => go(index + 1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-soft-text hover:text-dark-teal hover:border-teal/40 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 overflow-hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX;
          if (start == null || end == null) return;
          const delta = end - start;
          if (Math.abs(delta) < 40) return;
          go(delta < 0 ? index + 1 : index - 1);
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {page.map((product) => (
                <ProductCard key={product._id} product={product} imageMode="promo" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-teal' : 'w-1.5 bg-gray-300 hover:bg-teal/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
