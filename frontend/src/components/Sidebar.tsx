import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const isActive = (path: string) => location.pathname === path;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <span className="text-white text-xl font-semibold">Zenith</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">

        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/mood"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/mood')
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          🌙 Mood
        </Link>

        <Link
          to="/history"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/history')
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              : 'text-slate-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          📜 History
        </Link>

        <div className="flex items-center gap-3 px-4 py-3 text-slate-600 cursor-not-allowed">
          🧠 AI Plan
          <span className="ml-auto text-xs bg-gray-800 px-2 py-0.5 rounded">
            Soon
          </span>
        </div>

      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-slate-400 text-sm truncate mb-2">
          {user?.email}
        </p>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 text-slate-400 hover:text-white hover:border-gray-600 text-sm"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
