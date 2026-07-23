import { useEffect, useState } from 'react';
import { formatPrice } from '../../utils/format';

/**
 * Sticky PDP purchase bar — matches the teal “Added to cart” confirmation styling.
 */
export default function StickyPurchaseBar({
  targetRef,
  productName,
  price,
  imageUrl,
  onAdd,
  hidden,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = targetRef?.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetRef]);

  if (!show || hidden) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-[1400px] rounded-2xl bg-teal shadow-[0_16px_48px_rgba(42,127,128,0.35)] sm:inset-x-5 md:inset-x-8 md:bottom-5 lg:inset-x-10">
      <div className="flex min-h-[72px] items-center gap-4 px-4 py-3.5 md:min-h-[80px] md:gap-6 md:px-7 md:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3.5 md:gap-4">
          {imageUrl && (
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 sm:flex md:h-16 md:w-16">
              <img
                src={imageUrl}
                alt=""
                width="64"
                height="64"
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-snug text-white md:text-[17px]">
              {productName}
            </p>
            <p className="mt-0.5 text-[15px] font-bold text-white md:text-[16px]">
              {formatPrice(price)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded-full bg-white px-6 py-2.5 text-[14px] font-bold text-teal shadow-sm transition-all hover:bg-[#e8f7f5] hover:shadow-[0_6px_18px_rgba(255,255,255,0.25)] md:px-8 md:py-3 md:text-[15px]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
