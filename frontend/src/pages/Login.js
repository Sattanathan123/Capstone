import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    aadhaarNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Valid 10-digit mobile number required';
    }
    if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar number required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('dbiToken', data.token);
        localStorage.setItem('dbiUser', JSON.stringify(data.user));
        alert('Login successful!');
        // Redirect to dashboard based on role
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.text();
        alert('Login failed: ' + errorData);
      }
    } catch (error) {
      alert('Error connecting to server: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <motion.div 
          className="left-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="visual-elements">
            <div className="lock-icon">🔐</div>
            <div className="shield-icon">🛡️</div>
            <div className="check-icon">✅</div>
          </div>
          
          <h1>Digital Beneficiary Identification</h1>
          <p className="subtitle">Verified Access to Government Welfare Services</p>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="icon">🔒</span>
              <span>Secure Access</span>
            </div>
            <div className="feature-item">
              <span className="icon">🛡️</span>
              <span>Government Verified</span>
            </div>
            <div className="feature-item">
              <span className="icon">✓</span>
              <span>Verified User</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="login-right">
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="form-header">
            <h2>🔐 Login to Your DBI Account</h2>
            <p className="form-subtitle">Access your verified beneficiary profile securely</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Registered Mobile Number *</label>
              <input 
                type="tel" 
                name="mobileNumber" 
                value={formData.mobileNumber} 
                onChange={handleChange} 
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.mobileNumber && <span className="error">{errors.mobileNumber}</span>}
            </div>

            <div className="form-group">
              <label>Aadhaar Number *</label>
              <input 
                type="password" 
                name="aadhaarNumber" 
                value={formData.aadhaarNumber} 
                onChange={handleChange} 
                placeholder="Enter 12-digit Aadhaar number"
                maxLength="12"
              />
              {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
              <small>Your Aadhaar is masked for security</small>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Enter your password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-links">
              <a href="#" className="link">Forgot Password?</a>
              <a href="#" className="link primary" onClick={(e) => { e.preventDefault(); setActiveTab('register'); }}>
                New User? Register Here
              </a>
            </div>
          </form>

         
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
