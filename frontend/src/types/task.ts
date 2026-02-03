// frontend/src/types/task.ts

export type FocusType = 'deep_work' | 'maintenance' | 'creative';
export type TaskStatus = 'pending' | 'done' | 'moved';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  energy: number;
  timeEstimate?: number | null;
  focusType?: FocusType | null;
  status: TaskStatus;
  scheduledFor: string;
  completedAt?: string | null;
  createdAt: string;
}

/* ─── API INPUT TYPES ───────────────────────────── */

export interface CreateTaskInput {
  title: string;
  description?: string;
  energy: number;
  timeEstimate?: number;
  focusType?: FocusType;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  energy?: number;
  timeEstimate?: number;
  focusType?: FocusType;
  status?: TaskStatus;
  scheduledFor?: string;
}
