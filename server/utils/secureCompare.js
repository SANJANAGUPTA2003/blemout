import { createHmac, timingSafeEqual } from 'crypto';

export function timingSafeEqualString(left, right) {
  const a = Buffer.from(String(left || ''), 'utf8');
  const b = Buffer.from(String(right || ''), 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function expectedCheckoutSignature(razorpayOrderId, paymentId, secret) {
  return createHmac('sha256', String(secret || ''))
    .update(`${razorpayOrderId}|${paymentId}`)
    .digest('hex');
}

export function expectedWebhookSignature(rawBody, secret) {
  return createHmac('sha256', String(secret || ''))
    .update(String(rawBody || ''))
    .digest('hex');
}
