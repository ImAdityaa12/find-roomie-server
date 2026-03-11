import { userPreferences } from '@/db/schema';

export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type ValidateOnboardBody = Partial<NewUserPreferences> &
    Pick<Required<NewUserPreferences>, 'city' | 'budgetMin' | 'budgetMax'>;
