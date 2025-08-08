# Rookies Time - Timesheet Management App

A modern React application for timesheet management and staff administration, built for Rookie Rockstars.

## 🚀 Features

- **User Authentication** - Secure login with role-based access
- **Timesheet Management** - Weekly timesheet entry with automatic calculations
- **Staff Administration** - Add, edit, and manage staff members
- **Data Persistence** - Local storage for data retention
- **Export Functionality** - Export timesheet data for reporting

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Login.js        # Authentication component
│   ├── Dashboard.js    # Main timesheet interface
│   ├── StaffManager.js # Staff administration
│   ├── Logo.js         # App branding
│   └── *.css           # Component styles
├── utils/              # Utility functions
│   ├── staffData.js    # Staff data operations
│   └── timeUtils.js    # Time calculations & timesheet utils
├── hooks/              # Custom React hooks
│   └── useAppState.js  # App state management
├── constants/          # App constants
│   └── index.js        # Configuration & constants
├── assets/             # Static assets
└── App.js              # Main app component
```

## 🛠️ Architecture

### **Configuration (`/config`)**
- **`appConfig.js`** - Centralized app configuration, server settings, validation rules

### **Utility Functions (`/utils`)**
- **`staffData.js`** - Staff data management, authentication, localStorage operations
- **`timeUtils.js`** - Time formatting, calculations, timesheet operations

### **Custom Hooks (`/hooks`)**
- **`useAppState.js`** - Centralized app state management with authentication and navigation

### **Constants (`/constants`)**
- **`index.js`** - App configuration, validation rules, error messages

### **Components (`/components`)**
- **`Login.js`** - User authentication interface
- **`Dashboard.js`** - Main timesheet interface
- **`StaffManager.js`** - Staff administration panel
- **`Logo.js`** - App branding component

## 🔧 Key Functions

### **Staff Data Operations**
```javascript
import { staffDataUtils } from './utils/staffData';

// Get all staff members
const staff = staffDataUtils.getStaffData();

// Find user by username
const user = staffDataUtils.findStaffByUsername('johnsmith');

// Validate staff member
const validation = staffDataUtils.validateStaffMember(memberData);
```

### **Authentication**
```javascript
import { authUtils } from './utils/staffData';

// Validate login credentials
const result = authUtils.validateLogin(username, password);

// Get current user
const currentUser = authUtils.getCurrentUser();
```

### **Time & Timesheet Operations**
```javascript
import { timeUtils, timesheetUtils } from './utils/timeUtils';

// Format time
const formattedTime = timeUtils.formatTime(new Date());

// Calculate day total
const totalHours = timeUtils.calculateDayTotal(dayData);

// Save timesheet
timesheetUtils.saveTimesheetData(username, timesheetData);
```

### **App State Management**
```javascript
import { useAppState } from './hooks/useAppState';

const {
  currentUser,
  isLoggedIn,
  login,
  logout,
  showStaffManager
} = useAppState();
```

## 🎯 Usage

### **Configuration**
The app is configured to run on **localhost:3000** by default. You can customize the settings in `src/config/appConfig.js`:

```javascript
// Server Configuration
SERVER: {
  PORT: 3000,
  HOST: 'localhost',
  PROTOCOL: 'http'
}
```

### **Starting the App**
```bash
# Start on localhost:3000 (default)
npm start

# Start on localhost:3000 without opening browser
npm run start:dev

# Start on custom port
PORT=3001 npm start

# Start with HTTPS (for development)
HTTPS=true npm start
```

### **Demo Login**
- **Username**: `johnsmith`
- **Password**: `Rookies123!`

### **User Roles**
- **Admin**: Full access to all features including staff management
- **Approver**: Can view and export timesheet data
- **Standard**: Basic timesheet entry and viewing

## 📊 Data Structure

### **Staff Member**
```javascript
{
  id: '1',
  name: 'John Smith',
  email: 'john.smith@rookies.com',
  username: 'johnsmith',
  password: 'Rookies123!',
  role: 'admin',
  approver: '',
  hourlyRate: '18.50',
  isActive: true,
  createdAt: '2024-01-15T10:00:00.000Z'
}
```

### **Timesheet Day**
```javascript
{
  start: '09:00',
  end: '17:00',
  lunchOut: '12:00',
  lunchIn: '13:00',
  total: '7.00h',
  notes: 'Project work'
}
```

## 🔒 Security Features

- **Role-based Access Control** - Different permissions per user role
- **Input Validation** - Comprehensive form validation
- **Data Persistence** - Secure localStorage operations
- **Session Management** - Automatic login state restoration

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop and mobile
- **Real-time Updates** - Live clock and data refresh
- **Success/Error Feedback** - Clear user notifications
- **Intuitive Navigation** - Easy-to-use interface

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Database storage
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app version

## 👨‍💻 Development

### **Adding New Features**
1. Create utility functions in `/utils`
2. Add constants in `/constants`
3. Create custom hooks if needed in `/hooks`
4. Build components in `/components`
5. Update App.js if necessary

### **Code Style**
- Use functional components with hooks
- Separate business logic into utilities
- Use constants for configuration
- Implement proper error handling
- Add comprehensive comments

---

**Built for Rookie Rockstars by Jonathan Muir** 🎸
