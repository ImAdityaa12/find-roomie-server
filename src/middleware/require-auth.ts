import { auth } from '../lib/auth.js';         // import your better-auth instance
import { Request, Response, NextFunction } from 'express';


export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  
 
  const session = await auth.api.getSession({
    headers: req.headers as any,   
  });

 
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

 
  req.user = session.user;
  req.session = session.session;


  next();
};