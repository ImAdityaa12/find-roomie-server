import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.ts';
import { onboardUser } from './user.controller.ts';

const router = Router();
router.post('/v2/onboarding', requireAuth, onboardUser);

export default router;
