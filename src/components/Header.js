import React, { useState, useEffect } from 'react';
import './Header.css';
import Logo from './Logo';

const Header = ({ 
  title, 
  subtitle, 
  currentUser, 
  onLogout, 
  onBack, 
  showBackButton = false,
  showLogoutButton = true,
  showUserInfo = true,
  showLogo = true,
  additionalActions = null
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'standard': return 'Standard User';
      case 'approver': return 'Approver';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <header className="modern-header">
      <div className="header-background">
        <div className="header-gradient"></div>
        <div className="header-pattern"></div>
      </div>
      
      <div className="header-content">
        <div className="header-left">
          {showBackButton && (
            <button onClick={onBack} className="back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          )}
          
          {showLogo && (
            <div className="header-logo">
              <Logo />
            </div>
          )}
          
          <div className="header-titles">
            {title && <h1 className="header-title">{title}</h1>}
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="header-right">
          {showUserInfo && currentUser && (
            <div className="user-info-section">
              <div className="user-avatar">
                <span>{currentUser?.name?.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-role">{getRoleDisplayName(currentUser.role)}</span>
                <span className="current-time">{formatTime(currentTime)}</span>
              </div>
            </div>
          )}

          {additionalActions && (
            <div className="additional-actions">
              {additionalActions}
            </div>
          )}

          {showLogoutButton && (
            <button onClick={onLogout} className="logout-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
