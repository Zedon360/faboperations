import React, { useState, useMemo } from 'react';

const SECTIONS = [
  { key: 'meters', label: 'Meter Readings & Stock' },
  { key: 'payments', label: 'Payments' },
  { key: 'orders', label: 'Orders' },
  { key: 'credits', label: 'Credit Sales' },
  { key: 'discounts', label: 'Discounts' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'expenses', label: 'Expenses' },
];

const EXPENSE_CATEGORIES = [
  'Salaries', 'Electricity', 'Water', 'Security', 'Cleaning', 'Stationery', 'Repairs', 'Other'
];

const DailyReport = () => {
  const [activeSection, setActiveSection] = useState('meters');

  const [report, setReport] = useState({
    station: "MBAGALA",
    date: new Date().toISOString().split('T')[0],
    manager: "Osama Barahiyan",
    pmsPrice: 2860,
    agoPrice: 2870,

    // Shift Handover (Day or Night)
    shiftHandover: {
      shiftType: 'night', // 'day' or 'night'
      shiftDate: '', supervisor: '',
      pmsLtrs: 0, agoLtrs: 0,
      cash: 0, tpesa: 0, mpesa: 0, bank: 0
    },

    // PMS Pumps (P1-P6 from Excel)
    pmsPumps: [
      { id: 'P1', opening: 0, closing: 0, test: 0 },
      { id: 'P2', opening: 0, closing: 0, test: 0 },
      { id: 'P3', opening: 0, closing: 0, test: 0 },
      { id: 'P4', opening: 0, closing: 0, test: 0 },
      { id: 'P5', opening: 0, closing: 0, test: 0 },
      { id: 'P6', opening: 0, closing: 0, test: 0 },
    ],

    // AGO Pumps (D1-D8 from Excel)
    agoPumps: [
      { id: 'D1', opening: 0, closing: 0, test: 0 },
      { id: 'D2', opening: 0, closing: 0, test: 0 },
      { id: 'D3', opening: 0, closing: 0, test: 0 },
      { id: 'D4', opening: 0, closing: 0, test: 0 },
      { id: 'D5', opening: 0, closing: 0, test: 0 },
      { id: 'D6', opening: 0, closing: 0, test: 0 },
      { id: 'D7', opening: 0, closing: 0, test: 0 },
      { id: 'D8', opening: 0, closing: 0, test: 0 },
    ],

    // Stock Reconciliation
    stockRecon: {
      pmsOpeningStock: 0, pmsDeliveries: 0, pmsActualDip: 0,
      agoOpeningStock: 0, agoDeliveries: 0, agoActualDip: 0,
    },

    // Payment Methods Breakdown
    payments: { cash: 0, tpesa: 0, mpesa: 0, bank: 0, credit: 0 },

    // Orders (Pre-paid Company Orders)
    orders: [
      { company: '', product: 'PMS', litres: 0, pricePerLitre: 0, totalValue: 0, paymentRef: '' }
    ],

    // Credit Sales
    creditSales: [
      { customerName: '', product: 'PMS', litres: 0, totalValue: 0, authBy: '', invoiceNo: '' }
    ],

    // Discounts
    discounts: [
      { customerName: '', product: 'PMS', litres: 0, discountAmount: 0, authBy: '', reason: '' }
    ],

    // Deliveries
    deliveries: [
      { supplier: '', product: 'PMS', litres: 0, deliveryNote: '', receivedBy: '' }
    ],

    // Operating Expenses
    expenses: [
      { category: 'Salaries', description: '', amount: 0, receiptNo: '' }
    ],

    // Bank Deposit
    bankDeposit: { bankName: '', depositSlipNo: '', amountDeposited: 0 }
  });

  // --- HELPER: Update nested field ---
  const setField = (section, field, value) => {
    setReport(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updatePump = (type, index, field, val) => {
    const key = type === 'PMS' ? 'pmsPumps' : 'agoPumps';
    setReport(prev => {
      const updated = prev[key].map((p, i) => i === index ? { ...p, [field]: val } : p);
      return { ...prev, [key]: updated };
    });
  };

  const updateArrayItem = (key, index, field, val) => {
    setReport(prev => {
      const updated = prev[key].map((item, i) => i === index ? { ...item, [field]: val } : item);
      return { ...prev, [key]: updated };
    });
  };

  const addArrayItem = (key, template) => {
    setReport(prev => ({ ...prev, [key]: [...prev[key], { ...template }] }));
  };

  const removeArrayItem = (key, index) => {
    setReport(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  // --- CALCULATIONS (Excel Logic) ---
  const totals = useMemo(() => {
    const n = (v) => Number(v) || 0;
    const calcPump = (p) => n(p.closing) - n(p.opening);

    // PMS
    const pmsGross = report.pmsPumps.reduce((s, p) => s + calcPump(p), 0);
    const pmsTotalTest = report.pmsPumps.reduce((s, p) => s + n(p.test), 0);
    const pmsNet = pmsGross - pmsTotalTest;

    // AGO
    const agoGross = report.agoPumps.reduce((s, p) => s + calcPump(p), 0);
    const agoTotalTest = report.agoPumps.reduce((s, p) => s + n(p.test), 0);
    const agoNet = agoGross - agoTotalTest;

    // Sales values
    const pmsValue = pmsNet * n(report.pmsPrice);
    const agoValue = agoNet * n(report.agoPrice);
    const totalSalesValue = pmsValue + agoValue;

    // Stock Reconciliation
    const sr = report.stockRecon;
    const pmsExpectedStock = n(sr.pmsOpeningStock) + n(sr.pmsDeliveries) - pmsNet;
    const pmsStockVariance = n(sr.pmsActualDip) - pmsExpectedStock;
    const pmsStockVarianceValue = pmsStockVariance * n(report.pmsPrice);

    const agoExpectedStock = n(sr.agoOpeningStock) + n(sr.agoDeliveries) - agoNet;
    const agoStockVariance = n(sr.agoActualDip) - agoExpectedStock;
    const agoStockVarianceValue = agoStockVariance * n(report.agoPrice);

    // Payments
    const pay = report.payments;
    const totalPayments = n(pay.cash) + n(pay.tpesa) + n(pay.mpesa) + n(pay.bank) + n(pay.credit);

    // Orders
    const totalOrders = report.orders.reduce((s, o) => s + n(o.totalValue), 0);

    // Credit Sales
    const totalCreditSales = report.creditSales.reduce((s, c) => s + n(c.totalValue), 0);

    // Discounts
    const totalDiscounts = report.discounts.reduce((s, d) => s + n(d.discountAmount), 0);

    // Deliveries
    const totalDeliveryLtrs = (product) => report.deliveries.filter(d => d.product === product).reduce((s, d) => s + n(d.litres), 0);

    // Expenses
    const totalExpenses = report.expenses.reduce((s, e) => s + n(e.amount), 0);

    // Shift handover total
    const sh = report.shiftHandover;
    const shiftTotal = n(sh.cash) + n(sh.tpesa) + n(sh.mpesa) + n(sh.bank);

    // Variance = Total Payments - (Total Sales Value - Expenses)
    const variance = totalPayments - (totalSalesValue - totalExpenses);

    // Cash to deposit = Cash collections - Expenses
    const cashToDeposit = n(pay.cash) - totalExpenses;

    return {
      pmsGross, pmsTotalTest, pmsNet, pmsValue,
      agoGross, agoTotalTest, agoNet, agoValue,
      totalSalesValue,
      pmsExpectedStock, pmsStockVariance, pmsStockVarianceValue,
      agoExpectedStock, agoStockVariance, agoStockVarianceValue,
      totalPayments,
      totalOrders, totalCreditSales, totalDiscounts,
      totalDeliveryLtrs,
      totalExpenses,
      shiftTotal,
      variance,
      cashToDeposit,
    };
  }, [report]);

  // --- IMPROVED COLOR PALETTE ---
  // Clean white background with high-contrast colors
  const colors = {
    bg: '#ffffff',
    cardBg: '#f8fafc',
    cardBorder: '#e2e8f0',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    inputText: '#1e293b',
    labelText: '#475569',
    bodyText: '#1e293b',
    mutedText: '#64748b',
    heading: '#0f172a',
    red: '#dc2626',
    green: '#16a34a',
    greenLight: '#dcfce7',
    greenBg: '#f0fdf4',
    yellow: '#ca8a04',
    yellowLight: '#fef9c3',
    blue: '#2563eb',
    blueLight: '#dbeafe',
    orange: '#ea580c',
    orangeLight: '#fff7ed',
    purple: '#7c3aed',
    purpleLight: '#f5f3ff',
    pink: '#db2777',
    pinkLight: '#fdf2f8',
    teal: '#0d9488',
    tealLight: '#f0fdfa',
    redLight: '#fef2f2',
    divider: '#e2e8f0',
  };

  const card = { backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, padding: '24px', borderRadius: '16px', marginBottom: '20px' };
  const inp = { backgroundColor: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.inputText, padding: '10px 12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box', fontSize: '0.9rem' };
  const lbl = { color: colors.labelText, fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.05em', display: 'block', marginBottom: '6px', textTransform: 'uppercase' };
  const autoVal = { backgroundColor: colors.greenBg, border: `1px solid ${colors.green}30`, color: colors.green, padding: '10px 12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box', fontSize: '0.9rem', fontWeight: '600' };
  const sectionTitle = (color) => ({ margin: '0 0 20px 0', fontSize: '1.05rem', fontWeight: '800', color, letterSpacing: '0.03em' });
  const addBtn = { background: 'none', border: `1px dashed ${colors.cardBorder}`, color: colors.mutedText, padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', marginTop: '10px', fontSize: '0.8rem' };
  const removeBtn = { background: 'none', border: 'none', color: colors.red, cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px' };
  const selectStyle = { ...inp, appearance: 'auto' };

  // --- Shift toggle button style ---
  const shiftBtn = (isActive) => ({
    flex: 1,
    padding: '12px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.85rem',
    letterSpacing: '0.03em',
    transition: 'all 0.2s',
    ...(isActive ? {
      backgroundColor: report.shiftHandover.shiftType === 'day' ? '#f59e0b' : '#3b82f6',
      color: '#ffffff',
      boxShadow: report.shiftHandover.shiftType === 'day'
        ? '0 4px 12px rgba(245, 158, 11, 0.35)'
        : '0 4px 12px rgba(59, 130, 246, 0.35)',
    } : {
      backgroundColor: '#f1f5f9',
      color: colors.mutedText,
    })
  });

  // --- SECTION RENDERERS ---

  const isDay = report.shiftHandover.shiftType === 'day';
  const shiftColor = isDay ? '#f59e0b' : '#3b82f6';
  const shiftLabel = isDay ? 'DAY' : 'NIGHT';
  const shiftBg = isDay ? '#fffbeb' : '#eff6ff';

  const renderMeters = () => (
    <>
      {/* Shift Handover */}
      <section style={{ ...card, borderLeft: `4px solid ${shiftColor}`, backgroundColor: shiftBg }}>
        <h3 style={sectionTitle(shiftColor)}>SHIFT HANDOVER</h3>

        {/* Day / Night Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', maxWidth: '320px' }}>
          <button
            style={shiftBtn(report.shiftHandover.shiftType === 'day')}
            onClick={() => setField('shiftHandover', 'shiftType', 'day')}
          >
            DAY SHIFT
          </button>
          <button
            style={shiftBtn(report.shiftHandover.shiftType === 'night')}
            onClick={() => setField('shiftHandover', 'shiftType', 'night')}
          >
            NIGHT SHIFT
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div><label style={lbl}>{shiftLabel} Shift Date</label><input style={inp} type="date" value={report.shiftHandover.shiftDate} onChange={e => setField('shiftHandover', 'shiftDate', e.target.value)} /></div>
          <div><label style={lbl}>Supervisor</label><input style={inp} placeholder={`${shiftLabel} Supervisor Name`} value={report.shiftHandover.supervisor} onChange={e => setField('shiftHandover', 'supervisor', e.target.value)} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div><label style={lbl}>PMS Sold (Ltrs)</label><input style={inp} type="number" value={report.shiftHandover.pmsLtrs || ''} onChange={e => setField('shiftHandover', 'pmsLtrs', e.target.value)} /></div>
          <div><label style={lbl}>AGO Sold (Ltrs)</label><input style={inp} type="number" value={report.shiftHandover.agoLtrs || ''} onChange={e => setField('shiftHandover', 'agoLtrs', e.target.value)} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
          <div><label style={lbl}>Cash</label><input style={inp} type="number" value={report.shiftHandover.cash || ''} onChange={e => setField('shiftHandover', 'cash', e.target.value)} /></div>
          <div><label style={lbl}>T-Pesa</label><input style={inp} type="number" value={report.shiftHandover.tpesa || ''} onChange={e => setField('shiftHandover', 'tpesa', e.target.value)} /></div>
          <div><label style={lbl}>M-Pesa</label><input style={inp} type="number" value={report.shiftHandover.mpesa || ''} onChange={e => setField('shiftHandover', 'mpesa', e.target.value)} /></div>
          <div><label style={lbl}>Bank</label><input style={inp} type="number" value={report.shiftHandover.bank || ''} onChange={e => setField('shiftHandover', 'bank', e.target.value)} /></div>
        </div>
        <div style={{ marginTop: '12px', textAlign: 'right', color: shiftColor, fontWeight: '700', fontSize: '0.85rem' }}>
          {shiftLabel} Shift Total: TZS {totals.shiftTotal.toLocaleString()}
        </div>
      </section>

      {/* Meter Readings */}
      <section style={{ ...card, borderLeft: `4px solid ${colors.blue}` }}>
        <h3 style={sectionTitle(colors.blue)}>METER READINGS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* PMS Meter Readings */}
          <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: `1px solid ${colors.green}30`, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${colors.divider}` }}>
              <h4 style={{ color: colors.green, fontSize: '1.1rem', margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ backgroundColor: colors.greenBg, padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>PMS</span>
                <span style={{ color: colors.heading }}>PETROL</span>
              </h4>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: colors.mutedText, fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Volume</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: colors.green }}>{totals.pmsNet.toLocaleString()} L</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>PUMP</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>OPENING</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>CLOSING</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>TEST</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'right', padding: '0 16px 8px 16px' }}>GROSS</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'right', padding: '0 16px 8px 16px' }}>NET</th>
                  </tr>
                </thead>
                <tbody>
                  {report.pmsPumps.map((p, i) => {
                    const gross = (Number(p.closing) || 0) - (Number(p.opening) || 0);
                    const net = gross - (Number(p.test) || 0);
                    return (
                      <tr key={p.id} style={{ backgroundColor: colors.cardBg, transition: 'all 0.2s' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '800', color: colors.heading, borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', width: '80px' }}>{p.id}</td>
                        <td style={{ padding: '8px 16px' }}><input style={{ ...inp, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', fontWeight: '600' }} type="number" value={p.opening || ''} onChange={e => updatePump('PMS', i, 'opening', e.target.value)} /></td>
                        <td style={{ padding: '8px 16px' }}><input style={{ ...inp, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', fontWeight: '600' }} type="number" value={p.closing || ''} onChange={e => updatePump('PMS', i, 'closing', e.target.value)} /></td>
                        <td style={{ padding: '8px 16px' }}><input style={{ ...inp, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', fontWeight: '600' }} type="number" value={p.test || ''} onChange={e => updatePump('PMS', i, 'test', e.target.value)} /></td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: colors.mutedText, fontWeight: '600', fontSize: '0.95rem' }}>{gross.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: colors.green, fontWeight: '800', fontSize: '1.1rem', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>{net.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AGO Meter Readings */}
          <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: `1px solid ${colors.yellow}30`, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${colors.divider}` }}>
              <h4 style={{ color: colors.yellow, fontSize: '1.1rem', margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ backgroundColor: colors.yellowLight, padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>AGO</span>
                <span style={{ color: colors.heading }}>DIESEL</span>
              </h4>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: colors.mutedText, fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Volume</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: colors.yellow }}>{totals.agoNet.toLocaleString()} L</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>PUMP</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>OPENING</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>CLOSING</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'left', padding: '0 16px 8px 16px' }}>TEST</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'right', padding: '0 16px 8px 16px' }}>GROSS</th>
                    <th style={{ color: colors.mutedText, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'right', padding: '0 16px 8px 16px' }}>NET</th>
                  </tr>
                </thead>
                <tbody>
                  {report.agoPumps.map((p, i) => {
                    const gross = (Number(p.closing) || 0) - (Number(p.opening) || 0);
                    const net = gross - (Number(p.test) || 0);
                    return (
                      <tr key={p.id} style={{ backgroundColor: colors.cardBg, transition: 'all 0.2s' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '800', color: colors.heading, borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', width: '80px' }}>{p.id}</td>
                        <td style={{ padding: '8px 16px' }}><input style={{ ...inp, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', fontWeight: '600' }} type="number" value={p.opening || ''} onChange={e => updatePump('AGO', i, 'opening', e.target.value)} /></td>
                        <td style={{ padding: '8px 16px' }}><input style={{ ...inp, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', fontWeight: '600' }} type="number" value={p.closing || ''} onChange={e => updatePump('AGO', i, 'closing', e.target.value)} /></td>
                        <td style={{ padding: '8px 16px' }}><input style={{ ...inp, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', fontWeight: '600' }} type="number" value={p.test || ''} onChange={e => updatePump('AGO', i, 'test', e.target.value)} /></td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: colors.mutedText, fontWeight: '600', fontSize: '0.95rem' }}>{gross.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: colors.yellow, fontWeight: '800', fontSize: '1.1rem', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>{net.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Reconciliation */}
      <section style={{ ...card, borderLeft: `4px solid ${colors.purple}` }}>
        <h3 style={sectionTitle(colors.purple)}>STOCK RECONCILIATION & VARIANCE</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* PMS Stock */}
          <div style={{ padding: '16px', backgroundColor: colors.greenBg, borderRadius: '12px' }}>
            <h4 style={{ color: colors.green, fontSize: '0.85rem', marginBottom: '12px', fontWeight: '700' }}>PMS (PETROL)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><label style={lbl}>Opening Stock (Dip)</label><input style={inp} type="number" value={report.stockRecon.pmsOpeningStock || ''} onChange={e => setField('stockRecon', 'pmsOpeningStock', e.target.value)} /></div>
              <div><label style={lbl}>Deliveries Today</label><input style={inp} type="number" value={report.stockRecon.pmsDeliveries || ''} onChange={e => setField('stockRecon', 'pmsDeliveries', e.target.value)} /></div>
              <div><label style={lbl}>Sales (Auto)</label><div style={autoVal}>{totals.pmsNet.toLocaleString()} L</div></div>
              <div><label style={lbl}>Expected Stock</label><div style={autoVal}>{totals.pmsExpectedStock.toLocaleString()} L</div></div>
              <div><label style={lbl}>Actual Dip (Closing)</label><input style={inp} type="number" value={report.stockRecon.pmsActualDip || ''} onChange={e => setField('stockRecon', 'pmsActualDip', e.target.value)} /></div>
              <div><label style={lbl}>Variance</label>
                <div style={{ ...autoVal, backgroundColor: totals.pmsStockVariance === 0 ? colors.greenBg : colors.redLight, color: totals.pmsStockVariance === 0 ? colors.green : colors.red, borderColor: totals.pmsStockVariance === 0 ? `${colors.green}30` : `${colors.red}30` }}>
                  {totals.pmsStockVariance.toLocaleString()} L ({totals.pmsStockVarianceValue.toLocaleString()} TZS)
                </div>
              </div>
            </div>
          </div>
          {/* AGO Stock */}
          <div style={{ padding: '16px', backgroundColor: colors.yellowLight, borderRadius: '12px' }}>
            <h4 style={{ color: colors.yellow, fontSize: '0.85rem', marginBottom: '12px', fontWeight: '700' }}>AGO (DIESEL)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><label style={lbl}>Opening Stock (Dip)</label><input style={inp} type="number" value={report.stockRecon.agoOpeningStock || ''} onChange={e => setField('stockRecon', 'agoOpeningStock', e.target.value)} /></div>
              <div><label style={lbl}>Deliveries Today</label><input style={inp} type="number" value={report.stockRecon.agoDeliveries || ''} onChange={e => setField('stockRecon', 'agoDeliveries', e.target.value)} /></div>
              <div><label style={lbl}>Sales (Auto)</label><div style={autoVal}>{totals.agoNet.toLocaleString()} L</div></div>
              <div><label style={lbl}>Expected Stock</label><div style={autoVal}>{totals.agoExpectedStock.toLocaleString()} L</div></div>
              <div><label style={lbl}>Actual Dip (Closing)</label><input style={inp} type="number" value={report.stockRecon.agoActualDip || ''} onChange={e => setField('stockRecon', 'agoActualDip', e.target.value)} /></div>
              <div><label style={lbl}>Variance</label>
                <div style={{ ...autoVal, backgroundColor: totals.agoStockVariance === 0 ? colors.greenBg : colors.redLight, color: totals.agoStockVariance === 0 ? colors.green : colors.red, borderColor: totals.agoStockVariance === 0 ? `${colors.green}30` : `${colors.red}30` }}>
                  {totals.agoStockVariance.toLocaleString()} L ({totals.agoStockVarianceValue.toLocaleString()} TZS)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderPayments = () => (
    <section style={{ ...card, borderLeft: `4px solid ${colors.green}` }}>
      <h3 style={sectionTitle(colors.green)}>PAYMENT METHODS BREAKDOWN</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div><label style={lbl}>Cash Drops</label><input style={inp} type="number" value={report.payments.cash || ''} onChange={e => setField('payments', 'cash', e.target.value)} /></div>
        <div><label style={lbl}>T-Pesa</label><input style={inp} type="number" value={report.payments.tpesa || ''} onChange={e => setField('payments', 'tpesa', e.target.value)} /></div>
        <div><label style={lbl}>M-Pesa</label><input style={inp} type="number" value={report.payments.mpesa || ''} onChange={e => setField('payments', 'mpesa', e.target.value)} /></div>
        <div><label style={lbl}>Bank POS</label><input style={inp} type="number" value={report.payments.bank || ''} onChange={e => setField('payments', 'bank', e.target.value)} /></div>
        <div><label style={lbl}>Credit Sales Total (Auto)</label><div style={autoVal}>TZS {totals.totalCreditSales.toLocaleString()}</div></div>
        <div><label style={lbl}>Total Collections (Auto)</label><div style={{ ...autoVal, fontSize: '1rem', fontWeight: '800' }}>TZS {totals.totalPayments.toLocaleString()}</div></div>
      </div>

      {/* Bank Deposit */}
      <div style={{ marginTop: '24px', borderTop: `1px solid ${colors.divider}`, paddingTop: '20px' }}>
        <h4 style={{ color: colors.blue, fontSize: '0.85rem', fontWeight: '700', marginBottom: '12px' }}>BANK DEPOSIT</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div><label style={lbl}>Bank Name</label><input style={inp} value={report.bankDeposit.bankName} onChange={e => setField('bankDeposit', 'bankName', e.target.value)} /></div>
          <div><label style={lbl}>Deposit Slip No.</label><input style={inp} value={report.bankDeposit.depositSlipNo} onChange={e => setField('bankDeposit', 'depositSlipNo', e.target.value)} /></div>
          <div><label style={lbl}>Amount Deposited</label><input style={inp} type="number" value={report.bankDeposit.amountDeposited || ''} onChange={e => setField('bankDeposit', 'amountDeposited', e.target.value)} /></div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: colors.mutedText }}>Cash to Deposit (Auto): <span style={{ color: colors.green, fontWeight: '700' }}>TZS {totals.cashToDeposit.toLocaleString()}</span></div>
      </div>
    </section>
  );

  const renderOrders = () => (
    <section style={{ ...card, borderLeft: `4px solid ${colors.blue}` }}>
      <h3 style={sectionTitle(colors.blue)}>ORDERS (Pre-paid Company Orders)</h3>
      <p style={{ color: colors.mutedText, fontSize: '0.8rem', marginBottom: '16px' }}>Record pre-paid company fuel orders fulfilled today.</p>
      {report.orders.map((o, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr auto', gap: '10px', alignItems: 'end', marginBottom: '12px' }}>
          <div><label style={lbl}>Company</label><input style={inp} placeholder="Company Name" value={o.company} onChange={e => updateArrayItem('orders', i, 'company', e.target.value)} /></div>
          <div><label style={lbl}>Product</label>
            <select style={selectStyle} value={o.product} onChange={e => updateArrayItem('orders', i, 'product', e.target.value)}>
              <option value="PMS">PMS</option><option value="AGO">AGO</option>
            </select>
          </div>
          <div><label style={lbl}>Litres</label><input style={inp} type="number" value={o.litres || ''} onChange={e => updateArrayItem('orders', i, 'litres', e.target.value)} /></div>
          <div><label style={lbl}>Price/L</label><input style={inp} type="number" value={o.pricePerLitre || ''} onChange={e => updateArrayItem('orders', i, 'pricePerLitre', e.target.value)} /></div>
          <div><label style={lbl}>Total Value</label><input style={inp} type="number" value={o.totalValue || ''} onChange={e => updateArrayItem('orders', i, 'totalValue', e.target.value)} /></div>
          <div><label style={lbl}>Payment Ref</label><input style={inp} placeholder="Ref No." value={o.paymentRef} onChange={e => updateArrayItem('orders', i, 'paymentRef', e.target.value)} /></div>
          <button style={removeBtn} onClick={() => removeArrayItem('orders', i)}>x</button>
        </div>
      ))}
      <button style={addBtn} onClick={() => addArrayItem('orders', { company: '', product: 'PMS', litres: 0, pricePerLitre: 0, totalValue: 0, paymentRef: '' })}>+ Add Order</button>
      <div style={{ marginTop: '12px', textAlign: 'right', fontWeight: '700', color: colors.blue, fontSize: '0.9rem' }}>
        Total Orders: TZS {totals.totalOrders.toLocaleString()}
      </div>
    </section>
  );

  const renderCredits = () => (
    <section style={{ ...card, borderLeft: `4px solid ${colors.orange}` }}>
      <h3 style={sectionTitle(colors.orange)}>CREDIT SALES (Requires Manager Authorization)</h3>
      <p style={{ color: colors.mutedText, fontSize: '0.8rem', marginBottom: '16px' }}>Record all credit sales. Each requires manager sign-off.</p>
      {report.creditSales.map((c, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '12px' }}>
          <div><label style={lbl}>Customer</label><input style={inp} placeholder="Customer Name" value={c.customerName} onChange={e => updateArrayItem('creditSales', i, 'customerName', e.target.value)} /></div>
          <div><label style={lbl}>Product</label>
            <select style={selectStyle} value={c.product} onChange={e => updateArrayItem('creditSales', i, 'product', e.target.value)}>
              <option value="PMS">PMS</option><option value="AGO">AGO</option>
            </select>
          </div>
          <div><label style={lbl}>Litres</label><input style={inp} type="number" value={c.litres || ''} onChange={e => updateArrayItem('creditSales', i, 'litres', e.target.value)} /></div>
          <div><label style={lbl}>Total Value</label><input style={inp} type="number" value={c.totalValue || ''} onChange={e => updateArrayItem('creditSales', i, 'totalValue', e.target.value)} /></div>
          <div><label style={lbl}>Authorized By</label><input style={inp} placeholder="Manager Name" value={c.authBy} onChange={e => updateArrayItem('creditSales', i, 'authBy', e.target.value)} /></div>
          <div><label style={lbl}>Invoice No.</label><input style={inp} placeholder="INV-" value={c.invoiceNo} onChange={e => updateArrayItem('creditSales', i, 'invoiceNo', e.target.value)} /></div>
          <button style={removeBtn} onClick={() => removeArrayItem('creditSales', i)}>x</button>
        </div>
      ))}
      <button style={addBtn} onClick={() => addArrayItem('creditSales', { customerName: '', product: 'PMS', litres: 0, totalValue: 0, authBy: '', invoiceNo: '' })}>+ Add Credit Sale</button>
      <div style={{ marginTop: '12px', textAlign: 'right', fontWeight: '700', color: colors.orange, fontSize: '0.9rem' }}>
        Total Credit Sales: TZS {totals.totalCreditSales.toLocaleString()}
      </div>
    </section>
  );

  const renderDiscounts = () => (
    <section style={{ ...card, borderLeft: `4px solid ${colors.pink}` }}>
      <h3 style={sectionTitle(colors.pink)}>DISCOUNTS (Authorization Required if &gt;10,000 TZS)</h3>
      <p style={{ color: colors.mutedText, fontSize: '0.8rem', marginBottom: '16px' }}>All discounts above 10,000 TZS require manager authorization.</p>
      {report.discounts.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1.5fr auto', gap: '10px', alignItems: 'end', marginBottom: '12px' }}>
          <div><label style={lbl}>Customer</label><input style={inp} placeholder="Customer Name" value={d.customerName} onChange={e => updateArrayItem('discounts', i, 'customerName', e.target.value)} /></div>
          <div><label style={lbl}>Product</label>
            <select style={selectStyle} value={d.product} onChange={e => updateArrayItem('discounts', i, 'product', e.target.value)}>
              <option value="PMS">PMS</option><option value="AGO">AGO</option>
            </select>
          </div>
          <div><label style={lbl}>Litres</label><input style={inp} type="number" value={d.litres || ''} onChange={e => updateArrayItem('discounts', i, 'litres', e.target.value)} /></div>
          <div><label style={lbl}>Discount (TZS)</label><input style={inp} type="number" value={d.discountAmount || ''} onChange={e => updateArrayItem('discounts', i, 'discountAmount', e.target.value)} /></div>
          <div><label style={lbl}>Authorized By</label><input style={inp} placeholder="Manager Name" value={d.authBy} onChange={e => updateArrayItem('discounts', i, 'authBy', e.target.value)} /></div>
          <div><label style={lbl}>Reason</label><input style={inp} placeholder="Reason" value={d.reason} onChange={e => updateArrayItem('discounts', i, 'reason', e.target.value)} /></div>
          <button style={removeBtn} onClick={() => removeArrayItem('discounts', i)}>x</button>
        </div>
      ))}
      <button style={addBtn} onClick={() => addArrayItem('discounts', { customerName: '', product: 'PMS', litres: 0, discountAmount: 0, authBy: '', reason: '' })}>+ Add Discount</button>
      <div style={{ marginTop: '12px', textAlign: 'right', fontWeight: '700', color: colors.pink, fontSize: '0.9rem' }}>
        Total Discounts: TZS {totals.totalDiscounts.toLocaleString()}
      </div>
    </section>
  );

  const renderDeliveries = () => (
    <section style={{ ...card, borderLeft: `4px solid ${colors.teal}` }}>
      <h3 style={sectionTitle(colors.teal)}>DELIVERIES (Fuel Stock Received Today)</h3>
      <p style={{ color: colors.mutedText, fontSize: '0.8rem', marginBottom: '16px' }}>Record all fuel deliveries received at the station.</p>
      {report.deliveries.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr auto', gap: '10px', alignItems: 'end', marginBottom: '12px' }}>
          <div><label style={lbl}>Supplier</label><input style={inp} placeholder="Supplier Name" value={d.supplier} onChange={e => updateArrayItem('deliveries', i, 'supplier', e.target.value)} /></div>
          <div><label style={lbl}>Product</label>
            <select style={selectStyle} value={d.product} onChange={e => updateArrayItem('deliveries', i, 'product', e.target.value)}>
              <option value="PMS">PMS</option><option value="AGO">AGO</option>
            </select>
          </div>
          <div><label style={lbl}>Litres</label><input style={inp} type="number" value={d.litres || ''} onChange={e => updateArrayItem('deliveries', i, 'litres', e.target.value)} /></div>
          <div><label style={lbl}>Delivery Note No.</label><input style={inp} placeholder="DN-" value={d.deliveryNote} onChange={e => updateArrayItem('deliveries', i, 'deliveryNote', e.target.value)} /></div>
          <div><label style={lbl}>Received By</label><input style={inp} placeholder="Name" value={d.receivedBy} onChange={e => updateArrayItem('deliveries', i, 'receivedBy', e.target.value)} /></div>
          <button style={removeBtn} onClick={() => removeArrayItem('deliveries', i)}>x</button>
        </div>
      ))}
      <button style={addBtn} onClick={() => addArrayItem('deliveries', { supplier: '', product: 'PMS', litres: 0, deliveryNote: '', receivedBy: '' })}>+ Add Delivery</button>
      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: colors.mutedText }}>
        PMS Delivered: <span style={{ color: colors.green, fontWeight: '700' }}>{totals.totalDeliveryLtrs('PMS').toLocaleString()} L</span>
        {' | '}
        AGO Delivered: <span style={{ color: colors.yellow, fontWeight: '700' }}>{totals.totalDeliveryLtrs('AGO').toLocaleString()} L</span>
      </div>
    </section>
  );

  const renderExpenses = () => (
    <section style={{ ...card, borderLeft: `4px solid ${colors.red}` }}>
      <h3 style={sectionTitle(colors.red)}>OPERATING EXPENSES (Receipts Mandatory for All)</h3>
      <p style={{ color: colors.mutedText, fontSize: '0.8rem', marginBottom: '16px' }}>All expenses must have a valid receipt number.</p>
      {report.expenses.map((e, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '12px' }}>
          <div><label style={lbl}>Category</label>
            <select style={selectStyle} value={e.category} onChange={ev => updateArrayItem('expenses', i, 'category', ev.target.value)}>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Description</label><input style={inp} placeholder="Details" value={e.description} onChange={ev => updateArrayItem('expenses', i, 'description', ev.target.value)} /></div>
          <div><label style={lbl}>Amount (TZS)</label><input style={inp} type="number" value={e.amount || ''} onChange={ev => updateArrayItem('expenses', i, 'amount', ev.target.value)} /></div>
          <div><label style={lbl}>Receipt No.</label><input style={inp} placeholder="REC-" value={e.receiptNo} onChange={ev => updateArrayItem('expenses', i, 'receiptNo', ev.target.value)} /></div>
          <button style={removeBtn} onClick={() => removeArrayItem('expenses', i)}>x</button>
        </div>
      ))}
      <button style={addBtn} onClick={() => addArrayItem('expenses', { category: 'Other', description: '', amount: 0, receiptNo: '' })}>+ Add Expense</button>
      <div style={{ marginTop: '12px', textAlign: 'right', fontWeight: '700', color: colors.red, fontSize: '0.9rem' }}>
        Total Expenses: TZS {totals.totalExpenses.toLocaleString()}
      </div>
    </section>
  );

  const sectionMap = {
    meters: renderMeters,
    payments: renderPayments,
    orders: renderOrders,
    credits: renderCredits,
    discounts: renderDiscounts,
    deliveries: renderDeliveries,
    expenses: renderExpenses,
  };

  // --- NAV STEP INDICATOR ---
  const currentIdx = SECTIONS.findIndex(s => s.key === activeSection);

  return (
    <div style={{ maxWidth: '1400px', margin: 'auto', padding: '30px 40px', color: colors.bodyText, fontFamily: 'Inter, sans-serif', backgroundColor: colors.bg, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', margin: 0, color: colors.heading }}>DAILY <span style={{ color: colors.red }}>REPORT</span></h1>
          <p style={{ color: colors.mutedText, margin: '4px 0 0 0', fontSize: '0.85rem' }}>STATION: {report.station} | MANAGER: {report.manager}</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
          <div><label style={lbl}>Date</label><input style={{ ...inp, width: '150px' }} type="date" value={report.date} onChange={e => setReport({ ...report, date: e.target.value })} /></div>
          <div><label style={lbl}>PMS Price</label><input type="number" style={{ ...inp, width: '100px' }} value={report.pmsPrice} onChange={e => setReport({ ...report, pmsPrice: e.target.value })} /></div>
          <div><label style={lbl}>AGO Price</label><input type="number" style={{ ...inp, width: '100px' }} value={report.agoPrice} onChange={e => setReport({ ...report, agoPrice: e.target.value })} /></div>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: activeSection === s.key ? `2px solid ${colors.red}` : `1px solid ${colors.cardBorder}`,
              backgroundColor: activeSection === s.key ? colors.redLight : colors.cardBg,
              color: activeSection === s.key ? colors.red : colors.mutedText,
              cursor: 'pointer',
              fontWeight: activeSection === s.key ? '700' : '500',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ color: colors.mutedText, marginRight: '6px', fontSize: '0.7rem' }}>{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Content: Active Section + Summary Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px' }}>

        {/* Active Section */}
        <div>
          {sectionMap[activeSection]()}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              disabled={currentIdx === 0}
              onClick={() => setActiveSection(SECTIONS[currentIdx - 1].key)}
              style={{ padding: '12px 24px', borderRadius: '10px', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.cardBg, color: currentIdx === 0 ? colors.cardBorder : colors.heading, cursor: currentIdx === 0 ? 'default' : 'pointer', fontWeight: '600' }}
            >
              Previous
            </button>
            <button
              disabled={currentIdx === SECTIONS.length - 1}
              onClick={() => setActiveSection(SECTIONS[currentIdx + 1].key)}
              style={{ padding: '12px 24px', borderRadius: '10px', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.cardBg, color: currentIdx === SECTIONS.length - 1 ? colors.cardBorder : colors.heading, cursor: currentIdx === SECTIONS.length - 1 ? 'default' : 'pointer', fontWeight: '600' }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Persistent Summary Sidebar */}
        <div>
          <div style={{ ...card, backgroundColor: '#0f172a', position: 'sticky', top: '20px', color: '#ffffff' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '900', color: '#ffffff' }}>DAILY SUMMARY</h3>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>PMS Sales:</span><span style={{ color: '#e2e8f0' }}>{totals.pmsNet.toLocaleString()} L</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>AGO Sales:</span><span style={{ color: '#e2e8f0' }}>{totals.agoNet.toLocaleString()} L</span></div>
              <hr style={{ border: '0.5px solid #334155', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>PMS Value:</span><span style={{ color: '#e2e8f0' }}>TZS {totals.pmsValue.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>AGO Value:</span><span style={{ color: '#e2e8f0' }}>TZS {totals.agoValue.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}><span style={{ color: '#ffffff' }}>Total Sales:</span><span style={{ color: '#ffffff' }}>TZS {totals.totalSalesValue.toLocaleString()}</span></div>
              <hr style={{ border: '0.5px solid #334155', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#fca5a5' }}>Expenses:</span><span style={{ color: '#fca5a5' }}>- TZS {totals.totalExpenses.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#fdba74' }}>Credit Sales:</span><span style={{ color: '#fdba74' }}>TZS {totals.totalCreditSales.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#f0abfc' }}>Discounts:</span><span style={{ color: '#f0abfc' }}>TZS {totals.totalDiscounts.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#93c5fd' }}>Orders:</span><span style={{ color: '#93c5fd' }}>TZS {totals.totalOrders.toLocaleString()}</span></div>
              <hr style={{ border: '0.5px solid #334155', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1rem' }}>
                <span style={{ color: '#4ade80' }}>Collections:</span><span style={{ color: '#4ade80' }}>TZS {totals.totalPayments.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8' }}>Cash to Deposit:</span><span style={{ color: '#e2e8f0' }}>TZS {totals.cashToDeposit.toLocaleString()}</span>
              </div>

              {/* Variance */}
              <div style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: totals.variance === 0 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                textAlign: 'center',
                fontWeight: '800',
                fontSize: '1rem',
                color: totals.variance === 0 ? '#4ade80' : '#fca5a5'
              }}>
                VARIANCE: TZS {totals.variance.toLocaleString()}
                <div style={{ fontSize: '0.7rem', fontWeight: '500', marginTop: '4px' }}>
                  {totals.variance === 0 ? 'BALANCED' : totals.variance > 0 ? 'EXCESS' : 'SHORT'}
                </div>
              </div>

              {/* Stock Variance */}
              <div style={{ marginTop: '8px', padding: '10px', borderRadius: '8px', backgroundColor: '#1e293b', fontSize: '0.75rem' }}>
                <div style={{ fontWeight: '700', marginBottom: '6px', color: '#c4b5fd' }}>STOCK VARIANCE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>PMS:</span>
                  <span style={{ color: totals.pmsStockVariance === 0 ? '#4ade80' : '#fca5a5' }}>{totals.pmsStockVariance.toLocaleString()} L</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>AGO:</span>
                  <span style={{ color: totals.agoStockVariance === 0 ? '#4ade80' : '#fca5a5' }}>{totals.agoStockVariance.toLocaleString()} L</span>
                </div>
              </div>
            </div>
          </div>

          <button style={{
            width: '100%', padding: '18px', marginTop: '16px',
            backgroundColor: colors.red, color: '#ffffff', border: 'none',
            borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem',
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)'
          }}>
            SUBMIT & LOCK REPORT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
