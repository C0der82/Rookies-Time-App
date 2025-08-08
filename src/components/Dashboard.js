import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Logo from './Logo';
import Header from './Header';

const Dashboard = ({ currentUser, onLogout, onShowStaffManager }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timesheet, setTimesheet] = useState({
    monday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' },
    tuesday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' },
    wednesday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' },
    thursday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' },
    friday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' },
    saturday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' },
    sunday: { start: '', end: '', lunchOut: '', lunchIn: '', total: '', notes: '' }
  });
  const [weekTotal, setWeekTotal] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load saved timesheet data on component mount
  useEffect(() => {
    loadTimesheetData();
  }, [currentUser]);

  // Listen for staff data updates to refresh user info
  useEffect(() => {
    const handleStaffDataUpdated = (event) => {
      console.log('Staff data updated event received in Dashboard:', event.detail);
      
      // Refresh current user data if needed
      if (currentUser) {
        const savedStaff = JSON.parse(localStorage.getItem('rookiesTimeStaff') || '[]');
        const updatedUser = savedStaff.find(member => member.id === currentUser.id);
        if (updatedUser) {
          // Update current user with latest data
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          console.log('Current user data updated in Dashboard');
        }
      }
    };

    window.addEventListener('staffDataUpdated', handleStaffDataUpdated);
    return () => window.removeEventListener('staffDataUpdated', handleStaffDataUpdated);
  }, [currentUser]);

  const loadTimesheetData = () => {
    if (currentUser) {
      const savedData = localStorage.getItem(`timesheet_${currentUser.username}_${getCurrentWeekKey()}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setTimesheet(parsedData);
          console.log('Loaded saved timesheet data for', currentUser.username);
        } catch (error) {
          console.error('Error loading timesheet data:', error);
        }
      }
    }
  };

  const getCurrentWeekKey = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    return startOfWeek.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isAdmin = currentUser?.role === 'admin';
  const isApprover = currentUser?.role === 'approver';

  const handleTimeChange = (day, field, value) => {
    setTimesheet(prev => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day],
          [field]: value
        }
      };

      // Calculate total for the day if start and end are provided
      const dayData = updated[day];
      if (dayData.start && dayData.end) {
        const startTime = new Date(`2000-01-01T${dayData.start}`);
        const endTime = new Date(`2000-01-01T${dayData.end}`);
        let totalHours = (endTime - startTime) / (1000 * 60 * 60);
        
        // Subtract lunch break if both lunch out and lunch in are provided
        if (dayData.lunchOut && dayData.lunchIn) {
          const lunchOutTime = new Date(`2000-01-01T${dayData.lunchOut}`);
          const lunchInTime = new Date(`2000-01-01T${dayData.lunchIn}`);
          const lunchBreakHours = (lunchInTime - lunchOutTime) / (1000 * 60 * 60);
          totalHours -= lunchBreakHours;
        }
        
        dayData.total = totalHours > 0 ? totalHours.toFixed(2) + 'h' : '';
      }

      return updated;
    });
  };

  const calculateWeekTotal = () => {
    let total = 0;
    Object.values(timesheet).forEach(day => {
      if (day.total && day.total !== '') {
        total += parseFloat(day.total.replace('h', ''));
      }
    });
    setWeekTotal(total);
  };

  useEffect(() => {
    calculateWeekTotal();
  }, [timesheet]);

  const getCurrentWeekDates = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getCurrentWeekDates();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleSave = () => {
    if (currentUser) {
      const weekKey = getCurrentWeekKey();
      const saveKey = `timesheet_${currentUser.username}_${weekKey}`;
      
      // Save to localStorage
      localStorage.setItem(saveKey, JSON.stringify(timesheet));
      
      // Also save to a general timesheet database
      const allTimesheets = JSON.parse(localStorage.getItem('rookiesTimeTimesheets') || '{}');
      allTimesheets[saveKey] = {
        username: currentUser.username,
        name: currentUser.name,
        role: currentUser.role,
        weekKey: weekKey,
        data: timesheet,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('rookiesTimeTimesheets', JSON.stringify(allTimesheets));
      
      setSaveStatus('✅ Timesheet saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      
      console.log('Timesheet saved for', currentUser.username, 'week of', weekKey);
    }
  };

  const handleSubmit = () => {
    handleSave();
    alert('Timesheet submitted successfully!');
  };

  const handleExport = () => {
    if (isAdmin || isApprover) {
      const allTimesheets = JSON.parse(localStorage.getItem('rookiesTimeTimesheets') || '{}');
      const exportData = {
        exportDate: new Date().toISOString(),
        exportedBy: currentUser.username,
        timesheets: allTimesheets
      };
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rookies_time_timesheets_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      alert('Timesheet data exported successfully!');
    } else {
      alert('Only Admins and Approvers can export timesheet data.');
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Dashboard"
        subtitle="Time tracking for Rookie Rockstars"
        currentUser={currentUser}
        onLogout={onLogout}
        showLogo={false}
        additionalActions={
          isAdmin && (
            <button onClick={onShowStaffManager} className="staff-manager-btn">
              Manage Staff
            </button>
          )
        }
      />

      <div className="dashboard-content">
        <Logo />
        
        <div className="timesheet-container">
          <div className="timesheet-header">
            <div className="user-avatar">
              <span>{currentUser?.name?.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="user-details">
              <h2>{currentUser?.name}</h2>
              <p>Timesheet for week of {weekDates[0].toLocaleDateString()}</p>
            </div>
            <div className="header-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="approve-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>

          {saveStatus && (
            <div className="save-status">
              {saveStatus}
            </div>
          )}

          <div className="timesheet-grid">
            <div className="timesheet-table">
              <div className="table-header">
                <div className="header-cell">Day</div>
                <div className="header-cell">Start</div>
                <div className="header-cell">Lunch Out</div>
                <div className="header-cell">Lunch In</div>
                <div className="header-cell">End</div>
                <div className="header-cell">Total</div>
                <div className="header-cell">Notes</div>
              </div>
              
              {days.map((day, index) => (
                <div key={day} className="table-row">
                  <div className="day-cell">
                    {day.charAt(0).toUpperCase() + day.slice(1)} {weekDates[index].toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </div>
                  <div className="time-cell">
                    <input
                      type="time"
                      value={timesheet[day].start}
                      onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                      placeholder="9:00"
                    />
                  </div>
                  <div className="time-cell">
                    <input
                      type="time"
                      value={timesheet[day].lunchOut}
                      onChange={(e) => handleTimeChange(day, 'lunchOut', e.target.value)}
                      placeholder="12:00"
                    />
                  </div>
                  <div className="time-cell">
                    <input
                      type="time"
                      value={timesheet[day].lunchIn}
                      onChange={(e) => handleTimeChange(day, 'lunchIn', e.target.value)}
                      placeholder="13:00"
                    />
                  </div>
                  <div className="time-cell">
                    <input
                      type="time"
                      value={timesheet[day].end}
                      onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      placeholder="17:00"
                    />
                  </div>
                  <div className="total-cell">
                    {timesheet[day].total || '-'}
                  </div>
                  <div className="notes-cell">
                    <input
                      type="text"
                      value={timesheet[day].notes}
                      onChange={(e) => handleTimeChange(day, 'notes', e.target.value)}
                      placeholder="Notes..."
                    />
                  </div>
                </div>
              ))}
              
              <div className="table-row total-row">
                <div className="day-cell">Total</div>
                <div className="time-cell"></div>
                <div className="time-cell"></div>
                <div className="time-cell"></div>
                <div className="time-cell"></div>
                <div className="total-cell">{weekTotal.toFixed(2)}h</div>
                <div className="notes-cell"></div>
              </div>
            </div>
          </div>

          <div className="timesheet-actions">
            {(isAdmin || isApprover) && (
              <button className="export-btn" onClick={handleExport}>
                Export All Timesheets ▼
              </button>
            )}
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Rookies Time. Built for Rookie Rockstars by Jonathan Muir.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
