import { Request, Response } from 'express';
import { ValidateOnboardBody, ValidateHasRoomBody } from './types.js';
import { validateOnboardBody, validateHasRoomBody } from './user.validation.js';
import {
    onboardNeedsRoomService,
    onboardHasRoomService,
} from './user.service.js';
import { db } from '@/db/index.js';
import { user } from '@/db/schema.js';
import { eq } from 'drizzle-orm';

export const onboardUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const body = req.body as Partial<ValidateOnboardBody>;

        const error = validateOnboardBody(body);
        if (error) return res.status(400).json({ error });

        await onboardNeedsRoomService(userId, body as ValidateOnboardBody);

        return res
            .status(201)
            .json({ success: true, message: 'Onboarding complete!' });
    } catch (err) {
        console.error('Onboarding error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const onboardHasRoomUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const body = req.body as Partial<ValidateHasRoomBody>;

        const error = validateHasRoomBody(body);
        if (error) return res.status(400).json({ error });

        await onboardHasRoomService(userId, body as ValidateHasRoomBody);

        return res
            .status(201)
            .json({ success: true, message: 'Onboarding complete!' });
    } catch (err) {
        console.error('Has-room onboarding error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Update user's image in database
        await db
            .update(user)
            .set({
                image: file.path,
                updatedAt: new Date(),
            })
            .where(eq(user.id, userId));

        return res.status(200).json({
            success: true,
            message: 'Profile picture updated',
            data: {
                url: file.path,
            },
        });
    } catch (err) {
        console.error('Profile picture upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
    }
};
