import { productSummary, supportEmail, trackOrderUrl } from '../../utils/orderStatus.js';

function firstName(order) {
  return String(order.customerName || 'there').split(' ')[0];
}

function rupees(amount) {
  return `₹${Math.round(Number(amount || 0))}`;
}

export function confirmationMessages(order) {
  const name = firstName(order);
  const product = productSummary(order);
  const amount = rupees(order.totalAmount);
  const track = trackOrderUrl(order.orderId);

  return {
    email: {
      subject: `BLEMOUT order ${order.orderId} confirmed`,
      text: `Hi ${name},

Your BLEMOUT order has been placed successfully.

Order ID: ${order.orderId}
Product: ${product}
Amount: ${amount}

We'll notify you when your order is shipped.

Track your order:
${track}`,
    },
    sms: `BLEMOUT: Hi ${name}, your order ${order.orderId} for ${product} has been placed successfully. We'll share tracking details once shipped.`,
    whatsapp: `Hi ${name} 👋

Your BLEMOUT order ${order.orderId} has been placed successfully.

Product: ${product}
Amount: ${amount}

We'll notify you when your order is shipped.

Track your order:
${track}`,
    whatsappTemplate: process.env.WHATSAPP_TEMPLATE_CONFIRMATION || '',
    whatsappParams: [name, order.orderId, product, amount],
  };
}

export function shipmentMessages(order) {
  const name = firstName(order);
  const awb = order.awbNumber || order.trackingNumber || 'assigned';
  const courier = order.courier || 'our courier partner';
  const track = order.trackingUrl || trackOrderUrl(order.orderId);

  return {
    email: {
      subject: `BLEMOUT order ${order.orderId} has shipped`,
      text: `Hi ${name},

Your BLEMOUT order ${order.orderId} has been shipped with ${courier}.

AWB / Tracking number: ${awb}

Track your order:
${track}`,
    },
    sms: `BLEMOUT: Hi ${name}, order ${order.orderId} has shipped. Tracking: ${awb}`,
    whatsapp: `Hi ${name} 👋

Your BLEMOUT order ${order.orderId} has been shipped.

Courier: ${courier}
AWB: ${awb}

Track:
${track}`,
    whatsappTemplate: process.env.WHATSAPP_TEMPLATE_SHIPPED || '',
    whatsappParams: [name, order.orderId, courier, awb],
  };
}

export function outForDeliveryMessages(order) {
  const name = firstName(order);
  return {
    email: {
      subject: `BLEMOUT order ${order.orderId} is out for delivery`,
      text: `Hi ${name},\n\nYour BLEMOUT order ${order.orderId} is out for delivery today.`,
    },
    sms: `BLEMOUT: Hi ${name}, order ${order.orderId} is out for delivery.`,
    whatsapp: `Hi ${name} 👋\n\nYour BLEMOUT order ${order.orderId} is out for delivery.`,
    whatsappTemplate: process.env.WHATSAPP_TEMPLATE_OUT_FOR_DELIVERY || '',
    whatsappParams: [name, order.orderId],
  };
}

export function deliveryMessages(order) {
  const name = firstName(order);
  return {
    email: {
      subject: `BLEMOUT order ${order.orderId} delivered`,
      text: `Hi ${name},\n\nYour BLEMOUT order ${order.orderId} has been delivered. Thank you for shopping with BLEMOUT.`,
    },
    sms: `BLEMOUT: Hi ${name}, order ${order.orderId} has been delivered.`,
    whatsapp: `Hi ${name} 👋\n\nYour BLEMOUT order ${order.orderId} has been delivered. Thank you.`,
    whatsappTemplate: process.env.WHATSAPP_TEMPLATE_DELIVERED || '',
    whatsappParams: [name, order.orderId],
  };
}

export function cancellationMessages(order) {
  const name = firstName(order);
  const refund = order.refundStatus || 'NOT_APPLICABLE';
  const refundLine =
    refund === 'REFUNDED'
      ? 'A refund has been initiated to your original payment method.'
      : refund === 'PENDING' || refund === 'FAILED'
        ? `If this order was prepaid, refund status: ${refund}.`
        : 'No online refund is required for this order.';

  return {
    email: {
      subject: `BLEMOUT order ${order.orderId} cancelled`,
      text: `Hi ${name},

Your BLEMOUT order ${order.orderId} has been cancelled successfully.

${refundLine}

For support:
${supportEmail()}`,
    },
    sms: `BLEMOUT: Hi ${name}, order ${order.orderId} has been cancelled.`,
    whatsapp: `Hi ${name} 👋

Your BLEMOUT order ${order.orderId} has been cancelled successfully.

${refundLine}

For support:
${supportEmail()}`,
    whatsappTemplate: process.env.WHATSAPP_TEMPLATE_CANCELLED || '',
    whatsappParams: [name, order.orderId, refundLine],
  };
}
