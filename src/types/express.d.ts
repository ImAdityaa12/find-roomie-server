import { auth } from '../lib/auth.js';

type Session = typeof auth.$Infer.Session;
type BetterAuthUser = Session['user'];

declare global {
    namespace Express {
        interface Request {
            user?: BetterAuthUser & {
                status?: 'looking_for_room' | 'looking_for_roommate';
            };
            session?: Session['session'];
        }
    }
}
