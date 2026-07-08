import { Router } from 'express';
import { createPaymentOrder, verifyPayment, getPaymentStatus } from '../controllers/paymentController.js';

const router = Router();

router.get('/status', getPaymentStatus);
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
