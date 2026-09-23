export const ORDER_STATUS = {
  PLACED: 'pending',
  CONFIRMED: 'processing',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Placed',
  processing: 'Confirmed',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const RANK = {
  pending: 0,
  processing: 1,
  shipped: 2,
  in_transit: 3,
  out_for_delivery: 4,
  delivered: 5,
};

export const TIMELINE_STEPS = [
  { key: 'pending', label: 'Placed' },
  { key: 'processing', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export function statusRank(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'cancelled') return -1;
  return RANK[value] ?? 0;
}

export function canAdvanceTo(from, to) {
  if (to === ORDER_STATUS.CANCELLED) return true;
  const a = statusRank(from);
  const b = statusRank(to);
  if (a < 0 || b < 0) return false;
  return b >= a;
}

export function buildTimeline(status) {
  if (status === ORDER_STATUS.CANCELLED) {
    return [{ key: 'cancelled', label: 'Cancelled', complete: true, current: true }];
  }

  const index = TIMELINE_STEPS.findIndex((s) => s.key === status);
  const current = index === -1 ? 0 : index;
  return TIMELINE_STEPS.map((step, i) => ({
    ...step,
    complete: i <= current,
    current: i === current,
  }));
}

export function mapProviderShipmentStatus(raw) {
  const value = String(raw || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .trim();

  if (!value) return null;
  if (value.includes('cancel')) return ORDER_STATUS.CANCELLED;
  if (value.includes('out for delivery') || value === 'ofd') {
    return ORDER_STATUS.OUT_FOR_DELIVERY;
  }
  if (value.includes('deliver')) return ORDER_STATUS.DELIVERED;
  if (
    value.includes('in transit') ||
    value.includes('picked') ||
    value.includes('in_transit') ||
    value.includes('reached')
  ) {
    return ORDER_STATUS.IN_TRANSIT;
  }
  if (value.includes('ship') || value.includes('manifest') || value.includes('awb assigned')) {
    return ORDER_STATUS.SHIPPED;
  }
  return null;
}

export function productSummary(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  if (!items.length) return 'BLEMOUT products';
  if (items.length === 1) return items[0].name || 'BLEMOUT product';
  return `${items[0].name} + ${items.length - 1} more`;
}

export function storefrontOrigin() {
  return String(process.env.STOREFRONT_URL || 'https://www.blemout.com').replace(/\/$/, '');
}

export function trackOrderUrl(orderId) {
  return `${storefrontOrigin()}/track-order?orderId=${encodeURIComponent(orderId)}`;
}

export function supportEmail() {
  const configured = String(process.env.SUPPORT_EMAIL || '').trim();
  if (configured) return configured;
  console.info('[BLEMOUT] SUPPORT_EMAIL is not configured.');
  return 'support@blemout.com';
}

export function toPublicTracking(order) {
  return {
    orderId: order.orderId,
    orderStatus: order.orderStatus,
    status: order.orderStatus,
    statusLabel: ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    refundStatus: order.refundStatus || 'NOT_APPLICABLE',
    cancelledBy: order.cancelledBy || '',
    cancelledAt: order.cancelledAt || null,
    cancellationReason: order.cancellationReason || '',
    items: (order.items || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
    })),
    estimatedDelivery: order.estimatedDelivery,
    trackingNumber: order.trackingNumber || order.awbNumber || null,
    awbNumber: order.awbNumber || order.trackingNumber || null,
    courier: order.courier || '',
    trackingUrl: order.trackingUrl || '',
    shippingProvider: order.shippingProvider || '',
    shipmentStatus: order.shipmentStatus || '',
    timeline: buildTimeline(order.orderStatus),
    createdAt: order.createdAt,
    totalAmount: order.totalAmount,
  };
}
