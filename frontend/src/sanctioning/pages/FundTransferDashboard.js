import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/Toast';
import API_BASE from '../../config';
import './FundTransferDashboard.css';

const FundTransferDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [dashboard, setDashboard] = useState({ initiated: 0, processing: 0, completed: 0, failed: 0, recentTransfers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/fund-transfer/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) { window.dispatchEvent(new CustomEvent('auth-error', { detail: 401 })); return; }
      if (response.ok) setDashboard(await response.json());
    } catch (error) {
      toast('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (transferId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/fund-transfer/retry/${transferId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast('Transfer retry initiated', 'success');
        fetchDashboard();
      } else {
        toast('Failed to retry transfer', 'error');
      }
    } catch (error) {
      toast('Error retrying transfer', 'error');
    }
  };

  if (loading) return <div className="loading-screen">{t('dashboard.loading')}</div>;

  const total = dashboard.initiated + dashboard.processing + dashboard.completed + dashboard.failed;
  const rate = total ? dashboard.completed / total : 0;
  const r = 52, circ = 2 * Math.PI * r;

  return (
    <div className="fund-transfer-dashboard">
      <header className="fund-header">
        <div className="header-content">
          <div>
            <h1>Fund Transfer Dashboard</h1>
            <p>Monitor and manage fund disbursements</p>
          </div>
          <button onClick={() => navigate(-1)} className="back-btn">← {t('common.back')}</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-grid">
          <div className="stat-card initiated"><div className="stat-icon">🔄</div><div className="stat-info"><h3>{dashboard.initiated}</h3><p>Initiated</p></div></div>
          <div className="stat-card processing"><div className="stat-icon">⏳</div><div className="stat-info"><h3>{dashboard.processing}</h3><p>Processing</p></div></div>
          <div className="stat-card completed"><div className="stat-icon">✅</div><div className="stat-info"><h3>{dashboard.completed}</h3><p>Completed</p></div></div>
          <div className="stat-card failed"><div className="stat-icon">❌</div><div className="stat-info"><h3>{dashboard.failed}</h3><p>Failed</p></div></div>
        </section>

        <section className="analytics-section">
          <div className="analytics-card">
            <h3>📊 {t('dashboard.success_rate')} — Transfer Analytics</h3>
            <div className="performance-chart">
              <div className="progress-rings">
                <div className="ring-container">
                  <svg className="progress-ring" width="120" height="120">
                    <circle stroke="#e6e6e6" strokeWidth="8" fill="transparent" r={r} cx="60" cy="60" />
                    <circle stroke="#48bb78" strokeWidth="8" fill="transparent" r={r} cx="60" cy="60"
                      strokeDasharray={circ} strokeDashoffset={circ * (1 - rate)} transform="rotate(-90 60 60)" strokeLinecap="round" />
                  </svg>
                  <div className="ring-label">
                    <span className="ring-value" style={{ color: '#48bb78' }}>{Math.round(rate * 100)}%</span>
                    <span className="ring-text">{t('dashboard.success_rate')}</span>
                  </div>
                </div>
                <div className="performance-stats">
                  {[{ label: 'Initiated', val: dashboard.initiated, color: '#4299e1' },
                    { label: 'Processing', val: dashboard.processing, color: '#ed8936' },
                    { label: 'Completed', val: dashboard.completed, color: '#48bb78' },
                    { label: 'Failed', val: dashboard.failed, color: '#f56565' }]
                    .map(({ label, val, color }) => (
                      <div className="perf-stat" key={label}>
                        <span className="perf-label">{label}</span>
                        <div className="perf-bar"><div className="perf-fill" style={{ width: `${total ? Math.round((val / total) * 100) : 0}%`, background: color }}></div></div>
                        <span className="perf-value">{val} ({total ? Math.round((val / total) * 100) : 0}%)</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="transfers-section">
          <h2>Recent Transfers</h2>
          {dashboard.recentTransfers && dashboard.recentTransfers.length > 0 ? (
            <div className="transfers-table">
              <table>
                <thead>
                  <tr>
                    <th>Transfer ID</th><th>Application ID</th><th>Amount</th>
                    <th>Account Number</th><th>Status</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentTransfers.map((transfer) => (
                    <tr key={transfer.id}>
                      <td>{transfer.transferId}</td>
                      <td>{transfer.application?.applicationId || 'N/A'}</td>
                      <td>₹{transfer.amount?.toLocaleString()}</td>
                      <td>{transfer.beneficiaryAccount}</td>
                      <td><span className={`status-badge ${transfer.status.toLowerCase()}`}>{transfer.status}</span></td>
                      <td>{new Date(transfer.initiatedDate).toLocaleDateString()}</td>
                      <td>{transfer.status === 'FAILED' && <button className="retry-btn" onClick={() => handleRetry(transfer.transferId)}>Retry</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No recent transfers</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default FundTransferDashboard;
