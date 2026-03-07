import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { onboardUser } from '../controllers/userController.js';

const router = Router();
router.post('/onboarding', requireAuth, onboardUser);

export default router;