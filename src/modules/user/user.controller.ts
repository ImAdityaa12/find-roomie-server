import { Request, Response } from 'express';
import { db } from '@/db/index.js';
import { userPreferences } from '@/db/schema.js';
import { NewUserPreferences } from './types.js';
import { randomUUID } from 'crypto';

export const onboardUser = async (req: Request, res: Response) => {
  try {
    // 1. Get logged-in user's id from req.user (set by requireAuth)
    const userId = req.user!.id;

    // 2. Extract and validate body fields
    const body = req.body as Partial<NewUserPreferences>;

    // 3. Validate required fields
    if (!body.city) {
      return res.status(400).json({
        error: 'city is required'
      });
    }

    if (body.budgetMin === undefined || body.budgetMin === null) {
      return res.status(400).json({
        error: 'budgetMin is required'
      });
    }

    if (body.budgetMax === undefined || body.budgetMax === null) {
      return res.status(400).json({
        error: 'budgetMax is required'
      });
    }

    // 4. Validate budget range
    if (body.budgetMin < 0 || body.budgetMax < 0) {
      return res.status(400).json({
        error: 'Budget values must be positive'
      });
    }

    if (body.budgetMin > body.budgetMax) {
      return res.status(400).json({
        error: 'budgetMin cannot be greater than budgetMax'
      });
    }

    // 5. Validate age range if provided
    if (body.ageMin !== undefined && body.ageMin !== null && body.ageMax !== undefined && body.ageMax !== null) {
      if (body.ageMin < 18 || body.ageMax < 18) {
        return res.status(400).json({
          error: 'Age must be at least 18'
        });
      }
      if (body.ageMin > body.ageMax) {
        return res.status(400).json({
          error: 'ageMin cannot be greater than ageMax'
        });
      }
    }

    // 6. Validate coordinates if provided
    if (body.lat !== undefined && body.lat !== null && (body.lat < -90 || body.lat > 90)) {
      return res.status(400).json({
        error: 'Latitude must be between -90 and 90'
      });
    }

    if (body.lng !== undefined && body.lng !== null && (body.lng < -180 || body.lng > 180)) {
      return res.status(400).json({
        error: 'Longitude must be between -180 and 180'
      });
    }

    // 7. Validate enum fields
    const validLeaseDuration = ['3_months', '6_months', '1_year', 'flexible'] as const;
    const validWorkSchedule = ['day_shift', 'night_shift', 'work_from_home', 'flexible'] as const;
    const validSleepSchedule = ['early_bird', 'night_owl', 'flexible'] as const;
    const validCleanliness = ['very_clean', 'moderate', 'relaxed'] as const;
    const validGuestPolicy = ['rarely', 'sometimes', 'often'] as const;
    const validVegPreference = ['veg', 'non_veg', 'both'] as const;
    const validGenderPreference = ['male', 'female', 'any'] as const;

    if (body.leaseDuration !== undefined && !validLeaseDuration.includes(body.leaseDuration as any)) {
      return res.status(400).json({ error: `leaseDuration must be one of: ${validLeaseDuration.join(', ')}` });
    }
    if (body.workSchedule !== undefined && !validWorkSchedule.includes(body.workSchedule as any)) {
      return res.status(400).json({ error: `workSchedule must be one of: ${validWorkSchedule.join(', ')}` });
    }
    if (body.sleepSchedule !== undefined && !validSleepSchedule.includes(body.sleepSchedule as any)) {
      return res.status(400).json({ error: `sleepSchedule must be one of: ${validSleepSchedule.join(', ')}` });
    }
    if (body.cleanliness !== undefined && !validCleanliness.includes(body.cleanliness as any)) {
      return res.status(400).json({ error: `cleanliness must be one of: ${validCleanliness.join(', ')}` });
    }
    if (body.guestPolicy !== undefined && !validGuestPolicy.includes(body.guestPolicy as any)) {
      return res.status(400).json({ error: `guestPolicy must be one of: ${validGuestPolicy.join(', ')}` });
    }
    if (body.vegPreference !== undefined && !validVegPreference.includes(body.vegPreference as any)) {
      return res.status(400).json({ error: `vegPreference must be one of: ${validVegPreference.join(', ')}` });
    }
    if (body.genderPreference !== undefined && !validGenderPreference.includes(body.genderPreference as any)) {
      return res.status(400).json({ error: `genderPreference must be one of: ${validGenderPreference.join(', ')}` });
    }

    // 8. Prepare data for insertion
    const preferencesData: NewUserPreferences = {
      id: randomUUID(),
      userId,
      city: body.city,
      locality: body.locality ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
      moveInDate: body.moveInDate ?? null,
      leaseDuration: body.leaseDuration ?? 'flexible',
      workSchedule: body.workSchedule ?? 'flexible',
      sleepSchedule: body.sleepSchedule ?? 'flexible',
      cleanliness: body.cleanliness ?? 'moderate',
      guestPolicy: body.guestPolicy ?? 'sometimes',
      vegPreference: body.vegPreference ?? 'both',
      smoking: body.smoking ?? false,
      drinking: body.drinking ?? false,
      petsAllowed: body.petsAllowed ?? false,
      genderPreference: body.genderPreference ?? 'any',
      ageMin: body.ageMin ?? 18,
      ageMax: body.ageMax ?? 40,
    };

    // 9. Save to database using drizzle
    // "insert or update" — if user onboards again, update their preferences
    await db
      .insert(userPreferences)
      .values(preferencesData)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferencesData
        }
      });

    // 10. Send success response
    return res.status(201).json({
      success: true,
      message: 'Onboarding complete!'
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
