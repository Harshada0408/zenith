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
  getHistory,
} from '../controllers/taskController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/history', getHistory);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/complete', completeTask);
router.post('/:id/move-to-tomorrow', moveToTomorrow);

export default router;
