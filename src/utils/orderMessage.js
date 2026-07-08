export function buildOrderTrackingMessage({ orderId, customerName = 'there' }) {
  const firstName = customerName.split(' ')[0] || 'there';
  const trackUrl = `${window.location.origin}/track-order?orderId=${encodeURIComponent(orderId)}`;

  return `Hi ${firstName}, your BLEMOUT order has been confirmed.

Order ID: ${orderId}

Track your order here:
${trackUrl}

Use your Order ID and phone number to check status.`;
}

export function buildWhatsAppShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
