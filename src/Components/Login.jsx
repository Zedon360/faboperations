import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // EXACT CREDENTIAL CHECK
    // This removes the "noise" and bypasses Firebase network errors
    setTimeout(() => {
      if (username === "Zedon" && password === "Zedon123") {
        const mockUser = {
          uid: 'admin-zedon',
          displayName: 'Zedon',
          email: 'admin@fabintl.com'
        };
        
        if (onLoginSuccess) {
          onLoginSuccess(mockUser);
        }
      } else {
        setError("Invalid Admin Credentials.");
        setLoading(false);
      }
    }, 800); // Small delay to keep the 'loading' feel
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">
      <div className="max-w-md w-full bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-2xl">
        
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black italic text-red-600 tracking-tighter">FAB</h1>
          <p className="text-slate-400 uppercase tracking-[0.4em] text-[10px] mt-2 font-bold">
            Energy Systems
          </p>
        </div>

        {/* Instruction Section */}
        <div className="text-center mb-8">
          <h2 className="text-white text-xl font-bold">Secure Portal Access</h2>
          <p className="text-slate-500 text-sm mt-2">
            Sign in with your credentials to continue to the HQ Dashboard.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 py-4 px-4 rounded-xl text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 py-4 px-4 rounded-xl text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition uppercase text-sm shadow-xl shadow-red-600/10"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>

          {error && (
            <p className="text-red-500 text-center text-xs font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}
          
          <div className="pt-6 border-t border-slate-800 mt-6">
            <p className="text-slate-600 text-[9px] text-center uppercase tracking-[0.2em]">
              Authorized FAB Personnel Only • {new Date().getFullYear()}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;