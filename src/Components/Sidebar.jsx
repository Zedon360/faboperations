import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Stations', icon: '⛽' },
    { name: 'Fleet', icon: '🚛' },
    { name: 'Users', icon: '👥' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col">
      <div className="p-6">
        <h2 className="text-red-600 font-black italic text-2xl tracking-tighter">FAB HQ</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.name}
            className="w-full flex items-center space-x-3 text-slate-400 hover:text-white hover:bg-slate-800 p-3 rounded-xl transition font-bold text-sm"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
          © 2026 FAB Energy Systems
        </p>
      </div>
    </div>
  );
};

export default Sidebar;