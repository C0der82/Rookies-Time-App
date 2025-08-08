// Time and timesheet utilities
export const timeUtils = {
  // Format time for display
  formatTime: (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  },

  // Format date for display
  formatDate: (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  },

  // Get current week key for timesheet storage
  getCurrentWeekKey: () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    return startOfWeek.toISOString().split('T')[0];
  },

  // Get current week dates
  getCurrentWeekDates: () => {
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
  },

  // Calculate hours between two time strings
  calculateHours: (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  },

  // Calculate total hours for a day including lunch break
  calculateDayTotal: (dayData) => {
    if (!dayData.start || !dayData.end) return 0;
    
    let totalHours = timeUtils.calculateHours(dayData.start, dayData.end);
    
    // Subtract lunch break if both lunch out and lunch in are provided
    if (dayData.lunchOut && dayData.lunchIn) {
      const lunchBreak = timeUtils.calculateHours(dayData.lunchOut, dayData.lunchIn);
      totalHours -= lunchBreak;
    }
    
    return totalHours > 0 ? totalHours : 0;
  },

  // Calculate week total
  calculateWeekTotal: (timesheet) => {
    let total = 0;
    Object.values(timesheet).forEach(day => {
      if (day.total && day.total !== '') {
        total += parseFloat(day.total.replace('h', ''));
      }
    });
    return total;
  },

  // Get day names
  getDayNames: () => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],

  // Create empty timesheet for a week
  createEmptyTimesheet: () => {
    const days = timeUtils.getDayNames();
    const timesheet = {};
    
    days.forEach(day => {
      timesheet[day] = {
        start: '',
        end: '',
        lunchOut: '',
        lunchIn: '',
        total: '',
        notes: ''
      };
    });
    
    return timesheet;
  }
};

// Timesheet storage utilities
export const timesheetUtils = {
  // Get timesheet key for a user and week
  getTimesheetKey: (username, weekKey) => {
    return `timesheet_${username}_${weekKey}`;
  },

  // Load timesheet data for current user and week
  loadTimesheetData: (username) => {
    try {
      const weekKey = timeUtils.getCurrentWeekKey();
      const timesheetKey = timesheetUtils.getTimesheetKey(username, weekKey);
      const savedData = localStorage.getItem(timesheetKey);
      
      if (savedData) {
        return JSON.parse(savedData);
      }
      
      return timeUtils.createEmptyTimesheet();
    } catch (error) {
      console.error('Error loading timesheet data:', error);
      return timeUtils.createEmptyTimesheet();
    }
  },

  // Save timesheet data
  saveTimesheetData: (username, timesheetData) => {
    try {
      const weekKey = timeUtils.getCurrentWeekKey();
      const timesheetKey = timesheetUtils.getTimesheetKey(username, weekKey);
      
      // Save to user-specific timesheet
      localStorage.setItem(timesheetKey, JSON.stringify(timesheetData));
      
      // Also save to general timesheet database
      const allTimesheets = JSON.parse(localStorage.getItem('rookiesTimeTimesheets') || '{}');
      allTimesheets[timesheetKey] = {
        username,
        weekKey,
        data: timesheetData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('rookiesTimeTimesheets', JSON.stringify(allTimesheets));
      
      return true;
    } catch (error) {
      console.error('Error saving timesheet data:', error);
      return false;
    }
  },

  // Export all timesheets
  exportTimesheets: () => {
    try {
      const allTimesheets = JSON.parse(localStorage.getItem('rookiesTimeTimesheets') || '{}');
      const exportData = {
        exportDate: new Date().toISOString(),
        timesheets: allTimesheets
      };
      
      return exportData;
    } catch (error) {
      console.error('Error exporting timesheets:', error);
      return null;
    }
  }
};
