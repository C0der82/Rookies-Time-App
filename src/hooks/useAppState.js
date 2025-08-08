import { useState, useEffect } from 'react';
import { staffDataUtils, authUtils } from '../utils/staffData';

// Custom hook for managing app state
export const useAppState = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // Changed default to 'login'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize app state
  useEffect(() => {
    // Initialize staff data
    staffDataUtils.initializeStaffData();
    
    // Always start with login page, don't auto-login
    setCurrentView('login');
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Authentication functions
  const login = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    authUtils.saveCurrentUser(user);
  };

  const logout = () => {
    authUtils.clearCurrentUser();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentView('login'); // Changed to go back to login page
    setRefreshTrigger(prev => prev + 1);
  };

  // Navigation functions
  const showStaffManager = () => {
    setCurrentView('staff-manager');
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
    setRefreshTrigger(prev => prev + 1);
  };

  // View rendering logic
  const renderCurrentView = () => {
    if (!isLoggedIn) {
      return { type: 'login', props: { onLogin: login, refreshTrigger } };
    }

    if (currentView === 'staff-manager') {
      return { type: 'staff-manager', props: { onBack: backToDashboard, onLogout: logout } };
    }

    return {
      type: 'dashboard',
      props: {
        currentUser,
        onLogout: logout,
        onShowStaffManager: showStaffManager
      }
    };
  };

  return {
    // State
    currentTime,
    isLoggedIn,
    currentUser,
    currentView,
    refreshTrigger,
    
    // Actions
    login,
    logout,
    showStaffManager,
    backToDashboard,
    renderCurrentView
  };
};
