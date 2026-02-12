import React from 'react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const HQLayout = ({ user }) => {
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Firebase will notify App.jsx, and you'll be sent to Login automatically
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black italic text-red-600">FAB HQ</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-bold transition"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-[#0f172a] p-10 rounded-[2rem] border border-slate-800">
        <h2 className="text-3xl font-bold">Welcome, {user?.displayName || 'Admin'}</h2>
        <p className="text-slate-400 mt-2">You are now inside the Energy Systems Portal.</p>
      </div>
    </div>
  );
};

export default HQLayout;