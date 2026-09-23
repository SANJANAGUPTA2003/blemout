import Order from '../models/Order.js';
import { isRazorpayConfigured } from '../utils/razorpayConfig.js';
import { capturePaidOrder } from '../utils/capturePaidOrder.js';
import { parseRazorpayWebhookPayload } from '../utils/paymentCapture.js';
import { expectedWebhookSignature, timingSafeEqualString } from '../utils/secureCompare.js';
import { isBlemoutOrderId } from '../utils/adminOrder.js';

function webhookSecret() {
  return String(process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
}

export function isRazorpayWebhookConfigured() {
  return Boolean(webhookSecret());
}

export const handleRazorpayWebhook = async (req, res) => {
  if (!isRazorpayWebhookConfigured() || !isRazorpayConfigured()) {
    return res.status(503).json({ message: 'Payment webhook is not configured.' });
  }

  const rawBody = req.rawBody || (Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body || {}));
  const provided = String(req.headers['x-razorpay-signature'] || '');
  const expected = expectedWebhookSignature(rawBody, webhookSecret());
  if (!timingSafeEqualString(expected, provided)) {
    return res.status(401).json({ message: 'Invalid webhook signature.' });
  }

  let body = req.body;
  if (Buffer.isBuffer(body) || typeof body === 'string') {
    try {
      body = JSON.parse(String(rawBody));
    } catch {
      return res.status(400).json({ message: 'Invalid webhook payload.' });
    }
  }

  const parsed = parseRazorpayWebhookPayload(body);
  if (!parsed.isPaidEvent) {
    return res.json({ ok: true, ignored: true, reason: 'unhandled_event' });
  }
  if (!parsed.paymentId || !parsed.razorpayOrderId) {
    return res.status(400).json({ message: 'Unable to identify payment.' });
  }

  let order = await Order.findOne({ razorpayOrderId: parsed.razorpayOrderId });
  if (!order && isBlemoutOrderId(parsed.receipt)) {
    order = await Order.findOne({ orderId: String(parsed.receipt).toUpperCase() });
  }
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const result = await capturePaidOrder(order, {
    paymentId: parsed.paymentId,
    paymentEntity: parsed.payment,
  });
  if (!result.ok) {
    return res.status(result.statusCode || 400).json({ message: result.message });
  }

  return res.json({
    ok: true,
    alreadyPaid: Boolean(result.alreadyPaid),
    orderId: result.order.orderId,
  });
};
