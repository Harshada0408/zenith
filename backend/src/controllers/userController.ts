import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/users/day-state
export async function getDayState(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { activeDayStartedAt: true },
  });

  res.json({
    active: !!user?.activeDayStartedAt,
    startedAt: user?.activeDayStartedAt ?? null,
  });
}

// POST /api/users/start-day
export async function startDay(req: Request, res: Response) {
  const now = new Date();

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { activeDayStartedAt: now },
  });

  res.json({
    active: true,
    startedAt: now,
  });
}

// POST /api/users/end-day
export async function endDay(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { activeDayStartedAt: true },
  });

  if (!user?.activeDayStartedAt) {
    return res.status(400).json({ error: 'Day not started' });
  }

  const sessionStart = user.activeDayStartedAt;

  await prisma.task.updateMany({
    where: {
      userId: req.user!.id,
      archivedAt: null,
    },

    data: {
      archivedAt: sessionStart,
    },
  });

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { activeDayStartedAt: null },
  });

  res.json({ active: false, startedAt: null });
}
