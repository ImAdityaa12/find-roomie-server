import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  // TODO: Fix this cors configuration
  origin: true,
  credentials: true,
}));

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

// Mount Better Auth handler at /api/auth/*

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Roomate Finder API' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;