import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const DailyReport = () => {
  const [formData, setFormData] = useState({
    manager: '',
    pmsOpening: 0, pmsClosing: 0,
    agoOpening: 0, agoClosing: 0,
    cashCollected: 0,
    mTpesa: 0,
    bankDeposit: 0,
    expenses: 0,
    expenseNote: ''
  });

  // Business Logic
  const pmsSales = Number(formData.pmsClosing) - Number(formData.pmsOpening);
  const agoSales = Number(formData.agoClosing) - Number(formData.agoOpening);
  
  // Assuming current prices (you can make these inputs later)
  const pmsPrice = 2860; 
  const agoPrice = 2870;
  const totalValue = (pmsSales * pmsPrice) + (agoSales * agoPrice);
  
  const totalAccounted = Number(formData.cashCollected) + Number(formData.mTpesa) + Number(formData.bankDeposit) + Number(formData.expenses);
  const variance = totalAccounted - totalValue;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "daily_reports"), {
        ...formData,
        pmsSales, agoSales, totalValue, variance,
        timestamp: new Date()
      });
      alert("✅ Mbagala Report Synced to HQ");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-red-500">FAB <span className="text-white">INTERNATIONAL</span></h1>
            <p className="text-xs uppercase tracking-widest opacity-60">Mbagala Station Terminal</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-60 italic">Shift Status</p>
            <p className="font-bold text-green-400">● LIVE CONNECTION</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Section 1: Meters */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h2 className="text-blue-800 font-bold mb-4 italic">PMS METER READINGS</h2>
              <div className="space-y-3">
                <input type="number" placeholder="Opening" className="w-full p-3 rounded-lg border" onChange={(e)=>setFormData({...formData, pmsOpening: e.target.value})} />
                <input type="number" placeholder="Closing" className="w-full p-3 rounded-lg border" onChange={(e)=>setFormData({...formData, pmsClosing: e.target.value})} />
                <p className="text-sm font-bold text-blue-600 uppercase">Sales: {pmsSales} L</p>
              </div>
            </div>

            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
              <h2 className="text-orange-800 font-bold mb-4 italic">AGO METER READINGS</h2>
              <div className="space-y-3">
                <input type="number" placeholder="Opening" className="w-full p-3 rounded-lg border" onChange={(e)=>setFormData({...formData, agoOpening: e.target.value})} />
                <input type="number" placeholder="Closing" className="w-full p-3 rounded-lg border" onChange={(e)=>setFormData({...formData, agoClosing: e.target.value})} />
                <p className="text-sm font-bold text-orange-600 uppercase">Sales: {agoSales} L</p>
              </div>
            </div>
          </div>

          {/* Section 2: Money Reconciliation */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="font-black text-slate-800 mb-6 flex items-center">
              CASH RECONCILIATION <span className="ml-4 text-sm font-normal text-slate-400">Total Sales Value: TZS {totalValue.toLocaleString()}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Physical Cash</label>
                <input type="number" className="p-3 border rounded-xl" placeholder="TZS" onChange={(e)=>setFormData({...formData, cashCollected: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">M-Pesa / T-Pesa</label>
                <input type="number" className="p-3 border rounded-xl" placeholder="TZS" onChange={(e)=>setFormData({...formData, mTpesa: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Bank Deposit</label>
                <input type="number" className="p-3 border rounded-xl" placeholder="TZS" onChange={(e)=>setFormData({...formData, bankDeposit: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Petty Expenses</label>
                <input type="number" className="p-3 border rounded-xl" placeholder="TZS" onChange={(e)=>setFormData({...formData, expenses: e.target.value})} />
              </div>
            </div>

            {/* Variance Alert */}
            <div className={`mt-6 p-4 rounded-xl flex justify-between items-center ${variance === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="font-bold uppercase text-xs">Variance (Balance):</span>
              <span className="text-xl font-black">TZS {variance.toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition shadow-xl shadow-red-100 uppercase tracking-tighter">
            Confirm & Push to HQ Master
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyReport;