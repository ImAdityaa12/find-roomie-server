import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.ts';
import { onboardUserV1, onboardUserV2 } from './user.controller.ts';
import upload from '../media/media.middleware';

const router = Router();

const uploadFields = upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
]);

router.post('/v1/onboarding', requireAuth, uploadFields, onboardUserV1);

router.post('/v2/onboarding', requireAuth, onboardUserV2);

export default router;
