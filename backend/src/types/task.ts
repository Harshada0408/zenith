// frontend/src/types/task.ts

export type TaskStatus = 'pending' | 'done' | 'moved';

export type FocusType = 'deep_work' | 'maintenance' | 'creative';

export interface Task {
  id: string;
  userId: string;

  title: string;
  description: string | null;

  energy: number;              // 1–10
  timeEstimate: number | null; // minutes
  focusType: FocusType | null;

  status: TaskStatus;
  scheduledFor: string | null;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

// Input when creating a task
export interface CreateTaskInput {
  title: string;
  description?: string;
  energy: number;
  timeEstimate?: number;
  focusType?: FocusType;
  scheduledFor?: string;
}

// Input when updating a task (all optional)
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  energy?: number;
  timeEstimate?: number;
  focusType?: FocusType;
  status?: TaskStatus;
  scheduledFor?: string;
}
