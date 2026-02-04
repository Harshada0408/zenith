import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Z</span>
            </div>
            <span className="text-lg font-semibold">Zenith</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-gray-700 text-slate-400 hover:text-white hover:border-gray-600 text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-800/30 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Good day 👋
          </h1>
          <p className="text-slate-400">
            What do you want to tackle today?
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Tasks */}
          <Link
            to="/tasks"
            className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 
                      border border-blue-800/30 rounded-2xl p-6 
                      hover:border-blue-600/50 transition-colors cursor-pointer"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-white mb-1">Tasks</h3>
            <p className="text-slate-500 text-sm">Manage your daily tasks</p>
            <span className="inline-block mt-4 text-xs text-blue-400 bg-blue-900/40 px-3 py-1 rounded-full">
              Open →
            </span>
          </Link>

          {/* Mood */}
          <Link
            to="/mood"
            className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 
                      border border-purple-800/30 rounded-2xl p-6 
                      hover:border-purple-600/50 transition-colors cursor-pointer"
          >
            <div className="text-3xl mb-3">🌙</div>
            <h3 className="text-lg font-semibold text-white mb-1">Mood</h3>
            <p className="text-slate-500 text-sm">Track your energy & mood</p>
            <span className="inline-block mt-4 text-xs text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full">
              Open →
            </span>
          </Link>

          {/* AI Plan */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 
                          border border-indigo-800/30 rounded-2xl p-6">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold text-white mb-1">AI Plan</h3>
            <p className="text-slate-500 text-sm">Get your AI daily plan</p>
            <span className="inline-block mt-4 text-xs text-slate-600 bg-gray-800/50 px-3 py-1 rounded-full">
              Coming soon
            </span>
          </div>

        </div>

      </main>
    </div>
  );
}