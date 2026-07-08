import { Router } from 'express';
import { createContact, getContacts } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', createContact);
router.get('/', protect, getContacts);

export default router;
