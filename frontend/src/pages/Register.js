import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Register.css';

const Register = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    casteCategory: '',
    casteCertificateNumber: '',
    aadhaarNumber: '',
    address: '',
    state: '',
    district: '',
    block: '',
    village: '',
    pincode: '',
    annualIncome: '',
    incomeSource: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Valid 10-digit mobile number is required';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.casteCategory) newErrors.casteCategory = 'Caste category is required';
    if (!formData.casteCertificateNumber) newErrors.casteCertificateNumber = 'Certificate number is required';
    if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar number is required';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Valid 6-digit pincode is required';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Find first error field and scroll to it
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Registration successful! Redirecting to login...');
        setTimeout(() => {
          setActiveTab('login');
          window.scrollTo(0, 0);
        }, 1500);
      } else {
        const errorText = await response.text();
        let errorMessage = errorText;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorText;
        } catch {}
        
        if (errorMessage.includes('Mobile number already registered')) {
          alert(' Mobile Number Already Registered\n\nThis mobile number is already in use.\n\nPlease:\n• Use a different mobile number, or\n• Login with your existing account');
        } else if (errorMessage.includes('Aadhaar')) {
          alert(' Aadhaar Already Registered\n\nThis Aadhaar number is already registered.\n\nPlease:\n• Check your details, or\n• Login with your existing account');
        } else {
          alert(' Registration Failed\n\n' + errorMessage);
        }
      }
    } catch (error) {
      alert('Error connecting to server: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <motion.div 
          className="left-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="visual-elements">
            <div className="floating-card">
              <div className="card-icon">🆔</div>
              <div className="card-lines">
                <div className="line"></div>
                <div className="line short"></div>
              </div>
            </div>
          </div>
          
          <h1>Digital Beneficiary Identification</h1>
          <p className="subtitle">Secure • Transparent • Inclusive</p>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="icon">🔒</span>
              <span>Bank-grade Security</span>
            </div>
            <div className="feature-item">
              <span className="icon">✓</span>
              <span>Instant Verification</span>
            </div>
            <div className="feature-item">
              <span className="icon">🌍</span>
              <span>Accessible to All</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="register-right">
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2>Create Your DBI Account</h2>
          <p className="form-subtitle">Register to access government welfare schemes securely</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-section">
              <h3>Identity Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
                  {errors.fullName && <span className="error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error">{errors.gender}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="10-digit number" maxLength="10" />
                  {errors.mobileNumber && <span className="error">{errors.mobileNumber}</span>}
                </div>
                <div className="form-group">
                  <label>Email </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Create Password</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder="Password" 
                    />
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <span className="error">{errors.password}</span>}
                  <small>Use a strong password with letters, numbers & symbols</small>
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      placeholder="Re-enter password" 
                    />
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Eligibility Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Caste Category *</label>
                  <select name="casteCategory" value={formData.casteCategory} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="General">General</option>
                  </select>
                  {errors.casteCategory && <span className="error">{errors.casteCategory}</span>}
                </div>
                <div className="form-group">
                  <label>Community Certificate Number *</label>
                  <input type="text" name="casteCertificateNumber" value={formData.casteCertificateNumber} onChange={handleChange} placeholder="Certificate number" />
                  {errors.casteCertificateNumber && <span className="error">{errors.casteCertificateNumber}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Secure Identity</h3>
              <div className="form-group">
                <label>Aadhaar Number *</label>
                <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar" maxLength="12" />
                {errors.aadhaarNumber && <span className="error">{errors.aadhaarNumber}</span>}
                <small>Your Aadhaar will be securely encrypted</small>
              </div>
            </div>

            <div className="form-section">
              <h3>Address Details</h3>
              <div className="form-group">
                <label>Full Address *</label>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter complete address" rows="3"></textarea>
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State *</label>
                  <select name="state" value={formData.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" />
                  {errors.district && <span className="error">{errors.district}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Block</label>
                  <input type="text" name="block" value={formData.block} onChange={handleChange} placeholder="Block" />
                </div>
                <div className="form-group">
                  <label>Village</label>
                  <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="Village" />
                </div>
              </div>
              <div className="form-group">
                <label>Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength="6" />
                {errors.pincode && <span className="error">{errors.pincode}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Economic Status</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Annual Income</label>
                  <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} placeholder="Annual income in ₹" />
                </div>
                <div className="form-group">
                  <label>Income Source</label>
                  <select name="incomeSource" value={formData.incomeSource} onChange={handleChange}>
                    <option value="">Select Source</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Business">Business</option>
                    <option value="Employment">Employment</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>User Role</h3>
              <div className="form-group">
                <label>Select Role *</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option value="BENEFICIARY">Beneficiary</option>
                  <option value="FIELD_OFFICER">Field Verification Officer</option>
                  <option value="STATE_ADMIN">Department Admin</option>
                  <option value="BENEFICIARY">System Administrator</option>
                  <option value="FIELD_OFFICER">Monitoring & Audit Officer</option>
                  <option value="FIELD_OFFICER">Scheme Sanctioning Authority</option> 
                </select>
                {errors.role && <span className="error">{errors.role}</span>}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
