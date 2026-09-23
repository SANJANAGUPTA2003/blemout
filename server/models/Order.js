import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    hashedPhone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      default: 'razorpay',
    },
    razorpayOrderId: { type: String, default: '', index: true },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    trackingNumber: { type: String, default: '' },
    estimatedDelivery: { type: Date, default: null },
    adminNotes: { type: String, default: '' },
    shippingProvider: { type: String, default: '' },
    courier: { type: String, default: '' },
    awbNumber: { type: String, default: '' },
    trackingUrl: { type: String, default: '' },
    shipmentId: { type: String, default: '' },
    shipmentStatus: { type: String, default: '' },
    lastShipmentEventId: { type: String, default: '' },
    lastShipmentStatus: { type: String, default: '' },
    providerOrderId: { type: String, default: '' },
    shippingLock: { type: Boolean, default: false },
    stockDecremented: { type: Boolean, default: false },
    notificationsSent: { type: [String], default: [] },
    cancelledBy: {
      type: String,
      enum: ['', 'customer', 'admin'],
      default: '',
    },
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, default: '' },
    stockRestored: { type: Boolean, default: false },
    refundStatus: {
      type: String,
      enum: ['NOT_APPLICABLE', 'PENDING', 'REFUNDED', 'FAILED'],
      default: 'NOT_APPLICABLE',
    },
    razorpayRefundId: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
