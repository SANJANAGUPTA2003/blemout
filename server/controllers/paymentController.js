import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import { generateOrderId } from '../utils/orderId.js';
import { hashPhone } from '../utils/phoneHash.js';
import { isRazorpayConfigured, PAYMENT_UNAVAILABLE_MESSAGE } from '../utils/razorpayConfig.js';
import { decrementStock, validateAndPriceCart, validateCustomer } from '../utils/checkout.js';

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

function razorpayClientMessage(error) {
  const statusCode = Number(error?.statusCode || error?.status || 0);
  if (statusCode === 401 || statusCode === 403) {
    return 'Payment gateway authentication failed. Please try again later.';
  }
  return 'Unable to start payment. Please try again.';
}

export const getPaymentStatus = (req, res) => {
  const available = isRazorpayConfigured();
  res.json({
    available,
    message: available ? null : PAYMENT_UNAVAILABLE_MESSAGE,
  });
};

export const createPaymentOrder = async (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      available: false,
      message: PAYMENT_UNAVAILABLE_MESSAGE,
    });
  }

  const customerResult = validateCustomer(req.body.customer);
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

    const blemoutOrder = await Order.create({
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
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    let razorpayOrder;
    try {
      razorpayOrder = await getRazorpay().orders.create({
        amount: priced.amountPaise,
        currency: 'INR',
        receipt: orderId,
      });
    } catch (error) {
      return res.status(502).json({ message: razorpayClientMessage(error) });
    }

    blemoutOrder.razorpayOrderId = razorpayOrder.id;
    await blemoutOrder.save();

    return res.json({
      available: true,
      key: process.env.RAZORPAY_KEY_ID,
      id: razorpayOrder.id,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId,
    });
  } catch {
    return res.status(500).json({ message: 'Unable to create payment order. Please try again.' });
  }
};

export const verifyPayment = async (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      available: false,
      message: PAYMENT_UNAVAILABLE_MESSAGE,
    });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details.' });
    }

    let order = null;
    const lookupId = String(orderId || '').trim().toUpperCase();
    if (lookupId) {
      order = await Order.findOne({ orderId: lookupId });
    }
    if (!order && razorpay_order_id) {
      order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const serverRazorpayOrderId = order.razorpayOrderId;
    if (!serverRazorpayOrderId) {
      return res.status(400).json({ message: 'Order is not linked to a payment.' });
    }

    if (razorpay_order_id && razorpay_order_id !== serverRazorpayOrderId) {
      return res.status(400).json({ message: 'Payment does not match this order.' });
    }

    if (order.paymentStatus === 'paid') {
      return res.json({
        message: 'Payment verified',
        order: { orderId: order.orderId },
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${serverRazorpayOrderId}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = 'paid';
    await order.save();

    try {
      await decrementStock(order.items);
    } catch {
      // Keep the order paid if money was captured; stock is an ops follow-up.
    }

    return res.json({
      message: 'Payment verified',
      order: { orderId: order.orderId },
    });
  } catch {
    return res.status(500).json({ message: 'Unable to verify payment. Please try again.' });
  }
};
