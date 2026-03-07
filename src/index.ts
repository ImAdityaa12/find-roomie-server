import 'dotenv/config';
import express, { Request, Response } from 'express';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount Better Auth handler at /api/auth/*
app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Roomate Finder API' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
