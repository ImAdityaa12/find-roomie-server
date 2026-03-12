import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.js';
import { onboardUser, onboardHasRoomUser } from './user.controller.js';

const router = Router();
router.post('/v1/onboarding',   requireAuth, onboardHasRoomUser);
router.post('/v2/onboarding', requireAuth, onboardUser);

export default router;
