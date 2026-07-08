const PLACEHOLDER_PATTERNS = [
  'your_key_id',
  'your_razorpay',
  'your_key_secret',
  'changeme',
  'placeholder',
];

function isPlaceholder(value) {
  if (!value || typeof value !== 'string') return true;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function isRazorpayConfigured() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return !isPlaceholder(keyId) && !isPlaceholder(keySecret);
}

export const PAYMENT_UNAVAILABLE_MESSAGE = 'Payment gateway will be activated soon.';
