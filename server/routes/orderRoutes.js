import { Router } from 'express';
import {
  createOrder,
  getOrders,
  trackOrder,
  updateOrderStatus,
  cancelOrderByCustomer,
  cancelOrderByAdmin,
  shipOrderByAdmin,
  deleteOrderByAdmin,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/track', rateLimit({ windowMs: 60_000, max: 8 }), trackOrder);
router.post('/cancel', rateLimit({ windowMs: 60_000, max: 8 }), cancelOrderByCustomer);
router.post('/', rateLimit({ windowMs: 60_000, max: 8 }), createOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.post('/:id/cancel', protect, cancelOrderByAdmin);
router.post('/:id/ship', protect, shipOrderByAdmin);
router.delete('/:id', protect, deleteOrderByAdmin);

export default router;
