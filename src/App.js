import React from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StaffManager from './components/StaffManager';
import { useAppState } from './hooks/useAppState';

function App() {
  const {
    currentTime,
    isLoggedIn,
    currentUser,
    refreshTrigger,
    renderCurrentView
  } = useAppState();

  // Render the appropriate component based on current state
  // Login page is the default home page
  const { type, props } = renderCurrentView();

  switch (type) {
    case 'login':
      return <Login {...props} />;
    
    case 'staff-manager':
      return <StaffManager {...props} />;
    
    case 'dashboard':
      return <Dashboard {...props} />;
    
    default:
      // Always default to login page if no specific view is set
      return <Login refreshTrigger={refreshTrigger} />;
  }
}

export default App;
