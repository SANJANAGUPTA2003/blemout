import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Circle, Package, Truck, ShieldCheck, Ban, MapPin } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import SmartImage from '../components/ui/SmartImage';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import api from '../utils/api';
import { formatDate } from '../utils/format';
import { customerCancelReasons } from '../data/constants';

const TRACKING_ERROR = 'Order not found or details do not match.';

const steps = [
  { key: 'pending', label: 'Placed', icon: Package },
  { key: 'processing', label: 'Confirmed', icon: Circle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function statusLabel(order) {
  if (order?.statusLabel) return order.statusLabel;
  const value = String(order?.orderStatus || order?.status || '').toLowerCase();
  if (value === 'cancelled') return 'Cancelled';
  if (value === 'delivered') return 'Delivered';
  if (value === 'out_for_delivery') return 'Out for Delivery';
  if (value === 'in_transit') return 'In Transit';
  if (value === 'shipped') return 'Shipped';
  if (value === 'processing') return 'Confirmed';
  if (value === 'pending') return 'Placed';
  return value || 'Placed';
}

function paymentLabel(order) {
  const method = String(order?.paymentMethod || '').toLowerCase();
  const status = String(order?.paymentStatus || '').toLowerCase();
  if (method === 'cod') return status === 'paid' ? 'COD (collected)' : 'Cash on delivery';
  if (status === 'paid') return 'Paid online';
  if (status === 'failed') return 'Payment failed';
  return 'Payment pending';
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

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
    setNotice('');
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

  const confirmCancel = async () => {
    setCancelling(true);
    setError('');
    try {
      const { data } = await api.post('/orders/cancel', {
        orderId: orderId.trim().toUpperCase(),
        phone: phone.trim(),
        reason: cancelReason,
      });
      setOrder((prev) => ({
        ...prev,
        ...data,
        canCancel: false,
        orderStatus: data.orderStatus || 'cancelled',
        status: data.orderStatus || 'cancelled',
      }));
      setNotice(data.message || 'Your order has been cancelled successfully.');
      setConfirmOpen(false);
      setCancelReason('');
    } catch (err) {
      setError(
        err.response?.data?.message || "We couldn't cancel the order right now. Please try again."
      );
      setConfirmOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const currentStatus = order?.orderStatus || order?.status || '';
  const cancelled = String(currentStatus).toLowerCase() === 'cancelled';
  const timeline = Array.isArray(order?.timeline) && order.timeline.length ? order.timeline : steps;
  const canCancel = Boolean(order?.canCancel) && !cancelled;

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
              {notice && <p className="text-[15px] text-dark-teal">{notice}</p>}
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
              <SmartImage
                src="/track/track-order-banner.png"
                alt="Customer relaxing outdoors while waiting for a BLEMOUT order"
                role="banner"
                width={1200}
                height={900}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 720px"
                className="h-auto w-full object-contain object-center"
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
                <p
                  className={`text-[15px] font-semibold ${
                    cancelled ? 'text-red-600' : 'text-teal'
                  }`}
                >
                  {statusLabel(order)}
                </p>
              </div>

              {cancelled ? (
                <div className="border border-red-100 bg-[#fff7f7] p-4">
                  <Ban size={18} className="text-red-500" />
                  <p className="mt-3 text-[15px] font-semibold text-[#222222]">Cancelled</p>
                  <p className="mt-1 text-[15px] text-[#4a5560]">
                    This order is no longer active.
                    {order.cancelledAt ? ` Cancelled on ${formatDate(order.cancelledAt)}.` : ''}
                  </p>
                  {order.refundStatus === 'PENDING' && (
                    <p className="mt-2 text-[14px] text-[#4a5560]">
                      If you paid online, a refund will be processed to your original payment method.
                    </p>
                  )}
                  {order.refundStatus === 'REFUNDED' && (
                    <p className="mt-2 text-[14px] text-[#4a5560]">
                      A refund has been initiated to your original payment method.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {timeline.map((step) => {
                    const meta = steps.find((s) => s.key === step.key) || steps[0];
                    const Icon = meta.icon;
                    const done = Boolean(step.complete);
                    return (
                      <div
                        key={step.key}
                        className={`p-4 border ${done ? 'border-teal/40 bg-[#f7faf9]' : 'border-gray-100'}`}
                      >
                        <Icon size={18} className={done ? 'text-teal' : 'text-soft-text'} />
                        <p
                          className={`mt-3 text-[15px] font-semibold ${done ? 'text-text' : 'text-soft-text'}`}
                        >
                          {step.label || meta.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-10 space-y-2 text-[15px] text-[#4a5560]">
                <p>
                  <span className="font-semibold text-[#222222]">Payment:</span> {paymentLabel(order)}
                </p>
                {order.courier ? (
                  <p>
                    <span className="font-semibold text-[#222222]">Courier:</span> {order.courier}
                  </p>
                ) : null}
                {(order.awbNumber || order.trackingNumber) ? (
                  <p>
                    <span className="font-semibold text-[#222222]">AWB / Tracking:</span>{' '}
                    {order.awbNumber || order.trackingNumber}
                  </p>
                ) : null}
                {order.trackingUrl ? (
                  <p>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-dark-teal hover:text-teal"
                    >
                      Open courier tracking
                    </a>
                  </p>
                ) : null}
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

              {canCancel && (
                <div className="mt-8">
                  <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300" onClick={() => setConfirmOpen(true)}>
                    Cancel Order
                  </Button>
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

      <ConfirmDialog
        open={confirmOpen}
        title="Are you sure you want to cancel this order?"
        message="This cannot be undone. Eligible paid orders will be reviewed for a refund to the original payment method."
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        loading={cancelling}
        onCancel={() => {
          if (!cancelling) setConfirmOpen(false);
        }}
        onConfirm={confirmCancel}
      >
        <div className="mt-5">
          <label className="mb-1.5 block text-[15px] font-medium text-text">
            Reason <span className="font-normal text-soft-text">(optional)</span>
          </label>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] text-text focus:border-teal focus:outline-none focus:ring-2 focus:ring-light-teal"
          >
            <option value="">Select a reason</option>
            {customerCancelReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      </ConfirmDialog>
    </div>
  );
}
