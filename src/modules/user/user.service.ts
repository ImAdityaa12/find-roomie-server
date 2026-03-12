import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { user, userPreferences, roomListings } from '@/db/schema.js';
import type { ValidateOnboardBody, ValidateHasRoomBody } from './types.js';

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

export async function onboardHasRoomService(
    userId: string,
    body: ValidateHasRoomBody
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
            status: 'looking_for_roommate',
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

    // 3. Insert listing — city falls back to preferences.city
    await db.insert(roomListings).values({
        ...body.listing,
        userId,
        city: body.listing.city ?? body.preferences.city,
    });
}
