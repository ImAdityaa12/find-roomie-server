import { eq } from 'drizzle-orm';
import { db } from '@/db/index.ts';
import { user, userPreferences } from '@/db/schema.ts';
import type { ValidateOnboardBody } from './types.ts';

export async function onboardNeedsRoomService(
    userId: string,
    body: ValidateOnboardBody
) {
    // 1. Update user profile + flip status
    await db
        .update(user)
        .set({
            name: body.user.name,
            age: body.user.age,
            gender: body.user.gender as (typeof user.$inferSelect)['gender'],
            bio: body.user.bio ?? null,
            occupation: body.user.occupation,
            status: 'looking_for_room',
            onboardingDone: true,
            updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

    // 2. Upsert preferences
    await db
        .insert(userPreferences)
        .values({ ...body.preferences, userId })
        .onConflictDoUpdate({
            target: userPreferences.userId,
            set: { ...body.preferences, updatedAt: new Date() },
        });
}
