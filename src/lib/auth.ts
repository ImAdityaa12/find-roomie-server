import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/index.ts';
import * as schema from '@/db/schema.ts';
import { expo } from '@better-auth/expo';

export const auth = betterAuth({
    plugins: [expo()],
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            onboarding_done: {
                type: 'boolean',
                required: false,
                defaultValue: false,
                input: true,
                returned: true,
            },
        },
    },
    trustedOrigins: [
        'http://localhost:3000',
        'http://10.0.2.2:3000',
        'http://10.0.2.2:8081',
        'exp://10.0.2.2:8081',
        'exp://192.168.1.5:8081',
        'exp://192.168.1.7:8081',
        'exp://192.168.1.6:8081',
        'http://localhost:8081',
        `${process.env.CLIENT_URL}`,
    ],
});
