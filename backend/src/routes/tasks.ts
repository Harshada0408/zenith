// backend/src/routes/tasks.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  moveToTomorrow,
} from '../controllers/taskController';

const router = Router();

// 🔒 All task routes require authentication
router.use(authMiddleware);

// ─── CRUD ─────────────────────────────────────────────
router.post('/', createTask);              // Create task
router.get('/', getTasks);                 // Get tasks (today or by date)
router.get('/:id', getTaskById);           // Get single task
router.put('/:id', updateTask);            // Update task
router.delete('/:id', deleteTask);          // Delete task

// ─── Actions ──────────────────────────────────────────
router.post('/:id/complete', completeTask);        // Mark done
router.post('/:id/move-to-tomorrow', moveToTomorrow); // 9 PM pivot

export default router;
