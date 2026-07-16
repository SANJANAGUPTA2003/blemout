import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCart } from '../context/CartContext';
import { BUSINESS, getShippingCharge } from '../data/business';
import api from '../utils/api';
import { formatPrice } from '../utils/format';
import { loadRazorpay } from '../utils/razorpay';

const PAYMENT_UNAVAILABLE_MESSAGE = 'Payment gateway will be activated soon.';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [paymentAvailable, setPaymentAvailable] = useState(true);
  const [error, setError] = useState('');
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const shipping = getShippingCharge(items);
  const total = cartTotal + shipping;

  useEffect(() => {
    api
      .get('/payment/status')
      .then(({ data }) => setPaymentAvailable(Boolean(data.available)))
      .catch(() => setPaymentAvailable(false))
      .finally(() => setCheckingPayment(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToPolicies) {
      setError('Please agree to the Terms & Conditions and policies before placing your order.');
      return;
    }

    if (!paymentAvailable) {
      setError(PAYMENT_UNAVAILABLE_MESSAGE);
      return;
    }

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

      if (!paymentOrder.available) {
        setPaymentAvailable(false);
        setError(paymentOrder.message || PAYMENT_UNAVAILABLE_MESSAGE);
        setLoading(false);
        return;
      }

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
      if (err.response?.status === 503) {
        setPaymentAvailable(false);
        setError(err.response?.data?.message || PAYMENT_UNAVAILABLE_MESSAGE);
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
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
                  <h2 className="font-bold text-text mb-2 text-lg">Shipping Details</h2>
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
                  <div className="pt-4 border-t border-gray-100 text-sm text-soft-text space-y-1">
                    <p className="font-semibold text-text">Sold by BLEMOUT</p>
                    <p>{BUSINESS.email}</p>
                    <p>{BUSINESS.address}</p>
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

                {!checkingPayment && !paymentAvailable && (
                  <div className="mt-4 rounded-xl border border-teal/20 bg-mint-strong/40 px-4 py-3 text-sm text-dark-teal">
                    {PAYMENT_UNAVAILABLE_MESSAGE}
                  </div>
                )}

                {error && (
                  <p className="mt-4 text-sm text-red-500">{error}</p>
                )}

                <div className="mt-5 flex items-start gap-3">
                  <input
                    id="checkout-policy-consent"
                    type="checkbox"
                    checked={agreedToPolicies}
                    onChange={(event) => setAgreedToPolicies(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#2DBEAD]"
                    aria-describedby="checkout-policy-copy"
                    required
                  />
                  <p id="checkout-policy-copy" className="text-[12px] leading-relaxed text-[#4a5560]">
                    By placing your order, you agree to our{' '}
                    <Link
                      to="/terms-and-conditions"
                      className="font-semibold text-dark-teal underline decoration-teal/40 underline-offset-2"
                    >
                      Terms &amp; Conditions
                    </Link>
                    ,{' '}
                    <Link
                      to="/privacy-policy"
                      className="font-semibold text-dark-teal underline decoration-teal/40 underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    ,{' '}
                    <Link
                      to="/shipping-policy"
                      className="font-semibold text-dark-teal underline decoration-teal/40 underline-offset-2"
                    >
                      Shipping Policy
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/return-refund-policy"
                      className="font-semibold text-dark-teal underline decoration-teal/40 underline-offset-2"
                    >
                      Return &amp; Refund Policy
                    </Link>
                    .
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={loading || checkingPayment || !paymentAvailable || !agreedToPolicies}
                >
                  {checkingPayment
                    ? 'Checking payment...'
                    : !paymentAvailable
                      ? 'Payment Coming Soon'
                      : loading
                        ? 'Processing...'
                        : 'Pay with Razorpay'}
                </Button>
              </div>
            </FadeUp>
          </div>
        </form>
      </div>
    </div>
  );
}
