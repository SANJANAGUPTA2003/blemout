export function storefrontTrackUrl(orderId, origin = '') {
  const base = String(origin || 'https://www.blemout.com').replace(/\/$/, '');
  return `${base}/track-order?orderId=${encodeURIComponent(orderId)}`;
}

export function buildCustomerWhatsAppShareMessage({
  orderId,
  productName = 'BLEMOUT Face Wash',
  origin,
}) {
  const trackUrl = storefrontTrackUrl(orderId, origin);
  return `🎉 My BLEMOUT order has been placed!

Order ID: ${orderId}

Product: ${productName}

Track my order:
${trackUrl}`;
}

export function buildWhatsAppShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildOrderTrackingMessage({ orderId, customerName = 'there', productName, origin }) {
  return buildCustomerWhatsAppShareMessage({
    orderId,
    productName: productName || 'BLEMOUT Face Wash',
    origin: origin || (typeof window !== 'undefined' ? window.location.origin : 'https://www.blemout.com'),
  });
}
