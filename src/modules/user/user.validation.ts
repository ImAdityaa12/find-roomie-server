import {
    leaseDurationEnum,
    workScheduleEnum,
    sleepScheduleEnum,
    cleanlinessEnum,
    guestPolicyEnum,
    vegPreferenceEnum,
    genderPreferenceEnum,
    roomTypeEnum, // NEW
    furnishingEnum, // NEW
} from '@/db/schema.ts';
import { NewUserPreferences, NewRoomListing } from './types.ts';

type Body = Partial<NewUserPreferences>;
type ListingBody = Partial<NewRoomListing>;

export function validateOnboardBody(body: Body): string | null {
    if (!body.city) return 'city is required';
    if (body.budgetMin == null) return 'budgetMin is required';
    if (body.budgetMax == null) return 'budgetMax is required';

    if (body.budgetMin < 0 || body.budgetMax < 0)
        return 'Budget values must be positive';
    if (body.budgetMin > body.budgetMax)
        return 'budgetMin cannot be greater than budgetMax';

    if (body.ageMin != null && body.ageMax != null) {
        if (body.ageMin < 18 || body.ageMax < 18)
            return 'Age must be at least 18';
        if (body.ageMin > body.ageMax)
            return 'ageMin cannot be greater than ageMax';
    }

    if (body.lat != null && (body.lat < -90 || body.lat > 90))
        return 'Latitude must be between -90 and 90';
    if (body.lng != null && (body.lng < -180 || body.lng > 180))
        return 'Longitude must be between -180 and 180';

    const enumChecks: [keyof Body, readonly string[]][] = [
        ['leaseDuration', leaseDurationEnum.enumValues],
        ['workSchedule', workScheduleEnum.enumValues],
        ['sleepSchedule', sleepScheduleEnum.enumValues],
        ['cleanliness', cleanlinessEnum.enumValues],
        ['guestPolicy', guestPolicyEnum.enumValues],
        ['vegPreference', vegPreferenceEnum.enumValues],
        ['genderPreference', genderPreferenceEnum.enumValues],
    ];

    for (const [field, values] of enumChecks) {
        const val = body[field];
        if (val !== undefined && !values.includes(val as string)) {
            return `${field} must be one of: ${values.join(', ')}`;
        }
    }

    return null;
}

// ── NEW: validates the room listing part of the v1 body ───────────────────────
export function validateRoomListingBody(body: ListingBody): string | null {
    if (!body.title?.trim()) return 'title is required';
    if (!body.city?.trim()) return 'city is required';
    if (!body.locality?.trim()) return 'locality is required';
    if (body.rent == null) return 'rent is required';
    if (!body.roomType) return 'roomType is required';

    if (body.rent < 0) return 'rent must be positive';
    if (body.deposit != null && body.deposit < 0)
        return 'deposit must be positive';
    if (body.totalRooms != null && body.totalRooms < 1)
        return 'totalRooms must be at least 1';
    if (body.bathrooms != null && body.bathrooms < 1)
        return 'bathrooms must be at least 1';

    if (body.lat != null && (body.lat < -90 || body.lat > 90))
        return 'Latitude must be between -90 and 90';
    if (body.lng != null && (body.lng < -180 || body.lng > 180))
        return 'Longitude must be between -180 and 180';

    const enumChecks: [keyof ListingBody, readonly string[]][] = [
        ['roomType', roomTypeEnum.enumValues],
        ['furnishing', furnishingEnum.enumValues],
    ];

    for (const [field, values] of enumChecks) {
        const val = body[field];
        if (val !== undefined && !values.includes(val as string))
            return `${String(field)} must be one of: ${values.join(', ')}`;
    }

    return null;
}
