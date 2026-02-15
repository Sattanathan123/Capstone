import React from 'react';
import './SchemeCard.css';

const SchemeCard = ({ scheme, onApply }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="scheme-card">
      <div className="scheme-header">
        <h3>{scheme.schemeName}</h3>
        <span className="component-badge">{scheme.schemeComponent}</span>
      </div>

      <p className="scheme-description">{scheme.schemeDescription}</p>

      <div className="scheme-details">
        <div className="detail-row">
          <span className="detail-label">Benefit Type:</span>
          <span className="detail-value">{scheme.benefitType}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Maximum Benefit:</span>
          <span className="detail-value benefit-amount">
            ₹{scheme.maxBenefitAmount?.toLocaleString()}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Validity Period:</span>
          <span className="detail-value">
            {formatDate(scheme.applicationStartDate)} - {formatDate(scheme.applicationEndDate)}
          </span>
        </div>
      </div>

      <div className="eligibility-info">
        <h4>Eligibility Criteria</h4>
        <div className="eligibility-tags">
          <span className="tag">Income: ₹{scheme.minIncome?.toLocaleString()} - ₹{scheme.maxIncome?.toLocaleString()}</span>
          <span className="tag">Community: {scheme.community}</span>
          <span className="tag">Occupation: {scheme.occupation}</span>
        </div>
      </div>

      <button 
        className="apply-btn"
        onClick={() => onApply(scheme.id)}
      >
        Apply for Scheme
      </button>
    </div>
  );
};

export default SchemeCard;
