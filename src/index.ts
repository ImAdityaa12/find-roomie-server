import 'dotenv/config';
import express, { Request, Response } from 'express';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount Better Auth handler at /api/auth/*
app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Roomate Finder API' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;