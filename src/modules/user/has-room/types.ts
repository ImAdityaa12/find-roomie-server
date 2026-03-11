import { userPreferences, roomListings, user } from "@/db/schema";

export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type NewRoomListing     = typeof roomListings.$inferInsert;
export type NewUser            = typeof user.$inferInsert;

export type UserBody = Pick<Required<NewUser>, 'name' | 'age' | 'gender' | 'occupation'>
  & Partial<Pick<NewUser, 'bio'>>;

export type PreferencesBody = Partial<NewUserPreferences>
  & Pick<Required<NewUserPreferences>, 'city' | 'budgetMin' | 'budgetMax'>;

export type ListingBody = Partial<NewRoomListing>
  & Pick<Required<NewRoomListing>, 'title' | 'locality' | 'rent'>;

export type ValidateHasRoomBody = {
  user:        UserBody;
  preferences: PreferencesBody;
  listing:     ListingBody;
};