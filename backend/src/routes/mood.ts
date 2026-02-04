import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  logMood,
  getMoodHistory,
  getLatestMood,
} from '../controllers/moodController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', logMood);
router.get('/history', getMoodHistory);
router.get('/latest', getLatestMood);

export default router;
