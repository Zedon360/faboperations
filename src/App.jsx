import React, { useState } from 'react';
import HQDashboard from './portals/hq/HQDashboard';
import StationsManager from './portals/hq/StationsManager';
import FleetManager from './portals/hq/FleetManager';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-slate-200">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-black italic text-red-600 tracking-tighter">FAB HQ</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Command Center</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActivePage('dashboard')}
            className={`w-full flex items-center p-3 rounded-xl transition ${activePage === 'dashboard' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <span className="font-bold text-sm uppercase">📊 Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActivePage('stations')}
            className={`w-full flex items-center p-3 rounded-xl transition ${activePage === 'stations' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <span className="font-bold text-sm uppercase">⛽ Stations</span>
          </button>

          <button 
            onClick={() => setActivePage('fleet')}
            className={`w-full flex items-center p-3 rounded-xl transition ${activePage === 'fleet' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <span className="font-bold text-sm uppercase">🚛 Fleet Mgmt</span>
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        {activePage === 'dashboard' && <HQDashboard />}
        {activePage === 'stations' && <StationsManager />}
        {activePage === 'fleet' && <FleetManager />}
      </div>
    </div>
  );
}

export default App;