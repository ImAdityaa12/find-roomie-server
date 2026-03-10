import { db } from '@/db/index.js';
import { userPreferences } from '@/db/schema.js';
import { ValidateOnboardBody } from './types.js';

export async function upsertUserPreferences(userId: string, body: ValidateOnboardBody) {
  await db
    .insert(userPreferences)
    .values({ ...body, userId })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: body,
    });
}
