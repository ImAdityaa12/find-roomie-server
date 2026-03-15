import { roomListings, userPreferences } from '@/db/schema';

export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type NewRoomListingInsert = typeof roomListings.$inferInsert;

export type ValidateOnboardBody = Partial<NewUserPreferences> &
    Pick<Required<NewUserPreferences>, 'city' | 'budgetMin' | 'budgetMax'>;

// ── V1 types ─────────────────────────────────────────────────────────────────

export type OnboardV1PreferencesBody = {
    // required
    city: string;
    budgetMin: number;
    budgetMax: number;
    // optional
    leaseDuration?: NewUserPreferences['leaseDuration'];
    workSchedule?: NewUserPreferences['workSchedule'];
    sleepSchedule?: NewUserPreferences['sleepSchedule'];
    cleanliness?: NewUserPreferences['cleanliness'];
    guestPolicy?: NewUserPreferences['guestPolicy'];
    vegPreference?: NewUserPreferences['vegPreference'];
    genderPreference?: NewUserPreferences['genderPreference'];
    petsAllowed?: boolean;
    smoking?: boolean;
    drinking?: boolean;
    ageMin?: number | null;
    ageMax?: number | null;
    lat?: number | null;
    lng?: number | null;
};

export type OnboardV1ListingBody = {
    // required
    title: string;
    city: string;
    locality: string;
    rent: number;
    roomType: NewRoomListingInsert['roomType'];
    // optional
    description?: string | null;
    fullAddress?: string | null;
    lat?: number | null;
    lng?: number | null;
    deposit?: number | null;
    furnishing?: NewRoomListingInsert['furnishing'];
    totalRooms?: number | null;
    bathrooms?: number | null;
    amenities?: string[];
    availableFrom?: string | null;
    photos?: string[];
    videos?: string[];
};

export type OnboardV1Body = {
    preferences: OnboardV1PreferencesBody;
    listing?: OnboardV1ListingBody; // required when status === 'looking_for_roommate'
};

// shape of the v2 onboard request body (preferences only, no listing)
export type OnboardV2Body = {
    // required
    city: string;
    locality: string;
    budgetMin: number;
    budgetMax: number;
    // optional
    moveInDate?: string | null;
    leaseDuration?: NewUserPreferences['leaseDuration'];
    workSchedule?: NewUserPreferences['workSchedule'];
    sleepSchedule?: NewUserPreferences['sleepSchedule'];
    cleanliness?: NewUserPreferences['cleanliness'];
    vegPreference?: NewUserPreferences['vegPreference'];
    smoking?: boolean;
    drinking?: boolean;
    genderPreference?: NewUserPreferences['genderPreference'];
    ageMin?: number | null;
    ageMax?: number | null;
    lat?: number | null;
    lng?: number | null;
};
