import React from 'react';
import Sidebar from './Sidebar'; // Hakikisha path ni sahihi

const HQLayout = ({ user }) => {
  return (
    <div className="flex min-h-screen bg-[#0b0f1a]">
      {/* Sidebar ipo hapa */}
      <Sidebar />
      
      {/* Sehemu ya Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              HQ CONTROL CENTER
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Welcome back, {user.email}
            </p>
          </div>
          
          <button 
            onClick={() => auth.signOut()} 
            className="bg-slate-800 hover:bg-red-600 text-white text-[10px] font-bold py-2 px-4 rounded-lg transition"
          >
            LOGOUT
          </button>
        </header>

        {/* Hapa ndipo kurasa zako (Fleet, Stations) zitakuwa zinatokea */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6">
           <p className="text-slate-400">Select a section from the sidebar to manage FAB Operations.</p>
        </div>
      </main>
    </div>
  );
};

export default HQLayout;