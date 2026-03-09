import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth.js';
import { onboardUser } from '../controllers/user-controller.js';

const router = Router();
router.post('/onboarding', requireAuth, onboardUser);

export default router;