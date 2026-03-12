import { Request, Response } from 'express';
import { ValidateOnboardBody, ValidateHasRoomBody } from './types.js';
import { validateOnboardBody, validateHasRoomBody } from './user.validation.js';
import {
    onboardNeedsRoomService,
    onboardHasRoomService,
} from './user.service.js';
import { db } from '@/db/index.js';
import { roomListings } from '@/db/schema.js';
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

export const uploadRoomMedia = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const [listing] = await db
            .select()
            .from(roomListings)
            .where(eq(roomListings.userId, userId))
            .limit(1);

        if (!listing) {
            return res
                .status(404)
                .json({ error: 'No listing found for this user' });
        }

        const newPhotoUrls = files.map((file) => file.path);
        const existingPhotos = (listing.photos as string[]) || [];
        const updatedPhotos = [...existingPhotos, ...newPhotoUrls];

        await db
            .update(roomListings)
            .set({
                photos: updatedPhotos,
                updatedAt: new Date(),
            })
            .where(eq(roomListings.id, listing.id));

        return res.status(200).json({
            success: true,
            message: 'Room media uploaded successfully',
            data: {
                uploadedCount: files.length,
                totalPhotos: updatedPhotos.length,
                urls: newPhotoUrls,
            },
        });
    } catch (err) {
        console.error('Room media upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
    }
};
