import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── POST /api/mood ──────────────────────────────────────────
export async function logMood(req: Request, res: Response) {
  const userId = req.user!.id;
  const { mood, energy, reflection } = req.body;

  if (mood === undefined || energy === undefined) {
    return res.status(400).json({ error: 'mood and energy are required' });
  }

  if (mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'mood must be between 1 and 5' });
  }

  if (energy < 1 || energy > 10) {
    return res.status(400).json({ error: 'energy must be between 1 and 10' });
  }

  const entry = await prisma.mood.create({
    data: {
      userId,
      mood,
      energy,
      reflection: reflection || null,
    },
  });

  res.status(201).json({ success: true, entry });
}

// ─── GET /api/mood/history ───────────────────────────────────
export async function getMoodHistory(req: Request, res: Response) {
  const userId = req.user!.id;
  const days = req.query.days ? parseInt(req.query.days as string) : 7;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const history = await prisma.mood.findMany({
    where: {
      userId,
      timestamp: { gte: since },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  res.json({ success: true, history });
}

// ─── GET /api/mood/latest ────────────────────────────────────
export async function getLatestMood(req: Request, res: Response) {
  const userId = req.user!.id;

  const latest = await prisma.mood.findFirst({
    where: { userId },
    orderBy: { timestamp: 'desc' },
  });

  res.json({ success: true, latest });
}
