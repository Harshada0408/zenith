// // backend/src/controllers/taskController.ts
// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// /**
//  * Helper: get today's date at midnight (00:00)
//  * This avoids time drift issues when querying by day.
//  */
// function getTodayStart(): Date {
//   const date = new Date();
//   date.setHours(0, 0, 0, 0);
//   return date;
// }

// /**
//  * Helper: get tomorrow's date at midnight
//  */
// function getTomorrowStart(): Date {
//   const date = getTodayStart();
//   date.setDate(date.getDate() + 1);
//   return date;
// }

// /**
//  * POST /api/tasks
//  * Create a new task
//  */
// export async function createTask(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const {
//     title,
//     description,
//     energy,
//     timeEstimate,
//     focusType,
//     scheduledFor,
//   } = req.body;

//   // Basic validation
//   if (!title || energy === undefined) {
//     return res.status(400).json({
//       error: 'title and energy are required',
//     });
//   }

//   if (energy < 1 || energy > 10) {
//     return res.status(400).json({
//       error: 'energy must be between 1 and 10',
//     });
//   }

//   const task = await prisma.task.create({
//     data: {
//       userId,
//       title,
//       description: description || null,
//       energy,
//       timeEstimate: timeEstimate || null,
//       focusType: focusType || null,
//       scheduledFor: scheduledFor
//         ? new Date(scheduledFor)
//         : getTodayStart(),
//     },
//   });

//   return res.status(201).json({
//     success: true,
//     task,
//   });
// }

// /**
//  * GET /api/tasks
//  * Fetch tasks for a given day (defaults to today)
//  */
// export async function getTasks(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const { date } = req.query;

//   let targetDate: Date;

//   if (date && typeof date === 'string') {
//     targetDate = new Date(date);
//     targetDate.setHours(0, 0, 0, 0);
//   } else {
//     targetDate = getTodayStart();
//   }
//   console.log('🧠 getTasks userId:', userId);


//   const nextDay = new Date(targetDate);
//   nextDay.setDate(nextDay.getDate() + 1);

//   const tasks = await prisma.task.findMany({
//     where: {
//       userId,
//       scheduledFor: {
//         gte: targetDate,
//         lt: nextDay,
//       },
//     },
//     orderBy: {
//       energy: 'desc',
//     },
//   });

//   return res.json({
//     success: true,
//     tasks,
//   });
// }

// /**
//  * GET /api/tasks/:id
//  * Fetch a single task (user-isolated)
//  */
// export async function getTaskById(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const id = req.params.id;

//   const task = await prisma.task.findFirst({
//     where: { id, userId },
//   });

//   if (!task) {
//     return res.status(404).json({ error: 'Task not found' });
//   }

//   return res.json({
//     success: true,
//     task,
//   });
// }

// /**
//  * PUT /api/tasks/:id
//  * Partial update of a task
//  */
// export async function updateTask(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const id = req.params.id;

//   const existing = await prisma.task.findFirst({
//     where: { id, userId },
//   });

//   if (!existing) {
//     return res.status(404).json({ error: 'Task not found' });
//   }

//   const updates: Record<string, any> = {};

//   if (req.body.title !== undefined) updates.title = req.body.title;
//   if (req.body.description !== undefined)
//     updates.description = req.body.description;
//   if (req.body.energy !== undefined) updates.energy = req.body.energy;
//   if (req.body.timeEstimate !== undefined)
//     updates.timeEstimate = req.body.timeEstimate;
//   if (req.body.focusType !== undefined)
//     updates.focusType = req.body.focusType;
//   if (req.body.status !== undefined) updates.status = req.body.status;
//   if (req.body.scheduledFor !== undefined)
//     updates.scheduledFor = new Date(req.body.scheduledFor);

//   const task = await prisma.task.update({
//     where: { id },
//     data: updates,
//   });

//   return res.json({
//     success: true,
//     task,
//   });
// }

// /**
//  * DELETE /api/tasks/:id
//  */
// export async function deleteTask(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const id= req.params.id;

//   const existing = await prisma.task.findFirst({
//     where: { id, userId },
//   });

//   if (!existing) {
//     return res.status(404).json({ error: 'Task not found' });
//   }

//   await prisma.task.delete({ where: { id } });

//   return res.json({
//     success: true,
//     message: 'Task deleted',
//   });
// }

// /**
//  * POST /api/tasks/:id/complete
//  */
// export async function completeTask(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const id= req.params.id;

//   const existing = await prisma.task.findFirst({
//     where: { id, userId },
//   });

//   if (!existing) {
//     return res.status(404).json({ error: 'Task not found' });
//   }

//   const task = await prisma.task.update({
//     where: { id },
//     data: {
//       status: 'done',
//       completedAt: new Date(),
//     },
//   });

//   return res.json({
//     success: true,
//     task,
//   });
// }

// /**
//  * POST /api/tasks/:id/move-to-tomorrow
//  * The "9 PM pivot"
//  */
// export async function moveToTomorrow(req: Request, res: Response) {
//   const userId = req.user!.id;
//   const id= req.params.id;

//   const existing = await prisma.task.findFirst({
//     where: { id, userId },
//   });

//   if (!existing) {
//     return res.status(404).json({ error: 'Task not found' });
//   }

//   const task = await prisma.task.update({
//     where: { id },
//     data: {
//       status: 'moved',
//       scheduledFor: getTomorrowStart(),
//     },
//   });

//   return res.json({
//     success: true,
//     task,
//   });
// }


