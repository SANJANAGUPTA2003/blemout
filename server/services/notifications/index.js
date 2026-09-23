import Order from '../../models/Order.js';
import { dispatch, getNotificationConfig, logSkip } from './channels.js';
import {
  cancellationMessages,
  confirmationMessages,
  deliveryMessages,
  outForDeliveryMessages,
  shipmentMessages,
} from './templates.js';

const BUILDERS = {
  confirmation: confirmationMessages,
  shipped: shipmentMessages,
  out_for_delivery: outForDeliveryMessages,
  delivered: deliveryMessages,
  cancelled: cancellationMessages,
};

async function sendChannelOnce(order, eventKey, channel, payload) {
  const claimKey = `${eventKey}:${channel}`;
  const claimed = await Order.findOneAndUpdate(
    {
      _id: order._id,
      notificationsSent: { $nin: [eventKey, claimKey] },
    },
    { $addToSet: { notificationsSent: claimKey } },
    { new: true }
  );
  if (!claimed) {
    return { channel, sent: false, reason: 'already_sent' };
  }

  try {
    const results = await dispatch(claimed, payload, [channel]);
    const result = results[0] || { channel, sent: false, reason: 'send_failed' };
    if (!result.sent) {
      await Order.updateOne({ _id: order._id }, { $pull: { notificationsSent: claimKey } });
    }
    return result;
  } catch (error) {
    await Order.updateOne({ _id: order._id }, { $pull: { notificationsSent: claimKey } });
    console.error(`[BLEMOUT notify] ${claimKey} failed for ${order.orderId}:`, error.message);
    return { channel, sent: false, reason: 'send_failed' };
  }
}

async function sendOnce(order, eventKey) {
  if (!order?._id) return { skipped: true, reason: 'no_order' };
  const builder = BUILDERS[eventKey];
  if (!builder) return { skipped: true, reason: 'unknown_event' };

  const config = getNotificationConfig();
  const messages = builder(order);
  const results = [];

  if (config.email) {
    results.push(await sendChannelOnce(order, eventKey, 'email', messages));
  } else {
    results.push(logSkip('email', order.orderId, 'provider not configured'));
  }

  if (config.sms) {
    results.push(await sendChannelOnce(order, eventKey, 'sms', messages));
  } else {
    results.push(logSkip('sms', order.orderId, 'provider not configured'));
  }

  if (config.whatsapp && messages.whatsappTemplate) {
    results.push(await sendChannelOnce(order, eventKey, 'whatsapp', messages));
  } else if (config.whatsapp) {
    results.push(logSkip('whatsapp', order.orderId, 'template not configured'));
  } else {
    results.push(logSkip('whatsapp', order.orderId, 'provider not configured'));
  }

  return { skipped: false, results };
}

export function sendOrderConfirmation(order) {
  return sendOnce(order, 'confirmation');
}

export function sendShipmentNotification(order) {
  return sendOnce(order, 'shipped');
}

export function sendOutForDeliveryNotification(order) {
  return sendOnce(order, 'out_for_delivery');
}

export function sendDeliveryNotification(order) {
  return sendOnce(order, 'delivered');
}

export function sendCancellationNotification(order) {
  return sendOnce(order, 'cancelled');
}

export async function notifyOrderLifecycle(order, eventKey) {
  try {
    if (BUILDERS[eventKey]) return await sendOnce(order, eventKey);
  } catch (error) {
    console.error(`[BLEMOUT notify] lifecycle ${eventKey} error:`, error.message);
  }
  return { skipped: true };
}
