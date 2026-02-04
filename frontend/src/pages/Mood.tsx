// frontend/src/pages/Mood.tsx

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { moodService } from '../services/moodService';
import type { MoodEntry } from '../types/mood';
import { MOOD_LABELS } from '../types/mood';

export default function Mood() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  // ─── Form state ───────────────────────────────────────────
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState(5);
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ─── History state ───────────────────────────────────────
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [successFlash, setSuccessFlash] = useState(false);

  // ─── Load history on mount ───────────────────────────────
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await moodService.getHistory(7);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load mood history', err);
    } finally {
      setLoading(false);
    }
  }

  // ─── Submit mood ─────────────────────────────────────────
  async function handleSubmit() {
    if (selectedMood === null) {
      setError('Please select a mood');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const entry = await moodService.logMood({
        mood: selectedMood,
        energy,
        reflection: reflection.trim() || undefined,
      });

      setHistory((prev) => [...prev, entry]);
      setSuccessFlash(true);

      // Reset form
      setSelectedMood(null);
      setEnergy(5);
      setReflection('');

      setTimeout(() => setSuccessFlash(false), 2500);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to log mood');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString([], {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="font-semibold">← Dashboard</Link>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Mood & Energy</h1>
        <p className="text-slate-500 text-sm mb-6">
          How are you feeling right now?
        </p>

        {successFlash && (
          <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-emerald-400 text-sm">✓ Mood logged successfully</p>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        {/* Mood selector */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((val) => {
            const m = MOOD_LABELS[val];
            const active = selectedMood === val;
            return (
              <button
                key={val}
                onClick={() => setSelectedMood(val)}
                className={`flex-1 py-3 rounded-xl border ${
                  active
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className={`text-xs mt-1 ${m.color}`}>{m.label}</div>
              </button>
            );
          })}
        </div>

        {/* Energy */}
        <div className="mb-5">
          <label className="text-sm text-slate-400">
            Energy: {energy}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        {/* Reflection */}
        <textarea
          placeholder="Optional reflection..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={2}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Logging...' : 'Log Mood'}
        </button>

        {/* History */}
        <div className="mt-10">
          <h2 className="text-sm text-slate-500 uppercase mb-3">
            Last 7 Days
          </h2>

          {loading && <p className="text-slate-500">Loading…</p>}

          {!loading && history.length === 0 && (
            <p className="text-slate-600">No entries yet</p>
          )}

          <div className="space-y-2">
            {[...history].reverse().map((entry) => {
              const m = MOOD_LABELS[entry.mood];
              return (
                <div
                  key={entry.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex justify-between"
                >
                  <div>
                    <span className="text-xl mr-2">{m.emoji}</span>
                    <span className={m.color}>{m.label}</span>
                    <p className="text-xs text-slate-500">
                      {formatTime(entry.timestamp)}
                    </p>
                    {entry.reflection && (
                      <p className="text-slate-400 text-sm mt-1">
                        {entry.reflection}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    ⚡ {entry.energy}/10
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
