export function isBlemoutOrderId(value) {
  return /^BLM-[A-Z0-9]+$/i.test(String(value || '').trim());
}

export function isAllowedAdminStatusUpdate(from, to) {
  const current = String(from || '').toLowerCase();
  const next = String(to || '').toLowerCase();
  if (!next || current === next) return true;
  return current === 'pending' && next === 'processing';
}

export const SHIPMENT_FLOW = ['shipped', 'in_transit', 'out_for_delivery', 'delivered'];

export function isAdjacentShipmentAdvance(from, to) {
  const current = String(from || '').toLowerCase();
  const next = String(to || '').toLowerCase();
  const fromIndex = SHIPMENT_FLOW.indexOf(current);
  const toIndex = SHIPMENT_FLOW.indexOf(next);
  if (fromIndex === -1 || toIndex === -1) return false;
  return toIndex === fromIndex + 1;
}

export function isSameShipmentStatus(from, to) {
  return String(from || '').toLowerCase() === String(to || '').toLowerCase();
}

export function toAdminOrder(order) {
  if (!order) return order;
  const obj = typeof order.toObject === 'function' ? order.toObject() : { ...order };
  delete obj.hashedPhone;
  delete obj.razorpaySignature;
  return obj;
}
