import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import moodRoutes from './routes/mood.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks';
import { authMiddleware } from './middleware/auth';

dotenv.config();
console.log('DATABASE_URL at runtime:', process.env.DATABASE_URL);
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/mood', moodRoutes);
app.use('/api/users', userRoutes);



// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zenith backend is running!'
  });
});

// Test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      success: true,
      message: 'Database connected!',
      userCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user: req.user?.email,
  });
});

app.use('/api/tasks', taskRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
