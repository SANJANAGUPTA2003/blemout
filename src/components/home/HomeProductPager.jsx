import { Children, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomeProductPageSize } from '../../hooks/useHomeProductPageSize';

/**
 * Calm paged product strip: responsive card count per viewport.
 * No autoplay / infinite marquee.
 */
export default function HomeProductPager({ children, className = '' }) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const { pageSize, gridClass } = useHomeProductPageSize();
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;

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
          key={`${safePage}-${pageSize}`}
          className={`grid ${gridClass} items-stretch gap-x-5 gap-y-12 animate-[pagerFade_420ms_ease] md:gap-x-6 lg:gap-x-8 xl:gap-x-10`}
        >
          {items.slice(start, start + pageSize).map((child, i) => (
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
