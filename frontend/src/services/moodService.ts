// frontend/src/services/moodService.ts

import api from './api';
import type { MoodEntry, CreateMoodInput } from '../types/mood';

interface MoodEntryResponse {
  success: boolean;
  entry: MoodEntry;
}

interface MoodHistoryResponse {
  success: boolean;
  history: MoodEntry[];
}

interface LatestMoodResponse {
  success: boolean;
  latest: MoodEntry | null;
}

export const moodService = {
  // POST /api/mood
  async logMood(input: CreateMoodInput): Promise<MoodEntry> {
    const { data } = await api.post<MoodEntryResponse>(
      '/api/mood',
      input
    );
    return data.entry;
  },

  // GET /api/mood/history
  async getHistory(days?: number): Promise<MoodEntry[]> {
    const query = days ? `?days=${days}` : '';
    const { data } = await api.get<MoodHistoryResponse>(
      `/api/mood/history${query}`
    );
    return data.history;
  },

  // GET /api/mood/latest
  async getLatest(): Promise<MoodEntry | null> {
    const { data } = await api.get<LatestMoodResponse>(
      '/api/mood/latest'
    );
    return data.latest;
  },
};
