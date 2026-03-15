import 'dotenv/config';
import morgan from 'morgan';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth } from '@/lib/auth.ts';
import { toNodeHandler } from 'better-auth/node';
import userRouter from '@/modules/user/user.routes.ts';
import mediaRoutes from '@/modules/media/media.route.js';

const app = express();

app.use(express.json());
app.use(
    cors({
        // TODO: Fix this cors configuration
        origin: true,
        credentials: true,
    })
);
app.use(morgan('dev'));

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use('/user', userRouter);
app.use('/api/media', mediaRoutes);

// Mount Better Auth handler at /api/auth/*

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Roomate Finder API' });
});

export default app;
