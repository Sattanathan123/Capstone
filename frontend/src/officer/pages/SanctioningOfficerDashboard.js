import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/Toast';
import API_BASE from '../../config';
import './SanctioningOfficerDashboard.css';

const SanctioningOfficerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [officer, setOfficer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, sanctioned: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('APPROVED');

  useEffect(() => { fetchOfficerData(); }, []);

  const fetchOfficerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setOfficer(user);

      const appsRes = await fetch(`${API_BASE}/api/sanctioning/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (appsRes.status === 401) { window.dispatchEvent(new CustomEvent('auth-error', { detail: 401 })); return; }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data.map(app => ({
          id: app.id,
          beneficiaryName: app.user.fullName,
          schemeName: app.scheme.schemeName,
          applicationDate: app.appliedDate,
          location: `${app.user.village || 'N/A'}, ${app.user.block || 'N/A'}`,
          status: app.status,
          remarks: app.remarks,
          verificationRemarks: app.verificationRemarks
        })));
      }

      const statsRes = await fetch(`${API_BASE}/api/sanctioning/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      toast('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/sanctioning/application/${appId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setSelectedApp(await response.json());
      else toast('Failed to load application', 'error');
    } catch (error) {
      toast('Error loading application', 'error');
    }
  };

  const handleSanction = async (appId, status, remarks) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/sanctioning/sanction/${appId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks })
      });
      if (response.ok) {
        toast(`Application ${status} successfully!`, 'success');
        setSelectedApp(null);
        fetchOfficerData();
      } else {
        toast('Failed to update application', 'error');
      }
    } catch (error) {
      toast('Error: ' + error.message, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading-screen">{t('dashboard.loading')}</div>;

  const total = stats.pending + stats.sanctioned + stats.rejected;
  const rate = total ? stats.sanctioned / total : 0;
  const r = 52, circ = 2 * Math.PI * r;

  return (
    <div className="officer-dashboard">
      <header className="officer-header sanctioning">
        <div className="header-content">
          <div>
            <h1>Sanctioning Officer Dashboard</h1>
            <p className="role-badge">👤 {officer?.fullName} | 📍 {officer?.assignedDistrict}, {officer?.assignedState}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>{t('dashboard.logout')}</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card today"><div className="stat-icon">📅</div><div className="stat-info"><h3>{stats.today}</h3><p>{t('dashboard.sanctioned_today')}</p></div></div>
          <div className="stat-card pending"><div className="stat-icon">⏳</div><div className="stat-info"><h3>{stats.pending}</h3><p>{t('dashboard.pending_sanctions')}</p></div></div>
          <div className="stat-card approved"><div className="stat-icon">✅</div><div className="stat-info"><h3>{stats.sanctioned}</h3><p>{t('dashboard.total_sanctioned')}</p></div></div>
          <div className="stat-card rejected"><div className="stat-icon">❌</div><div className="stat-info"><h3>{stats.rejected}</h3><p>{t('dashboard.total_rejected')}</p></div></div>
        </section>

        <section className="performance-analytics">
          <div className="analytics-card">
            <h3>📊 {t('dashboard.performance')}</h3>
            <div className="performance-chart">
              <div className="progress-rings">
                <div className="ring-container">
                  <svg className="progress-ring" width="120" height="120">
                    <circle className="progress-ring-bg" stroke="#e6e6e6" strokeWidth="8" fill="transparent" r={r} cx="60" cy="60" />
                    <circle stroke="#f093fb" strokeWidth="8" fill="transparent" r={r} cx="60" cy="60"
                      strokeDasharray={circ} strokeDashoffset={circ * (1 - rate)} transform="rotate(-90 60 60)" strokeLinecap="round" />
                  </svg>
                  <div className="ring-label">
                    <span className="ring-value" style={{ color: '#f093fb' }}>{Math.round(rate * 100)}%</span>
                    <span className="ring-text">{t('dashboard.sanction_rate')}</span>
                  </div>
                </div>
                <div className="performance-stats">
                  <div className="perf-stat">
                    <span className="perf-label">Daily Progress</span>
                    <div className="perf-bar"><div className="perf-fill" style={{ width: `${Math.min((stats.today / 10) * 100, 100)}%`, background: 'linear-gradient(90deg,#667eea,#f093fb)' }}></div></div>
                    <span className="perf-value">{stats.today}/10 {t('dashboard.daily_target')}</span>
                  </div>
                  <div className="perf-stat">
                    <span className="perf-label">{t('dashboard.pending_workload')}</span>
                    <div className="perf-bar"><div className="perf-fill workload" style={{ width: `${Math.min((stats.pending / 50) * 100, 100)}%` }}></div></div>
                    <span className="perf-value">{stats.pending} {t('dashboard.pending_sanctions')}</span>
                  </div>
                  <div className="perf-stat">
                    <span className="perf-label">Sanctioned vs Rejected</span>
                    <div className="perf-bar"><div className="perf-fill" style={{ width: `${stats.sanctioned + stats.rejected > 0 ? Math.round(stats.sanctioned / (stats.sanctioned + stats.rejected) * 100) : 0}%`, background: 'linear-gradient(90deg,#48bb78,#38a169)' }}></div></div>
                    <span className="perf-value">{stats.sanctioned} sanctioned / {stats.rejected} rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="verifications-section">
          <div className="tabs-header">
            <button className={`tab ${activeTab === 'APPROVED' ? 'active' : ''}`} onClick={() => setActiveTab('APPROVED')}>⏳ Pending Sanction</button>
            <button className={`tab ${activeTab === 'SANCTIONED' ? 'active' : ''}`} onClick={() => setActiveTab('SANCTIONED')}>✅ Sanctioned</button>
            <button className={`tab ${activeTab === 'REJECTED' ? 'active' : ''}`} onClick={() => setActiveTab('REJECTED')}>❌ Rejected</button>
          </div>
          {applications.filter(a => a.status === activeTab).length === 0 ? (
            <div className="no-data"><p>No {activeTab.toLowerCase()} applications.</p></div>
          ) : (
            <div className="verifications-list">
              {applications.filter(a => a.status === activeTab).map((app) => (
                <div key={app.id} className="verification-card">
                  <div className="card-header">
                    <div><h3>{app.beneficiaryName}</h3><p className="scheme-name">{app.schemeName}</p></div>
                    <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row"><span className="label">📍 {t('common.location')}:</span><span className="value">{app.location}</span></div>
                    <div className="info-row"><span className="label">📅 {t('common.applied')}:</span><span className="value">{new Date(app.applicationDate).toLocaleDateString()}</span></div>
                    {app.verificationRemarks && <div className="info-row"><span className="label">🔍 Verification:</span><span className="value">{app.verificationRemarks}</span></div>}
                    {app.remarks && <div className="info-row"><span className="label">💬 {t('common.remarks')}:</span><span className="value">{app.remarks}</span></div>}
                  </div>
                  <div className="card-actions">
                    <button className="btn-view" onClick={() => handleViewDetails(app.id)}>{t('dashboard.view_details')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Sanction Review</h2>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section"><h3>📋 Application Information</h3>
                <p><strong>Application ID:</strong> {selectedApp.applicationId}</p>
                <p><strong>Scheme:</strong> {selectedApp.scheme?.schemeName}</p>
                <p><strong>Applied Date:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedApp.status}</p>
              </div>
              <div className="detail-section"><h3>👤 Beneficiary Details</h3>
                <p><strong>Name:</strong> {selectedApp.user?.fullName}</p>
                <p><strong>Aadhaar:</strong> {selectedApp.user?.aadhaarNumber}</p>
                <p><strong>Mobile:</strong> {selectedApp.user?.mobileNumber}</p>
                <p><strong>Email:</strong> {selectedApp.user?.email || 'N/A'}</p>
              </div>
              <div className="detail-section"><h3>📍 Address Details</h3>
                <p><strong>Address:</strong> {selectedApp.user?.address}</p>
                <p><strong>District:</strong> {selectedApp.user?.district}</p>
                <p><strong>State:</strong> {selectedApp.user?.state}</p>
              </div>
              <div className="detail-section"><h3>💰 Eligibility Information</h3>
                <p><strong>Annual Income:</strong> ₹{selectedApp.user?.annualIncome?.toLocaleString()}</p>
                <p><strong>Caste Category:</strong> {selectedApp.user?.casteCategory}</p>
              </div>
              <div className="detail-section"><h3>📄 Documents</h3>
                <div className="documents-list">
                  {selectedApp.aadhaarDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Aadhaar Card', data: selectedApp.aadhaarDoc })}>📎 Aadhaar Card - Click to View</div>}
                  {selectedApp.incomeCertDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Income Certificate', data: selectedApp.incomeCertDoc })}>📎 Income Certificate - Click to View</div>}
                  {selectedApp.communityCertDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Community Certificate', data: selectedApp.communityCertDoc })}>📎 Community Certificate - Click to View</div>}
                  {selectedApp.occupationProofDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Occupation Proof', data: selectedApp.occupationProofDoc })}>📎 Occupation Proof - Click to View</div>}
                </div>
              </div>
              {selectedApp.verificationRemarks && (
                <div className="detail-section"><h3>🔍 Field Verification Remarks</h3>
                  <p className="remarks-display">{selectedApp.verificationRemarks}</p>
                </div>
              )}
              {selectedApp.status === 'APPROVED' && (
                <>
                  <div className="detail-section"><h3>✍️ Sanction Remarks</h3>
                    <textarea placeholder="Enter sanction remarks..." rows="4" id="remarks" className="remarks-input" />
                  </div>
                  <div className="action-buttons">
                    <button className="btn-approve" onClick={() => handleSanction(selectedApp.id, 'SANCTIONED', document.getElementById('remarks').value)}>✅ {t('common.sanction')}</button>
                    <button className="btn-reject" onClick={() => { const r = document.getElementById('remarks').value; if (!r) { toast('Please provide remarks for rejection', 'warning'); return; } handleSanction(selectedApp.id, 'REJECTED', r); }}>❌ {t('common.reject')}</button>
                    <button className="btn-cancel" onClick={() => setSelectedApp(null)}>{t('common.cancel')}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {viewingDoc && (
        <div className="modal-overlay" onClick={() => setViewingDoc(null)}>
          <div className="modal-content doc-viewer" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 {viewingDoc.name}</h2>
              <button className="close-btn" onClick={() => setViewingDoc(null)}>×</button>
            </div>
            <div className="modal-body" style={{ height: '80vh', padding: 0 }}>
              <iframe src={viewingDoc.data} style={{ width: '100%', height: '100%', border: 'none' }} title={viewingDoc.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanctioningOfficerDashboard;
