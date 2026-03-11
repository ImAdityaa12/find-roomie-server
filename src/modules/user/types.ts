import { userPreferences, user } from "@/db/schema";

export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type NewUser = typeof user.$inferInsert;

export type UserBody = Pick<Required<NewUser>, 'name' | 'age' | 'gender' | 'occupation'>
  & Partial<Pick<NewUser, 'bio'>>;

export type PreferencesBody = Partial<NewUserPreferences> &
  Pick<Required<NewUserPreferences>, 'city' | 'budgetMin' | 'budgetMax'>;

export type ValidateOnboardBody = {
  user: UserBody;
  preferences: PreferencesBody;
};