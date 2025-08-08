// Staff data utilities and constants
export const DEFAULT_STAFF_DATA = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@rookies.com',
    username: 'johnsmith',
    password: 'Rookies123!',
    role: 'admin',
    hourlyRate: '18.50',
    isActive: true,
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@rookies.com',
    username: 'sarahj',
    password: 'password123',
    role: 'admin',
    hourlyRate: '16.75',
    isActive: true,
    createdAt: '2024-01-20T14:30:00.000Z'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@rookies.com',
    username: 'mikew',
    password: 'password123',
    role: 'standard',
    hourlyRate: '14.25',
    isActive: true,
    createdAt: '2024-02-01T09:15:00.000Z'
  },
  {
    id: '4',
    name: 'Lisa Davis',
    email: 'lisa.davis@rookies.com',
    username: 'lisad',
    password: 'password123',
    role: 'admin',
    hourlyRate: '15.50',
    isActive: true,
    createdAt: '2024-02-15T11:30:00.000Z'
  },
  {
    id: '5',
    name: 'Jon Muir',
    email: 'jon.muir@rookies.com',
    username: 'jonmuir',
    password: 'password123',
    role: 'admin',
    hourlyRate: '20.00',
    isActive: true,
    createdAt: '2024-08-08T19:40:00.000Z'
  }
];

// LocalStorage keys
export const STORAGE_KEYS = {
  STAFF_DATA: 'rookiesTimeStaff',
  CURRENT_USER: 'currentUser',
  TIMESHEETS: 'rookiesTimeTimesheets'
};

// Staff data operations
export const staffDataUtils = {
  // Get staff data from localStorage
  getStaffData: () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.STAFF_DATA);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error reading staff data:', error);
      return null;
    }
  },

  // Save staff data to localStorage
  saveStaffData: (staffData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF_DATA, JSON.stringify(staffData));
      return true;
    } catch (error) {
      console.error('Error saving staff data:', error);
      return false;
    }
  },

  // Initialize staff data if it doesn't exist
  initializeStaffData: () => {
    const existingData = staffDataUtils.getStaffData();
    if (!existingData) {
      staffDataUtils.saveStaffData(DEFAULT_STAFF_DATA);
      return DEFAULT_STAFF_DATA;
    }
    return existingData;
  },

  // Get active staff members
  getActiveStaff: () => {
    const staffData = staffDataUtils.getStaffData();
    return staffData ? staffData.filter(member => member.isActive) : [];
  },

  // Find staff member by username
  findStaffByUsername: (username) => {
    const staffData = staffDataUtils.getStaffData();
    return staffData ? staffData.find(member => member.username === username) : null;
  },

  // Validate staff member data
  validateStaffMember: (member) => {
    const required = ['name', 'email', 'username', 'password', 'role', 'hourlyRate'];
    const missing = required.filter(field => !member[field]);
    
    if (missing.length > 0) {
      return { valid: false, errors: missing };
    }
    
    if (member.hourlyRate && parseFloat(member.hourlyRate) < 0) {
      return { valid: false, errors: ['hourlyRate must be positive'] };
    }
    
    return { valid: true, errors: [] };
  }
};

// User authentication utilities
export const authUtils = {
  // Get current logged in user
  getCurrentUser: () => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error reading current user:', error);
      return null;
    }
  },

  // Save current user
  saveCurrentUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving current user:', error);
      return false;
    }
  },

  // Clear current user (logout)
  clearCurrentUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (error) {
      console.error('Error clearing current user:', error);
      return false;
    }
  },

  // Validate login credentials
  validateLogin: (username, password) => {
    const user = staffDataUtils.findStaffByUsername(username);
    
    if (!user) {
      return { valid: false, error: 'Username not found' };
    }
    
    if (!user.isActive) {
      return { valid: false, error: 'Account is inactive' };
    }
    
    if (user.password !== password) {
      return { valid: false, error: 'Invalid password' };
    }
    
    return { valid: true, user };
  }
};
