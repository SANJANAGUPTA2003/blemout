import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import Button from './ui/Button';
import ProductPlaceholder from './ui/ProductPlaceholder';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    cartTotal,
    lastAddedId,
  } = useCart();
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen || !panelRef.current) return undefined;
    const focusables = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const onTab = (e) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    panelRef.current.addEventListener('keydown', onTab);
    return () => panelRef.current?.removeEventListener('keydown', onTab);
  }, [isDrawerOpen, items]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[80] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={closeDrawer}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your Cart"
            className="fixed top-0 right-0 z-[90] h-full w-full max-w-[100vw] sm:max-w-[420px] bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.08)] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-text">Your Cart</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeDrawer}
                className="p-2 text-soft-text hover:text-dark-teal transition-colors"
                aria-label="Close cart drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-sm text-soft-text py-10 text-center">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className={`flex gap-3 pb-4 border-b border-gray-50 ${
                        item._id === lastAddedId ? 'bg-[#f7faf9] -mx-2 px-2 pt-2 rounded-lg' : ''
                      }`}
                    >
                      <div className="w-20 h-20 shrink-0 border-0 bg-transparent flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <ProductPlaceholder size="sm" className="rounded-none" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="mt-1 text-xs text-soft-text">Size: {item.size}</p>
                        )}
                        <p className="mt-1 text-sm font-bold text-text">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center border border-gray-200 rounded-full">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-1.5 text-soft-text hover:text-dark-teal"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1.5 text-soft-text hover:text-dark-teal"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => removeFromCart(item._id)}
                            className="p-1.5 text-soft-text hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-3 border-t border-gray-100 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-soft-text">Subtotal</span>
                <span className="font-bold text-text">{formatPrice(cartTotal)}</span>
              </div>
              <Link to="/checkout" onClick={closeDrawer} className="block">
                <Button className="w-full" disabled={items.length === 0}>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/cart" onClick={closeDrawer} className="block">
                <Button variant="outline" className="w-full">
                  View Cart
                </Button>
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full rounded-full border border-teal bg-white py-3 text-center text-[15px] font-semibold text-teal transition-colors hover:bg-[#e8f7f5]"
              >
                Continue Shopping
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
