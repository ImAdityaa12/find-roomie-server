import { Request, Response } from 'express';
import { NewUserPreferences, OnboardV2Body } from './types.ts';
import {
    validateOnboardBody,
    validateOnboardV2Body,
    validateRoomListingBody,
} from './user.validation.ts';
import {
    createRoomListing,
    markOnboardingDone,
    upsertUserPreferences,
} from './user.service.ts';
import { db } from '@/db/index.ts';
import { user } from '@/db/schema.ts';
import { eq } from 'drizzle-orm';

export const onboardUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const body = req.body as Partial<NewUserPreferences>;

        const error = validateOnboardBody(body);
        if (error) return res.status(400).json({ error });

        const result = await upsertUserPreferences(
            userId,
            body as Parameters<typeof upsertUserPreferences>[1]
        );

        if (result && result.length > 0) {
            await db
                .update(user)
                .set({ onboardingDone: true })
                .where(eq(user.id, userId));
        }

        return res
            .status(201)
            .json({ success: true, message: 'Onboarding complete!' });
    } catch (err) {
        console.error('Onboarding error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const onboardUserV1 = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        // Step 1: parse body
        const rawPrefs =
            typeof req.body.preferences === 'string'
                ? JSON.parse(req.body.preferences)
                : (req.body.preferences ?? req.body);

        const rawListing =
            typeof req.body.listing === 'string'
                ? JSON.parse(req.body.listing)
                : (req.body.listing ?? null);

        // Step 2: validate preferences
        const prefsError = validateOnboardBody(rawPrefs);
        if (prefsError) return res.status(400).json({ error: prefsError });

        // Step 3: validate listing (Mode A only)
        const isLookingForRoommate =
            req.user!.status === 'looking_for_roommate' || rawListing != null;

        if (isLookingForRoommate) {
            if (!rawListing)
                return res.status(400).json({
                    error: 'listing is required for looking_for_roommate users',
                });
            const listingError = validateRoomListingBody(rawListing);
            if (listingError)
                return res.status(400).json({ error: listingError });
        }

        // Step 4: extract Cloudinary URLs
        // multer-storage-cloudinary uploads automatically in the middleware,
        // so file.path is already the public Cloudinary URL by this point.
        const files = req.files as
            | { [fieldname: string]: Express.Multer.File[] }
            | undefined;

        const photoUrls = (files?.['photos'] ?? []).map((f) => f.path);
        const videoUrls = (files?.['videos'] ?? []).map((f) => f.path);

        // Step 5: persist
        await upsertUserPreferences(userId, rawPrefs);

        if (isLookingForRoommate && rawListing) {
            await createRoomListing(userId, rawListing, photoUrls, videoUrls);
        }

        await markOnboardingDone(userId);

        return res
            .status(201)
            .json({ success: true, message: 'Onboarding complete!' });
    } catch (err) {
        console.error('V1 Onboarding error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const onboardUserV2 = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const body = req.body as OnboardV2Body;

        const error = validateOnboardV2Body(body);
        if (error) return res.status(400).json({ error });

        await upsertUserPreferences(userId, body);
        await markOnboardingDone(userId);

        return res
            .status(201)
            .json({ success: true, message: 'Onboarding complete!' });
    } catch (err) {
        console.error('V2 Onboarding error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
