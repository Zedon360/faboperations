import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Hapa tutaongeza logic ya ku-check kama ni Admin au Manager
      onLoginSuccess(userCredential.user);
    } catch (err) {
      setError("Login imefeli. Angalia Email au Password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">
      <div className="max-w-md w-full bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-red-600 tracking-tighter">FAB</h1>
          <p className="text-slate-400 uppercase tracking-[0.3em] text-[10px] mt-2">Energy Systems</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white focus:border-red-600 outline-none transition"
              placeholder="admin@fab.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white focus:border-red-600 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition shadow-lg shadow-red-900/20 uppercase tracking-widest">
            Sign In to Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;