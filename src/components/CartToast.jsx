import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartToast() {
  const { toast, dismissToast, openDrawer } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-6 md:bottom-auto md:top-24 md:left-auto md:right-6 md:translate-x-0 w-[min(92vw,360px)] bg-white border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl px-4 py-3 flex items-start gap-3"
        >
          <span className="mt-0.5 w-7 h-7 rounded-full bg-teal/15 text-teal flex items-center justify-center shrink-0">
            <Check size={15} strokeWidth={2.5} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text">Added to cart</p>
            <p className="mt-0.5 text-xs text-soft-text line-clamp-1">{toast.name}</p>
            <button
              type="button"
              onClick={() => {
                dismissToast();
                openDrawer();
              }}
              className="mt-2 text-xs font-semibold text-dark-teal hover:text-teal transition-colors"
            >
              View Cart
            </button>
          </div>
          <Link
            to="/cart"
            onClick={dismissToast}
            className="text-[11px] font-semibold text-teal hover:text-dark-teal shrink-0 pt-0.5"
          >
            Open
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
