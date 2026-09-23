export const CUSTOMER_CANCELLABLE = ['pending', 'processing'];
export const ADMIN_CANCELLABLE = [
  'pending',
  'processing',
  'shipped',
  'in_transit',
  'out_for_delivery',
];

export function isShippedLike(status) {
  return ['shipped', 'in_transit', 'out_for_delivery'].includes(String(status || '').toLowerCase());
}

export const CUSTOMER_CANCEL_REASONS = [
  'Changed my mind',
  'Ordered by mistake',
  'Found another product',
  'Delivery time is too long',
  'Other',
];

export function isCustomerCancellable(status) {
  return CUSTOMER_CANCELLABLE.includes(String(status || '').toLowerCase());
}

export function isAdminCancellable(status) {
  return ADMIN_CANCELLABLE.includes(String(status || '').toLowerCase());
}

export function shouldRestoreStock(order) {
  if (!order) return false;
  if (order.stockRestored) return false;
  if (order.stockDecremented === false) return false;
  if (order.stockDecremented === true) return true;
  if (order.paymentMethod === 'cod') return true;
  return order.paymentStatus === 'paid';
}

export function stockRestoreClaimFilter(orderMongoId) {
  return { _id: orderMongoId, stockRestored: { $ne: true } };
}

export function customerCancelBlockedMessage(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'cancelled') {
    return 'This order is already cancelled.';
  }
  if (value === 'shipped' || value === 'in_transit' || value === 'out_for_delivery') {
    return 'Sorry, this order can no longer be cancelled because it has already been shipped.';
  }
  if (value === 'delivered') {
    return 'Sorry, this order can no longer be cancelled because it has already been delivered.';
  }
  return 'This order can no longer be cancelled.';
}
