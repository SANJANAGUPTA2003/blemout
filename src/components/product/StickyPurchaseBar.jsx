import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/format';

export default function StickyPurchaseBar({
  targetRef,
  productName,
  price,
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
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#eef1f0] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#222222] md:text-[15px]">
            {productName}
          </p>
          <p className="text-[14px] font-bold text-[#222222]">{formatPrice(price)}</p>
        </div>
        <Button type="button" size="sm" onClick={onAdd} className="shrink-0">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
