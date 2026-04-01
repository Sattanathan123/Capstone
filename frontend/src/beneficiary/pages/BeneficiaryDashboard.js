import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/Toast';
import API_BASE from '../../config';
import SchemeCard from '../components/SchemeCard';
import './BeneficiaryDashboard.css';

const BeneficiaryDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const toast = useToast();
  const schemesRef = useRef(null);
  const [beneficiary, setBeneficiary] = useState(null);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('eligible');
  const [activeSubTab, setActiveSubTab] = useState('all');
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
      
      const schemesRes = await fetch(`${API_BASE}/api/beneficiary/eligible-schemes`, {
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
        const appsRes = await fetch(`${API_BASE}/api/beneficiary/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (appsRes.ok) {
          const apps = await appsRes.json();
          setApplications(apps);
          const sanctionedApps = apps.filter(a => a.status === 'SANCTIONED');
          const feedbackChecks = await Promise.all(
            sanctionedApps.map(a =>
              fetch(`http://localhost:8080/api/feedback/check/${a.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              }).then(r => r.json()).then(d => d.submitted ? a.id : null)
            )
          );
          setSubmittedFeedbacks(feedbackChecks.filter(Boolean));
        } else {
          setApplications([]);
        }
      } catch (err) {
        setApplications([]);
      }
    } catch (error) {
      toast('Error loading dashboard', 'error');
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
      const response = await fetch(`${API_BASE}/api/feedback/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('Feedback response:', result);
      if (response.ok) {
        toast('Thank you for your feedback!', 'success');
        setSubmittedFeedbacks([...submittedFeedbacks, feedbackModal.id]);
        setFeedbackModal(null);
        setFeedbackData({ rating: 5, comments: '', amountSpentOn: '', benefitReceived: '', wouldRecommend: true, suggestions: '' });
      } else {
        toast(result.error || 'Failed to submit feedback', 'error');
      }
    } catch (e) {
      toast('Error submitting feedback', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-screen">{t('dashboard.loading')}</div>;
  }

  return (
    <div className="beneficiary-dashboard">
      <header className="beneficiary-header">
        <div className="header-content">
          <div>
            <h1>{t('beneficiary.dashboard_title')}</h1>
            <p className="role-badge">{t('beneficiary.role')}</p>
          </div>
          <div className="header-actions">
            <button className="bank-btn" onClick={() => navigate('/beneficiary/bank-details')}>{t('beneficiary.bank_details')}</button>
            <button className="track-nav-btn" onClick={() => navigate('/track')}>{t('beneficiary.track_app')}</button>
            <button className="logout-btn" onClick={handleLogout}>{t('dashboard.logout')}</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Beneficiary Profile Summary */}
        <section className="profile-summary">
          <h2>{t('beneficiary.profile_summary')}</h2>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="label">{t('beneficiary.name')}:</span>
              <span className="value">{beneficiary?.fullName}</span>
            </div>
            <div className="profile-item">
              <span className="label">{t('beneficiary.annual_income')}:</span>
              <span className="value">₹{beneficiary?.annualIncome?.toLocaleString()}</span>
            </div>
            <div className="profile-item">
              <span className="label">{t('beneficiary.community')}:</span>
              <span className="value">{beneficiary?.casteCategory}</span>
            </div>
            <div className="profile-item">
              <span className="label">{t('beneficiary.occupation')}:</span>
              <span className="value">{beneficiary?.incomeSource}</span>
            </div>
            <div className="profile-item">
              <span className="label">{t('beneficiary.eligibility')}:</span>
              <span className="value verified">{t('beneficiary.verified')}</span>
            </div>
          </div>
        </section>

        {/* Main Tabs: Eligible Schemes & Applied Schemes */}
        <section className="tabs-section" ref={schemesRef}>
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'eligible' ? 'active' : ''}`}
              onClick={() => setActiveTab('eligible')}
            >
              🎯 {t('beneficiary.eligible_schemes')}
              {eligibleSchemes.length > 0 && <span className="tab-count">{eligibleSchemes.length}</span>}
            </button>
            <button
              className={`tab-btn ${activeTab === 'applied' ? 'active' : ''}`}
              onClick={() => setActiveTab('applied')}
            >
              📄 {t('beneficiary.your_applications')}
              {applications.length > 0 && <span className="tab-count">{applications.length}</span>}
            </button>
          </div>

          <div className="tab-content">
            {/* Eligible Schemes Tab */}
            {activeTab === 'eligible' && (
              eligibleSchemes.length === 0 ? (
                <div className="no-schemes">
                  <div className="no-schemes-icon">📋</div>
                  <h3>{t('beneficiary.no_schemes')}</h3>
                  <p>{t('beneficiary.no_schemes_sub')}</p>
                </div>
              ) : (
                <div className="schemes-grid">
                  {eligibleSchemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} onApply={handleApply} />
                  ))}
                </div>
              )
            )}

            {/* Applied Schemes Tab */}
            {activeTab === 'applied' && (() => {
              const pending = applications.filter(a => ['SUBMITTED','PENDING_VERIFICATION','UNDER_REVIEW','FIELD_VERIFIED'].includes(a.status));
              const approved = applications.filter(a => ['APPROVED','SANCTIONED','DISBURSED'].includes(a.status));
              const rejected = applications.filter(a => a.status === 'REJECTED');
              const subMap = { all: applications, pending, approved, rejected };
              const filtered = subMap[activeSubTab] || applications;

              return (
                <>
                  <div className="sub-tabs">
                    {[['all','All'], ['pending','⏳ Pending'], ['approved','✅ Approved'], ['rejected','❌ Rejected']].map(([key, label]) => (
                      <button
                        key={key}
                        className={`sub-tab-btn ${activeSubTab === key ? 'active' : ''}`}
                        onClick={() => setActiveSubTab(key)}
                      >
                        {label}
                        <span className="sub-tab-count">{subMap[key].length}</span>
                      </button>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div className="no-schemes">
                      <div className="no-schemes-icon">📭</div>
                      <h3>No {activeSubTab === 'all' ? '' : activeSubTab} applications</h3>
                      <p>{activeSubTab === 'all' ? 'Apply for eligible schemes to get started.' : `You have no ${activeSubTab} applications.`}</p>
                    </div>
                  ) : (
                    <div className="applications-list">
                      {filtered.map((app) => (
                        <div key={app.id} className={`application-card border-${app.status.toLowerCase()}`}>
                          <div className="app-header">
                            <h3>{app.schemeName}</h3>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              {app.applicationId && (
                                <span style={{ fontSize: '13px', color: '#555', fontWeight: '600', background: '#eef2ff', padding: '3px 10px', borderRadius: '12px' }}>🆔 {app.applicationId}</span>
                              )}
                              <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                              {app.applicationId && (
                                <button
                                  onClick={() => navigate(`/track?id=${app.applicationId}`)}
                                  style={{ padding: '6px 14px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                                >
                                  🔍 Track
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="app-details">
                            <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                            {app.remarks && <p className="remarks">{t('beneficiary.remarks')}: {app.remarks}</p>}
                            {app.status === 'SANCTIONED' && !submittedFeedbacks.includes(app.id) && (
                              <button className="feedback-btn" onClick={() => setFeedbackModal(app)}>{t('beneficiary.give_feedback')}</button>
                            )}
                            {submittedFeedbacks.includes(app.id) && (
                              <span className="feedback-done">{t('beneficiary.feedback_done')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="modal-overlay" onClick={() => setFeedbackModal(null)}>
          <div className="feedback-modal" onClick={e => e.stopPropagation()}>
            <h2>{t('beneficiary.feedback_title')}</h2>
            <p>{t('beneficiary.feedback_scheme')}: <strong>{feedbackModal.schemeName}</strong></p>
            <div className="rating-section">
              <label>{t('beneficiary.rating')}:</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className={`star ${feedbackData.rating >= star ? 'active' : ''}`}
                    onClick={() => setFeedbackData({...feedbackData, rating: star})}>★</span>
                ))}
              </div>
            </div>

            <div className="comments-section">
              <label>{t('beneficiary.spent_on')}</label>
              <select value={feedbackData.amountSpentOn} onChange={e => setFeedbackData({...feedbackData, amountSpentOn: e.target.value})}>
                <option value="">{t('beneficiary.select')}</option>
                <option value="Education">{t('beneficiary.edu_education')}</option>
                <option value="Agriculture">{t('beneficiary.edu_agriculture')}</option>
                <option value="Healthcare">{t('beneficiary.edu_healthcare')}</option>
                <option value="Housing">{t('beneficiary.edu_housing')}</option>
                <option value="Business">{t('beneficiary.edu_business')}</option>
                <option value="Food">{t('beneficiary.edu_food')}</option>
                <option value="Other">{t('beneficiary.edu_other')}</option>
              </select>
            </div>

            <div className="comments-section">
              <label>{t('beneficiary.benefit_received')}</label>
              <textarea rows="2" placeholder={t('beneficiary.benefit_placeholder')} value={feedbackData.benefitReceived} onChange={e => setFeedbackData({...feedbackData, benefitReceived: e.target.value})} />
            </div>

            <div className="comments-section">
              <label>{t('beneficiary.recommend')}</label>
              <div className="radio-group">
                <label><input type="radio" checked={feedbackData.wouldRecommend === true} onChange={() => setFeedbackData({...feedbackData, wouldRecommend: true})} /> {t('beneficiary.yes')}</label>
                <label><input type="radio" checked={feedbackData.wouldRecommend === false} onChange={() => setFeedbackData({...feedbackData, wouldRecommend: false})} /> {t('beneficiary.no')}</label>
              </div>
            </div>

            <div className="comments-section">
              <label>{t('beneficiary.suggestions')}</label>
              <textarea rows="2" placeholder={t('beneficiary.suggestions_placeholder')} value={feedbackData.suggestions} onChange={e => setFeedbackData({...feedbackData, suggestions: e.target.value})} />
            </div>

            <div className="comments-section">
              <label>{t('beneficiary.comments')}</label>
              <textarea rows="2" placeholder={t('beneficiary.comments_placeholder')} value={feedbackData.comments} onChange={e => setFeedbackData({...feedbackData, comments: e.target.value})} />
            </div>

            <div className="modal-actions">
              <button className="submit-feedback-btn" onClick={handleFeedbackSubmit}>{t('beneficiary.submit_feedback')}</button>
              <button className="cancel-btn" onClick={() => setFeedbackModal(null)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryDashboard;
