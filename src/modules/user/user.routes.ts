import { Router } from 'express';
import { requireAuth } from '@/middleware/require-auth.js';
import {
    onboardUser,
    onboardHasRoomUser,
    uploadProfilePicture,
} from './user.controller.js';
import upload from '@/modules/media/media.middleware.js';

const router = Router();
router.post('/v1/onboarding/has-room', requireAuth, onboardHasRoomUser);
router.post('/v2/onboarding/needs-room', requireAuth, onboardUser);
router.post(
    '/profile-picture',
    requireAuth,
    upload.single('file'),
    uploadProfilePicture
);

export default router;
