import { Request, Response } from 'express';
import { db } from '../db/index.js';
import { userPreferences } from '../db/schema.js';
import { randomUUID } from 'crypto';

export const onboardUser = async (req: Request, res: Response) => {

  try {
    // 1. Get logged-in user's id from req.user (set by requireAuth)
    const userId = req.user!.id;

    // 2. Destructure all fields from request body
    const {
      // Location
      city,
      locality,
      lat,
      lng,

      // Budget
      budgetMin,
      budgetMax,

      // Timing
      moveInDate,
      leaseDuration,

      // Lifestyle
      workSchedule,
      sleepSchedule,
      cleanliness,
      guestPolicy,
      vegPreference,

      // Habits
      smoking,
      drinking,
      petsAllowed,

      // Roommate preference
      genderPreference,
      ageMin,
      ageMax,
    } = req.body;

    // 3. Validate required fields
    if (!city || budgetMin === undefined || budgetMax === undefined) {
      return res.status(400).json({
        error: 'city, budgetMin and budgetMax are required'
      });
    }

    // 4. Save to database using drizzle
    // "insert or update" — if user onboards again, update their preferences
    await db
      .insert(userPreferences)
      .values({
        id:              randomUUID(),
        userId,
        city,
        locality,
        lat,
        lng,
        budgetMin,
        budgetMax,
        moveInDate,
        leaseDuration,
        workSchedule,
        sleepSchedule,
        cleanliness,
        guestPolicy,
        vegPreference,
        smoking:         smoking ?? false,
        drinking:        drinking ?? false,
        petsAllowed:     petsAllowed ?? false,
        genderPreference,
        ageMin,
        ageMax,
      })
      .onConflictDoUpdate({
        // if userId already exists → update instead of throwing error
        target: userPreferences.userId,
        set: {
          city,
          locality,
          lat,
          lng,
          budgetMin,
          budgetMax,
          moveInDate,
          leaseDuration,
          workSchedule,
          sleepSchedule,
          cleanliness,
          guestPolicy,
          vegPreference,
          smoking:         smoking ?? false,
          drinking:        drinking ?? false,
          petsAllowed:     petsAllowed ?? false,
          genderPreference,
          ageMin,
          ageMax,
        }
      });

    // 5. Send success response
    return res.status(201).json({
      success: true,
      message: 'Onboarding complete!'
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};