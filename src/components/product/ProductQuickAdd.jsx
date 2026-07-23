import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/format';
import { getListingImage } from '../../data/productDisplay';
import { getSellingPrice } from '../../data/business';
import { useCart } from '../../context/CartContext';

export default function ProductQuickAdd({
  product,
  disabled,
  onOpenChange,
}) {
  const { addToCart, isDrawerOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const addedRef = useRef(false);
  const timerRef = useRef(null);

  const storageKey = product ? `blemout_quickadd_${product.slug}` : '';

  useEffect(() => {
    setVisible(false);
    setDismissed(false);
    addedRef.current = false;
    if (!product?.slug) return undefined;
    if (sessionStorage.getItem(storageKey) === '1') return undefined;

    timerRef.current = window.setTimeout(() => {
      if (addedRef.current) return;
      if (sessionStorage.getItem(storageKey) === '1') return;
      setVisible(true);
    }, 120000);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [product?.slug, storageKey]);

  useEffect(() => {
    onOpenChange?.(visible && !dismissed && !disabled && !isDrawerOpen);
  }, [visible, dismissed, disabled, isDrawerOpen, onOpenChange]);

  if (!product || dismissed || !visible || disabled || isDrawerOpen) return null;
  if (typeof window !== 'undefined' && window.innerWidth < 380) return null;

  const price = getSellingPrice(product);
  const thumb = getListingImage(product);

  const close = () => {
    sessionStorage.setItem(storageKey, '1');
    setDismissed(true);
    setVisible(false);
  };

  const add = () => {
    addedRef.current = true;
    addToCart({ ...product, price }, 1);
    sessionStorage.setItem(storageKey, '1');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] hidden w-[min(calc(100vw-2rem),320px)] rounded-xl border border-[#eef1f0] bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:flex sm:items-center sm:gap-3">
      <img
        src={thumb}
        alt=""
        className="h-14 w-14 shrink-0 object-contain bg-[#fafafa]"
        width="56"
        height="56"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[#222222]">{product.name}</p>
        <p className="mt-0.5 text-[13px] font-bold text-[#222222]">{formatPrice(price)}</p>
        <Button type="button" size="sm" className="mt-2 w-full" onClick={add}>
          Add to Cart
        </Button>
      </div>
      <button type="button" onClick={close} className="absolute right-2 top-2 p-1 text-[#6b7280]" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
