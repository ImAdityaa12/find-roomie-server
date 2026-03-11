import {
  genderEnum,
  leaseDurationEnum,
  workScheduleEnum,
  sleepScheduleEnum,
  cleanlinessEnum,
  guestPolicyEnum,
  vegPreferenceEnum,
  genderPreferenceEnum,
  roomTypeEnum,
  furnishingEnum,
} from '@/db/schema.js';
import type { UserBody, PreferencesBody, ListingBody, ValidateHasRoomBody } from '@/modules/user/has-room/types';

// ── User ──────────────────────────────────

function validateUserBody(body: Partial<UserBody>): string | null {
  if (!body.name?.trim())            return 'name is required';
  if (body.age == null)              return 'age is required';
  if (body.age < 18 || body.age > 100) return 'age must be between 18 and 100';
  if (!body.gender)                  return 'gender is required';
  if (!body.occupation?.trim())      return 'occupation is required';

  if (!genderEnum.enumValues.includes(body.gender as any))
    return `gender must be one of: ${genderEnum.enumValues.join(', ')}`;

  return null;
}

// ── Preferences ───────────────────────────

function validatePreferencesBody(body: Partial<PreferencesBody>): string | null {
  if (!body.city)             return 'city is required';
  if (body.budgetMin == null) return 'budgetMin is required';
  if (body.budgetMax == null) return 'budgetMax is required';

  if (body.budgetMin < 0 || body.budgetMax < 0) return 'budget values must be positive';
  if (body.budgetMin > body.budgetMax)           return 'budgetMin cannot be greater than budgetMax';

  if (body.ageMin != null && body.ageMin < 18)  return 'ageMin must be at least 18';
  if (body.ageMax != null && body.ageMax < 18)  return 'ageMax must be at least 18';
  if (body.ageMin != null && body.ageMax != null && body.ageMin > body.ageMax)
    return 'ageMin cannot be greater than ageMax';

  if (body.lat != null && (body.lat < -90  || body.lat > 90))  return 'latitude must be between -90 and 90';
  if (body.lng != null && (body.lng < -180 || body.lng > 180)) return 'longitude must be between -180 and 180';

  const enumChecks: [keyof PreferencesBody, readonly string[]][] = [
    ['leaseDuration',    leaseDurationEnum.enumValues],
    ['workSchedule',     workScheduleEnum.enumValues],
    ['sleepSchedule',    sleepScheduleEnum.enumValues],
    ['cleanliness',      cleanlinessEnum.enumValues],
    ['guestPolicy',      guestPolicyEnum.enumValues],
    ['vegPreference',    vegPreferenceEnum.enumValues],
    ['genderPreference', genderPreferenceEnum.enumValues],
  ];

  for (const [field, values] of enumChecks) {
    const val = body[field];
    if (val !== undefined && !values.includes(val as string))
      return `${field} must be one of: ${values.join(', ')}`;
  }

  return null;
}

// ── Listing ───────────────────────────────

function validateListingBody(body: Partial<ListingBody>): string | null {
  if (!body.title?.trim())    return 'title is required';
  if (!body.locality?.trim()) return 'locality is required';
  if (body.rent == null)      return 'rent is required';

  if (body.rent < 0)                                  return 'rent must be a positive number';
  if (body.deposit    != null && body.deposit    < 0) return 'deposit must be a positive number';
  if (body.totalRooms != null && body.totalRooms < 1) return 'totalRooms must be at least 1';
  if (body.bathrooms  != null && body.bathrooms  < 1) return 'bathrooms must be at least 1';

  if (body.photos != null) {
    if (!Array.isArray(body.photos) || body.photos.some((p) => typeof p !== 'string'))
      return 'photos must be an array of strings';
  }
  if (body.amenities != null) {
    if (!Array.isArray(body.amenities) || body.amenities.some((a) => typeof a !== 'string'))
      return 'amenities must be an array of strings';
  }

  const enumChecks: [keyof ListingBody, readonly string[]][] = [
    ['roomType',   roomTypeEnum.enumValues],
    ['furnishing', furnishingEnum.enumValues],
  ];

  for (const [field, values] of enumChecks) {
    const val = body[field];
    if (val !== undefined && !values.includes(val as string))
      return `${field} must be one of: ${values.join(', ')}`;
  }

  return null;
}

// ── Combined ──────────────────────────────

export function validateHasRoomBody(body: Partial<ValidateHasRoomBody>): string | null {
  return (
    validateUserBody(body.user               ?? {}) ??
    validatePreferencesBody(body.preferences ?? {}) ??
    validateListingBody(body.listing         ?? {})
  );
}