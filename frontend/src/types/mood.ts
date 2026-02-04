// frontend/src/types/mood.ts

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;        // 1–5
  energy: number;      // 1–10
  reflection: string | null;
  timestamp: string;  // ISO string
}

export interface CreateMoodInput {
  mood: number;        // 1–5
  energy: number;      // 1–10
  reflection?: string;
}

// UI helpers
export const MOOD_LABELS: Record<
  number,
  { label: string; emoji: string; color: string }
> = {
  1: { label: 'Awful', emoji: '😞', color: 'text-red-400' },
  2: { label: 'Bad', emoji: '😕', color: 'text-orange-400' },
  3: { label: 'Okay', emoji: '😐', color: 'text-yellow-400' },
  4: { label: 'Good', emoji: '🙂', color: 'text-emerald-400' },
  5: { label: 'Great', emoji: '😄', color: 'text-blue-400' },
};
