import { db } from '@/db/index.ts';
import { userPreferences } from '@/db/schema.ts';
import { ValidateOnboardBody } from './types.ts';

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
