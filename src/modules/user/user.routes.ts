import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.ts';
import { onboardUser } from './user.controller.ts';
import { onboardHasRoomUser } from '@/modules/user/has-room/controller.ts';

const router = Router();
router.post('/v1/onboarding/has-room', requireAuth, onboardHasRoomUser);
router.post('/v2/onboarding/needs-room', requireAuth, onboardUser);

export default router;
