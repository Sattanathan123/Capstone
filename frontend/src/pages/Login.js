import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    aadhaarNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);

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
      console.log('Login attempt with:', { mobileNumber: formData.mobileNumber, aadhaarNumber: formData.aadhaarNumber });
      
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        
        // Redirect based on role
        if (data.user.role === 'BENEFICIARY') {
          window.location.href = '/beneficiary/dashboard';
        } else if (['DEPT_ADMIN', 'DISTRICT_ADMIN', 'STATE_ADMIN', 'FIELD_VERIFICATION_OFFICER', 'SYSTEM_ADMIN', 'MONITORING_AUDIT_OFFICER', 'SCHEME_SANCTIONING_AUTHORITY'].includes(data.user.role)) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        const errorData = await response.text();
        console.error('Login failed:', errorData);
        alert('Login failed: ' + errorData);
      }
    } catch (error) {
      console.error('Login error:', error);
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
          <h1>Digital Beneficiary Identification</h1>
          <p className="subtitle">Verified Access to Government Welfare Services</p>
          
          <div className="features-list">
            <div className="feature-item">
              <span>Secure Access</span>
            </div>
            <div className="feature-item">
              <span>Government Verified</span>
            </div>
            <div className="feature-item">
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
              <div style={{ position: 'relative' }}>
                <input 
                  type={showAadhaar ? 'text' : 'password'} 
                  name="aadhaarNumber" 
                  value={formData.aadhaarNumber} 
                  onChange={handleChange} 
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength="12"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowAadhaar(!showAadhaar)}
                >
                  {showAadhaar ? '👁️‍🗨️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
              <small>Your Aadhaar is masked for security</small>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-links">
              <a href="#" className="link">Forgot Password?</a>
              <a href="#" className="link primary" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
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
