import React from 'react';

const FleetManager = () => {
  return (
    <div className="p-10">
      <h2 className="text-3xl font-black uppercase italic mb-10">Fleet & Logistics</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-[10px] uppercase text-slate-500">
            <tr>
              <th className="p-6">Truck ID</th>
              <th className="p-6">Destination</th>
              <th className="p-6 text-right">Fuel Loaded (L)</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr className="hover:bg-slate-800/30 transition">
              <td className="p-6 font-bold">T 442 ABC</td>
              <td className="p-6">MBAGALA</td>
              <td className="p-6 text-right font-mono">35,000</td>
              <td className="p-6"><span className="text-orange-500 font-bold text-xs uppercase">In Transit</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetManager;