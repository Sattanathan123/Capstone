import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SanctioningDashboard.css';

const SanctioningDashboard = () => {
  const navigate = useNavigate();
  const [authority, setAuthority] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, sanctioned: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setAuthority(user);

      const appsRes = await fetch('http://localhost:8080/api/sanctioning/pending-sanctions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data);
      }

      const statsRes = await fetch('http://localhost:8080/api/sanctioning/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSanction = async (appId, status, remarks, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/sanctioning/sanction/${appId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, remarks, amount })
      });

      if (response.ok) {
        alert(`Application ${status} successfully!`);
        setSelectedApp(null);
        fetchData();
      } else {
        alert('Failed to update application');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
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
    <div className="sanctioning-dashboard">
      <header className="sanctioning-header">
        <div className="header-content">
          <div>
            <h1>Scheme Sanctioning Authority Dashboard</h1>
            <p className="role-badge">👤 {authority?.fullName} | 📍 {authority?.assignedDistrict}, {authority?.assignedState}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.today}</h3>
              <p>Sanctioned Today</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Sanctions</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.sanctioned}</h3>
              <p>Total Sanctioned</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{stats.rejected}</h3>
              <p>Total Rejected</p>
            </div>
          </div>
        </section>

        <section className="applications-section">
          <h2>💰 Approved Applications - Pending Sanction</h2>
          
          {applications.length === 0 ? (
            <div className="no-data">
              <p>No applications pending sanction from your district.</p>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="card-header">
                    <div>
                      <h3>{app.user.fullName}</h3>
                      <p className="scheme-name">{app.scheme.schemeName}</p>
                    </div>
                    <span className="status-badge approved">APPROVED</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">📍 District:</span>
                      <span className="value">{app.user.district}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📅 Applied:</span>
                      <span className="value">{new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">💬 Verification Remarks:</span>
                      <span className="value">{app.remarks || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-view" onClick={() => setSelectedApp(app)}>
                      Review & Sanction
                    </button>
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
              <div className="detail-section">
                <h3>Beneficiary Information</h3>
                <p><strong>Name:</strong> {selectedApp.user.fullName}</p>
                <p><strong>District:</strong> {selectedApp.user.district}</p>
                <p><strong>Scheme:</strong> {selectedApp.scheme.schemeName}</p>
                <p><strong>Applied:</strong> {new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
              </div>
              
              <div className="detail-section">
                <h3>Sanction Amount (₹)</h3>
                <input 
                  type="number" 
                  id="amount"
                  placeholder="Enter sanction amount"
                  className="amount-input"
                />
              </div>

              <div className="detail-section">
                <h3>Remarks</h3>
                <textarea 
                  placeholder="Enter your remarks..."
                  rows="4"
                  id="remarks"
                  className="remarks-input"
                />
              </div>

              <div className="action-buttons">
                <button 
                  className="btn-sanction"
                  onClick={() => {
                    const amount = document.getElementById('amount').value;
                    const remarks = document.getElementById('remarks').value;
                    if (!amount) {
                      alert('Please enter sanction amount');
                      return;
                    }
                    handleSanction(selectedApp.id, 'SANCTIONED', remarks, amount);
                  }}
                >
                  ✅ Sanction
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => {
                    const remarks = document.getElementById('remarks').value;
                    if (!remarks) {
                      alert('Please provide remarks for rejection');
                      return;
                    }
                    handleSanction(selectedApp.id, 'REJECTED', remarks, null);
                  }}
                >
                  ❌ Reject
                </button>
                <button className="btn-cancel" onClick={() => setSelectedApp(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanctioningDashboard;
