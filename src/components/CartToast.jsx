import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import ProductPlaceholder from './ui/ProductPlaceholder';

/**
 * Premium teal sticky “Added to cart” bar.
 * Teal surface + white text; both CTAs are white with teal labels.
 */
export default function CartToast() {
  const { toast, dismissToast, openDrawer, isDrawerOpen } = useCart();
  const visible = Boolean(toast) && !isDrawerOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={toast.id}
          role="status"
          aria-live="polite"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '110%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[1400px] rounded-2xl bg-teal shadow-[0_16px_48px_rgba(42,127,128,0.35)] sm:inset-x-5 md:inset-x-8 md:bottom-5 lg:inset-x-10"
        >
          <div className="flex min-h-[80px] items-center gap-4 px-4 py-4 md:min-h-[88px] md:gap-8 md:px-7 md:py-5">
            <div className="flex min-w-0 flex-1 items-center gap-3.5 md:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 md:h-[72px] md:w-[72px]">
                {toast.imageUrl ? (
                  <img
                    src={toast.imageUrl}
                    alt=""
                    width="72"
                    height="72"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ProductPlaceholder size="sm" className="rounded-none" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                  Added to cart
                </p>
                <p className="mt-1 truncate text-[16px] font-semibold leading-snug text-white md:text-[18px]">
                  {toast.name}
                </p>
                {toast.price != null && (
                  <p className="mt-0.5 text-[15px] font-bold text-white md:text-[16px]">
                    {formatPrice(toast.price)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={dismissToast}
                className="min-w-[148px] rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-teal transition-all hover:bg-[#e8f7f5] md:min-w-[160px] md:text-[15px]"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => {
                  dismissToast();
                  openDrawer();
                }}
                className="min-w-[148px] rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-teal shadow-sm transition-all hover:bg-[#e8f7f5] hover:shadow-[0_6px_18px_rgba(255,255,255,0.25)] md:min-w-[160px] md:text-[15px]"
              >
                View Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
