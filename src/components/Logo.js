import React from 'react';
import './Logo.css';
import logoImage from '../assets/rookie-rockstars-logo.png';

const Logo = () => {
  return (
    <div className="logo">
      <img 
        src={logoImage} 
        alt="ROOKIE ROCKSTARS Logo" 
        className="logo-image"
      />
    </div>
  );
};

export default Logo;
