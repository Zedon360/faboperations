import React, { useState } from 'react';
import { auth } from '../services/firebase'; // Matches your folder structure
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = ({ onLoginSuccess }) => {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Failed to sign in. Please try again.");
    }
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
            Please sign in with your company Google account to continue to the HQ Dashboard.
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full bg-white hover:bg-slate-100 text-black font-black py-4 rounded-xl transition flex items-center justify-center gap-3 uppercase text-sm shadow-xl shadow-white/5"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5" 
            />
            Sign In with Google
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
        </div>
      </div>
    </div>
  );
};

// Crucial: This prevents the "Does not provide an export named default" error
export default Login;