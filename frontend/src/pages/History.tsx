import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import type{ Task } from '../types/task';

export default function History() {
  const [history, setHistory] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    try {
      const data = await taskService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(date: string) {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpanded(newExpanded);
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  const dates = Object.keys(history).sort().reverse(); // Newest first

  return (
    <div className="flex-1 px-8 py-8 overflow-y-auto">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-white mb-2">Task History</h1>
        <p className="text-slate-500 text-sm mb-8">Archive of completed and moved tasks</p>

        {loading && (
          <p className="text-slate-600 text-center py-12">Loading history...</p>
        )}

        {!loading && dates.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-4xl mb-3">📜</p>
            <p className="text-slate-500 font-medium">No archived tasks yet</p>
            <p className="text-slate-600 text-sm mt-1">Tasks appear here when you click "End Today"</p>
          </div>
        )}

        {!loading && dates.length > 0 && (
          <div className="space-y-3">
            {dates.map((date) => {
              const tasks = history[date];
              const doneTasks = tasks.filter((t) => t.status === 'done');
              const movedTasks = tasks.filter((t) => t.status === 'moved');
              const isExpanded = expanded.has(date);

              return (
                <div key={date} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {/* Header — clickable */}
                  <button
                    onClick={() => toggleExpand(date)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-white font-semibold">{formatDate(date)}</span>
                      <div className="flex gap-3 text-sm">
                        {doneTasks.length > 0 && (
                          <span className="text-emerald-400">✓ {doneTasks.length} done</span>
                        )}
                        {movedTasks.length > 0 && (
                          <span className="text-amber-400">→ {movedTasks.length} moved</span>
                        )}
                      </div>
                    </div>
                    <span className="text-slate-600">{isExpanded ? '▼' : '▶'}</span>
                  </button>

                  {/* Expanded task list */}
                  {isExpanded && (
                    <div className="px-5 pb-4 space-y-2 border-t border-gray-800 pt-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 py-2 px-3 bg-gray-800/50 rounded-lg"
                        >
                          <span className={task.status === 'done' ? 'text-emerald-500' : 'text-amber-500'}>
                            {task.status === 'done' ? '✓' : '→'}
                          </span>
                          <span className={`text-sm flex-1 ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                            {task.title}
                          </span>
                          {task.timeEstimate && (
                            <span className="text-xs text-slate-600">{task.timeEstimate}min</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}