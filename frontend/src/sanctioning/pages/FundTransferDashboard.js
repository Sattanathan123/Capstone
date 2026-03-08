import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FundTransferDashboard.css';

const FundTransferDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    initiated: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    recentTransfers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/fund-transfer/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (transferId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/fund-transfer/retry/${transferId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Transfer retry initiated');
        fetchDashboard();
      }
    } catch (error) {
      console.error('Error retrying transfer:', error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading Fund Transfer Dashboard...</div>;
  }

  return (
    <div className="fund-transfer-dashboard">
      <header className="fund-header">
        <div className="header-content">
          <div>
            <h1>Fund Transfer Dashboard</h1>
            <p>Monitor and manage fund disbursements</p>
          </div>
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-grid">
          <div className="stat-card initiated">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{dashboard.initiated}</h3>
              <p>Initiated</p>
            </div>
          </div>
          <div className="stat-card processing">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{dashboard.processing}</h3>
              <p>Processing</p>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{dashboard.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card failed">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{dashboard.failed}</h3>
              <p>Failed</p>
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
                    <th>Transfer ID</th>
                    <th>Application ID</th>
                    <th>Amount</th>
                    <th>Account Number</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentTransfers.map((transfer) => (
                    <tr key={transfer.id}>
                      <td>{transfer.transferId}</td>
                      <td>{transfer.application?.applicationId || 'N/A'}</td>
                      <td>₹{transfer.amount?.toLocaleString()}</td>
                      <td>{transfer.beneficiaryAccount}</td>
                      <td>
                        <span className={`status-badge ${transfer.status.toLowerCase()}`}>
                          {transfer.status}
                        </span>
                      </td>
                      <td>{new Date(transfer.initiatedDate).toLocaleDateString()}</td>
                      <td>
                        {transfer.status === 'FAILED' && (
                          <button 
                            className="retry-btn"
                            onClick={() => handleRetry(transfer.transferId)}
                          >
                            Retry
                          </button>
                        )}
                      </td>
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
