import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ onLoginClick, onSignupClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    if (location.pathname === '/about') return 'about';
    if (location.pathname === '/features') return 'features';
    if (location.pathname === '/track') return 'track';
    return 'home';
  };
  
  const activeTab = getActiveTab();
  
  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <div className="header-top">
        <div className="logo-section">
          <div className="emblem">🇮🇳</div>
          <div className="title-section">
            <h1>Digital Beneficiary Identification (DBI)</h1>
            <p className="subtitle">Secure, Transparent & Inclusive Welfare Delivery</p>
          </div>
        </div>
        <div className="auth-buttons">
          <motion.button 
            className="btn-login" 
            onClick={onLoginClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
          <motion.button 
            className="btn-signup" 
            onClick={onSignupClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>
      <nav className="nav-tabs">
        <button 
          className={activeTab === 'home' ? 'tab active' : 'tab'}
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button 
          className={activeTab === 'about' ? 'tab active' : 'tab'}
          onClick={() => navigate('/about')}
        >
          About
        </button>
        <button 
          className={activeTab === 'features' ? 'tab active' : 'tab'}
          onClick={() => navigate('/features')}
        >
          Features
        </button>
        <button 
          className={activeTab === 'track' ? 'tab active' : 'tab'}
          onClick={() => navigate('/track')}
        >
          Track Application
        </button>
      </nav>
    </motion.header>
  );
};

export default Header;
