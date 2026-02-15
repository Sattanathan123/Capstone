import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import './BeneficiaryDashboard.css';

const BeneficiaryDashboard = () => {
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaryData();
  }, []);

  const fetchBeneficiaryData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/beneficiary/eligible-schemes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBeneficiary(data.beneficiary);
        setEligibleSchemes(data.eligibleSchemes);
      } else {
        alert('Failed to load data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (schemeId) => {
    if (!window.confirm('Are you sure you want to apply for this scheme?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/beneficiary/apply/${schemeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        fetchBeneficiaryData();
      } else {
        const error = await response.text();
        alert('Application failed: ' + error);
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Error submitting application');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="beneficiary-dashboard">
      <header className="beneficiary-header">
        <div className="header-content">
          <div>
            <h1>Beneficiary Dashboard</h1>
            <p className="role-badge">Role: Beneficiary</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Beneficiary Profile Summary */}
        <section className="profile-summary">
          <h2>Profile Summary</h2>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="label">Name:</span>
              <span className="value">{beneficiary?.fullName}</span>
            </div>
            <div className="profile-item">
              <span className="label">Annual Income:</span>
              <span className="value">₹{beneficiary?.annualIncome?.toLocaleString()}</span>
            </div>
            <div className="profile-item">
              <span className="label">Community:</span>
              <span className="value">{beneficiary?.casteCategory}</span>
            </div>
            <div className="profile-item">
              <span className="label">Occupation:</span>
              <span className="value">{beneficiary?.incomeSource}</span>
            </div>
            <div className="profile-item">
              <span className="label">Eligibility Status:</span>
              <span className="value verified">✓ Verified</span>
            </div>
          </div>
        </section>

        {/* Eligible Schemes Section */}
        <section className="schemes-section">
          <h2>Eligible Schemes for You</h2>
          
          {eligibleSchemes.length === 0 ? (
            <div className="no-schemes">
              <div className="no-schemes-icon">📋</div>
              <h3>No schemes available based on your eligibility criteria.</h3>
              <p>Please check back later or contact support for assistance.</p>
            </div>
          ) : (
            <div className="schemes-grid">
              {eligibleSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;
