import { Children, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 5;

/**
 * Calm paged product strip: show 5 cards, arrow advances one page at a time.
 * No autoplay / infinite marquee.
 */
export default function HomeProductPager({ children, className = '' }) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const [page, setPage] = useState(0);

  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * PAGE_SIZE;

  const go = (dir) => {
    setPage((p) => {
      const next = p + dir;
      if (next < 0) return pageCount - 1;
      if (next >= pageCount) return 0;
      return next;
    });
  };

  if (!items.length) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden">
        <div
          key={safePage}
          className="grid grid-cols-2 gap-x-4 gap-y-10 animate-[pagerFade_420ms_ease] sm:grid-cols-3 md:gap-x-5 lg:grid-cols-5 lg:gap-x-6"
        >
          {items.slice(start, start + PAGE_SIZE).map((child, i) => (
            <div key={`page-${safePage}-${i}`} className="min-w-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-end gap-3 md:mt-10">
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => go(-1)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d7ebe8] bg-white text-[#222222] shadow-sm transition-colors hover:border-teal hover:text-dark-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <ChevronLeft size={22} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => go(1)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white shadow-sm transition-colors hover:bg-dark-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <ChevronRight size={22} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
