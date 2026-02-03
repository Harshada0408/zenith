import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import type { Task, FocusType } from '../types/task';

// ─── Helpers ─────────────────────────────────────────────────
function energyColor(energy: number) {
  if (energy >= 8) return 'text-red-400 bg-red-900/30 border-red-800/40';
  if (energy >= 5) return 'text-amber-400 bg-amber-900/30 border-amber-800/40';
  return 'text-emerald-400 bg-emerald-900/30 border-emerald-800/40';
}

const focusStyles: Record<FocusType, { label: string; color: string }> = {
  deep_work:   { label: 'Deep Work',   color: 'text-blue-400 bg-blue-900/30 border-blue-800/40' },
  maintenance: { label: 'Maintenance', color: 'text-purple-400 bg-purple-900/30 border-purple-800/40' },
  creative:    { label: 'Creative',    color: 'text-pink-400 bg-pink-900/30 border-pink-800/40' },
};

export default function Tasks() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energy, setEnergy] = useState(5);
  const [timeEstimate, setTimeEstimate] = useState('');
  const [focusType, setFocusType] = useState<FocusType | ''>('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title.trim()) { setFormError('Title is required'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      const newTask = await taskService.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        energy,
        timeEstimate: timeEstimate ? Number(timeEstimate) : undefined,
        focusType: focusType || undefined,
      });
      setTasks((prev) => [newTask, ...prev]);
      resetForm();
      setShowForm(false);
    } catch (err: any) {
        console.error('CREATE TASK ERROR:', err);
        setFormError(
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            'Failed to create task'
        );
      
      setSubmitting(false);
    }
  }

  async function handleComplete(id: string) {
    try {
      const updated = await taskService.completeTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) { console.error(err); }
  }

  async function handleMove(id: string) {
    try {
      await taskService.moveToTomorrow(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id: string) {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) { console.error(err); }
  }

  function resetForm() {
    setTitle(''); setDescription(''); setEnergy(5);
    setTimeEstimate(''); setFocusType(''); setFormError('');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const pending = tasks.filter((t) => t.status === 'pending');
  const done    = tasks.filter((t) => t.status === 'done');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <span className="text-lg font-semibold">Zenith</span>
            </Link>
            <span className="text-slate-600 text-sm">/ Tasks</span>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-gray-700 text-slate-400 hover:text-white hover:border-gray-600 text-sm transition-colors">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Today's Tasks</h1>
            <p className="text-slate-500 text-sm mt-0.5">{pending.length} pending · {done.length} done</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); resetForm(); }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all text-sm"
          >
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>

        {/* Add Task Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">New Task</h3>
            {formError && <p className="text-red-400 text-sm mb-3">{formError}</p>}

            <input type="text" placeholder="What needs to get done?" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors mb-3" />

            <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors mb-4 resize-none" />

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-400">Energy Required</label>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${energyColor(energy)}`}>{energy}/10</span>
              </div>
              <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full accent-indigo-500" />
              <div className="flex justify-between text-xs text-slate-600 mt-1"><span>Low</span><span>High</span></div>
            </div>

            <div className="flex gap-3 mb-5">
              <div className="flex-1">
                <label className="text-sm text-slate-400 mb-1 block">Time (min)</label>
                <input type="number" placeholder="30" value={timeEstimate} onChange={(e) => setTimeEstimate(e.target.value)} min={1}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-slate-400 mb-1 block">Focus Type</label>
                <select value={focusType} onChange={(e) => setFocusType(e.target.value as FocusType | '')}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm">
                  <option value="" disabled>Select type</option>
                  <option value="deep_work">Deep Work</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>

            <button onClick={handleCreate} disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium disabled:opacity-50 hover:from-indigo-600 hover:to-purple-700 transition-all text-sm">
              {submitting ? 'Creating...' : 'Add Task'}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <div className="text-center py-12"><p className="text-slate-600">Loading tasks...</p></div>}

        {/* Empty */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-500 font-medium">No tasks yet</p>
            <p className="text-slate-600 text-sm mt-1">Click "+ Add Task" to get started</p>
          </div>
        )}

        {/* Pending */}
        {!loading && pending.length > 0 && (
          <div className="space-y-3">
            {pending.map((task) => (
              <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white font-medium">{task.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleComplete(task.id)} className="px-3 py-1 rounded-lg bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 text-xs font-medium hover:bg-emerald-900/50 transition-colors">Done</button>
                    <button onClick={() => handleMove(task.id)} className="px-3 py-1 rounded-lg bg-amber-900/30 border border-amber-800/40 text-amber-400 text-xs font-medium hover:bg-amber-900/50 transition-colors">Tomorrow</button>
                    <button onClick={() => handleDelete(task.id)} className="px-2 py-1 text-slate-600 hover:text-red-400 transition-colors text-xs">✕</button>
                  </div>
                </div>
                {task.description && <p className="text-slate-500 text-sm mt-1.5">{task.description}</p>}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${energyColor(task.energy)}`}>⚡ {task.energy}/10</span>
                  {task.focusType && <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${focusStyles[task.focusType].color}`}>{focusStyles[task.focusType].label}</span>}
                  {task.timeEstimate && <span className="text-xs text-slate-500 px-2.5 py-1 rounded-full border border-gray-800 bg-gray-800/50">🕐 {task.timeEstimate} min</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Done */}
        {!loading && done.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Completed</h2>
            <div className="space-y-2">
              {done.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3 bg-gray-900/50 border border-gray-800/50 rounded-xl opacity-60">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-slate-500 line-through text-sm">{task.title}</span>
                  <button onClick={() => handleDelete(task.id)} className="ml-auto text-slate-700 hover:text-red-400 transition-colors text-xs">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}