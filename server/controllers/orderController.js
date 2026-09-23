import Order from '../models/Order.js';
import { generateOrderId } from '../utils/orderId.js';
import { hashPhone, verifyPhone } from '../utils/phoneHash.js';
import {
  decrementStock,
  restoreStock,
  validateAndPriceCart,
  validateCustomer,
} from '../utils/checkout.js';
import { isCustomerCancellable } from '../utils/orderCancel.js';
import { executeOrderCancel, publicCancelPayload } from '../utils/executeOrderCancel.js';
import { evaluateOrderDeletion } from '../utils/orderDelete.js';
import { ORDER_STATUS, toPublicTracking } from '../utils/orderStatus.js';
import { isAllowedAdminStatusUpdate, toAdminOrder } from '../utils/adminOrder.js';
import { notifyOrderLifecycle } from '../services/notifications/index.js';
import { getShippingProvider, isShippingConfigured } from '../services/shipping/index.js';
import { shipClaimFilter } from '../utils/shipClaim.js';

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
        orderStatus: 'processing',
        stockDecremented: true,
      });

      notifyOrderLifecycle(order, 'confirmation').catch(() => {});

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
    res.json(orders.map((order) => toAdminOrder(order)));
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
      ...toPublicTracking(order),
      canCancel: isCustomerCancellable(order.orderStatus),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to track order right now.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.body.status === 'cancelled') {
      const result = await executeOrderCancel(order, {
        actor: 'admin',
        reason: req.body.cancellationReason || req.body.adminNotes || 'Cancelled by admin',
        allowShipped: true,
      });
      if (!result.ok) {
        return res.status(result.statusCode || 400).json({ message: result.message });
      }
      return res.json(toAdminOrder(result.order));
    }

    const updates = {};
    if (req.body.status) {
      if (order.orderStatus === 'cancelled' && req.body.status !== 'cancelled') {
        return res.status(409).json({
          message: 'Cancelled orders cannot be reopened from status updates.',
        });
      }
      if (!isAllowedAdminStatusUpdate(order.orderStatus, req.body.status)) {
        return res.status(409).json({
          message: 'That order status cannot be set from Admin. Use Ship Order or wait for the shipping webhook.',
        });
      }
      updates.orderStatus = req.body.status;
    }
    if (req.body.trackingNumber !== undefined) updates.trackingNumber = req.body.trackingNumber;
    if (req.body.estimatedDelivery !== undefined) {
      updates.estimatedDelivery = req.body.estimatedDelivery
        ? new Date(req.body.estimatedDelivery)
        : null;
    }
    if (req.body.adminNotes !== undefined) updates.adminNotes = req.body.adminNotes;

    const updated = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(toAdminOrder(updated));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelOrderByCustomer = async (req, res) => {
  try {
    const orderId = String(req.body.orderId || '').trim().toUpperCase();
    const phone = String(req.body.phone || '').trim();
    const reason = String(req.body.reason || '').trim();

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

    const result = await executeOrderCancel(order, {
      actor: 'customer',
      reason,
      allowShipped: false,
    });

    if (!result.ok) {
      return res.status(result.statusCode || 400).json({ message: result.message });
    }

    return res.json({
      message: result.message,
      alreadyCancelled: Boolean(result.alreadyCancelled),
      ...publicCancelPayload(result.order),
      ...toPublicTracking(result.order),
      canCancel: false,
    });
  } catch {
    return res.status(500).json({
      message: "We couldn't cancel the order right now. Please try again.",
    });
  }
};

export const cancelOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const result = await executeOrderCancel(order, {
      actor: 'admin',
      reason: req.body.reason || '',
      allowShipped: true,
    });

    if (!result.ok) {
      return res.status(result.statusCode || 400).json({ message: result.message });
    }

    return res.json({
      message: result.message,
      alreadyCancelled: Boolean(result.alreadyCancelled),
      order: toAdminOrder(result.order),
    });
  } catch {
    return res.status(500).json({
      message: "We couldn't cancel the order right now. Please try again.",
    });
  }
};

export const shipOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.orderStatus === ORDER_STATUS.CANCELLED) {
      return res.status(409).json({ message: 'Cancelled orders cannot be shipped.' });
    }
    if (order.orderStatus === ORDER_STATUS.DELIVERED) {
      return res.status(409).json({ message: 'This order has already been delivered.' });
    }
    if (order.paymentMethod === 'razorpay' && order.paymentStatus !== 'paid') {
      return res.status(409).json({ message: 'Unpaid online orders cannot be shipped.' });
    }

    const claimed = await Order.findOneAndUpdate(
      shipClaimFilter(order._id),
      { $set: { shippingLock: true } },
      { new: true }
    );
    if (!claimed) {
      const latest = await Order.findById(order._id);
      if (latest?.awbNumber) {
        return res.status(409).json({ message: 'This order already has a shipment.' });
      }
      if (latest?.shippingLock) {
        return res.status(409).json({ message: 'A shipment is already being created for this order.' });
      }
      return res.status(409).json({ message: 'This order cannot be shipped.' });
    }

    try {
      const provider = getShippingProvider();
      const result = await provider.createShipment(claimed);
      if (!result.ok) {
        claimed.shippingLock = false;
        if (result.shipmentId) claimed.shipmentId = result.shipmentId;
        if (result.providerOrderId) claimed.providerOrderId = String(result.providerOrderId);
        if (result.provider || provider.name) claimed.shippingProvider = result.provider || provider.name;
        await claimed.save();
        return res.status(503).json({
          message: result.message || 'Unable to create shipment.',
          configured: isShippingConfigured(),
        });
      }

      claimed.shippingProvider = result.provider || provider.name;
      claimed.courier = result.courier || '';
      claimed.awbNumber = result.awb;
      claimed.trackingNumber = result.awb;
      claimed.trackingUrl = result.trackingUrl || '';
      claimed.shipmentId = result.shipmentId || claimed.shipmentId || '';
      if (result.providerOrderId) claimed.providerOrderId = String(result.providerOrderId);
      claimed.shipmentStatus = ORDER_STATUS.SHIPPED;
      claimed.lastShipmentStatus = ORDER_STATUS.SHIPPED;
      claimed.orderStatus = ORDER_STATUS.SHIPPED;
      claimed.shippingLock = false;
      await claimed.save();

      notifyOrderLifecycle(claimed, 'shipped').catch(() => {});

      return res.json({
        message: 'Shipment created. The order is now marked as shipped.',
        order: toAdminOrder(claimed),
      });
    } catch {
      await Order.updateOne({ _id: claimed._id }, { $set: { shippingLock: false } });
      return res.status(500).json({ message: 'Unable to create shipment right now.' });
    }
  } catch {
    return res.status(500).json({ message: 'Unable to create shipment right now.' });
  }
};

export const deleteOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const decision = evaluateOrderDeletion(order);
    if (!decision.ok) {
      return res.status(decision.statusCode || 409).json({ message: decision.message });
    }

    const orderId = order.orderId;
    await Order.deleteOne({ _id: order._id });
    console.info(
      `[BLEMOUT] DELETE_ORDER ${orderId} admin=${req.admin?.email || req.admin?.id || 'unknown'}`
    );
    return res.json({ success: true, orderId });
  } catch {
    return res.status(500).json({ message: 'Unable to delete the order right now.' });
  }
};

export { generateOrderId };
