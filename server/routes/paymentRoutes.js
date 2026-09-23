import { Router } from 'express';
import { createPaymentOrder, verifyPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { handleRazorpayWebhook } from '../controllers/razorpayWebhookController.js';

const router = Router();

router.get('/status', getPaymentStatus);
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', handleRazorpayWebhook);

export default router;
