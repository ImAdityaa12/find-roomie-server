import { Request, Response } from 'express';
import { NewUserPreferences } from './types.ts';
import { validateOnboardBody } from './user.validation.ts';
import { upsertUserPreferences } from './user.service.ts';
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
