import assert from 'node:assert/strict';
import {
  CUSTOMER_CANCELLABLE,
  ADMIN_CANCELLABLE,
  isCustomerCancellable,
  isAdminCancellable,
  shouldRestoreStock,
  customerCancelBlockedMessage,
  stockRestoreClaimFilter,
} from './orderCancel.js';

assert.deepEqual(CUSTOMER_CANCELLABLE, ['pending', 'processing']);
assert.ok(ADMIN_CANCELLABLE.includes('shipped'));
assert.equal(isCustomerCancellable('pending'), true);
assert.equal(isCustomerCancellable('shipped'), false);
assert.equal(isCustomerCancellable('delivered'), false);
assert.equal(isCustomerCancellable('cancelled'), false);
assert.equal(isCustomerCancellable('in_transit'), false);
assert.equal(isCustomerCancellable('out_for_delivery'), false);
assert.equal(isAdminCancellable('in_transit'), true);
assert.equal(isAdminCancellable('out_for_delivery'), true);
assert.match(customerCancelBlockedMessage('in_transit'), /already been shipped/);
assert.match(customerCancelBlockedMessage('out_for_delivery'), /already been shipped/);

assert.equal(shouldRestoreStock({ stockRestored: true, paymentMethod: 'cod' }), false);
assert.equal(shouldRestoreStock({ paymentMethod: 'cod', paymentStatus: 'pending' }), true);
assert.equal(shouldRestoreStock({ paymentMethod: 'razorpay', paymentStatus: 'pending' }), false);
assert.equal(shouldRestoreStock({ paymentMethod: 'razorpay', paymentStatus: 'paid' }), true);
assert.equal(shouldRestoreStock({ stockDecremented: false, paymentMethod: 'razorpay', paymentStatus: 'paid' }), false);
assert.deepEqual(stockRestoreClaimFilter('abc'), { _id: 'abc', stockRestored: { $ne: true } });

assert.match(customerCancelBlockedMessage('shipped'), /already been shipped/);
assert.match(customerCancelBlockedMessage('delivered'), /already been delivered/);
assert.match(customerCancelBlockedMessage('cancelled'), /already cancelled/);

console.log('orderCancel helpers: ok');
