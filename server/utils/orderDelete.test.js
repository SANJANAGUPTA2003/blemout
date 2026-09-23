import assert from 'node:assert/strict';
import { evaluateOrderDeletion, isAdminDeletable } from './orderDelete.js';

function check(order, expectedOk, pattern) {
  const result = evaluateOrderDeletion(order);
  assert.equal(result.ok, expectedOk, JSON.stringify(result));
  if (pattern) assert.match(result.message, pattern);
  if (result.ok) {
    assert.equal(result.restoresStock, false);
    assert.equal(result.issuesRefund, false);
    assert.equal(result.callsShipping, false);
  }
}

check({ orderStatus: 'pending', paymentStatus: 'pending' }, true);
check({ orderStatus: 'processing', paymentStatus: 'pending' }, true);
check({ orderStatus: 'cancelled', paymentStatus: 'pending' }, true);
check({ orderStatus: 'cancelled', paymentStatus: 'failed' }, true);

check({ orderStatus: 'delivered', paymentStatus: 'pending' }, false, /Delivered orders cannot be permanently deleted/);
check({ orderStatus: 'shipped', paymentStatus: 'pending' }, false, /Shipped orders cannot be permanently deleted/);
check({ orderStatus: 'in_transit', paymentStatus: 'pending' }, false, /Shipped orders cannot be permanently deleted/);
check({ orderStatus: 'out_for_delivery', paymentStatus: 'pending' }, false, /Shipped orders cannot be permanently deleted/);

check(
  { orderStatus: 'processing', paymentStatus: 'paid' },
  false,
  /Paid orders cannot be permanently deleted/
);
check(
  { orderStatus: 'cancelled', paymentStatus: 'paid', refundStatus: 'REFUNDED' },
  false,
  /Paid orders cannot be permanently deleted/
);
check(
  { orderStatus: 'processing', paymentStatus: 'pending', awbNumber: 'AWB1' },
  false,
  /active shipment/
);

check(
  { orderStatus: 'processing', paymentStatus: 'pending', shipmentId: 'sr-1' },
  false,
  /active shipment/
);

assert.equal(evaluateOrderDeletion(null).statusCode, 404);
assert.equal(isAdminDeletable({ orderStatus: 'pending', paymentStatus: 'pending' }), true);
assert.equal(isAdminDeletable({ orderStatus: 'delivered' }), false);

console.log('orderDelete helpers: ok');
