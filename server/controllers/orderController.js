import Order from '../models/Order.js';
import { generateOrderId } from '../utils/orderId.js';
import { hashPhone, verifyPhone } from '../utils/phoneHash.js';
import {
  decrementStock,
  restoreStock,
  validateAndPriceCart,
  validateCustomer,
} from '../utils/checkout.js';

const TRACKING_ERROR = 'Order not found or details do not match.';

export const createOrder = async (req, res) => {
  const customerResult = validateCustomer(req.body.customer || req.body);
  if (customerResult.error) {
    return res.status(400).json({ message: customerResult.error });
  }

  try {
    const priced = await validateAndPriceCart(req.body.items);
    if (priced.error) {
      return res.status(priced.status || 400).json({ message: priced.error });
    }

    const orderId = await generateOrderId();
    const customer = customerResult.customer;
    const hashedPhone = await hashPhone(customer.phone);

    await decrementStock(priced.items);

    try {
      const order = await Order.create({
        orderId,
        customerName: customer.name,
        phone: customer.phone,
        hashedPhone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        items: priced.items,
        totalAmount: priced.totalAmount,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'pending',
      });

      return res.status(201).json({
        orderId: order.orderId,
        order: { orderId: order.orderId },
      });
    } catch (error) {
      await restoreStock(priced.items);
      throw error;
    }
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to place order.' });
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
