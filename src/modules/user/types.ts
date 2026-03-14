import { NewRoomListing, userPreferences } from '@/db/schema';

export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type ValidateOnboardBody = Partial<NewUserPreferences> &
    Pick<Required<NewUserPreferences>, 'city' | 'budgetMin' | 'budgetMax'>;

// listing validator expects at minimum these 5 fields
export type ValidateRoomListingBody = Partial<NewRoomListing> &
    Pick<
        Required<NewRoomListing>,
        'title' | 'city' | 'locality' | 'rent' | 'roomType'
    >;

// shape of the full v1 onboard request body
export type OnboardV1Body = {
    preferences: ValidateOnboardBody;
    listing?: ValidateRoomListingBody; // only when status === 'looking_for_roommate'
};
