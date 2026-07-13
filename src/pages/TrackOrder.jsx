import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Circle, Package, Truck, ShieldCheck } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../utils/api';
import { formatDate } from '../utils/format';

const TRACKING_ERROR = 'Order not found or details do not match.';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: Circle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function statusIndex(status = '') {
  const value = status.toLowerCase();
  if (value.includes('deliver')) return 3;
  if (value.includes('ship')) return 2;
  if (value.includes('process') || value.includes('confirm')) return 1;
  return 0;
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('orderId');
    if (id) setOrderId(id);
  }, [searchParams]);

  const trackOrder = async (e) => {
    e?.preventDefault();
    const trimmedId = orderId.trim().toUpperCase();
    const trimmedPhone = phone.trim();

    if (!trimmedId || !trimmedPhone) {
      setError('Please enter both your Order ID and phone number.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data } = await api.post('/orders/track', {
        orderId: trimmedId,
        phone: trimmedPhone,
      });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || TRACKING_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const activeStep = order ? statusIndex(order.status) : -1;

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <FadeUp>
            <div className="aspect-[4/5] overflow-hidden bg-[#f7faf9]">
              <img
                src="/products/facewash/2.jpg"
                alt="BLEMOUT products"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.06}>
            <p className="text-[11px] tracking-[0.22em] uppercase text-teal font-semibold mb-3">
              Customer Service
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-text tracking-tight">
              Track Your Order
            </h1>
            <p className="mt-4 text-soft-text leading-relaxed max-w-md">
              Enter your secure Order ID and the phone number used at checkout.
              We verify both before showing status — never share your full order details publicly.
            </p>

            <form onSubmit={trackOrder} className="mt-8 space-y-4 max-w-md">
              <Input
                label="Order ID"
                placeholder="e.g. BLM-A7K9Q2"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              />
              <Input
                label="Phone Number"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Verifying...' : 'Track Order'}
              </Button>
            </form>

            <div className="mt-8 flex items-start gap-3 text-sm text-soft-text max-w-md">
              <ShieldCheck size={18} className="text-teal shrink-0 mt-0.5" />
              <p>
                Tracking is rate-limited and privacy-safe. Full customer details stay available only to authenticated admin.
              </p>
            </div>
          </FadeUp>
        </div>

        {order && (
          <FadeUp>
            <div className="mt-16 md:mt-20 max-w-3xl">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div>
                  <p className="text-xs tracking-[0.16em] uppercase text-soft-text font-semibold">Order</p>
                  <h2 className="mt-1 text-2xl font-semibold text-text">{order.orderId || order.publicOrderId}</h2>
                  {order.createdAt && (
                    <p className="mt-1 text-sm text-soft-text">Placed {formatDate(order.createdAt)}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-teal capitalize">{order.status || 'Placed'}</p>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= activeStep;
                  return (
                    <div
                      key={step.key}
                      className={`p-4 border ${done ? 'border-teal/40 bg-[#f7faf9]' : 'border-gray-100'}`}
                    >
                      <Icon size={18} className={done ? 'text-teal' : 'text-soft-text'} />
                      <p className={`mt-3 text-sm font-semibold ${done ? 'text-text' : 'text-soft-text'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {order.items?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-sm font-semibold text-text mb-4">Items</h3>
                  <ul className="space-y-3">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between gap-4 text-sm text-soft-text border-b border-gray-50 pb-3">
                        <span>{item.name} × {item.quantity || 1}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-8 text-sm text-soft-text">
                Need help?{' '}
                <Link to="/contact" className="text-dark-teal font-semibold hover:text-teal">
                  Contact support
                </Link>
              </p>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
