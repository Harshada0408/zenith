
// export default App;
import { useState } from 'react';
import { signIn, signUp, signOut } from './services/auth';
import { supabase } from './services/supabase';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSignup = async () => {
    try {
      await signUp(email, password);
      setStatus('Signup successful');
    } catch (e: any) {
      setStatus(e.message);
    }
  };

const handleLogin = async () => {
  try {
    await signIn(email, password);

    const { data } = await supabase.auth.getSession();
    console.log('SESSION:', data.session);
    console.log('ACCESS TOKEN:', data.session?.access_token);

    setStatus('Login successful (check console)');
  } catch (e: any) {
    setStatus(e.message);
  }
};


  const handleLogout = async () => {
    await signOut();
    setStatus('Logged out');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">Zenith Auth</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleSignup} className="w-full bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>

        <button onClick={handleLogin} className="w-full bg-green-500 text-white p-2 rounded">
          Login
        </button>

        <button onClick={handleLogout} className="w-full bg-gray-400 text-white p-2 rounded">
          Logout
        </button>

        <p className="text-center text-sm">{status}</p>
      </div>
    </div>
  );
}

export default App;