import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Helper: get today's date at midnight (no time drift) ───
function getTodayStart(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

// ─── Helper: get tomorrow's date at midnight ────────────────
function getTomorrowStart(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// ─── POST /api/tasks ─────────────────────────────────────────
// Creates a new task. scheduledFor defaults to today if not sent.
export async function createTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const { title, description, energy, timeEstimate, focusType, scheduledFor } = req.body;

  // Validate required fields
  if (!title || energy === undefined) {
    res.status(400).json({ error: 'title and energy are required' });
    return;
  }

  if (energy < 1 || energy > 10) {
    res.status(400).json({ error: 'energy must be between 1 and 10' });
    return;
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title,
      description: description || null,
      energy,
      timeEstimate: timeEstimate || null,
      focusType: focusType || null,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : getTodayStart(),
    },
  });

  res.status(201).json({ success: true, task });
}

// ─── GET /api/tasks ──────────────────────────────────────────
// Returns tasks for a given date. Defaults to today.
// Usage: GET /api/tasks          → today's tasks
//        GET /api/tasks?date=2025-01-15 → that day's tasks
export async function getTasks(req: Request, res: Response) {
  const userId = req.user!.id;
  const { date } = req.query;

  // Figure out which day to fetch
  let targetDate: Date;
  if (date && typeof date === 'string') {
    targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
  } else {
    targetDate = getTodayStart();
  }

  // Next day at midnight (for the range query)
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      scheduledFor: {
        gte: targetDate,  // >= today 00:00
        lt: nextDay,      // <  tomorrow 00:00
      },
    },
    orderBy: {
      energy: 'desc',     // High energy tasks first (default sort)
    },
  });

  res.json({ success: true, tasks });
}

// ─── GET /api/tasks/:id ──────────────────────────────────────
// Get a single task by ID. Only returns if it belongs to this user.
export async function getTaskById(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: { id, userId },   // userId check = security
  });

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json({ success: true, task });
}

// ─── PUT /api/tasks/:id ──────────────────────────────────────
// Partial update. Only updates fields that are sent.
// Security: checks userId before updating.
export async function updateTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  // First check: does this task belong to this user?
  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  // Build update object — only include fields that were actually sent
  const updates: Record<string, any> = {};
  if (req.body.title !== undefined)         updates.title = req.body.title;
  if (req.body.description !== undefined)   updates.description = req.body.description;
  if (req.body.energy !== undefined)        updates.energy = req.body.energy;
  if (req.body.timeEstimate !== undefined)  updates.timeEstimate = req.body.timeEstimate;
  if (req.body.focusType !== undefined)     updates.focusType = req.body.focusType;
  if (req.body.status !== undefined)        updates.status = req.body.status;
  if (req.body.scheduledFor !== undefined)  updates.scheduledFor = new Date(req.body.scheduledFor);

  const task = await prisma.task.update({
    where: { id },
    data: updates,
  });

  res.json({ success: true, task });
}

// ─── DELETE /api/tasks/:id ───────────────────────────────────
// Deletes a task. Only if it belongs to this user.
export async function deleteTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  await prisma.task.delete({ where: { id } });

  res.json({ success: true, message: 'Task deleted' });
}

// ─── POST /api/tasks/:id/complete ────────────────────────────
// Marks a task as done. Sets completedAt to now.
export async function completeTask(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      status: 'done',
      completedAt: new Date(),
    },
  });

  res.json({ success: true, task });
}

// ─── POST /api/tasks/:id/move-to-tomorrow ────────────────────
// The "9 PM pivot". Moves task to tomorrow, marks as "moved".
export async function moveToTomorrow(req: Request, res: Response) {
  const userId = req.user!.id;
  const { id } = req.params;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      status: 'moved',
      scheduledFor: getTomorrowStart(),
    },
  });

  res.json({ success: true, task });
}

// ─── POST /api/tasks/end-day ──────────────────────────────────
// Archives all today's tasks (done + pending).
// Sets archivedAt timestamp so they move to History.
export async function endDay(req: Request, res: Response) {
  const userId = req.user!.id;
  const today = getTodayStart();
  const tomorrow = getTomorrowStart();

  // Find all tasks scheduled for today that aren't archived yet
  const tasksToArchive = await prisma.task.updateMany({
    where: {
      userId,
      scheduledFor: {
        gte: today,
        lt: tomorrow,
      },
      archivedAt: null,
    },
    data: {
      archivedAt: new Date(),
    },
  });

  res.json({ success: true, archived: tasksToArchive.count });
}

// ─── POST /api/tasks/start-day ────────────────────────────────
// Activates tasks from yesterday that were moved to "tomorrow".
// Changes their scheduledFor from yesterday to today.
export async function startDay(req: Request, res: Response) {
  const userId = req.user!.id;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const today = getTodayStart();

  // Find tasks from yesterday with status "moved"
  const movedTasks = await prisma.task.updateMany({
    where: {
      userId,
      status: 'moved',
      scheduledFor: {
        gte: yesterday,
        lt: today,
      },
    },
    data: {
      scheduledFor: today,
      status: 'pending', // Reset to pending for the new day
    },
  });

  res.json({ success: true, activated: movedTasks.count });
}

// ─── GET /api/tasks/history ───────────────────────────────────
// Returns archived tasks grouped by date.
// Only returns tasks where archivedAt is not null.
export async function getHistory(req: Request, res: Response) {
  const userId = req.user!.id;

  const archivedTasks = await prisma.task.findMany({
    where: {
      userId,
      archivedAt: { not: null },
    },
    orderBy: {
      archivedAt: 'desc', // Newest archives first
    },
  });

  // Group by date
  const grouped: Record<string, any[]> = {};
  archivedTasks.forEach((task) => {
    const dateKey = task.archivedAt!.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(task);
  });

  res.json({ success: true, history: grouped });
}