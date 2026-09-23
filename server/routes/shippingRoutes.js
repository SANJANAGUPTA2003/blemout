import { Router } from 'express';
import { handleShippingWebhook } from '../controllers/shippingWebhookController.js';

const router = Router();

router.post('/webhook', handleShippingWebhook);

export default router;
