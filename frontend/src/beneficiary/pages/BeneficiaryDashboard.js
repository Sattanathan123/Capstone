import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import './BeneficiaryDashboard.css';

const BeneficiaryDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const schemesRef = useRef(null);
  const [beneficiary, setBeneficiary] = useState(null);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comments: '', amountSpentOn: '', benefitReceived: '', wouldRecommend: true, suggestions: '' });
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);

  useEffect(() => {
    fetchBeneficiaryData();
  }, []);

  useEffect(() => {
    // Refresh data when navigating back after income update
    if (location.state?.refreshSchemes) {
      fetchBeneficiaryData();
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.scrollTo === 'eligible-schemes' && schemesRef.current) {
      setTimeout(() => {
        schemesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        schemesRef.current.classList.add('highlight-section');
        setTimeout(() => schemesRef.current?.classList.remove('highlight-section'), 2000);
      }, 500);
    }
  }, [location.state, eligibleSchemes]);

  const fetchBeneficiaryData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const schemesRes = await fetch('http://localhost:8080/api/beneficiary/eligible-schemes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Response status:', schemesRes.status);
      
      if (schemesRes.ok) {
        const data = await schemesRes.json();
        console.log('Data received:', data);
        setBeneficiary(data.beneficiary);
        setEligibleSchemes(data.eligibleSchemes);
      } else {
        console.error('Failed:', await schemesRes.text());
      }
      
      try {
        const appsRes = await fetch('http://localhost:8080/api/beneficiary/applications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const apps = await appsRes.json();
          setApplications(apps);
        } else {
          setApplications([]);
        }
      } catch (err) {
        setApplications([]);
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

  const handleFeedbackSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = { applicationId: feedbackModal.id, ...feedbackData };
      console.log('Submitting feedback:', payload);
      const response = await fetch('http://localhost:8080/api/feedback/submit', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('Feedback response:', result);
      if (response.ok) {
        alert('Thank you for your feedback!');
        setSubmittedFeedbacks([...submittedFeedbacks, feedbackModal.id]);
        setFeedbackModal(null);
        setFeedbackData({ rating: 5, comments: '', amountSpentOn: '', benefitReceived: '', wouldRecommend: true, suggestions: '' });
      } else {
        alert(result.error || 'Failed to submit feedback');
      }
    } catch (e) {
      console.error('Feedback error:', e);
      alert('Error submitting feedback');
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
          <div className="header-actions">
            <button className="bank-btn" onClick={() => navigate('/beneficiary/bank-details')}>
              🏦 Bank Details
            </button>
            <button className="track-nav-btn" onClick={() => navigate('/track')}>
              📍 Track Application
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
            <h2>📍 Your Applications</h2>
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="app-header">
                    <h3>{app.schemeName}</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {app.applicationId && (
                        <span style={{ fontSize: '14px', color: '#666' }}>ID: {app.applicationId}</span>
                      )}
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="app-details">
                    <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                    {app.remarks && <p className="remarks">Remarks: {app.remarks}</p>}
                    {app.status === 'SANCTIONED' && !submittedFeedbacks.includes(app.id) && (
                      <button className="feedback-btn" onClick={() => setFeedbackModal(app)}>
                        ⭐ Give Feedback
                      </button>
                    )}
                    {submittedFeedbacks.includes(app.id) && (
                      <span className="feedback-done">✅ Feedback Submitted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Eligible Schemes Section */}
        <section className="schemes-section" ref={schemesRef}>
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

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="modal-overlay" onClick={() => setFeedbackModal(null)}>
          <div className="feedback-modal" onClick={e => e.stopPropagation()}>
            <h2>⭐ Rate Your Experience</h2>
            <p>Scheme: <strong>{feedbackModal.schemeName}</strong></p>

            <div className="rating-section">
              <label>Overall Rating:</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className={`star ${feedbackData.rating >= star ? 'active' : ''}`}
                    onClick={() => setFeedbackData({...feedbackData, rating: star})}>★</span>
                ))}
              </div>
            </div>

            <div className="comments-section">
              <label>How did you spend the sanctioned amount?</label>
              <select value={feedbackData.amountSpentOn}
                onChange={e => setFeedbackData({...feedbackData, amountSpentOn: e.target.value})}>
                <option value="">Select...</option>
                <option value="Education">Education (fees, books, etc.)</option>
                <option value="Agriculture">Agriculture (seeds, equipment, etc.)</option>
                <option value="Healthcare">Healthcare (treatment, medicines)</option>
                <option value="Housing">Housing (construction, repair)</option>
                <option value="Business">Business/Self-employment</option>
                <option value="Food">Food & Daily needs</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="comments-section">
              <label>What benefit did you receive?</label>
              <textarea rows="2" placeholder="Describe the benefit you received..."
                value={feedbackData.benefitReceived}
                onChange={e => setFeedbackData({...feedbackData, benefitReceived: e.target.value})} />
            </div>

            <div className="comments-section">
              <label>Would you recommend this scheme to others?</label>
              <div className="radio-group">
                <label><input type="radio" checked={feedbackData.wouldRecommend === true}
                  onChange={() => setFeedbackData({...feedbackData, wouldRecommend: true})} /> Yes</label>
                <label><input type="radio" checked={feedbackData.wouldRecommend === false}
                  onChange={() => setFeedbackData({...feedbackData, wouldRecommend: false})} /> No</label>
              </div>
            </div>

            <div className="comments-section">
              <label>Any suggestions for improvement?</label>
              <textarea rows="2" placeholder="Your suggestions..."
                value={feedbackData.suggestions}
                onChange={e => setFeedbackData({...feedbackData, suggestions: e.target.value})} />
            </div>

            <div className="comments-section">
              <label>Additional Comments:</label>
              <textarea rows="2" placeholder="Any other comments..."
                value={feedbackData.comments}
                onChange={e => setFeedbackData({...feedbackData, comments: e.target.value})} />
            </div>

            <div className="modal-actions">
              <button className="submit-feedback-btn" onClick={handleFeedbackSubmit}>Submit Feedback</button>
              <button className="cancel-btn" onClick={() => setFeedbackModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryDashboard;
