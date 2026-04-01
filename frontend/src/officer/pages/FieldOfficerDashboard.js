import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/Toast';
import API_BASE from '../../config';
import './FieldOfficerDashboard.css';

const FieldOfficerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [officer, setOfficer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [successPopup, setSuccessPopup] = useState(null); // { status, name }

  useEffect(() => { fetchOfficerData(); }, []);

  const fetchOfficerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setOfficer(user);

      const verificationsRes = await fetch(`${API_BASE}/api/officer/all-verifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (verificationsRes.status === 401) { window.dispatchEvent(new CustomEvent('auth-error', { detail: 401 })); return; }

      if (verificationsRes.ok) {
        const data = await verificationsRes.json();
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        const formattedData = data.map(app => ({
          id: app.id,
          beneficiaryName: app.user.fullName,
          schemeName: app.scheme.schemeName,
          applicationDate: app.appliedDate,
          priority: app.priority || 'Medium',
          location: `${app.user.village || 'N/A'}, ${app.user.block || 'N/A'}`,
          status: app.status === 'PENDING_VERIFICATION' ? 'PENDING' : app.status,
          remarks: app.remarks
        })).sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1));
        setApplications(formattedData);
      } else {
        toast('Failed to load verifications', 'error');
      }

      const statsRes = await fetch(`${API_BASE}/api/officer/stats`, {
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
      const response = await fetch(`${API_BASE}/api/officer/application/${appId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setSelectedApp(await response.json());
      else toast('Failed to load application details', 'error');
    } catch (error) {
      toast('Error loading application', 'error');
    }
  };

  const handleVerify = async (appId, status, remarks) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/officer/verify/${appId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks })
      });
      if (response.ok) {
        setSelectedApp(null);
        fetchOfficerData();
        setSuccessPopup({ status, name: selectedApp?.beneficiaryName || 'Application' });
        setTimeout(() => { setSuccessPopup(null); }, 3000);
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

  return (
    <div className="officer-dashboard">
      <header className="officer-header">
        <div className="header-content">
          <div>
            <h1>Field Verification Officer Dashboard</h1>
            <p className="role-badge">👤 {officer?.fullName} | 📍 {officer?.assignedDistrict}, {officer?.assignedState}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>{t('dashboard.logout')}</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info"><h3>{stats.today}</h3><p>{t('dashboard.verified_today')}</p></div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info"><h3>{stats.pending}</h3><p>{t('dashboard.pending')}</p></div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info"><h3>{stats.approved}</h3><p>{t('dashboard.approved')}</p></div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info"><h3>{stats.rejected}</h3><p>{t('dashboard.rejected')}</p></div>
          </div>
        </section>

        <section className="performance-analytics">
          <div className="analytics-card">
            <h3>📊 {t('dashboard.performance')}</h3>
            <div className="performance-chart">
              <div className="progress-rings">
                <div className="ring-container">
                  <svg className="progress-ring" width="120" height="120">
                    <circle className="progress-ring-bg" stroke="#e6e6e6" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60" />
                    <circle className="progress-ring-fill" stroke="#4CAF50" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52 * (1 - (stats.approved / (stats.approved + stats.rejected + stats.pending) || 0))}`}
                      transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="ring-label">
                    <span className="ring-value">{Math.round((stats.approved / (stats.approved + stats.rejected + stats.pending) || 0) * 100)}%</span>
                    <span className="ring-text">{t('dashboard.approval_rate')}</span>
                  </div>
                </div>
                <div className="performance-stats">
                  <div className="perf-stat">
                    <span className="perf-label">Efficiency</span>
                    <div className="perf-bar"><div className="perf-fill" style={{ width: `${Math.min((stats.today / 10) * 100, 100)}%` }}></div></div>
                    <span className="perf-value">{stats.today}/10 {t('dashboard.daily_target')}</span>
                  </div>
                  <div className="perf-stat">
                    <span className="perf-label">Workload</span>
                    <div className="perf-bar"><div className="perf-fill workload" style={{ width: `${Math.min((stats.pending / 50) * 100, 100)}%` }}></div></div>
                    <span className="perf-value">{stats.pending} {t('dashboard.pending_workload')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="verifications-section">
          <div className="tabs-header">
            <button className={`tab ${activeTab === 'PENDING' ? 'active' : ''}`} onClick={() => setActiveTab('PENDING')}>⏳ Pending ({applications.filter(a => a.status === 'PENDING').length})</button>
            <button className={`tab ${activeTab === 'APPROVED' ? 'active' : ''}`} onClick={() => setActiveTab('APPROVED')}>✅ Approved ({applications.filter(a => a.status === 'APPROVED').length})</button>
            <button className={`tab ${activeTab === 'REJECTED' ? 'active' : ''}`} onClick={() => setActiveTab('REJECTED')}>❌ Rejected ({applications.filter(a => a.status === 'REJECTED').length})</button>
          </div>

          {applications.filter(a => a.status === activeTab).length === 0 ? (
            <div className="no-data"><p>No {activeTab.toLowerCase()} applications.</p></div>
          ) : (
            <div className="verifications-list">
              {applications.filter(a => a.status === activeTab).map((app) => (
                <div key={app.id} className="verification-card">
                  <div className="card-header">
                    <div>
                      <h3>{app.beneficiaryName}</h3>
                      <p className="scheme-name">{app.schemeName}</p>
                    </div>
                    <span className={`priority-badge ${app.priority.toLowerCase()}`}>{app.priority} Priority</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row"><span className="label">📍 {t('common.location')}:</span><span className="value">{app.location}</span></div>
                    <div className="info-row"><span className="label">📅 {t('common.applied')}:</span><span className="value">{new Date(app.applicationDate).toLocaleDateString()}</span></div>
                    <div className="info-row"><span className="label">📊 {t('common.status')}:</span><span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span></div>
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
              <h2>Verification Details</h2>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>📋 Application Information</h3>
                <p><strong>Application ID:</strong> {selectedApp.applicationId}</p>
                <p><strong>Scheme:</strong> {selectedApp.scheme?.schemeName}</p>
                <p><strong>Applied Date:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedApp.status}</p>
              </div>
              <div className="detail-section">
                <h3>👤 Beneficiary Details</h3>
                <p><strong>Name:</strong> {selectedApp.user?.fullName}</p>
                <p><strong>Aadhaar:</strong> {selectedApp.user?.aadhaarNumber}</p>
                <p><strong>Mobile:</strong> {selectedApp.user?.mobileNumber}</p>
                <p><strong>Email:</strong> {selectedApp.user?.email || 'N/A'}</p>
                <p><strong>DOB:</strong> {selectedApp.user?.dateOfBirth || 'N/A'}</p>
                <p><strong>Gender:</strong> {selectedApp.user?.gender || 'N/A'}</p>
              </div>
              <div className="detail-section">
                <h3>📍 Address Details</h3>
                <p><strong>Address:</strong> {selectedApp.user?.address}</p>
                <p><strong>Village:</strong> {selectedApp.user?.village || 'N/A'}</p>
                <p><strong>Block:</strong> {selectedApp.user?.block || 'N/A'}</p>
                <p><strong>District:</strong> {selectedApp.user?.district}</p>
                <p><strong>State:</strong> {selectedApp.user?.state}</p>
                <p><strong>Pincode:</strong> {selectedApp.user?.pincode}</p>
              </div>
              <div className="detail-section">
                <h3>💰 Eligibility Information</h3>
                <p><strong>Annual Income:</strong> ₹{selectedApp.user?.annualIncome?.toLocaleString()}</p>
                <p><strong>Caste Category:</strong> {selectedApp.user?.casteCategory}</p>
                <p><strong>Income Source:</strong> {selectedApp.user?.incomeSource}</p>
                <p><strong>Priority:</strong> <span className={`priority-badge ${selectedApp.priority?.toLowerCase()}`}>{selectedApp.priority || 'Medium'}</span></p>
              </div>
              <div className="detail-section">
                <h3>📄 Required Documents</h3>
                <div className="documents-list">
                  {selectedApp.aadhaarDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Aadhaar Card', data: selectedApp.aadhaarDoc })}>📎 Aadhaar Card - Click to View</div>}
                  {selectedApp.incomeCertDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Income Certificate', data: selectedApp.incomeCertDoc })}>📎 Income Certificate - Click to View</div>}
                  {selectedApp.communityCertDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Community Certificate', data: selectedApp.communityCertDoc })}>📎 Community Certificate - Click to View</div>}
                  {selectedApp.occupationProofDoc && <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Occupation Proof', data: selectedApp.occupationProofDoc })}>📎 Occupation Proof - Click to View</div>}
                </div>
                {(!selectedApp.aadhaarDoc && !selectedApp.incomeCertDoc && !selectedApp.communityCertDoc && !selectedApp.occupationProofDoc) && <p className="doc-note">No documents uploaded</p>}
              </div>
              <div className="detail-section">
                <h3>✍️ Verification Remarks</h3>
                <textarea placeholder="Enter field verification remarks..." rows="5" id="remarks" className="remarks-input" />
              </div>
              <div className="action-buttons">
                <button className="btn-approve" onClick={() => handleVerify(selectedApp.id, 'APPROVED', document.getElementById('remarks').value)}>✅ {t('common.approve')}</button>
                <button className="btn-reject" onClick={() => { const r = document.getElementById('remarks').value; if (!r) { toast('Please provide remarks for rejection', 'warning'); return; } handleVerify(selectedApp.id, 'REJECTED', r); }}>❌ {t('common.reject')}</button>
                <button className="btn-cancel" onClick={() => setSelectedApp(null)}>{t('common.cancel')}</button>
              </div>
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

      {successPopup && (
        <div className="success-popup">
          <div className={`success-popup-box ${successPopup.status === 'APPROVED' ? 'popup-approved' : 'popup-rejected'}`}>
            <div className="success-popup-icon">{successPopup.status === 'APPROVED' ? '✅' : '❌'}</div>
            <div className="success-popup-text">
              <strong>{successPopup.status === 'APPROVED' ? 'Application Approved!' : 'Application Rejected!'}</strong>
              <span>{successPopup.name} has been {successPopup.status.toLowerCase()} successfully.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldOfficerDashboard;
