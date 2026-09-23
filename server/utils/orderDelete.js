export const DELETABLE_STATUSES = ['pending', 'processing', 'cancelled'];
export const BLOCKED_SHIPMENT_STATUSES = ['shipped', 'in_transit', 'out_for_delivery', 'delivered'];

function hasActiveShipment(order) {
  const status = String(order?.orderStatus || '').toLowerCase();
  if (BLOCKED_SHIPMENT_STATUSES.includes(status)) return true;
  if (String(order?.awbNumber || '').trim()) return true;
  if (String(order?.trackingNumber || '').trim() && status !== 'cancelled' && status !== 'pending' && status !== 'processing') {
    return true;
  }
  if (order?.shippingLock) return true;
  if (String(order?.shipmentId || '').trim()) return true;
  if (String(order?.providerOrderId || '').trim()) return true;
  return false;
}

export function evaluateOrderDeletion(order) {
  if (!order) {
    return { ok: false, statusCode: 404, message: 'Order not found.' };
  }

  const status = String(order.orderStatus || '').toLowerCase();
  const paymentStatus = String(order.paymentStatus || '').toLowerCase();

  if (status === 'delivered') {
    return { ok: false, statusCode: 409, message: 'Delivered orders cannot be permanently deleted.' };
  }
  if (status === 'shipped' || status === 'in_transit' || status === 'out_for_delivery') {
    return { ok: false, statusCode: 409, message: 'Shipped orders cannot be permanently deleted.' };
  }
  if (!DELETABLE_STATUSES.includes(status)) {
    return { ok: false, statusCode: 409, message: 'This order cannot be permanently deleted.' };
  }

  if (hasActiveShipment(order)) {
    return {
      ok: false,
      statusCode: 409,
      message: 'Orders with an active shipment cannot be permanently deleted.',
    };
  }

  if (paymentStatus === 'paid') {
    return {
      ok: false,
      statusCode: 409,
      message: 'Paid orders cannot be permanently deleted. Cancel/refund the order first.',
    };
  }

  if (['PENDING', 'REFUNDED'].includes(String(order.refundStatus || ''))) {
    return {
      ok: false,
      statusCode: 409,
      message: 'Paid orders cannot be permanently deleted. Cancel/refund the order first.',
    };
  }

  return {
    ok: true,
    restoresStock: false,
    issuesRefund: false,
    callsShipping: false,
  };
}

export function isAdminDeletable(order) {
  return evaluateOrderDeletion(order).ok;
}
