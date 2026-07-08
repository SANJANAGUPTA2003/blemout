import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { formatPrice } from '../utils/format';
import { loadRazorpay } from '../utils/razorpay';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const shipping = cartTotal >= 499 ? 0 : 49;
  const total = cartTotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const { data: paymentOrder } = await api.post('/payment/create-order', {
        amount: total,
      });

      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'BLEMOUT',
        description: 'Skincare Order',
        order_id: paymentOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#2DBEAD' },
        handler: async (response) => {
          try {
            const { data } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: form,
              items: items.map((item) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
              totalAmount: total,
            });

            clearCart();
            navigate('/order-success', {
              state: { orderId: data.order.orderId, customerName: form.name },
            });
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="text-gray-400 mb-4">Your cart is empty.</p>
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FadeUp>
          <h1 className="text-3xl font-semibold text-text mb-8">Checkout</h1>
        </FadeUp>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <FadeUp>
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="font-semibold text-text mb-2">Shipping Details</h2>
                  <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <Input label="Address" name="address" value={form.address} onChange={handleChange} required />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label="City" name="city" value={form.city} onChange={handleChange} required />
                    <Input label="State" name="state" value={form.state} onChange={handleChange} required />
                    <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
                  </div>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.1}>
              <div className="bg-ivory rounded-2xl p-6 h-fit sticky top-24">
                <h2 className="font-semibold text-text mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                      <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-text pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-500">{error}</p>
                )}

                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? 'Processing...' : 'Pay with Razorpay'}
                </Button>
              </div>
            </FadeUp>
          </div>
        </form>
      </div>
    </div>
  );
}
