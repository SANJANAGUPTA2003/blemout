import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import ProductPlaceholder from '../components/ui/ProductPlaceholder';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { productPath } from '../data/productImages';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-32 text-center">
        <FadeUp>
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-semibold text-text">Your cart is empty</h1>
          <p className="mt-2 text-soft-text text-sm">Add some products to get started.</p>
          <Link to="/shop" className="inline-block mt-6">
            <Button>Continue Shopping</Button>
          </Link>
        </FadeUp>
      </div>
    );
  }

  const shipping = cartTotal >= 499 ? 0 : 49;
  const total = cartTotal + shipping;

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FadeUp>
          <h1 className="text-3xl font-semibold text-text mb-8">Shopping Cart</h1>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <FadeUp key={item._id} delay={i * 0.05}>
                <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-50">
                  <Link
                    to={productPath(item)}
                    className="w-24 h-24 shrink-0 bg-[#f7faf9] rounded-xl flex items-center justify-center overflow-hidden"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <ProductPlaceholder size="sm" className="rounded-xl" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={productPath(item)}>
                      <h3 className="font-medium text-text truncate hover:text-dark-teal transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-soft-text mt-0.5">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-gray-100 rounded-full">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1.5 hover:text-dark-teal transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1.5 hover:text-dark-teal transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1}>
            <div className="bg-ivory rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="font-semibold text-text mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-teal">Free shipping on prepaid orders!</p>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-text">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link to="/checkout" className="block mt-6">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
              <Link to="/shop" className="block mt-3 text-center text-sm text-gray-500 hover:text-teal">
                Continue Shopping
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
