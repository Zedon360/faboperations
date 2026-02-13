import React, { useState, useMemo } from 'react';

const DailyReport = () => {
  const [report, setReport] = useState({
    station: "MBAGALA",
    date: new Date().toISOString().split('T')[0],
    manager: "Osama Barahiyan",
    pmsPrice: 2860,
    agoPrice: 2870,
    // Night Handover Section
    nightHandover: { pmsSales: 0, agoSales: 0, cash: 0, tpesa: 0, mpesa: 0, bank: 0 },
    // Pump Readings
    pmsPumps: [
      { id: 'P1', opening: 0, closing: 0, test: 0 },
      { id: 'P2', opening: 0, closing: 0, test: 0 }
    ],
    agoPumps: [
      { id: 'D1', opening: 0, closing: 0, test: 0 }
    ],
    // Expenses
    expenses: [{ category: "Salaries", desc: "", amount: 0 }],
    // Payments (Collections)
    payments: { cash: 0, tpesa: 0, mpesa: 0, bank: 0 }
  });

  // --- AUTOMATIC CALCULATIONS (The "Excel" Logic) ---
  const totals = useMemo(() => {
    const calcNet = (pumps) => pumps.reduce((sum, p) => sum + (Number(p.closing) - Number(p.opening) - Number(p.test)), 0);
    
    const pmsNetLtrs = calcNet(report.pmsPumps);
    const agoNetLtrs = calcNet(report.agoPumps);
    
    const pmsValue = pmsNetLtrs * report.pmsPrice;
    const agoValue = agoNetLtrs * report.agoPrice;
    const totalSalesValue = pmsValue + agoValue;

    const totalExpenses = report.expenses.reduce((sum, ex) => sum + Number(ex.amount), 0);
    const totalPayments = Object.values(report.payments).reduce((sum, val) => sum + Number(val), 0);
    
    return {
      pmsNetLtrs, agoNetLtrs,
      pmsValue, agoValue,
      totalSalesValue,
      totalExpenses,
      totalPayments,
      variance: totalPayments - (totalSalesValue - totalExpenses)
    };
  }, [report]);

  const updatePump = (type, index, field, val) => {
    const key = type === 'PMS' ? 'pmsPumps' : 'agoPumps';
    const updated = [...report[key]];
    updated[index][field] = val;
    setReport({ ...report, [key]: updated });
  };

  // --- STYLING ---
  const cardStyle = { backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '20px', marginBottom: '20px' };
  const inputStyle = { backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '8px', width: '100%' };
  const labelStyle = { color: '#64748b', fontSize: '0.75rem', fontWeight: '900', display: 'block', marginBottom: '8px' };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '40px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>DAILY <span style={{ color: '#dc2626' }}>REPORT</span></h1>
          <p style={{ color: '#64748b' }}>STATION: {report.station} | MANAGER: {report.manager}</p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div><label style={labelStyle}>PMS PRICE</label><input type="number" style={{...inputStyle, width: '100px'}} value={report.pmsPrice} onChange={e => setReport({...report, pmsPrice: e.target.value})}/></div>
          <div><label style={labelStyle}>AGO PRICE</label><input type="number" style={{...inputStyle, width: '100px'}} value={report.agoPrice} onChange={e => setReport({...report, agoPrice: e.target.value})}/></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Left Column: Data Entry */}
        <div>
          {/* Night Handover Section */}
          <section style={cardStyle}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#dc2626' }}>NIGHT SHIFT HANDOVER</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <input style={inputStyle} placeholder="Night PMS Sales" type="number" onChange={e => setReport({...report, nightHandover: {...report.nightHandover, pmsSales: e.target.value}})}/>
              <input style={inputStyle} placeholder="Night AGO Sales" type="number" onChange={e => setReport({...report, nightHandover: {...report.nightHandover, agoSales: e.target.value}})}/>
              <input style={inputStyle} placeholder="Cash Handover" type="number" onChange={e => setReport({...report, nightHandover: {...report.nightHandover, cash: e.target.value}})}/>
            </div>
          </section>

          {/* PMS Pump Readings */}
          <section style={cardStyle}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#4ade80' }}>PMS METER READINGS (PETROL)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={labelStyle}><th align="left">PUMP</th><th align="left">OPENING</th><th align="left">CLOSING</th><th align="left">TEST</th></tr></thead>
              <tbody>
                {report.pmsPumps.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{p.id}</td>
                    <td><input style={inputStyle} type="number" value={p.opening} onChange={e => updatePump('PMS', i, 'opening', e.target.value)}/></td>
                    <td><input style={inputStyle} type="number" value={p.closing} onChange={e => updatePump('PMS', i, 'closing', e.target.value)}/></td>
                    <td><input style={inputStyle} type="number" value={p.test} onChange={e => updatePump('PMS', i, 'test', e.target.value)}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* AGO Pump Readings */}
          <section style={cardStyle}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#fbbf24' }}>AGO METER READINGS (DIESEL)</h3>
            {report.agoPumps.map((p, i) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{p.id}</span>
                <input style={inputStyle} type="number" placeholder="Opening" onChange={e => updatePump('AGO', i, 'opening', e.target.value)}/>
                <input style={inputStyle} type="number" placeholder="Closing" onChange={e => updatePump('AGO', i, 'closing', e.target.value)}/>
                <input style={inputStyle} type="number" placeholder="Test" onChange={e => updatePump('AGO', i, 'test', e.target.value)}/>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column: Summaries & Payments */}
        <div>
          {/* Payment Methods */}
          <section style={{ ...cardStyle, border: '1px solid #4ade80' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem' }}>PAYMENT METHODS (COLLECTIONS)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={labelStyle}>CASH DROPS</label><input style={inputStyle} type="number" onChange={e => setReport({...report, payments: {...report.payments, cash: e.target.value}})}/></div>
              <div><label style={labelStyle}>T-PESA</label><input style={inputStyle} type="number" onChange={e => setReport({...report, payments: {...report.payments, tpesa: e.target.value}})}/></div>
              <div><label style={labelStyle}>M-PESA</label><input style={inputStyle} type="number" onChange={e => setReport({...report, payments: {...report.payments, mpesa: e.target.value}})}/></div>
              <div><label style={labelStyle}>BANK POS</label><input style={inputStyle} type="number" onChange={e => setReport({...report, payments: {...report.payments, bank: e.target.value}})}/></div>
            </div>
          </section>

          {/* Real-time Summary Sheet */}
          <section style={{ ...cardStyle, backgroundColor: '#1e293b' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '900' }}>DAILY SUMMARY</h3>
            <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total PMS Sales:</span> <span>{totals.pmsNetLtrs.toLocaleString()} L</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total AGO Sales:</span> <span>{totals.agoNetLtrs.toLocaleString()} L</span></div>
              <hr style={{ border: '0.1px solid #334155' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>Total Sales Value:</span> <span>TZS {totals.totalSalesValue.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}><span>Expenses:</span> <span>- TZS {totals.totalExpenses.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
                <span>NET COLLECTIONS:</span> 
                <span>TZS {totals.totalPayments.toLocaleString()}</span>
              </div>
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                borderRadius: '8px', 
                backgroundColor: totals.variance === 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                textAlign: 'center',
                fontWeight: 'bold',
                color: totals.variance === 0 ? '#4ade80' : '#f87171'
              }}>
                VARIANCE: TZS {totals.variance.toLocaleString()}
              </div>
            </div>
          </section>

          <button style={{ width: '100%', padding: '20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)' }}>
            SUBMIT & LOCK REPORT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;