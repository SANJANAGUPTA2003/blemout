import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Circle, Package, Truck } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SectionHeading from '../components/ui/SectionHeading';
import api from '../utils/api';
import { formatDate } from '../utils/format';

const TRACKING_ERROR = 'Order not found or details do not match.';

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

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <FadeUp>
          <SectionHeading
            title="Track Your Order"
            subtitle="Enter your secure Order ID and the phone number used at checkout."
          />
        </FadeUp>

        <FadeUp delay={0.1}>
          <form onSubmit={trackOrder} className="space-y-4 mb-10">
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
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Verifying...' : 'Track Order'}
            </Button>
          </form>
        </FadeUp>

        {error && (
          <FadeUp>
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl text-center mb-6">
              {error}
            </div>
          </FadeUp>
        )}

        {order && (
          <FadeUp delay={0.15}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-soft-text">Order ID</p>
                  <p className="text-xl font-bold text-teal tracking-wide">{order.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-soft-text">Placed on</p>
                  <p className="text-sm font-medium text-text">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl bg-soft-blue p-4">
                  <p className="text-xs text-soft-text uppercase tracking-wide">Order Status</p>
                  <p className="mt-1 text-sm font-semibold text-text capitalize">{order.orderStatus}</p>
                </div>
                <div className="rounded-xl bg-soft-blue p-4">
                  <p className="text-xs text-soft-text uppercase tracking-wide">Payment</p>
                  <p className="mt-1 text-sm font-semibold text-text capitalize">{order.paymentStatus}</p>
                </div>
              </div>

              {order.orderStatus === 'cancelled' ? (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl text-center">
                  This order has been cancelled.
                </div>
              ) : (
                <div className="relative pl-8 space-y-8">
                  {order.timeline?.map((step, i) => (
                    <div key={step.key} className="relative">
                      {i < (order.timeline?.length || 0) - 1 && (
                        <div
                          className={`absolute left-[-20px] top-6 w-0.5 h-full ${
                            step.complete ? 'bg-teal' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      <div className="flex items-center gap-3">
                        {step.complete ? (
                          <CheckCircle
                            size={24}
                            className={`absolute left-[-32px] ${step.current ? 'text-teal' : 'text-mid-teal'}`}
                          />
                        ) : (
                          <Circle size={24} className="absolute left-[-32px] text-gray-300" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${step.complete ? 'text-text' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {step.current && (
                            <p className="text-xs text-teal mt-0.5">Current status</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(order.trackingNumber || order.estimatedDelivery) && (
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  {order.trackingNumber && (
                    <div className="flex items-start gap-3 rounded-xl bg-mint-strong/30 p-4">
                      <Truck size={18} className="text-teal mt-0.5" />
                      <div>
                        <p className="text-xs text-soft-text">Tracking Number</p>
                        <p className="text-sm font-medium text-text">{order.trackingNumber}</p>
                      </div>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div className="rounded-xl bg-mint-strong/30 p-4">
                      <p className="text-xs text-soft-text">Estimated Delivery</p>
                      <p className="text-sm font-medium text-text">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={16} className="text-teal" />
                  <span className="text-sm font-medium text-text">Order Items</span>
                </div>
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-soft-text py-1.5">
                    <span>{item.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
