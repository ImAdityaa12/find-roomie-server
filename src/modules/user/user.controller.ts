import { Request, Response } from 'express';
import { ValidateOnboardBody } from './types.js';
import { validateOnboardBody } from './user.validation.js';
import { onboardNeedsRoomService } from './user.service.js';

export const onboardUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = req.body as Partial<ValidateOnboardBody>;

    const error = validateOnboardBody(body);
    if (error) return res.status(400).json({ error });

    await onboardNeedsRoomService(userId, body as ValidateOnboardBody);

    return res.status(201).json({ success: true, message: 'Onboarding complete!' });
  } catch (err) {
    console.error('Onboarding error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
