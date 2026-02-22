import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SanctioningOfficerDashboard.css';

const SanctioningOfficerDashboard = () => {
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, sanctioned: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('APPROVED');

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setOfficer(user);

      const appsRes = await fetch('http://localhost:8080/api/sanctioning/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (appsRes.ok) {
        const data = await appsRes.json();
        const formattedData = data.map(app => ({
          id: app.id,
          beneficiaryName: app.user.fullName,
          schemeName: app.scheme.schemeName,
          applicationDate: app.appliedDate,
          location: `${app.user.village || 'N/A'}, ${app.user.block || 'N/A'}`,
          status: app.status,
          remarks: app.remarks,
          verificationRemarks: app.verificationRemarks
        }));
        setApplications(formattedData);
      }

      const statsRes = await fetch('http://localhost:8080/api/sanctioning/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/sanctioning/application/${appId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedApp(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSanction = async (appId, status, remarks) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/sanctioning/sanction/${appId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, remarks })
      });

      if (response.ok) {
        alert(`Application ${status} successfully!`);
        setSelectedApp(null);
        fetchOfficerData();
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
    <div className="officer-dashboard">
      <header className="officer-header sanctioning">
        <div className="header-content">
          <div>
            <h1>Sanctioning Officer Dashboard</h1>
            <p className="role-badge">👤 {officer?.fullName} | 📍 {officer?.assignedDistrict}, {officer?.assignedState}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.today}</h3>
              <p>Sanctioned Today</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Sanctions</p>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.sanctioned}</h3>
              <p>Total Sanctioned</p>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{stats.rejected}</h3>
              <p>Total Rejected</p>
            </div>
          </div>
        </section>

        <section className="verifications-section">
          <div className="tabs-header">
            <button className={`tab ${activeTab === 'APPROVED' ? 'active' : ''}`} onClick={() => setActiveTab('APPROVED')}>⏳ Pending Sanction</button>
            <button className={`tab ${activeTab === 'SANCTIONED' ? 'active' : ''}`} onClick={() => setActiveTab('SANCTIONED')}>✅ Sanctioned</button>
            <button className={`tab ${activeTab === 'REJECTED' ? 'active' : ''}`} onClick={() => setActiveTab('REJECTED')}>❌ Rejected</button>
          </div>
          
          {applications.filter(app => app.status === activeTab).length === 0 ? (
            <div className="no-data">
              <p>No {activeTab.toLowerCase()} applications.</p>
            </div>
          ) : (
            <div className="verifications-list">
              {applications.filter(app => app.status === activeTab).map((app) => (
                <div key={app.id} className="verification-card">
                  <div className="card-header">
                    <div>
                      <h3>{app.beneficiaryName}</h3>
                      <p className="scheme-name">{app.schemeName}</p>
                    </div>
                    <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">📍 Location:</span>
                      <span className="value">{app.location}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📅 Applied:</span>
                      <span className="value">{new Date(app.applicationDate).toLocaleDateString()}</span>
                    </div>
                    {app.verificationRemarks && (
                      <div className="info-row">
                        <span className="label">🔍 Verification:</span>
                        <span className="value">{app.verificationRemarks}</span>
                      </div>
                    )}
                    {app.remarks && (
                      <div className="info-row">
                        <span className="label">💬 Remarks:</span>
                        <span className="value">{app.remarks}</span>
                      </div>
                    )}
                  </div>
                  <div className="card-actions">
                    <button className="btn-view" onClick={() => handleViewDetails(app.id)}>View Details</button>
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
              </div>

              <div className="detail-section">
                <h3>📍 Address Details</h3>
                <p><strong>Address:</strong> {selectedApp.user?.address}</p>
                <p><strong>District:</strong> {selectedApp.user?.district}</p>
                <p><strong>State:</strong> {selectedApp.user?.state}</p>
              </div>

              <div className="detail-section">
                <h3>💰 Eligibility Information</h3>
                <p><strong>Annual Income:</strong> ₹{selectedApp.user?.annualIncome?.toLocaleString()}</p>
                <p><strong>Caste Category:</strong> {selectedApp.user?.casteCategory}</p>
              </div>

              <div className="detail-section">
                <h3>📄 Documents</h3>
                <div className="documents-list">
                  {selectedApp.aadhaarDoc && (
                    <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Aadhaar Card', data: selectedApp.aadhaarDoc })}>
                      📎 Aadhaar Card - Click to View
                    </div>
                  )}
                  {selectedApp.incomeCertDoc && (
                    <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Income Certificate', data: selectedApp.incomeCertDoc })}>
                      📎 Income Certificate - Click to View
                    </div>
                  )}
                  {selectedApp.communityCertDoc && (
                    <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Community Certificate', data: selectedApp.communityCertDoc })}>
                      📎 Community Certificate - Click to View
                    </div>
                  )}
                  {selectedApp.occupationProofDoc && (
                    <div className="doc-item clickable" onClick={() => setViewingDoc({ name: 'Occupation Proof', data: selectedApp.occupationProofDoc })}>
                      📎 Occupation Proof - Click to View
                    </div>
                  )}
                </div>
              </div>

              {selectedApp.verificationRemarks && (
                <div className="detail-section">
                  <h3>🔍 Field Verification Remarks</h3>
                  <p className="remarks-display">{selectedApp.verificationRemarks}</p>
                </div>
              )}
              
              {selectedApp.status === 'APPROVED' && (
                <>
                  <div className="detail-section">
                    <h3>✍️ Sanction Remarks</h3>
                    <textarea 
                      placeholder="Enter sanction remarks..."
                      rows="4"
                      id="remarks"
                      className="remarks-input"
                    />
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn-approve"
                      onClick={() => {
                        const remarks = document.getElementById('remarks').value;
                        handleSanction(selectedApp.id, 'SANCTIONED', remarks);
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
                        handleSanction(selectedApp.id, 'REJECTED', remarks);
                      }}
                    >
                      ❌ Reject
                    </button>
                    <button className="btn-cancel" onClick={() => setSelectedApp(null)}>Cancel</button>
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
              <iframe
                src={viewingDoc.data}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={viewingDoc.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanctioningOfficerDashboard;
