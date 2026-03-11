import {
  genderEnum,
  leaseDurationEnum,
  workScheduleEnum,
  sleepScheduleEnum,
  cleanlinessEnum,
  guestPolicyEnum,
  vegPreferenceEnum,
  genderPreferenceEnum,
} from '@/db/schema.js';
import type { UserBody, PreferencesBody, ValidateOnboardBody } from './types.js';

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

  if (body.ageMin != null && body.ageMax != null) {
    if (body.ageMin < 18 || body.ageMax < 18) return 'age must be at least 18';
    if (body.ageMin > body.ageMax)            return 'ageMin cannot be greater than ageMax';
  }

  if (body.lat != null && (body.lat < -90  || body.lat > 90))   return 'latitude must be between -90 and 90';
  if (body.lng != null && (body.lng < -180 || body.lng > 180))  return 'longitude must be between -180 and 180';

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

// ── Combined ──────────────────────────────

export function validateOnboardBody(body: Partial<ValidateOnboardBody>): string | null {
  return (
    validateUserBody(body.user ?? {}) ??
    validatePreferencesBody(body.preferences ?? {})
  );
}
