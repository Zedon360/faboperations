import React, { useState } from 'react';

const StationsManager = () => {
  const [stations, setStations] = useState([
    { id: 1, name: 'MBAGALA', manager: 'Osama Barahiyan', status: 'Online' },
    { id: 2, name: 'MITUNDU', manager: 'Kassim Ali', status: 'Offline' }
  ]);

  const addStation = () => {
    const name = prompt("Enter Station Name:");
    const manager = prompt("Assign Manager:");
    if(name && manager) {
      setStations([...stations, { id: Date.now(), name, manager, status: 'Active' }]);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black uppercase italic">Station Management</h2>
        <button 
          onClick={addStation}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-red-900/20"
        >
          + ADD NEW STATION
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(s => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-red-600 transition group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-white">{s.name}</h3>
              <span className="text-[10px] bg-green-900 text-green-400 px-2 py-1 rounded-md font-bold uppercase">{s.status}</span>
            </div>
            <p className="text-slate-500 text-xs mb-6">Manager: <span className="text-slate-200">{s.manager}</span></p>
            <button className="w-full bg-slate-800 py-3 rounded-xl text-xs font-bold uppercase tracking-widest group-hover:bg-red-600 transition">
              Enter Station Portal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationsManager;