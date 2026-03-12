import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.js';
import {
    onboardUser,
    onboardHasRoomUser,
    uploadRoomMedia,
} from './user.controller.js';
import upload from '@/modules/media/media.middleware.js';

const router = Router();
router.post('/v1/onboarding', requireAuth, onboardHasRoomUser);
router.post('/v2/onboarding', requireAuth, onboardUser);
router.post(
    '/room-media',
    requireAuth,
    upload.array('files', 10),
    uploadRoomMedia
);

export default router;
