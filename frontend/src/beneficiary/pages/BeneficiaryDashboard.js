import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import './BeneficiaryDashboard.css';

const BeneficiaryDashboard = () => {
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaryData();
  }, []);

  const fetchBeneficiaryData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [schemesRes, appsRes] = await Promise.all([
        fetch('http://localhost:8080/api/beneficiary/eligible-schemes', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/beneficiary/applications', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (schemesRes.ok) {
        const data = await schemesRes.json();
        setBeneficiary(data.beneficiary);
        setEligibleSchemes(data.eligibleSchemes);
      }
      if (appsRes.ok) {
        const apps = await appsRes.json();
        setApplications(apps);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (schemeId) => {
    navigate(`/beneficiary/apply/${schemeId}`);
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

        {/* Application Tracking Section */}
        {applications.length > 0 && (
          <section className="tracking-section">
            <h2>📍 Track Your Applications</h2>
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="app-header">
                    <h3>{app.schemeName}</h3>
                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="journey-map">
                    <div className={`journey-step ${['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED'].includes(app.status) ? 'completed' : ''}`}>
                      <div className="step-icon">📝</div>
                      <div className="step-label">Submitted</div>
                    </div>
                    <div className={`journey-line ${['UNDER_REVIEW', 'APPROVED', 'DISBURSED'].includes(app.status) ? 'completed' : ''}`}></div>
                    <div className={`journey-step ${['UNDER_REVIEW', 'APPROVED', 'DISBURSED'].includes(app.status) ? 'completed' : ''}`}>
                      <div className="step-icon">🔍</div>
                      <div className="step-label">Under Review</div>
                    </div>
                    <div className={`journey-line ${['APPROVED', 'DISBURSED'].includes(app.status) ? 'completed' : ''}`}></div>
                    <div className={`journey-step ${['APPROVED', 'DISBURSED'].includes(app.status) ? 'completed' : app.status === 'REJECTED' ? 'rejected' : ''}`}>
                      <div className="step-icon">{app.status === 'REJECTED' ? '❌' : '✅'}</div>
                      <div className="step-label">{app.status === 'REJECTED' ? 'Rejected' : 'Approved'}</div>
                    </div>
                    <div className={`journey-line ${app.status === 'DISBURSED' ? 'completed' : ''}`}></div>
                    <div className={`journey-step ${app.status === 'DISBURSED' ? 'completed' : ''}`}>
                      <div className="step-icon">💰</div>
                      <div className="step-label">Disbursed</div>
                    </div>
                  </div>
                  <div className="app-details">
                    <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                    {app.remarks && <p className="remarks">Remarks: {app.remarks}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
