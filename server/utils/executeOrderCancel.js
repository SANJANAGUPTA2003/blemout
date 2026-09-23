import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import { restoreStock } from './checkout.js';
import { isRazorpayConfigured } from './razorpayConfig.js';
import {
  ADMIN_CANCELLABLE,
  CUSTOMER_CANCELLABLE,
  customerCancelBlockedMessage,
  shouldRestoreStock,
  stockRestoreClaimFilter,
} from './orderCancel.js';
import { notifyOrderLifecycle } from '../services/notifications/index.js';

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function refundAmountPaise(order) {
  return Math.round(Number(order.totalAmount || 0) * 100);
}

function needsRefund(order) {
  return (
    order.paymentMethod === 'razorpay' &&
    order.paymentStatus === 'paid' &&
    Boolean(order.razorpayPaymentId)
  );
}

async function attemptRefund(order) {
  if (!needsRefund(order)) {
    return { refundStatus: 'NOT_APPLICABLE', razorpayRefundId: order.razorpayRefundId || '' };
  }

  if (order.refundStatus === 'REFUNDED' && order.razorpayRefundId) {
    return { refundStatus: 'REFUNDED', razorpayRefundId: order.razorpayRefundId };
  }

  if (!isRazorpayConfigured()) {
    return { refundStatus: 'PENDING', razorpayRefundId: '' };
  }

  try {
    const refund = await getRazorpay().payments.refund(order.razorpayPaymentId, {
      amount: refundAmountPaise(order),
      notes: { blemoutOrderId: order.orderId },
    });
    const refundId = refund?.id || '';
    return { refundStatus: refundId ? 'REFUNDED' : 'PENDING', razorpayRefundId: refundId };
  } catch {
    return { refundStatus: 'FAILED', razorpayRefundId: '' };
  }
}

async function restoreIfNeeded(order) {
  if (!shouldRestoreStock(order)) return Boolean(order.stockRestored);

  const claimed = await Order.findOneAndUpdate(
    stockRestoreClaimFilter(order._id),
    { $set: { stockRestored: true } },
    { new: true }
  );
  if (!claimed) return true;

  try {
    await restoreStock(order.items || []);
    return true;
  } catch {
    await Order.updateOne({ _id: order._id }, { $set: { stockRestored: false } });
    return false;
  }
}

/**
 * Cancel an order once. Restores stock at most once. Paid Razorpay refunds
 * are attempted but never reported as successful unless Razorpay confirms.
 */
export async function executeOrderCancel(order, { actor, reason, allowShipped }) {
  const status = String(order.orderStatus || '').toLowerCase();
  const allowed = allowShipped ? ADMIN_CANCELLABLE : CUSTOMER_CANCELLABLE;

    if (status === 'cancelled') {
      let stockRestored = Boolean(order.stockRestored);
      try {
        stockRestored = await restoreIfNeeded(order);
      } catch {
        stockRestored = Boolean(order.stockRestored);
      }
      const latest = await Order.findById(order._id);
      return {
        ok: true,
        alreadyCancelled: true,
        order: latest || order,
        message: 'This order is already cancelled.',
        stockRestored,
      };
    }

  if (!allowed.includes(status)) {
    return {
      ok: false,
      statusCode: 409,
      message: customerCancelBlockedMessage(status),
    };
  }

  const claimed = await Order.findOneAndUpdate(
    {
      _id: order._id,
      orderStatus: { $in: allowed },
    },
    {
      $set: {
        orderStatus: 'cancelled',
        cancelledBy: actor,
        cancelledAt: new Date(),
        cancellationReason: String(reason || '').trim().slice(0, 240),
      },
    },
    { new: true }
  );

  if (!claimed) {
    const latest = await Order.findById(order._id);
    if (latest?.orderStatus === 'cancelled') {
      return {
        ok: true,
        alreadyCancelled: true,
        order: latest,
        message: 'This order is already cancelled.',
      };
    }
    return {
      ok: false,
      statusCode: 409,
      message: customerCancelBlockedMessage(latest?.orderStatus),
    };
  }

  let stockRestored = Boolean(claimed.stockRestored);
  try {
    stockRestored = await restoreIfNeeded(claimed);
  } catch {
    stockRestored = false;
  }

  const refund = await attemptRefund(claimed);

  claimed.stockRestored = stockRestored;
  claimed.refundStatus = refund.refundStatus;
  if (refund.razorpayRefundId) claimed.razorpayRefundId = refund.razorpayRefundId;
  await claimed.save();

  notifyOrderLifecycle(claimed, 'cancelled').catch(() => {});

  let message = 'Your order has been cancelled successfully.';
  if (actor === 'admin') {
    message = `Order ${claimed.orderId} has been cancelled.`;
  }
  if (needsRefund(claimed) && refund.refundStatus === 'PENDING') {
    message += ' A refund will be processed to the original payment method.';
  } else if (needsRefund(claimed) && refund.refundStatus === 'FAILED') {
    message += ' The order is cancelled; the refund will be reviewed by our team.';
  } else if (needsRefund(claimed) && refund.refundStatus === 'REFUNDED') {
    message += ' A refund has been initiated to the original payment method.';
  }

  return { ok: true, alreadyCancelled: false, order: claimed, message };
}

export function publicCancelPayload(order) {
  return {
    orderId: order.orderId,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    refundStatus: order.refundStatus || 'NOT_APPLICABLE',
    cancelledBy: order.cancelledBy || '',
    cancelledAt: order.cancelledAt || null,
    cancellationReason: order.cancellationReason || '',
    canCancel: false,
  };
}
