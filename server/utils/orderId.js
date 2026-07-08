import crypto from 'crypto';
import Order from '../models/Order.js';

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomSuffix(length = 6) {
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i] % CHARSET.length];
  }
  return result;
}

export async function generateOrderId() {
  for (let attempt = 0; attempt < 12; attempt++) {
    const orderId = `BLM-${randomSuffix(6)}`;
    const exists = await Order.exists({ orderId });
    if (!exists) return orderId;
  }
  throw new Error('Could not generate a unique order ID');
}
