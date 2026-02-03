import type { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const supabaseUser = data.user;

  // 🔥 CRITICAL FIX: ensure user exists in Prisma DB
  await prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {},
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email!,
    },
  });

  // Attach user to request
  req.user = supabaseUser;

  next();
};
