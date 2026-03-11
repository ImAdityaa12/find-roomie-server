import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.js';
import { onboardUser } from './user.controller.js';
import { onboardHasRoomUser } from '@/modules/user/has-room/controller.js';

const router = Router();
router.post('/v1/onboarding/has-room',   requireAuth, onboardHasRoomUser);
router.post('/v2/onboarding/needs-room', requireAuth, onboardUser);


export default router;
