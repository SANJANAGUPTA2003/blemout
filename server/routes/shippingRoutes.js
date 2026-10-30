import { Router } from 'express';
import { handleShippingWebhook } from '../controllers/shippingWebhookController.js';
import { protect } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { testShiprocketConnection } from '../services/shipping/shiprocket.js';

const router = Router();

// Existing webhook
router.post('/webhook', handleShippingWebhook);

// Admin-only Shiprocket connection test
router.get(
  '/test-connection',
  protect,
  rateLimit({ windowMs: 60_000, max: 5 }),
  async (req, res) => {
    try {
      const result = await testShiprocketConnection();

      if (!result.ok) {
        return res.status(503).json(result);
      }

      return res.json(result);
    } catch {
      return res.status(500).json({
        ok: false,
        message: 'Shiprocket connection test failed.',
      });
    }
  }
);

export default router; 
