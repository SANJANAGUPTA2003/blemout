import assert from 'node:assert/strict';
import { createHmac } from 'crypto';
import {
  ORDER_STATUS,
  buildTimeline,
  mapProviderShipmentStatus,
} from './orderStatus.js';
import {
  isAllowedAdminStatusUpdate,
  isAdjacentShipmentAdvance,
  isBlemoutOrderId,
} from './adminOrder.js';
import {
  parseShipmentWebhook,
  shouldApplyShipmentUpdate,
  nextLifecycleNotify,
  buildShipmentLookupQuery,
} from '../services/shipping/webhook.js';
import {
  unpaidPaymentClaimFilter,
  paidPaymentSet,
  paymentMatchesOrder,
  parseRazorpayWebhookPayload,
} from './paymentCapture.js';
import {
  expectedCheckoutSignature,
  expectedWebhookSignature,
  timingSafeEqualString,
} from './secureCompare.js';
import { shipClaimFilter, shouldRetryExistingShipment, pickupLocationOrError } from './shipClaim.js';
import {
  shouldRestoreStock,
  stockRestoreClaimFilter,
  isCustomerCancellable,
  isAdminCancellable,
} from './orderCancel.js';

assert.equal(ORDER_STATUS.PLACED, 'pending');
assert.equal(isBlemoutOrderId('BLM-ABC123'), true);
assert.equal(isBlemoutOrderId('123456789'), false);
assert.equal(isBlemoutOrderId(''), false);

assert.equal(isAllowedAdminStatusUpdate('pending', 'processing'), true);
assert.equal(isAllowedAdminStatusUpdate('pending', 'delivered'), false);
assert.equal(isAllowedAdminStatusUpdate('processing', 'delivered'), false);
assert.equal(isAllowedAdminStatusUpdate('processing', 'shipped'), false);
assert.equal(isAllowedAdminStatusUpdate('shipped', 'pending'), false);
assert.equal(isAllowedAdminStatusUpdate('shipped', 'processing'), false);
assert.equal(isAllowedAdminStatusUpdate('delivered', 'pending'), false);
assert.equal(isAllowedAdminStatusUpdate('cancelled', 'processing'), false);
assert.equal(isAllowedAdminStatusUpdate('pending', 'pending'), true);

assert.equal(isAdjacentShipmentAdvance('shipped', 'in_transit'), true);
assert.equal(isAdjacentShipmentAdvance('in_transit', 'out_for_delivery'), true);
assert.equal(isAdjacentShipmentAdvance('out_for_delivery', 'delivered'), true);
assert.equal(isAdjacentShipmentAdvance('pending', 'delivered'), false);
assert.equal(isAdjacentShipmentAdvance('processing', 'shipped'), false);
assert.equal(isAdjacentShipmentAdvance('shipped', 'delivered'), false);
assert.equal(isAdjacentShipmentAdvance('delivered', 'in_transit'), false);

const placed = buildTimeline('pending');
assert.equal(placed[0].current, true);

assert.equal(mapProviderShipmentStatus('Out For Delivery'), 'out_for_delivery');

const mixed = parseShipmentWebhook({
  order_id: 123456789,
  channel_order_id: 'blm-abc123',
  awb: 'AWB99',
  current_status: 'SHIPPED',
  event_id: 'evt-1',
});
assert.equal(mixed.blemoutOrderId, 'BLM-ABC123');
assert.equal(mixed.orderId, 'BLM-ABC123');
assert.deepEqual(buildShipmentLookupQuery(mixed), { orderId: 'BLM-ABC123' });

const awbOnly = parseShipmentWebhook({
  order_id: 999,
  awb: 'AWB-FALLBACK',
  current_status: 'In Transit',
  event_id: 'evt-awb',
});
assert.equal(awbOnly.blemoutOrderId, '');
assert.deepEqual(buildShipmentLookupQuery(awbOnly), {
  $or: [{ awbNumber: 'AWB-FALLBACK' }, { trackingNumber: 'AWB-FALLBACK' }],
});

const shipmentOnly = parseShipmentWebhook({
  order_id: 111,
  shipment_id: 'ship-55',
  current_status: 'SHIPPED',
  event_id: 'evt-ship',
});
assert.deepEqual(buildShipmentLookupQuery(shipmentOnly), { shipmentId: 'ship-55' });

assert.equal(buildShipmentLookupQuery(parseShipmentWebhook({ order_id: 42, current_status: 'SHIPPED' })) != null, true);

const unknown = parseShipmentWebhook({ current_status: 'SHIPPED' });
assert.equal(buildShipmentLookupQuery(unknown), null);

const dup = shouldApplyShipmentUpdate(
  { orderStatus: 'shipped', lastShipmentEventId: 'evt-1' },
  mixed
);
assert.equal(dup.apply, false);
assert.equal(dup.reason, 'duplicate_event');

