import React, { useMemo } from 'react';
import * as XLSX from 'xlsx';
import Header from './Header';
import './Dashboard.css';

const getWeekKey = (date = new Date()) => {
  const d = new Date(date);
  const startOfWeek = new Date(d);
  startOfWeek.setDate(d.getDate() - d.getDay() + 1); // Monday start
  return startOfWeek.toISOString().split('T')[0];
};

const Reports = ({ onBack, onLogout }) => {
  const allTimesheets = useMemo(() => {
    const raw = localStorage.getItem('rookiesTimeTimesheets');
    return raw ? JSON.parse(raw) : {};
  }, []);

  const weekKey = getWeekKey();

  const weeklyRows = useMemo(() => {
    const rows = [];
    Object.values(allTimesheets).forEach((entry) => {
      if (entry.weekKey !== weekKey) return;
      const { username, name, role, data } = entry;

      let totalHours = 0;
      Object.values(data || {}).forEach((day) => {
        if (day?.total) totalHours += parseFloat(String(day.total).replace('h', '')) || 0;
      });

      // Try to get hourly rate from stored staff
      const staffRaw = localStorage.getItem('rookiesTimeStaff');
      const staff = staffRaw ? JSON.parse(staffRaw) : [];
      const user = staff.find((u) => u.username === username);
      const rate = user?.hourlyRate ? parseFloat(user.hourlyRate) : 0;
      const cost = +(totalHours * rate).toFixed(2);

      rows.push({ username, name, role, totalHours: +totalHours.toFixed(2), rate: +(+rate).toFixed(2), cost });
    });

    rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [allTimesheets, weekKey]);

  const grandTotals = useMemo(() => {
    return weeklyRows.reduce(
      (acc, r) => ({ hours: acc.hours + r.totalHours, cost: acc.cost + r.cost }),
      { hours: 0, cost: 0 }
    );
  }, [weeklyRows]);

  const exportWeekToExcel = () => {
    const header = ['Name', 'Username', 'Role', 'Week', 'Total Hours', 'Hourly Rate (£)', 'Cost (£)'];
    const rows = [header];

    weeklyRows.forEach((r) => {
      rows.push([r.name, r.username, r.role, weekKey, r.totalHours, r.rate, r.cost]);
    });

    rows.push([]);
    rows.push(['Grand Total', '', '', weekKey, +grandTotals.hours.toFixed(2), '', +grandTotals.cost.toFixed(2)]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wch: 22 },
      { wch: 16 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 16 },
      { wch: 14 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Summary');
    XLSX.writeFile(wb, `weekly_summary_${weekKey}.xlsx`);
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Reports"
        subtitle={`Weekly summary (${weekKey})`}
        currentUser={null}
        onLogout={onLogout}
        onBack={onBack}
        showBackButton={true}
        showUserInfo={false}
        showLogo={false}
        additionalActions={
          <button className="export-btn" onClick={exportWeekToExcel}>
            Export Week to Excel
          </button>
        }
      />

      <div className="dashboard-content">
        <div className="timesheet-container">
          <div className="timesheet-grid">
            <div className="timesheet-table">
              <div className="table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                <div className="header-cell">Name</div>
                <div className="header-cell">Username</div>
                <div className="header-cell">Role</div>
                <div className="header-cell">Week</div>
                <div className="header-cell">Total Hours</div>
                <div className="header-cell">Cost (£)</div>
              </div>
              {weeklyRows.map((r) => (
                <div key={r.username} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                  <div className="day-cell">{r.name}</div>
                  <div className="time-cell">{r.username}</div>
                  <div className="time-cell">{r.role}</div>
                  <div className="time-cell">{weekKey}</div>
                  <div className="time-cell">{r.totalHours.toFixed(2)}h</div>
                  <div className="total-cell">£{r.cost.toFixed(2)}</div>
                </div>
              ))}
              <div className="table-row total-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                <div className="day-cell">Grand Total</div>
                <div className="time-cell"></div>
                <div className="time-cell"></div>
                <div className="time-cell">{weekKey}</div>
                <div className="time-cell">{grandTotals.hours.toFixed(2)}h</div>
                <div className="total-cell">£{grandTotals.cost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
