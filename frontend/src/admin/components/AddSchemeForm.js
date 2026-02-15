import React, { useState } from 'react';
import './AddSchemeForm.css';

const AddSchemeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    schemeName: '',
    schemeDescription: '',
    schemeComponent: '',
    status: 'ACTIVE',
    minIncome: '',
    maxIncome: '',
    community: '',
    occupation: '',
    benefitType: '',
    maxBenefitAmount: '',
    applicationStartDate: '',
    applicationEndDate: '',
    requiresAadhaar: true,
    requiresIncomeCertificate: true,
    requiresCommunityCertificate: true,
    requiresOccupationProof: true
  });

  const [errors, setErrors] = useState({});

  const schemeComponents = ['ADARSH_GRAM', 'GIA', 'HOSTEL'];
  const communities = ['SC', 'ST', 'OBC', 'GENERAL', 'OTHERS'];
  const occupations = ['Agriculture', 'Business', 'Employment', 'Daily Wage', 'Self-Employed', 'Unemployed', 'Others'];
  const benefitTypes = ['FINANCIAL', 'SERVICE', 'INFRASTRUCTURE'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Basic Details
    if (!formData.schemeName.trim()) {
      newErrors.schemeName = 'Scheme name is required';
    }
    if (!formData.schemeDescription.trim()) {
      newErrors.schemeDescription = 'Scheme description is required';
    }
    if (!formData.schemeComponent) {
      newErrors.schemeComponent = 'Scheme component is required';
    }

    // Eligibility Criteria (MANDATORY)
    if (!formData.minIncome) {
      newErrors.minIncome = 'Minimum income is required';
    }
    if (!formData.maxIncome) {
      newErrors.maxIncome = 'Maximum income is required';
    }
    if (formData.minIncome && formData.maxIncome && parseFloat(formData.minIncome) >= parseFloat(formData.maxIncome)) {
      newErrors.maxIncome = 'Maximum income must be greater than minimum income';
    }
    if (!formData.community) {
      newErrors.community = 'Community/Category is required';
    }
    if (!formData.occupation) {
      newErrors.occupation = 'Occupation is required';
    }

    // Benefit Details
    if (!formData.benefitType) {
      newErrors.benefitType = 'Benefit type is required';
    }
    if (!formData.maxBenefitAmount) {
      newErrors.maxBenefitAmount = 'Maximum benefit amount is required';
    }

    // Timeline
    if (!formData.applicationStartDate) {
      newErrors.applicationStartDate = 'Application start date is required';
    }
    if (!formData.applicationEndDate) {
      newErrors.applicationEndDate = 'Application end date is required';
    }
    if (formData.applicationStartDate && formData.applicationEndDate && 
        new Date(formData.applicationStartDate) >= new Date(formData.applicationEndDate)) {
      newErrors.applicationEndDate = 'End date must be after start date';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="add-scheme-form">
      <div className="form-header">
        <h2>Add New Scheme</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Scheme Details */}
        <section className="form-section">
          <h3>Basic Scheme Details</h3>
          
          <div className="form-group">
            <label>Scheme Name *</label>
            <input
              type="text"
              name="schemeName"
              value={formData.schemeName}
              onChange={handleChange}
              placeholder="Enter scheme name"
            />
            {errors.schemeName && <span className="error">{errors.schemeName}</span>}
          </div>

          <div className="form-group">
            <label>Scheme Description *</label>
            <textarea
              name="schemeDescription"
              value={formData.schemeDescription}
              onChange={handleChange}
              placeholder="Enter scheme description"
              rows="3"
            />
            {errors.schemeDescription && <span className="error">{errors.schemeDescription}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Scheme Component *</label>
              <select
                name="schemeComponent"
                value={formData.schemeComponent}
                onChange={handleChange}
              >
                <option value="">Select Component</option>
                {schemeComponents.map(comp => (
                  <option key={comp} value={comp}>{comp.replace('_', ' ')}</option>
                ))}
              </select>
              {errors.schemeComponent && <span className="error">{errors.schemeComponent}</span>}
            </div>

            <div className="form-group">
              <label>Scheme Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {/* Eligibility Criteria */}
        <section className="form-section">
          <h3>Eligibility Criteria (MANDATORY)</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Minimum Annual Income (₹) *</label>
              <input
                type="number"
                name="minIncome"
                value={formData.minIncome}
                onChange={handleChange}
                placeholder="0"
              />
              {errors.minIncome && <span className="error">{errors.minIncome}</span>}
            </div>

            <div className="form-group">
              <label>Maximum Annual Income (₹) *</label>
              <input
                type="number"
                name="maxIncome"
                value={formData.maxIncome}
                onChange={handleChange}
                placeholder="500000"
              />
              {errors.maxIncome && <span className="error">{errors.maxIncome}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Community / Category *</label>
              <select
                name="community"
                value={formData.community}
                onChange={handleChange}
              >
                <option value="">Select Community</option>
                {communities.map(comm => (
                  <option key={comm} value={comm}>{comm}</option>
                ))}
              </select>
              {errors.community && <span className="error">{errors.community}</span>}
            </div>

            <div className="form-group">
              <label>Occupation *</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              >
                <option value="">Select Occupation</option>
                {occupations.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
              {errors.occupation && <span className="error">{errors.occupation}</span>}
            </div>
          </div>
        </section>

        {/* Benefit Details */}
        <section className="form-section">
          <h3>Benefit Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Type of Benefit *</label>
              <select
                name="benefitType"
                value={formData.benefitType}
                onChange={handleChange}
              >
                <option value="">Select Benefit Type</option>
                {benefitTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.benefitType && <span className="error">{errors.benefitType}</span>}
            </div>

            <div className="form-group">
              <label>Maximum Benefit Amount (₹) *</label>
              <input
                type="number"
                name="maxBenefitAmount"
                value={formData.maxBenefitAmount}
                onChange={handleChange}
                placeholder="500000"
              />
              {errors.maxBenefitAmount && <span className="error">{errors.maxBenefitAmount}</span>}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="form-section">
          <h3>Timeline</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Application Start Date *</label>
              <input
                type="date"
                name="applicationStartDate"
                value={formData.applicationStartDate}
                onChange={handleChange}
              />
              {errors.applicationStartDate && <span className="error">{errors.applicationStartDate}</span>}
            </div>

            <div className="form-group">
              <label>Application End Date *</label>
              <input
                type="date"
                name="applicationEndDate"
                value={formData.applicationEndDate}
                onChange={handleChange}
              />
              {errors.applicationEndDate && <span className="error">{errors.applicationEndDate}</span>}
            </div>
          </div>
        </section>

        {/* Documents Required */}
        <section className="form-section">
          <h3>Documents Required</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresAadhaar"
                checked={formData.requiresAadhaar}
                onChange={handleChange}
              />
              <span>Aadhaar</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresIncomeCertificate"
                checked={formData.requiresIncomeCertificate}
                onChange={handleChange}
              />
              <span>Income Certificate</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresCommunityCertificate"
                checked={formData.requiresCommunityCertificate}
                onChange={handleChange}
              />
              <span>Community Certificate</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresOccupationProof"
                checked={formData.requiresOccupationProof}
                onChange={handleChange}
              />
              <span>Occupation Proof</span>
            </label>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Add Scheme
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSchemeForm;
