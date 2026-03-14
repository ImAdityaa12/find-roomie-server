import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.ts';
import { onboardUser } from './user.controller.ts';
import { db } from '@/db/index.ts';
import { user } from '@/db/schema.ts';
import { eq } from 'drizzle-orm';

const router = Router();
router.post('/v2/onboarding', requireAuth, onboardUser);

export default router;
