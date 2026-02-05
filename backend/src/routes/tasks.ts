import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  moveToTomorrow,
  endDay,
  startDay,
  getHistory,
} from '../controllers/taskController.js';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

router.post('/',                    createTask);       // Create task
router.get('/',                     getTasks);         // Get tasks (today or by date)
router.get('/:id',                  getTaskById);      // Get single task
router.put('/:id',                  updateTask);       // Update task
router.delete('/:id',               deleteTask);       // Delete task
router.post('/:id/complete',        completeTask);     // Mark done
router.post('/:id/move-to-tomorrow', moveToTomorrow);  // 9 PM pivot

// Day management
router.post('/end-day',   endDay);       // Archive today's tasks
router.post('/start-day', startDay);     // Activate tomorrow's tasks
router.get('/history',    getHistory);   // Get archived tasks

export default router;