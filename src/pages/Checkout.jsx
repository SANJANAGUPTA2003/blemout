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

const cartPayload = (items) =>
  items.map((item) => ({
    productId: item._id,
    quantity: item.quantity,
  }));

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [paymentAvailable, setPaymentAvailable] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
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
  const onlinePayDisabled = !paymentAvailable && paymentMethod === 'razorpay';

  useEffect(() => {
    api
      .get('/payment/status')
      .then(({ data }) => {
        const available = Boolean(data.available);
        setPaymentAvailable(available);
        if (!available) setPaymentMethod('cod');
      })
      .catch(() => {
        setPaymentAvailable(false);
        setPaymentMethod('cod');
      })
      .finally(() => setCheckingPayment(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goToSuccess = (orderId) => {
    clearCart();
    navigate('/order-success', {
      state: { orderId, customerName: form.name, paymentMethod },
    });
  };

  const placeCodOrder = async () => {
    const { data } = await api.post('/orders', {
      customer: form,
      items: cartPayload(items),
    });
    const orderId = data.orderId || data.order?.orderId;
    if (!orderId) {
      throw new Error('Unable to place order.');
    }
    goToSuccess(orderId);
  };

  const startRazorpayCheckout = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      setError('Failed to load payment gateway. Please try again.');
      setLoading(false);
      return;
    }

    const { data: paymentOrder } = await api.post('/payment/create-order', {
      customer: form,
      items: cartPayload(items),
    });

    if (!paymentOrder.available) {
      setPaymentAvailable(false);
      setPaymentMethod('cod');
      setError(paymentOrder.message || PAYMENT_UNAVAILABLE_MESSAGE);
      setLoading(false);
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID || paymentOrder.key;
    if (!key) {
      setError('Payment is not configured. Please try Cash on Delivery or contact support.');
      setLoading(false);
      return;
    }

    const options = {
      key,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: 'BLEMOUT',
      description: 'Skincare Order',
      order_id: paymentOrder.id || paymentOrder.order_id,
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
            orderId: paymentOrder.orderId,
          });

          const orderId = data.order?.orderId;
          if (!orderId) {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
            return;
          }

          goToSuccess(orderId);
        } catch {
          setError('Payment verification failed. Please contact support with your payment details.');
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError('Payment was cancelled. Your order is not confirmed.');
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setError('Payment failed. Please try again.');
      setLoading(false);
    });
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToPolicies) {
      setError('Please agree to the Terms & Conditions and policies before placing your order.');
      return;
    }

    if (paymentMethod === 'razorpay' && !paymentAvailable) {
      setError(PAYMENT_UNAVAILABLE_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        await placeCodOrder();
        return;
      }

      await startRazorpayCheckout();
    } catch (err) {
      if (err.response?.status === 503) {
        setPaymentAvailable(false);
        setPaymentMethod('cod');
        setError(err.response?.data?.message || PAYMENT_UNAVAILABLE_MESSAGE);
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
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

                <div className="mt-5 space-y-2">
                  <p className="text-sm font-semibold text-text">Payment method</p>
                  <label className="flex items-center gap-3 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      disabled={!paymentAvailable}
                      className="accent-[#2DBEAD]"
                    />
                    Pay online (Razorpay)
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#2DBEAD]"
                    />
                    Cash on Delivery
                  </label>
                </div>

                {!checkingPayment && !paymentAvailable && (
                  <div className="mt-4 rounded-xl border border-teal/20 bg-mint-strong/40 px-4 py-3 text-sm text-dark-teal">
                    {PAYMENT_UNAVAILABLE_MESSAGE} You can still place a Cash on Delivery order.
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
                  disabled={loading || checkingPayment || !agreedToPolicies || onlinePayDisabled}
                >
                  {checkingPayment
                    ? 'Checking payment...'
                    : loading
                      ? 'Processing...'
                      : paymentMethod === 'cod'
                        ? 'Place COD Order'
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
