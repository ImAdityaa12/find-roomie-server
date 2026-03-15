import { Request, Response } from 'express';
import { NewUserPreferences, OnboardV1Body, OnboardV2Body } from './types.ts';
import {
    validateOnboardBody,
    validateOnboardV1PreferencesBody,
    validateOnboardV1ListingBody,
    validateOnboardV2Body,
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
        const body = req.body as OnboardV1Body;

        const prefsError = validateOnboardV1PreferencesBody(
            body.preferences ?? {}
        );
        if (prefsError) return res.status(400).json({ error: prefsError });

        const isLookingForRoommate =
            req.user!.status === 'looking_for_roommate' || body.listing != null;

        if (isLookingForRoommate) {
            if (!body.listing)
                return res.status(400).json({
                    error: 'listing is required for looking_for_roommate users',
                });
            const listingError = validateOnboardV1ListingBody(body.listing);
            if (listingError)
                return res.status(400).json({ error: listingError });
        }

        await upsertUserPreferences(userId, body.preferences);

        if (isLookingForRoommate && body.listing) {
            const { photos, ...listingData } = body.listing;
            await createRoomListing(userId, listingData, photos ?? []);
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
