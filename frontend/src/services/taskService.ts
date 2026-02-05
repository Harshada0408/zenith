import api from './api';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

interface TaskResponse {
  success: boolean;
  task: Task;
}

export const taskService = {

  // ───── GET TASKS ─────
  async getTasks(date?: string): Promise<Task[]> {
    const params = date ? `?date=${date}` : '';
    const { data } = await api.get<TasksResponse>(`/api/tasks${params}`);
    return data.tasks;
  },

  // ───── GET SINGLE TASK ─────
  async getTaskById(id: string): Promise<Task> {
    const { data } = await api.get<TaskResponse>(`/api/tasks/${id}`);
    return data.task;
  },

  // ───── CREATE TASK ─────
  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await api.post<TaskResponse>('/api/tasks', input);
    return data.task;
  },

  // ───── UPDATE TASK ─────
  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data } = await api.put<TaskResponse>(`/api/tasks/${id}`, input);
    return data.task;
  },

  // ───── DELETE TASK ─────
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/api/tasks/${id}`);
  },

  // ───── COMPLETE TASK ─────
  async completeTask(id: string): Promise<Task> {
    const { data } = await api.post<TaskResponse>(`/api/tasks/${id}/complete`);
    return data.task;
  },

  // ───── MOVE TO TOMORROW ─────
  async moveToTomorrow(id: string): Promise<Task> {
    const { data } = await api.post<TaskResponse>(
      `/api/tasks/${id}/move-to-tomorrow`
    );
    return data.task;
  },

  // ───── END DAY (NEW) ─────
  async endDay(): Promise<{ archived: number }> {
    const { data } = await api.post('/api/tasks/end-day');
    return { archived: data.archived };
  },

  // ───── START DAY (NEW) ─────
  async startDay(): Promise<{ activated: number }> {
    const { data } = await api.post('/api/tasks/start-day');
    return { activated: data.activated };
  },

  // ───── HISTORY (NEW) ─────
  async getHistory(): Promise<Record<string, Task[]>> {
    const { data } = await api.get('/api/tasks/history');
    return data.history;
  },
};
