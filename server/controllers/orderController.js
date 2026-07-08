import Order from '../models/Order.js';
import { generateOrderId } from '../utils/orderId.js';
import { hashPhone, verifyPhone } from '../utils/phoneHash.js';

const TRACKING_ERROR = 'Order not found or details do not match.';

export const createOrder = async (req, res) => {
  try {
    const orderId = await generateOrderId();
    const hashedPhone = await hashPhone(req.body.phone);
    const order = await Order.create({ ...req.body, orderId, hashedPhone });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const orderId = String(req.body.orderId || '').trim().toUpperCase();
    const phone = String(req.body.phone || '').trim();

    if (!orderId || !phone) {
      return res.status(404).json({ message: TRACKING_ERROR });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: TRACKING_ERROR });
    }

    const phoneMatch = await verifyPhone(phone, order.hashedPhone);
    if (!phoneMatch) {
      return res.status(404).json({ message: TRACKING_ERROR });
    }

    res.json({
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber || null,
      timeline: buildTimeline(order.orderStatus),
      createdAt: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to track order right now.' });
  }
};

function buildTimeline(status) {
  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  if (status === 'cancelled') {
    return [{ key: 'cancelled', label: 'Cancelled', complete: true, current: true }];
  }

  const index = steps.findIndex((s) => s.key === status);
  return steps.map((step, i) => ({
    ...step,
    complete: i <= index,
    current: i === index,
  }));
}

export const updateOrderStatus = async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.orderStatus = req.body.status;
    if (req.body.trackingNumber !== undefined) updates.trackingNumber = req.body.trackingNumber;
    if (req.body.estimatedDelivery !== undefined) {
      updates.estimatedDelivery = req.body.estimatedDelivery
        ? new Date(req.body.estimatedDelivery)
        : null;
    }
    if (req.body.adminNotes !== undefined) updates.adminNotes = req.body.adminNotes;

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { generateOrderId };
