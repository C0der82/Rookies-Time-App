import { APP_CONFIG } from '../config/appConfig';

// App constants and configuration

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  APPROVER: 'approver',
  STANDARD: 'standard'
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.APPROVER]: 'Approver',
  [USER_ROLES.STANDARD]: 'Standard User'
};

// App views
export const APP_VIEWS = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  STAFF_MANAGER: 'staff-manager'
};

// Time intervals from config
export const TIME_INTERVALS = {
  CLOCK_UPDATE: APP_CONFIG.TIME.CLOCK_UPDATE_INTERVAL,
  USER_REFRESH: APP_CONFIG.TIME.USER_REFRESH_INTERVAL,
  SUCCESS_MESSAGE: APP_CONFIG.TIME.SUCCESS_MESSAGE_DURATION,
  ERROR_MESSAGE: APP_CONFIG.TIME.ERROR_MESSAGE_DURATION
};

// Form validation from config
export const VALIDATION = {
  MIN_HOURLY_RATE: APP_CONFIG.VALIDATION.MIN_HOURLY_RATE,
  MAX_HOURLY_RATE: APP_CONFIG.VALIDATION.MAX_HOURLY_RATE,
  MIN_PASSWORD_LENGTH: APP_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH: APP_CONFIG.VALIDATION.MAX_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH: APP_CONFIG.VALIDATION.MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH: APP_CONFIG.VALIDATION.MAX_USERNAME_LENGTH
};

// Default values from config
export const DEFAULTS = {
  NEW_USER_ROLE: APP_CONFIG.DEFAULTS.NEW_USER_ROLE,
  NEW_USER_STATUS: APP_CONFIG.DEFAULTS.NEW_USER_STATUS,
  HOURLY_RATE: APP_CONFIG.DEFAULTS.HOURLY_RATE,
  WORKING_HOURS: APP_CONFIG.DEFAULTS.WORKING_HOURS
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill in all required fields',
  INVALID_PASSWORD: 'Invalid password for this username',
  USERNAME_NOT_FOUND: 'Username not found',
  ACCOUNT_INACTIVE: 'Account is inactive. Contact administrator.',
  INVALID_HOURLY_RATE: 'Please enter a valid hourly rate (must be a positive number)',
  USERNAME_EXISTS: 'Username already exists. Please choose a different username.',
  DATA_LOAD_ERROR: 'Error reading staff data. Please refresh the page.',
  DATA_SAVE_ERROR: 'Error saving data. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  STAFF_ADDED: 'Staff member added successfully!',
  STAFF_UPDATED: 'Staff member updated successfully!',
  STAFF_DELETED: 'Staff member deleted successfully!',
  TIMESHEET_SAVED: 'Timesheet saved successfully!',
  TIMESHEET_SUBMITTED: 'Timesheet submitted successfully!',
  DATA_EXPORTED: 'Timesheet data exported successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!'
};

// LocalStorage keys from config
export const STORAGE_KEYS = {
  STAFF_DATA: APP_CONFIG.STORAGE.STAFF_DATA,
  CURRENT_USER: APP_CONFIG.STORAGE.CURRENT_USER,
  TIMESHEETS: APP_CONFIG.STORAGE.TIMESHEETS
};

// Demo credentials
export const DEMO_CREDENTIALS = {
  USERNAME: 'johnsmith',
  PASSWORD: 'Rookies123!'
};

// Server configuration
export const SERVER_CONFIG = {
  URL: APP_CONFIG.SERVER.PROTOCOL + '://' + APP_CONFIG.SERVER.HOST + ':' + APP_CONFIG.SERVER.PORT,
  PORT: APP_CONFIG.SERVER.PORT,
  HOST: APP_CONFIG.SERVER.HOST,
  PROTOCOL: APP_CONFIG.SERVER.PROTOCOL
};

// Development settings
export const DEV_CONFIG = {
  DEBUG_MODE: APP_CONFIG.DEV.DEBUG_MODE,
  LOG_LEVEL: APP_CONFIG.DEV.LOG_LEVEL,
  AUTO_REFRESH: APP_CONFIG.DEV.AUTO_REFRESH
};
