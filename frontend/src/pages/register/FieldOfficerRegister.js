import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../Register.css';

const FieldOfficerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', gender: '', dateOfBirth: '', mobileNumber: '', email: '', password: '',
    aadhaarNumber: '', employeeId: '', idCardNumber: '', assignedState: '', assignedDistrict: '', assignedBlock: ''
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
        body: JSON.stringify({ ...formData, role: 'FIELD_VERIFICATION_OFFICER' })
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
          <h1>Field Verification Officer</h1>
          <p className="subtitle">Verify • Inspect • Report</p>
          <div className="features-list">
            <div className="feature-item"><span>Verify Applications</span></div>
            <div className="feature-item"><span>Field Inspections</span></div>
            <div className="feature-item"><span>Report Submissions</span></div>
          </div>
        </motion.div>
      </div>
      <div className="register-right">
        <motion.div className="form-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <h2>👮 Field Officer Registration</h2>
          <p className="form-subtitle">Register to verify beneficiary applications</p>
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
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
              <div className="form-group">
                <label>ID Card Number *</label>
                <input type="text" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-section">
              <h3>Work Assignment</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Assigned State *</label>
                  <input type="text" name="assignedState" value={formData.assignedState} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Assigned District *</label>
                  <input type="text" name="assignedDistrict" value={formData.assignedDistrict} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Assigned Block *</label>
                <input type="text" name="assignedBlock" value={formData.assignedBlock} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="submit-btn">Register Now</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FieldOfficerRegister;
