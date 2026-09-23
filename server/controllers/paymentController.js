import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import { generateOrderId } from '../utils/orderId.js';
import { hashPhone } from '../utils/phoneHash.js';
import { isRazorpayConfigured, PAYMENT_UNAVAILABLE_MESSAGE } from '../utils/razorpayConfig.js';
import { validateAndPriceCart, validateCustomer } from '../utils/checkout.js';
import { capturePaidOrder } from '../utils/capturePaidOrder.js';
import { paymentMatchesOrder } from '../utils/paymentCapture.js';
import { expectedCheckoutSignature, timingSafeEqualString } from '../utils/secureCompare.js';

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

    await Order.create({
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
      razorpayOrderId: razorpayOrder.id,
      stockDecremented: false,
    });

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

async function fetchPaymentSafely(paymentId) {
  try {
    const payment = await getRazorpay().payments.fetch(paymentId);
    return { ok: true, payment };
  } catch (error) {
    console.info('[BLEMOUT payment] gateway lookup failed:', error.message);
    return { ok: false };
  }
}

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

    const expectedSignature = expectedCheckoutSignature(
      serverRazorpayOrderId,
      razorpay_payment_id,
      process.env.RAZORPAY_KEY_SECRET
    );
    if (!timingSafeEqualString(expectedSignature, razorpay_signature)) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    const fetched = await fetchPaymentSafely(razorpay_payment_id);
    let paymentEntity = fetched.ok ? fetched.payment : null;
    if (paymentEntity) {
      const match = paymentMatchesOrder(order, paymentEntity);
      if (!match.ok) {
        return res.status(400).json({ message: 'Payment does not match this order.' });
      }
    }

    const result = await capturePaidOrder(order, {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paymentEntity,
    });
    if (!result.ok) {
      return res.status(result.statusCode || 400).json({ message: result.message });
    }

    return res.json({
      message: 'Payment verified',
      order: { orderId: result.order.orderId },
    });
  } catch {
    return res.status(500).json({ message: 'Unable to verify payment. Please try again.' });
  }
};
