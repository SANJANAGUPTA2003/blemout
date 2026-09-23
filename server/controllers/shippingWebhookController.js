import Order from '../models/Order.js';
import { notifyOrderLifecycle } from '../services/notifications/index.js';
import {
  isShippingWebhookConfigured,
  parseShipmentWebhook,
  shouldApplyShipmentUpdate,
  verifyShippingWebhook,
  nextLifecycleNotify,
  buildShipmentLookupQuery,
} from '../services/shipping/webhook.js';

export const handleShippingWebhook = async (req, res) => {
  if (!isShippingWebhookConfigured()) {
    return res.status(503).json({ message: 'Shipping webhook is not configured.' });
  }

  const auth = verifyShippingWebhook(req);
  if (!auth.ok) {
    return res.status(auth.statusCode).json({ message: auth.message });
  }

  const parsed = parseShipmentWebhook(req.body || {});
  const query = buildShipmentLookupQuery(parsed);
  if (!query) {
    return res.status(400).json({ message: 'Unable to identify shipment.' });
  }

  try {
    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({ message: 'Order not found for shipment webhook.' });
    }

    const decision = shouldApplyShipmentUpdate(order, parsed);
    if (!decision.apply) {
      return res.json({
        ok: true,
        duplicate: decision.reason === 'duplicate_event',
        ignored: true,
        reason: decision.reason,
        orderId: order.orderId,
      });
    }

    if (!decision.fieldsOnly) {
      order.orderStatus = parsed.mappedStatus;
      order.shipmentStatus = parsed.mappedStatus;
      order.lastShipmentStatus = parsed.mappedStatus;
    }
    order.lastShipmentEventId = parsed.eventId;
    if (parsed.awb) {
      order.awbNumber = parsed.awb;
      order.trackingNumber = parsed.awb;
    }
    if (parsed.courier) order.courier = parsed.courier;
    if (parsed.trackingUrl) order.trackingUrl = parsed.trackingUrl;
    if (parsed.shipmentId) order.shipmentId = parsed.shipmentId;
    await order.save();

    if (!decision.fieldsOnly) {
      const notifyKey = nextLifecycleNotify(parsed.mappedStatus);
      if (notifyKey) {
        notifyOrderLifecycle(order, notifyKey).catch(() => {});
      }
    }

    return res.json({
      ok: true,
      orderId: order.orderId,
      orderStatus: order.orderStatus,
    });
  } catch {
    return res.status(500).json({ message: 'Unable to process shipping webhook.' });
  }
};
