import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDayState, startDay, endDay } from '../controllers/userController.js';

const router = Router();

router.use(authMiddleware);

router.get('/day-state', getDayState);
router.post('/start-day', startDay);
router.post('/end-day', endDay);

export default router;
