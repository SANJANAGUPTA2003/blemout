import { timingSafeEqualString } from '../../utils/secureCompare.js';
import { isBlemoutOrderId, isAdjacentShipmentAdvance, isSameShipmentStatus } from '../../utils/adminOrder.js';
import { ORDER_STATUS, mapProviderShipmentStatus } from '../../utils/orderStatus.js';

export function isShippingWebhookConfigured() {
  return Boolean(webhookSecret());
}

function webhookSecret() {
  return String(process.env.SHIPPING_WEBHOOK_TOKEN || process.env.SHIPROCKET_WEBHOOK_TOKEN || '').trim();
}

export function extractWebhookToken(req) {
  const header =
    req.headers['x-shipping-webhook-token'] ||
    req.headers['x-shiprocket-token'] ||
    req.headers['x-api-key'] ||
    '';
  const auth = String(req.headers.authorization || '');
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return String(header).trim();
}

export function verifyShippingWebhook(req) {
  const expected = webhookSecret();
  if (!expected) {
    return { ok: false, statusCode: 503, message: 'Shipping webhook is not configured.' };
  }
  const provided = extractWebhookToken(req);
  if (!timingSafeEqualString(provided, expected)) {
    return { ok: false, statusCode: 401, message: 'Unauthorized webhook.' };
  }
  return { ok: true };
}

function firstBlemoutId(values) {
  for (const value of values) {
    if (isBlemoutOrderId(value)) return String(value).trim().toUpperCase();
  }
  return '';
}

export function parseShipmentWebhook(body = {}) {
  const nested = body.data && typeof body.data === 'object' ? body.data : {};
  const source = { ...nested, ...body };

  const blemoutOrderId = firstBlemoutId([
    source.channel_order_id,
    source.channelOrderId,
    source.blemout_order_id,
    source.orderId,
    isBlemoutOrderId(source.order_id) ? source.order_id : '',
  ]);

  const awb = String(source.awb || source.awb_code || source.awbNumber || '').trim();
  const shipmentId = String(
    source.shipment_id || source.shipmentId || source.sr_shipment_id || ''
  ).trim();
  const providerOrderId = String(source.sr_order_id || (!isBlemoutOrderId(source.order_id) ? source.order_id : '') || '').trim();
  const courier = String(source.courier_name || source.courier || '').trim();
  const trackingUrl = String(source.tracking_url || source.trackingUrl || '').trim();
  const rawStatus = source.current_status || source.shipment_status || source.status || '';
  const mappedStatus = mapProviderShipmentStatus(rawStatus);
  const eventId = String(
    source.event_id ||
      source.eventId ||
      [awb || blemoutOrderId || shipmentId, rawStatus, source.current_timestamp || source.updated_at || ''].join(':')
  ).slice(0, 200);

  return {
    orderId: blemoutOrderId,
    blemoutOrderId,
    awb,
    shipmentId,
    providerOrderId,
    courier,
    trackingUrl,
    rawStatus,
    mappedStatus,
    eventId,
  };
}

export function buildShipmentLookupQuery(parsed) {
  if (parsed.blemoutOrderId) return { orderId: parsed.blemoutOrderId };
  if (parsed.awb) {
    return { $or: [{ awbNumber: parsed.awb }, { trackingNumber: parsed.awb }] };
  }
  if (parsed.shipmentId) return { shipmentId: parsed.shipmentId };
  if (parsed.providerOrderId) {
    return { $or: [{ shipmentId: parsed.providerOrderId }, { providerOrderId: parsed.providerOrderId }] };
  }
  return null;
}

export function nextLifecycleNotify(status) {
  if (status === ORDER_STATUS.OUT_FOR_DELIVERY) return 'out_for_delivery';
  if (status === ORDER_STATUS.DELIVERED) return 'delivered';
  if (status === ORDER_STATUS.SHIPPED) return 'shipped';
  return null;
}

export function shouldApplyShipmentUpdate(order, parsed) {
  if (!parsed.mappedStatus) {
    return { apply: false, reason: 'unmapped_status' };
  }
  if (parsed.mappedStatus === ORDER_STATUS.CANCELLED) {
    return { apply: false, reason: 'provider_cancel_ignored' };
  }
  if (order.orderStatus === ORDER_STATUS.CANCELLED || order.orderStatus === ORDER_STATUS.DELIVERED) {
    return { apply: false, reason: 'terminal_order' };
  }
  if (order.lastShipmentEventId && parsed.eventId && order.lastShipmentEventId === parsed.eventId) {
    return { apply: false, reason: 'duplicate_event' };
  }
  if (isSameShipmentStatus(order.orderStatus, parsed.mappedStatus)) {
    return { apply: true, fieldsOnly: true, reason: 'same_status' };
  }
  if (!isAdjacentShipmentAdvance(order.orderStatus, parsed.mappedStatus)) {
    return { apply: false, reason: 'skipped_or_invalid_progression' };
  }
  return { apply: true, fieldsOnly: false };
}
