import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/Toast';
import API_BASE from '../../config';
import './SanctioningDashboard.css';

const SanctioningDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [authority, setAuthority] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, sanctioned: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setAuthority(user);

      const appsRes = await fetch(`${API_BASE}/api/sanctioning/pending-sanctions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (appsRes.status === 401) { window.dispatchEvent(new CustomEvent('auth-error', { detail: 401 })); return; }
      if (appsRes.ok) setApplications(await appsRes.json());

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

  const handleSanction = async (appId, status, remarks, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/sanctioning/sanction/${appId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks, amount })
      });
      if (response.ok) {
        toast(`Application ${status} successfully!`, 'success');
        setSelectedApp(null);
        fetchData();
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
    <div className="sanctioning-dashboard">
      <header className="sanctioning-header">
        <div className="header-content">
          <div>
            <h1>Scheme Sanctioning Authority Dashboard</h1>
            <p className="role-badge">👤 {authority?.fullName} | 📍 {authority?.assignedDistrict}, {authority?.assignedState}</p>
          </div>
          <div className="header-actions">
            <button className="fund-transfer-btn" onClick={() => navigate('/sanctioning/fund-transfer')}>💰 Fund Transfers</button>
            <button className="logout-btn" onClick={handleLogout}>{t('dashboard.logout')}</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-info"><h3>{stats.today}</h3><p>{t('dashboard.sanctioned_today')}</p></div></div>
          <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-info"><h3>{stats.pending}</h3><p>{t('dashboard.pending_sanctions')}</p></div></div>
          <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-info"><h3>{stats.sanctioned}</h3><p>{t('dashboard.total_sanctioned')}</p></div></div>
          <div className="stat-card"><div className="stat-icon">❌</div><div className="stat-info"><h3>{stats.rejected}</h3><p>{t('dashboard.total_rejected')}</p></div></div>
        </section>

        <section className="analytics-section">
          <div className="analytics-card">
            <h3>📊 {t('dashboard.performance')}</h3>
            <div className="performance-chart">
              <div className="progress-rings">
                <div className="ring-container">
                  <svg className="progress-ring" width="120" height="120">
                    <circle stroke="#e6e6e6" strokeWidth="8" fill="transparent" r={r} cx="60" cy="60" />
                    <circle stroke="#27ae60" strokeWidth="8" fill="transparent" r={r} cx="60" cy="60"
                      strokeDasharray={circ} strokeDashoffset={circ * (1 - rate)} transform="rotate(-90 60 60)" strokeLinecap="round" />
                  </svg>
                  <div className="ring-label">
                    <span className="ring-value" style={{ color: '#27ae60' }}>{Math.round(rate * 100)}%</span>
                    <span className="ring-text">{t('dashboard.sanction_rate')}</span>
                  </div>
                </div>
                <div className="performance-stats">
                  {[{ label: t('dashboard.sanctioned_today'), val: stats.today, max: 10, color: '#27ae60' },
                    { label: t('dashboard.pending_sanctions'), val: stats.pending, max: 50, color: '#ed8936' },
                    { label: t('dashboard.total_sanctioned'), val: stats.sanctioned, max: Math.max(stats.sanctioned + stats.rejected, 1), color: '#4299e1' }]
                    .map(({ label, val, max, color }) => (
                      <div className="perf-stat" key={label}>
                        <span className="perf-label">{label}</span>
                        <div className="perf-bar"><div className="perf-fill" style={{ width: `${Math.min((val / max) * 100, 100)}%`, background: color }}></div></div>
                        <span className="perf-value">{val}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="applications-section">
          <h2>💰 Approved Applications - Pending Sanction</h2>
          {applications.length === 0 ? (
            <div className="no-data"><p>No applications pending sanction from your district.</p></div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="card-header">
                    <div><h3>{app.user.fullName}</h3><p className="scheme-name">{app.scheme.schemeName}</p></div>
                    <span className="status-badge approved">APPROVED</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row"><span className="label">📍 District:</span><span className="value">{app.user.district}</span></div>
                    <div className="info-row"><span className="label">📅 Applied:</span><span className="value">{new Date(app.appliedDate).toLocaleDateString()}</span></div>
                    <div className="info-row"><span className="label">💬 Verification Remarks:</span><span className="value">{app.remarks || 'N/A'}</span></div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-view" onClick={() => setSelectedApp(app)}>{t('dashboard.view_details')}</button>
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
              <h2>Sanction Application</h2>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section"><h3>Beneficiary Information</h3>
                <p><strong>Name:</strong> {selectedApp.user.fullName}</p>
                <p><strong>District:</strong> {selectedApp.user.district}</p>
                <p><strong>Scheme:</strong> {selectedApp.scheme.schemeName}</p>
                <p><strong>Applied:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="detail-section"><h3>Sanction Amount (₹)</h3>
                <input type="number" id="amount" placeholder="Enter sanction amount" className="amount-input" />
              </div>
              <div className="detail-section"><h3>Remarks</h3>
                <textarea placeholder="Enter your remarks..." rows="4" id="remarks" className="remarks-input" />
              </div>
              <div className="action-buttons">
                <button className="btn-sanction" onClick={() => { const a = document.getElementById('amount').value; const rem = document.getElementById('remarks').value; if (!a) { toast('Please enter sanction amount', 'warning'); return; } handleSanction(selectedApp.id, 'SANCTIONED', rem, a); }}>✅ {t('common.sanction')}</button>
                <button className="btn-reject" onClick={() => { const rem = document.getElementById('remarks').value; if (!rem) { toast('Please provide remarks for rejection', 'warning'); return; } handleSanction(selectedApp.id, 'REJECTED', rem, null); }}>❌ {t('common.reject')}</button>
                <button className="btn-cancel" onClick={() => setSelectedApp(null)}>{t('common.cancel')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanctioningDashboard;
