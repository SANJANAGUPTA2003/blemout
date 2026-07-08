import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Copy, MessageCircle } from 'lucide-react';
import FadeUp from '../components/ui/FadeUp';
import Button from '../components/ui/Button';
import { buildOrderTrackingMessage, buildWhatsAppShareUrl } from '../utils/orderMessage';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || '';
  const customerName = location.state?.customerName || '';
  const [copied, setCopied] = useState(false);

  const copyOrderId = async () => {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = orderId
    ? buildWhatsAppShareUrl(buildOrderTrackingMessage({ orderId, customerName }))
    : null;

  return (
    <div className="py-32">
      <div className="max-w-lg mx-auto px-4 text-center">
        <FadeUp>
          <CheckCircle size={64} className="mx-auto text-teal mb-6" />
          <h1 className="text-3xl font-semibold text-text">Order Placed!</h1>
          <p className="mt-3 text-soft-text">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {orderId ? (
            <div className="mt-6 bg-mint-strong/25 rounded-2xl p-6">
              <p className="text-sm text-soft-text">Your Secure Order ID</p>
              <p className="text-2xl font-bold text-teal tracking-wider mt-1">{orderId}</p>
              <button
                type="button"
                onClick={copyOrderId}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-dark-teal hover:text-teal transition-colors"
              >
                <Copy size={16} />
                {copied ? 'Copied!' : 'Copy Order ID'}
              </button>
            </div>
          ) : (
            <p className="mt-6 text-sm text-soft-text">Your order confirmation details will arrive shortly.</p>
          )}

          <p className="mt-4 text-sm text-soft-text">
            Save this Order ID. You will need it along with your phone number to track your order.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {orderId && (
              <Link to={`/track-order?orderId=${encodeURIComponent(orderId)}`}>
                <Button className="w-full sm:w-auto">Track Order</Button>
              </Link>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full sm:w-auto gap-2">
                  <MessageCircle size={16} />
                  Share on WhatsApp
                </Button>
              </a>
            )}
            <Link to="/shop">
              <Button variant="secondary" className="w-full sm:w-auto">Continue Shopping</Button>
            </Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
