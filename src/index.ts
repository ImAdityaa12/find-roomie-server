import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth } from '@/lib/auth.ts';
import { toNodeHandler } from 'better-auth/node';
import userRouter from '@/modules/user/user.routes.ts';


const app = express();

app.use(express.json());
app.use(cors({
  // TODO: Fix this cors configuration
  origin: true,
  credentials: true,
}));

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use('/user', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Roomate Finder API' });
});

export default app;