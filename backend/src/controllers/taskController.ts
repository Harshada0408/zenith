// backend/src/controllers/taskController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Helper: get today's date at midnight (00:00)
 * This avoids time drift issues when querying by day.
 */
function getTodayStart(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Helper: get tomorrow's date at midnight
 */
function getTomorrowStart(): Date {
  const date = getTodayStart();
  date.setDate(date.getDate() + 1);
  return date;
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function createTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const {
    title,
    description,
    energy,
    timeEstimate,
    focusType,
    scheduledFor,
  } = req.body;

  // Basic validation
  if (!title || energy === undefined) {
    return res.status(400).json({
      error: 'title and energy are required',
    });
  }

  if (energy < 1 || energy > 10) {
    return res.status(400).json({
      error: 'energy must be between 1 and 10',
    });
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title,
      description: description || null,
      energy,
      timeEstimate: timeEstimate || null,
      focusType: focusType || null,
      scheduledFor: scheduledFor
        ? new Date(scheduledFor)
        : getTodayStart(),
    },
  });

  return res.status(201).json({
    success: true,
    task,
  });
}

/**
 * GET /api/tasks
 * Fetch tasks for a given day (defaults to today)
 */
export async function getTasks(req: Request, res: Response) {
  const userId = req.user!.id;
  const { date } = req.query;

  let targetDate: Date;

  if (date && typeof date === 'string') {
    targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
  } else {
    targetDate = getTodayStart();
  }
  console.log('🧠 getTasks userId:', userId);


  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      scheduledFor: {
        gte: targetDate,
        lt: nextDay,
      },
    },
    orderBy: {
      energy: 'desc',
    },
  });

  return res.json({
    success: true,
    tasks,
  });
}

/**
 * GET /api/tasks/:id
 * Fetch a single task (user-isolated)
 */
export async function getTaskById(req: Request, res: Response) {
  const userId = req.user!.id;
  const id = req.params.id;

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.json({
    success: true,
    task,
  });
}

/**
 * PUT /api/tasks/:id
 * Partial update of a task
 */
export async function updateTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const id = req.params.id;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updates: Record<string, any> = {};

  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.description !== undefined)
    updates.description = req.body.description;
  if (req.body.energy !== undefined) updates.energy = req.body.energy;
  if (req.body.timeEstimate !== undefined)
    updates.timeEstimate = req.body.timeEstimate;
  if (req.body.focusType !== undefined)
    updates.focusType = req.body.focusType;
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.scheduledFor !== undefined)
    updates.scheduledFor = new Date(req.body.scheduledFor);

  const task = await prisma.task.update({
    where: { id },
    data: updates,
  });

  return res.json({
    success: true,
    task,
  });
}

/**
 * DELETE /api/tasks/:id
 */
export async function deleteTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const id= req.params.id;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await prisma.task.delete({ where: { id } });

  return res.json({
    success: true,
    message: 'Task deleted',
  });
}

/**
 * POST /api/tasks/:id/complete
 */
export async function completeTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const id= req.params.id;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      status: 'done',
      completedAt: new Date(),
    },
  });

  return res.json({
    success: true,
    task,
  });
}

/**
 * POST /api/tasks/:id/move-to-tomorrow
 * The "9 PM pivot"
 */
export async function moveToTomorrow(req: Request, res: Response) {
  const userId = req.user!.id;
  const id= req.params.id;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      status: 'moved',
      scheduledFor: getTomorrowStart(),
    },
  });

  return res.json({
    success: true,
    task,
  });
}
