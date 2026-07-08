import { Router } from 'express';
import {
  createOrder,
  getOrders,
  trackOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/track', rateLimit({ windowMs: 60_000, max: 8 }), trackOrder);
router.post('/', createOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
