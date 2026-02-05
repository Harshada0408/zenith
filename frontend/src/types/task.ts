export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  energy: number | null;
  priority: TaskPriority | null;
  timeEstimate: number | null;
  focusType: FocusType | null;
  status: TaskStatus;
  scheduledFor: string | null;
  completedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'pending' | 'done' | 'moved';

export type FocusType = 'deep_work' | 'maintenance' | 'creative';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface CreateTaskInput {
  title: string;
  description?: string;
  energy?: number;
  priority?: TaskPriority;
  timeEstimate?: number;
  focusType?: FocusType;
  scheduledFor?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  energy?: number;
  priority?: TaskPriority;
  timeEstimate?: number;
  focusType?: FocusType;
  status?: TaskStatus;
  scheduledFor?: string;
}

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; badge: string; color: string }
> = {
  high: {
    label: 'High',
    badge: '🔴',
    color: 'text-red-400 bg-red-900/30 border-red-800/40',
  },
  medium: {
    label: 'Medium',
    badge: '🟡',
    color: 'text-amber-400 bg-amber-900/30 border-amber-800/40',
  },
  low: {
    label: 'Low',
    badge: '🟢',
    color: 'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  },
};
