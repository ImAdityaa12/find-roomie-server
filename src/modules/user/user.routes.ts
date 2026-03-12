import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth';
import {
    onboardUser,
    onboardHasRoomUser,
} from '@/modules/user/user.controller.ts';

const router = Router();
router.post('/v1/onboarding', requireAuth, onboardHasRoomUser);
router.post('/v2/onboarding', requireAuth, onboardUser);

export default router;
