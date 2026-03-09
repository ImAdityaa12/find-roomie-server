import { Request, Response } from 'express';
import { NewUserPreferences } from './types.js';
import { validateOnboardBody } from './user.validation.js';
import { upsertUserPreferences } from './user.service.js';

export const onboardUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = req.body as Partial<NewUserPreferences>;

    const error = validateOnboardBody(body);
    if (error) return res.status(400).json({ error });

    await upsertUserPreferences(userId, body as Parameters<typeof upsertUserPreferences>[1]);

    return res.status(201).json({ success: true, message: 'Onboarding complete!' });
  } catch (err) {
    console.error('Onboarding error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