const adjacent = shouldApplyShipmentUpdate(
  { orderStatus: 'shipped', lastShipmentEventId: 'evt-0' },
  parseShipmentWebhook({ channel_order_id: 'BLM-ABC123', current_status: 'In Transit', event_id: 'evt-2' })
);
assert.equal(adjacent.apply, true);
assert.equal(adjacent.fieldsOnly, false);

const skipped = shouldApplyShipmentUpdate(
  { orderStatus: 'pending' },
  parseShipmentWebhook({ channel_order_id: 'BLM-ABC123', current_status: 'Delivered', event_id: 'jump' })
);
assert.equal(skipped.apply, false);

const sameStatus = shouldApplyShipmentUpdate(
  { orderStatus: 'shipped', lastShipmentEventId: 'other' },
  parseShipmentWebhook({ channel_order_id: 'BLM-ABC123', current_status: 'SHIPPED', event_id: 'same' })
);
assert.equal(sameStatus.fieldsOnly, true);

const afterDelivered = shouldApplyShipmentUpdate(
  { orderStatus: 'delivered' },
  parseShipmentWebhook({ channel_order_id: 'BLM-ABC123', current_status: 'In Transit', event_id: 'old' })
);
assert.equal(afterDelivered.reason, 'terminal_order');

const ignoreCancel = shouldApplyShipmentUpdate(
  { orderStatus: 'shipped' },
  parseShipmentWebhook({ channel_order_id: 'BLM-ABC123', current_status: 'cancelled', event_id: 'c1' })
);
assert.equal(ignoreCancel.reason, 'provider_cancel_ignored');
assert.equal(nextLifecycleNotify('out_for_delivery'), 'out_for_delivery');

const expected = expectedCheckoutSignature('order_1', 'pay_1', 'secret');
assert.equal(timingSafeEqualString(expected, expected), true);
assert.equal(timingSafeEqualString(expected, 'deadbeef'), false);

assert.deepEqual(unpaidPaymentClaimFilter('abc'), {
  _id: 'abc',
  paymentStatus: { $ne: 'paid' },
  orderStatus: { $ne: 'cancelled' },
});
assert.equal(paidPaymentSet({ paymentId: 'pay_1', signature: 'sig' }).paymentStatus, 'paid');

const order = { razorpayOrderId: 'order_1', totalAmount: 10 };
assert.equal(paymentMatchesOrder(order, { order_id: 'order_1', amount: 1000, status: 'captured' }).ok, true);
assert.equal(paymentMatchesOrder(order, { order_id: 'order_2', amount: 1000, status: 'captured' }).ok, false);
assert.equal(paymentMatchesOrder(order, { order_id: 'order_1', amount: 50, status: 'captured' }).ok, false);
assert.equal(paymentMatchesOrder(order, { order_id: 'order_1', amount: 1000, status: 'failed' }).ok, false);

const webhookBody = {
  event: 'payment.captured',
  payload: {
    payment: { entity: { id: 'pay_1', order_id: 'order_1', amount: 1000, status: 'captured' } },
    order: { entity: { id: 'order_1', receipt: 'BLM-ABC123' } },
  },
};
const parsedPay = parseRazorpayWebhookPayload(webhookBody);
assert.equal(parsedPay.isPaidEvent, true);
assert.equal(parsedPay.paymentId, 'pay_1');
assert.equal(parseRazorpayWebhookPayload({ event: 'payment.failed' }).isPaidEvent, false);

const webhookSig = expectedWebhookSignature('{"ok":true}', 'whsec');
assert.equal(webhookSig, createHmac('sha256', 'whsec').update('{"ok":true}').digest('hex'));

const shipFilter = shipClaimFilter('oid');
assert.equal(shipFilter.shippingLock.$ne, true);
assert.equal(shouldRetryExistingShipment({ shipmentId: 's1', awbNumber: '' }), true);
assert.equal(shouldRetryExistingShipment({ shipmentId: 's1', awbNumber: 'AWB' }), false);

const prevPickup = process.env.SHIPROCKET_PICKUP_LOCATION;
delete process.env.SHIPROCKET_PICKUP_LOCATION;
assert.equal(pickupLocationOrError().ok, false);
process.env.SHIPROCKET_PICKUP_LOCATION = 'Warehouse A';
assert.equal(pickupLocationOrError().ok, true);
if (prevPickup == null) delete process.env.SHIPROCKET_PICKUP_LOCATION;
else process.env.SHIPROCKET_PICKUP_LOCATION = prevPickup;

assert.equal(shouldRestoreStock({ stockDecremented: false, paymentMethod: 'razorpay', paymentStatus: 'paid' }), false);
assert.equal(shouldRestoreStock({ stockDecremented: true, stockRestored: false }), true);
assert.deepEqual(stockRestoreClaimFilter('oid'), { _id: 'oid', stockRestored: { $ne: true } });
assert.equal(isCustomerCancellable('shipped'), false);
assert.equal(isAdminCancellable('delivered'), false);

console.log('orderStatus + shipping webhook helpers: ok');
