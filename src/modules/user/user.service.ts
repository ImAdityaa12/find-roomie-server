import { db } from '@/db/index.ts';
import { roomListings, user, userPreferences } from '@/db/schema.ts';
import { ValidateOnboardBody, ValidateRoomListingBody } from './types.ts';
import { eq } from 'drizzle-orm';

export async function upsertUserPreferences(
    userId: string,
    body: ValidateOnboardBody
) {
    const result = await db
        .insert(userPreferences)
        .values({ ...body, userId })
        .onConflictDoUpdate({
            target: userPreferences.userId,
            set: body,
        })
        .returning();

    return result;
}

// ── NEW: inserts a room listing row, merging photo + video URLs into photos[] ──
// Your schema's `photos` column is jsonb string[] so we store both here.
// If you later add a separate `videos` column to the schema, split them out.
export async function createRoomListing(
    userId: string,
    body: ValidateRoomListingBody,
    photoUrls: string[],
    videoUrls: string[]
) {
    const { amenities, ...rest } = body;
    await db.insert(roomListings).values({
        ...rest,
        userId,
        // neon-http driver requires explicit JSON.stringify for jsonb array columns
        photos: JSON.stringify([
            ...photoUrls,
            ...videoUrls,
        ]) as unknown as string[],
        amenities: JSON.stringify(amenities ?? []) as unknown as string[],
    });
}

// ── NEW: flips onboardingDone to true after all steps succeed ─────────────────
export async function markOnboardingDone(userId: string) {
    await db
        .update(user)
        .set({ onboardingDone: true })
        .where(eq(user.id, userId));
}
