import React, { useState } from "react";

const DailyStationReport = () => {
  const [report, setReport] = useState({
    station: "",
    date: "",
    manager: "",
    supervisor: "",
    pmsPrice: "",
    agoPrice: "",
    pumps: [
      { pump: "Pump 1", opening: "", closing: "" },
      { pump: "Pump 2", opening: "", closing: "" },
    ],
    expenses: [{ reason: "", amount: "" }],
    deposit: "",
    remarks: ""
  });

  const updatePump = (index, field, value) => {
    const updated = [...report.pumps];
    updated[index][field] = value;
    setReport({ ...report, pumps: updated });
  };

  const updateExpense = (index, field, value) => {
    const updated = [...report.expenses];
    updated[index][field] = value;
    setReport({ ...report, expenses: updated });
  };

  const addExpense = () => {
    setReport({ ...report, expenses: [...report.expenses, { reason: "", amount: "" }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMITTED REPORT:", report);
    alert("Daily report saved (check console)");
  };

  return (
    <div style={{ padding: 40, maxWidth: 1100, margin: "auto" }}>
      <h2>DAILY STATION REPORT</h2>

      <form onSubmit={handleSubmit}>

        <h3>Station Information</h3>
        <input placeholder="Station Name"
          value={report.station}
          onChange={e => setReport({ ...report, station: e.target.value })}
        />
        <input type="date"
          value={report.date}
          onChange={e => setReport({ ...report, date: e.target.value })}
        />
        <input placeholder="Manager"
          value={report.manager}
          onChange={e => setReport({ ...report, manager: e.target.value })}
        />
        <input placeholder="Supervisor"
          value={report.supervisor}
          onChange={e => setReport({ ...report, supervisor: e.target.value })}
        />

        <h3>Fuel Prices</h3>
        <input placeholder="PMS Price"
          value={report.pmsPrice}
          onChange={e => setReport({ ...report, pmsPrice: e.target.value })}
        />
        <input placeholder="AGO Price"
          value={report.agoPrice}
          onChange={e => setReport({ ...report, agoPrice: e.target.value })}
        />

        <h3>Pump Readings</h3>
        {report.pumps.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <strong>{p.pump}</strong>
            <input placeholder="Opening"
              value={p.opening}
              onChange={e => updatePump(i, "opening", e.target.value)}
            />
            <input placeholder="Closing"
              value={p.closing}
              onChange={e => updatePump(i, "closing", e.target.value)}
            />
          </div>
        ))}

        <h3>Expenses</h3>
        {report.expenses.map((ex, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <input placeholder="Reason"
              value={ex.reason}
              onChange={e => updateExpense(i, "reason", e.target.value)}
            />
            <input placeholder="Amount"
              value={ex.amount}
              onChange={e => updateExpense(i, "amount", e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addExpense}>+ Add Expense</button>

        <h3>Deposit</h3>
        <input placeholder="Deposited Amount"
          value={report.deposit}
          onChange={e => setReport({ ...report, deposit: e.target.value })}
        />

        <h3>Remarks</h3>
        <textarea placeholder="Remarks"
          value={report.remarks}
          onChange={e => setReport({ ...report, remarks: e.target.value })}
        />

        <br /><br />
        <button type="submit">SAVE DAILY REPORT</button>

      </form>
    </div>
  );
};

export default DailyStationReport;
