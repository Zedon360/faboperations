import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const HQDashboard = () => {
  const [reports, setReports] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "daily_reports"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  // Summary Logic for Requirement (a)
  const totalPms = reports.reduce((sum, r) => sum + (Number(r.pmsSales) || 0), 0);
  const totalAgo = reports.reduce((sum, r) => sum + (Number(r.agoSales) || 0), 0);
  const totalCash = reports.reduce((sum, r) => sum + (Number(r.cashCollected) || 0), 0);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-800 pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-black italic text-red-600 tracking-tighter">FAB MASTER HQ</h1>
            <p className="text-slate-500 text-xs uppercase tracking-[0.4em] mt-2">Executive Operations Control</p>
          </div>
          <div className="hidden md:block text-right">
            <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-6 rounded-full transition">
              + ADD NEW STATION
            </button>
          </div>
        </div>

        {/* Top Level Summary - Requirement (c) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Total Group PMS Sales</p>
            <h2 className="text-3xl font-black text-blue-500">{totalPms.toLocaleString()} <span className="text-sm font-normal uppercase text-slate-600">Ltrs</span></h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Total Group AGO Sales</p>
            <h2 className="text-3xl font-black text-orange-500">{totalAgo.toLocaleString()} <span className="text-sm font-normal uppercase text-slate-600">Ltrs</span></h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Total Cash Position</p>
            <h2 className="text-3xl font-black text-green-500">TZS {totalCash.toLocaleString()}</h2>
          </div>
        </div>

        {/* Station Breakdown Table - Requirement (d) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-slate-800/50 border-b border-slate-800">
            <h3 className="font-bold text-sm uppercase tracking-widest italic">Live Station Feed</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="p-6">Station Name</th>
                  <th className="p-6">Manager</th>
                  <th className="p-6 text-right">PMS Sold</th>
                  <th className="p-6 text-right">AGO Sold</th>
                  <th className="p-6 text-right">Net Cash</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition group">
                    <td className="p-6 font-black text-red-500 uppercase tracking-tighter">{report.station}</td>
                    <td className="p-6 text-sm font-medium">{report.manager}</td>
                    <td className="p-6 text-right text-blue-400 font-mono italic">{report.pmsSales} L</td>
                    <td className="p-6 text-right text-orange-400 font-mono italic">{report.agoSales} L</td>
                    <td className="p-6 text-right font-bold text-white">TZS {(Number(report.cashCollected) || 0).toLocaleString()}</td>
                    <td className="p-6 text-center">
                      <button className="bg-slate-800 group-hover:bg-red-600 text-[10px] font-bold py-2 px-4 rounded-lg transition-all">
                        VIEW DETAIL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HQDashboard;