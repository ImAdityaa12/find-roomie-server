import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.ts';
import { onboardUser, onboardUserV1 } from './user.controller.ts';
import upload from '../media/media.middleware';
import { db } from '@/db/index.ts';
import { user } from '@/db/schema.ts';
import { eq } from 'drizzle-orm';

const router = Router();

const uploadFields = upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
]);

router.post('/v1/onboarding', requireAuth, uploadFields, onboardUserV1);

router.post('/v2/onboarding', requireAuth, onboardUser);

export default router;
