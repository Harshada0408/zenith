import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { moodService } from '../services/moodService';
import type { Task, CreateTaskInput, TaskPriority, FocusType, PRIORITY_CONFIG } from '../types/task';
import {MOOD_LABELS } from '../types/mood';
import type { MoodEntry} from '../types/mood';
import { authFetch } from '../utils/authFetch';

export default function Dashboard() {
  const [startingDay, setStartingDay] = useState(false);
  const [dayActive, setDayActive] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [focusType, setFocusType] = useState<FocusType | ''>('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [filterFocus, setFilterFocus] = useState<FocusType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'alpha'>('priority');
  const [movedCount, setMovedCount] = useState(0);

  useEffect(() => {
    loadData();
    loadDayState();
  }, []);


  async function loadData() {
    setLoading(true);
    try {
      const [tasksData, moodData] = await Promise.all([
        taskService.getTasks(),
        moodService.getLatest(),
      ]);
      setTasks(tasksData);
      setLatestMood(moodData);

      const moved = tasksData.filter((t) => t.status === 'moved');
      setMovedCount(moved.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function loadDayState() {
    try {
      const res = await authFetch('/api/users/day-state');
      const data = await res.json();
      setDayActive(data.active);
    } catch (err) {
      console.error('Failed to load day state', err);
    }
  }

  async function handleCreate() {
    if (!title.trim()) {
      setFormError('Title required');
      return;
    }

    setSubmitting(true);
    try {
      const input: CreateTaskInput = {
        title,
        description: description || undefined,
        priority: priority || undefined,
        timeEstimate: timeEstimate ? Number(timeEstimate) : undefined,
        focusType: focusType || undefined,
      };

      const newTask = await taskService.createTask(input);
      setTasks((prev) => [newTask, ...prev]);
      resetForm();
      setShowForm(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.error || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setPriority('');
    setTimeEstimate('');
    setFocusType('');
    setFormError('');
  }

  async function handleComplete(id: string) {
    const updated = await taskService.completeTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleMove(id: string) {
    const updated = await taskService.moveToTomorrow(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: string) {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // async function handleStartDay() {
  //   try {
  //     setStartingDay(true);

  //     await fetch('/api/users/start-day', {
  //       method: 'POST',
  //       credentials: 'include',
  //     });

    
  //     await loadDayState();

  //     await loadData();
  //   } catch (err) {
  //     console.error('Failed to start day', err);
  //   } finally {
  //     setStartingDay(false);
  //   }
  // }

  async function handleStartDay() {
    try {
      setStartingDay(true);

      const res = await authFetch('/api/users/start-day', {
        method: 'POST',
      });

      const data = await res.json();
      setDayActive(data.active);

      await loadData();
    } catch (err) {
      console.error('Failed to start day', err);
    } finally {
      setStartingDay(false);
    }
  }




  async function handleEndDay() {
    await authFetch('/api/users/end-day', { method: 'POST' });
    setDayActive(false);
    await loadData();
  }



  const pending = tasks.filter((t) => t.status === 'pending');
  const done = tasks.filter((t) => t.status === 'done');
  const tomorrow = tasks.filter((t) => t.status === 'moved');

  let filtered = pending;
  if (filterFocus !== 'all') {
    filtered = filtered.filter((t) => t.focusType === filterFocus);
  }

  let sorted = [...filtered];

  if (sortBy === 'priority') {
    const order = { high: 1, medium: 2, low: 3 };
    sorted.sort((a, b) => {
      const ap = a.priority ? order[a.priority] : 999;
      const bp = b.priority ? order[b.priority] : 999;
      return ap - bp;
    });
  }

  if (sortBy === 'time') {
    sorted.sort((a, b) => (a.timeEstimate || 999) - (b.timeEstimate || 999));
  }

  if (sortBy === 'alpha') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="flex-1 px-8 py-8 overflow-y-auto">
      <div className="max-w-4xl">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>

          {dayActive ? (
            <button
              onClick={handleEndDay}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-slate-400 hover:text-white"
            >
              End Today
            </button>
          ) : (
            <button
              onClick={handleStartDay}
              disabled={startingDay}
            >
              {startingDay ? 'Starting your day… 🌅' : 'Start Day'}
            </button>

          )}

        </div>

        {/* MOOD */}
        {latestMood && (
          <div className="bg-purple-900/20 border border-purple-700 p-4 rounded-xl mb-6 flex justify-between">
            <div className="flex gap-3 items-center">
              <span className="text-3xl">{MOOD_LABELS[latestMood.mood].emoji}</span>
              <div>
                <p className="text-white">Feeling {MOOD_LABELS[latestMood.mood].label}</p>
                <p className="text-slate-400 text-sm">Energy {latestMood.energy}/10</p>
              </div>
            </div>

            <a href="/mood" className="text-purple-400 text-sm">
              Log Mood →
            </a>
          </div>
        )}

        {/* START DAY */}
        {movedCount > 0 && !dayActive && (
          <div className="bg-indigo-900/20 border border-indigo-700 p-4 rounded-xl mb-6">
            <p className="text-indigo-400">
              You have {movedCount} task from yesterday
            </p>
            <p className="text-indigo-300 text-sm mt-1">
              Start your day to continue working on them.
            </p>
          </div>
        )}


        {/* ADD TASK */}
        <div className="mb-6">

          <div className="flex justify-between mb-4">
            <h2 className="text-lg text-white">Today's Tasks</h2>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-500 px-4 py-2 rounded text-sm text-white"
            >
              {showForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl mb-4">

              {formError && (
                <p className="text-red-400 text-sm mb-3">{formError}</p>
              )}

              <input
                placeholder="Title"
                className="w-full mb-3 p-2 bg-gray-800 border border-gray-700 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Description"
                className="w-full mb-3 p-2 bg-gray-800 border border-gray-700 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex gap-3 mb-3">

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                >
                  <option value="">Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <input
                  placeholder="Minutes"
                  type="number"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(e.target.value)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                />

                <select
                  value={focusType}
                  onChange={(e) => setFocusType(e.target.value as FocusType)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                >
                  <option value="">Focus</option>
                  <option value="deep_work">Deep Work</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="creative">Creative</option>
                </select>

              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-indigo-500 py-2 rounded text-white"
              >
                {submitting ? 'Creating...' : 'Add Task'}
              </button>

            </div>
          )}

          {/* TASK LIST */}
          {sorted.map((task) => (
            <div key={task.id} className="bg-gray-900 border border-gray-800 p-4 rounded mb-2 flex justify-between">

              <div>
                <h3 className="text-white">{task.title}</h3>

                {task.priority && (
                  <span className="text-xs text-slate-400">
                    {PRIORITY_CONFIG[task.priority].badge} {PRIORITY_CONFIG[task.priority].label}
                  </span>
                )}
              </div>

              <div className="flex gap-2">

                <button onClick={() => handleComplete(task.id)} className="text-green-400 text-sm">
                  Done
                </button>

                <button onClick={() => handleMove(task.id)} className="text-yellow-400 text-sm">
                  Tomorrow
                </button>

                <button onClick={() => handleDelete(task.id)} className="text-red-400 text-sm">
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
