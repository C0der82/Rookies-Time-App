import React, { useState, useEffect } from 'react';
import './Login.css';
import Logo from './Logo';
import { DEFAULT_STAFF_DATA, staffDataUtils } from '../utils/staffData';

const Login = ({ onLogin, refreshTrigger }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetData, setResetData] = useState({ username: '', email: '', newPassword: '', confirm: '' });
  const [resetStatus, setResetStatus] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  // Use centralized default staff data
  const [defaultStaff, setDefaultStaff] = useState(DEFAULT_STAFF_DATA);

  // Function to add new user to Login.js default staff
  const addUserToLoginDefaults = (newUser) => {
    setDefaultStaff(prev => [...prev, newUser]);
    console.log('New user added to Login.js defaults:', newUser.username);
  };

  // Load available users for debugging - this will refresh every time the component mounts
  const loadAvailableUsers = () => {
    console.log('=== LOADING AVAILABLE USERS ===');
    const savedStaff = staffDataUtils.getStaffData();
    console.log('Saved staff data:', savedStaff);
    
    if (savedStaff && savedStaff.length > 0) {
      const activeUsers = savedStaff.filter(member => member.isActive);
      console.log('Active users found:', activeUsers.length);
      setAvailableUsers(activeUsers);
      
      // Only reset to default if we have no active users at all
      if (activeUsers.length === 0) {
        console.log('No active users found, resetting to default data');
        staffDataUtils.saveStaffData(defaultStaff);
        setAvailableUsers(defaultStaff);
        // Don't show error message - just silently reset
      }
    } else {
      // If no staff data exists, create default data
      console.log('No staff data found, creating default data');
      staffDataUtils.saveStaffData(defaultStaff);
      setAvailableUsers(defaultStaff);
    }
  };

  useEffect(() => {
    loadAvailableUsers();
  }, []);

  // Real-time refresh: Check for new users every 5 seconds (less aggressive)
  useEffect(() => {
    const interval = setInterval(() => {
      const savedStaff = staffDataUtils.getStaffData();
      if (savedStaff) {
        const activeUsers = savedStaff.filter(member => member.isActive);
        
        // Only update if the number of users has changed AND we have users
        if (activeUsers.length !== availableUsers.length && activeUsers.length > 0) {
          console.log('New users detected, updating login list');
          setAvailableUsers(activeUsers);
        }
      }
    }, 5000); // Check every 5 seconds instead of 2

    return () => clearInterval(interval);
  }, [availableUsers.length]);

  // Listen for staff data updates
  useEffect(() => {
    const handleStaffDataUpdated = (event) => {
      console.log('Staff data updated event received:', event.detail);
      
      // Refresh the available users list immediately
      loadAvailableUsers();
      setError('');
      setCredentials({ username: '', password: '' });
    };

    window.addEventListener('staffDataUpdated', handleStaffDataUpdated);
    return () => window.removeEventListener('staffDataUpdated', handleStaffDataUpdated);
  }, []);

  // Refresh user list when returning from staff manager
  useEffect(() => {
    if (refreshTrigger) {
      loadAvailableUsers();
      setError('');
      setCredentials({ username: '', password: '' });
    }
  }, [refreshTrigger]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    // Always get the latest staff data from localStorage
    const savedStaff = staffDataUtils.getStaffData();
    if (savedStaff) {
      const user = savedStaff.find(member => 
        member.username === credentials.username && 
        member.password === credentials.password &&
        member.isActive
      );

      if (user) {
        // Enforce mustChangePassword flow
        if (user.mustChangePassword) {
          setError('You must change your temporary password. Please login with the temporary password and change it from Dashboard.');
          // Continue login to allow change in dashboard
        }
        // Store logged in user info
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        // Provide more detailed error message
        const userExists = savedStaff.find(member => member.username === credentials.username);
        if (userExists) {
          if (!userExists.isActive) {
            setError('Account is inactive. Contact administrator.');
          } else {
            setError('Invalid password for this username.');
          }
        } else {
          setError('Username not found. Available users: ' + 
            availableUsers.map(u => u.username).join(', '));
        }
      }
    } else {
      // If no staff data, create default and try again
      staffDataUtils.saveStaffData(defaultStaff);
      // Don't show error message - just silently create default data
    }
  };

  const handleRefreshUsers = () => {
    loadAvailableUsers();
    setError('');
    setCredentials({ username: '', password: '' });
  };

  const handleResetData = () => {
    // Clear all localStorage data
    localStorage.clear();
    // Set fresh default data
    localStorage.setItem('rookiesTimeStaff', JSON.stringify(defaultStaff));
    loadAvailableUsers();
    setError('Staff data has been reset to default. Try: johnsmith / Rookies123!');
    setCredentials({ username: '', password: '' });
  };

  const handleClearAllData = () => {
    // Clear all localStorage data completely
    localStorage.clear();
    console.log('All localStorage data cleared');
    setError('');
    setCredentials({ username: '', password: '' });
    
    // Reset to default staff data
    staffDataUtils.saveStaffData(defaultStaff);
    setAvailableUsers(defaultStaff);
    
    setError('✅ All data cleared! Default users restored. Try: johnsmith / Rookies123!');
    setTimeout(() => setError(''), 5000);
  };



  return (
    <div className="login-container">
      <div className="login-card">
        <Logo />
        
        <div className="login-header">
          <h1>Rookies Time</h1>
          <p>Staff Login</p>
        </div>

        {(
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        )}


      </div>
    </div>
  );
};

export default Login;
