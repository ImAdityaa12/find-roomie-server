import { auth } from '../lib/auth.js';

type Session = typeof auth.$Infer.Session; // get types directly from better-auth

declare global {
    namespace Express {
        interface Request {
            user?: Session['user']; // now req.user is valid TypeScript
            session?: Session['session']; // now req.session is valid TypeScript
        }
    }
}
