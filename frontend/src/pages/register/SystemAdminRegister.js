import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../Register.css';

const SystemAdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', gender: '', dateOfBirth: '', mobileNumber: '', email: '', password: '',
    aadhaarNumber: '', employeeId: '', adminLevel: '', designation: '', accessGrantedBy: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'SYSTEM_ADMIN' })
      });
      if (response.ok) {
        const data = await response.json();
        alert('Registration successful! You can now login.');
        navigate('/login');
      } else {
        const errorText = await response.text();
        console.error('Registration error:', errorText);
        alert('Registration failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="register-page">
      <button className="back-button" onClick={() => navigate('/register')}>
        ← Back to Role Selection
      </button>
      <div className="register-left">
        <motion.div className="left-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1>System Administrator</h1>
          <p className="subtitle">Configure • Secure • Maintain</p>
          <div className="features-list">
            <div className="feature-item"><span>System Configuration</span></div>
            <div className="feature-item"><span>User Management</span></div>
            <div className="feature-item"><span>Security Control</span></div>
          </div>
        </motion.div>
      </div>
      <div className="register-right">
        <motion.div className="form-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <h2>⚙️ System Admin Registration</h2>
          <p className="form-subtitle">Register to manage system configuration</p>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <input type="text" name="gender" value={formData.gender} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} maxLength="10" required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Create Password</h3>
              <div className="form-group">
                <label>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <small>Use a strong password with letters, numbers & symbols</small>
              </div>
            </div>

            <div className="form-section">
              <h3>Identity Verification</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Aadhaar Number *</label>
                  <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} maxLength="12" required />
                  <small>Your Aadhaar will be securely encrypted</small>
                </div>
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>System Access</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Admin Level *</label>
                  <input type="text" name="adminLevel" value={formData.adminLevel} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Designation *</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Access Granted By *</label>
                <input type="text" name="accessGrantedBy" value={formData.accessGrantedBy} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="submit-btn">Register Now</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemAdminRegister;
