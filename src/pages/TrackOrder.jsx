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
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-16">
          <FadeUp>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-teal">
              Customer Service
            </p>
            <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-[#222222]">
              Track Your Order
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#4a5560] md:text-[18px]">
              Stay updated on your BLEMOUT order from dispatch to delivery.
            </p>
            <p className="mt-2 max-w-md text-[16px] leading-relaxed text-[#4a5560]">
              Enter your Order ID to check the latest status.
            </p>
            <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
              Secure Tracking · Quick Updates · Hassle-Free Experience
            </p>

            <form onSubmit={trackOrder} className="mt-9 space-y-5 max-w-md">
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
              {error && <p className="text-[15px] text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Verifying...' : 'Track Order'}
              </Button>
            </form>

            <div className="mt-8 flex max-w-md items-start gap-3 text-[15px] text-[#4a5560]">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-teal" />
              <p>
                Tracking is rate-limited and privacy-safe. Full customer details stay available
                only to authenticated admin.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.06}>
            <div className="overflow-hidden rounded-2xl bg-[#f4f7f6] p-3 md:p-5">
              <img
                src="/track/track-order-banner.png"
                alt="Customer relaxing outdoors while waiting for a BLEMOUT order"
                width="1200"
                height="900"
                className="h-auto w-full object-contain object-center"
                loading="eager"
                decoding="async"
              />
            </div>
          </FadeUp>
        </div>

        {order && (
          <FadeUp>
            <div className="mt-16 max-w-3xl md:mt-20">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                    Order
                  </p>
                  <h2 className="mt-1 text-[28px] font-semibold text-[#222222]">
                    {order.orderId || order.publicOrderId}
                  </h2>
                  {order.createdAt && (
                    <p className="mt-1 text-[15px] text-[#4a5560]">
                      Placed {formatDate(order.createdAt)}
                    </p>
                  )}
                </div>
                <p className="text-[15px] font-semibold capitalize text-teal">
                  {order.status || 'Placed'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= activeStep;
                  return (
                    <div
                      key={step.key}
                      className={`p-4 border ${done ? 'border-teal/40 bg-[#f7faf9]' : 'border-gray-100'}`}
                    >
                      <Icon size={18} className={done ? 'text-teal' : 'text-soft-text'} />
                      <p
                        className={`mt-3 text-[15px] font-semibold ${done ? 'text-text' : 'text-soft-text'}`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {order.items?.length > 0 && (
                <div className="mt-10">
                  <h3 className="mb-4 text-[16px] font-semibold text-[#222222]">Items</h3>
                  <ul className="space-y-3">
                    {order.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between gap-4 border-b border-gray-50 pb-3 text-[15px] text-[#4a5560]"
                      >
                        <span>
                          {item.name} × {item.quantity || 1}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-8 text-[15px] text-[#4a5560]">
                Need help?{' '}
                <Link to="/contact" className="font-semibold text-dark-teal hover:text-teal">
                  Contact us
                </Link>
              </p>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
