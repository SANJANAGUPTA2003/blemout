import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';

/**
 * Horizontal recommendation carousel for PDP cross-selling.
 */
export default function ProductRecommendCarousel({ products = [], title = 'You May Also Like' }) {
  const trackRef = useRef(null);

  if (!products.length) return null;

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(360, el.clientWidth * 0.75);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section className="mt-20 md:mt-28">
      <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
        <div>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-teal">
            Complete Your Routine
          </p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.03em] text-[#222222]">
            {title}
          </h2>
        </div>
        {products.length > 2 && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll recommendations left"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e0ebe9] bg-white text-[#222222] transition-colors hover:border-teal hover:text-teal"
            >
              <ChevronLeft size={20} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Scroll recommendations right"
              onClick={() => scrollBy(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-dark-teal"
            >
              <ChevronRight size={20} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((item) => (
          <div
            key={item._id || item.slug}
            className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[46vw] sm:max-w-[300px] md:w-[280px] lg:w-[300px]"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/shop" className="text-[15px] font-semibold text-dark-teal hover:text-teal">
          Browse all products →
        </Link>
      </div>
    </section>
  );
}
