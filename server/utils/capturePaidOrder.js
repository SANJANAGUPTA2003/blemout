import Order from '../models/Order.js';
import { decrementStock } from './checkout.js';
import { notifyOrderLifecycle } from '../services/notifications/index.js';
import {
  paidPaymentSet,
  paymentMatchesOrder,
  unpaidPaymentClaimFilter,
} from './paymentCapture.js';

export async function capturePaidOrder(order, { paymentId, signature = '', paymentEntity } = {}) {
  if (paymentEntity) {
    const match = paymentMatchesOrder(order, paymentEntity);
    if (!match.ok) {
      return { ok: false, statusCode: 400, message: 'Payment does not match this order.', reason: match.reason };
    }
  }

  if (order.paymentStatus === 'paid') {
    notifyOrderLifecycle(order, 'confirmation').catch(() => {});
    return { ok: true, alreadyPaid: true, order };
  }

  const claimed = await Order.findOneAndUpdate(
    unpaidPaymentClaimFilter(order._id),
    { $set: paidPaymentSet({ paymentId, signature }) },
    { new: true }
  );

  if (!claimed) {
    const latest = await Order.findById(order._id);
    if (latest) notifyOrderLifecycle(latest, 'confirmation').catch(() => {});
    return { ok: true, alreadyPaid: true, order: latest || order };
  }

  try {
    await decrementStock(claimed.items);
    claimed.stockDecremented = true;
    await claimed.save();
  } catch {
    // Payment already captured; inventory is an ops follow-up.
  }

  notifyOrderLifecycle(claimed, 'confirmation').catch(() => {});
  return { ok: true, alreadyPaid: false, order: claimed };
}
