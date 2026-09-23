export function unpaidPaymentClaimFilter(orderMongoId) {
  return {
    _id: orderMongoId,
    paymentStatus: { $ne: 'paid' },
    orderStatus: { $ne: 'cancelled' },
  };
}

export function paidPaymentSet({ paymentId, signature = '' }) {
  return {
    paymentStatus: 'paid',
    orderStatus: 'processing',
    razorpayPaymentId: paymentId,
    ...(signature ? { razorpaySignature: signature } : {}),
  };
}

export function paymentMatchesOrder(order, payment) {
  if (!order || !payment) {
    return { ok: false, reason: 'missing_payment' };
  }
  if (payment.order_id && order.razorpayOrderId && payment.order_id !== order.razorpayOrderId) {
    return { ok: false, reason: 'order_mismatch' };
  }
  const expectedPaise = Math.round(Number(order.totalAmount || 0) * 100);
  if (payment.amount != null && Number(payment.amount) !== expectedPaise) {
    return { ok: false, reason: 'amount_mismatch' };
  }
  const status = String(payment.status || '').toLowerCase();
  const captured = payment.captured === true || status === 'captured';
  const authorized = status === 'authorized';
  if (status && !captured && !authorized) {
    return { ok: false, reason: 'not_captured' };
  }
  return { ok: true };
}

export function parseRazorpayWebhookPayload(body = {}) {
  const event = String(body.event || '');
  const payment = body.payload?.payment?.entity || null;
  const razorpayOrder = body.payload?.order?.entity || null;
  return {
    event,
    payment,
    razorpayOrderId: payment?.order_id || razorpayOrder?.id || '',
    paymentId: payment?.id || '',
    receipt: razorpayOrder?.receipt || '',
    isPaidEvent: event === 'payment.captured' || event === 'order.paid',
  };
}
