import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.ts';
import { onboardUserV1, onboardUserV2 } from './user.controller.ts';

const router = Router();

router.post('/v1/onboarding', requireAuth, onboardUserV1);

router.post('/v2/onboarding', requireAuth, onboardUserV2);

export default router;
