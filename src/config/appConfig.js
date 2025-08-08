// App Configuration
export const APP_CONFIG = {
  // Server Configuration
  SERVER: {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost',
    PROTOCOL: process.env.HTTPS === 'true' ? 'https' : 'http'
  },

  // App Information
  APP: {
    NAME: 'Rookies Time',
    VERSION: '1.0.0',
    DESCRIPTION: 'Timesheet Management App for Rookie Rockstars',
    AUTHOR: 'Jonathan Muir'
  },

  // Development Settings
  DEV: {
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    AUTO_REFRESH: true
  },

  // LocalStorage Keys
  STORAGE: {
    STAFF_DATA: 'rookiesTimeStaff',
    CURRENT_USER: 'currentUser',
    TIMESHEETS: 'rookiesTimeTimesheets'
  },

  // API Configuration (for future use)
  API: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    TIMEOUT: process.env.REACT_APP_API_TIMEOUT || 5000,
    RETRY_ATTEMPTS: 3
  },

  // Time Settings
  TIME: {
    CLOCK_UPDATE_INTERVAL: 1000, // 1 second
    USER_REFRESH_INTERVAL: 5000, // 5 seconds
    SUCCESS_MESSAGE_DURATION: 5000, // 5 seconds
    ERROR_MESSAGE_DURATION: 3000 // 3 seconds
  },

  // Validation Rules
  VALIDATION: {
    MIN_HOURLY_RATE: 0,
    MAX_HOURLY_RATE: 1000,
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 50,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20
  },

  // Default Values
  DEFAULTS: {
    NEW_USER_ROLE: 'standard',
    NEW_USER_STATUS: true,
    HOURLY_RATE: '14.25',
    WORKING_HOURS: {
      START: '09:00',
      END: '17:00',
      LUNCH_START: '12:00',
      LUNCH_END: '13:00'
    }
  }
};

// Helper function to get full server URL
export const getServerUrl = () => {
  const { SERVER } = APP_CONFIG;
  return `${SERVER.PROTOCOL}://${SERVER.HOST}:${SERVER.PORT}`;
};

// Helper function to check if running in development
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Helper function to get localStorage key
export const getStorageKey = (key) => {
  return APP_CONFIG.STORAGE[key] || key;
};

export default APP_CONFIG;
