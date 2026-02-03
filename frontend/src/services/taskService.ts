// frontend/src/services/taskService.ts

import api from './api';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

interface TaskResponse {
  success: boolean;
  task: Task;
}

export const taskService = {
  // Get tasks (defaults to today on backend)
  async getTasks(date?: string): Promise<Task[]> {
    const query = date ? `?date=${date}` : '';
    const { data } = await api.get<TasksResponse>(`/api/tasks${query}`);
    return data.tasks;
  },

  // Get single task
  async getTaskById(id: string): Promise<Task> {
    const { data } = await api.get<TaskResponse>(`/api/tasks/${id}`);
    return data.task;
  },

  // Create task
  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await api.post<TaskResponse>('/api/tasks', input);
    return data.task;
  },

  // Update task (partial)
  async updateTask(
    id: string,
    input: UpdateTaskInput
  ): Promise<Task> {
    const { data } = await api.put<TaskResponse>(
      `/api/tasks/${id}`,
      input
    );
    return data.task;
  },

  // Delete task
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/api/tasks/${id}`);
  },

  // Mark task as done
  async completeTask(id: string): Promise<Task> {
    const { data } = await api.post<TaskResponse>(
      `/api/tasks/${id}/complete`
    );
    return data.task;
  },

  // Move task to tomorrow
  async moveToTomorrow(id: string): Promise<Task> {
    const { data } = await api.post<TaskResponse>(
      `/api/tasks/${id}/move-to-tomorrow`
    );
    return data.task;
  },
};
