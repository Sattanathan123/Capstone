import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FieldOfficerDashboard.css';

const FieldOfficerDashboard = () => {
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ today: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setOfficer(user);
      
      console.log('=== FETCHING OFFICER DATA ===');
      console.log('Officer:', user);
      console.log('Token:', token);

      // Fetch all verifications
      const verificationsRes = await fetch('http://localhost:8080/api/officer/all-verifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Response status:', verificationsRes.status);
      
      if (verificationsRes.ok) {
        const data = await verificationsRes.json();
        console.log('Raw data from API:', data);
        console.log('Number of applications:', data.length);
        
        const formattedData = data.map(app => {
          console.log('Processing app:', app.id, 'Status:', app.status);
          return {
            id: app.id,
            beneficiaryName: app.user.fullName,
            schemeName: app.scheme.schemeName,
            applicationDate: app.appliedDate,
            priority: app.priority || 'Medium',
            location: `${app.user.village || 'N/A'}, ${app.user.block || 'N/A'}`,
            status: app.status === 'PENDING_VERIFICATION' ? 'PENDING' : app.status,
            remarks: app.remarks
          };
        });
        
        console.log('Formatted data:', formattedData);
        setApplications(formattedData);
      } else {
        const errorText = await verificationsRes.text();
        console.error('API Error:', errorText);
      }

      // Fetch stats
      const statsRes = await fetch('http://localhost:8080/api/officer/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats data:', statsData);
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
      const response = await fetch(`http://localhost:8080/api/officer/application/${appId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Application data received:', {
          hasAadhaar: !!data.aadhaarDoc,
          hasIncome: !!data.incomeCertDoc,
          hasCommunity: !!data.communityCertDoc,
          hasOccupation: !!data.occupationProofDoc
        });
        setSelectedApp(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVerify = async (appId, status, remarks) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/officer/verify/${appId}`, {
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
      console.error('Error verifying:', error);
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
      <header className="officer-header">
        <div className="header-content">
          <div>
            <h1>Field Verification Officer Dashboard</h1>
            <p className="role-badge">👤 {officer?.fullName} | 📍 {officer?.assignedDistrict}, {officer?.assignedState}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card today">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.today}</h3>
              <p>Verified Today</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Verifications</p>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.approved}</h3>
              <p>Total Approved</p>
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
            <button className={`tab ${activeTab === 'PENDING' ? 'active' : ''}`} onClick={() => setActiveTab('PENDING')}>⏳ Pending ({applications.filter(app => app.status === 'PENDING').length})</button>
            <button className={`tab ${activeTab === 'APPROVED' ? 'active' : ''}`} onClick={() => setActiveTab('APPROVED')}>✅ Approved ({applications.filter(app => app.status === 'APPROVED').length})</button>
            <button className={`tab ${activeTab === 'REJECTED' ? 'active' : ''}`} onClick={() => setActiveTab('REJECTED')}>❌ Rejected ({applications.filter(app => app.status === 'REJECTED').length})</button>
          </div>
          
          <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
            Debug: Total applications loaded: {applications.length} | Active tab: {activeTab} | Filtered: {applications.filter(app => app.status === activeTab).length}
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
                    <span className={`priority-badge ${app.priority.toLowerCase()}`}>
                      {app.priority} Priority
                    </span>
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
                    <div className="info-row">
                      <span className="label">📊 Status:</span>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                    </div>
                    {app.remarks && (
                      <div className="info-row">
                        <span className="label">💬 Remarks:</span>
                        <span className="value">{app.remarks}</span>
                      </div>
                    )}
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetails(app.id)}
                    >
                      View Details
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
              </div>

              <div className="detail-section">
                <h3>📄 Required Documents</h3>
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
                {(!selectedApp.aadhaarDoc && !selectedApp.incomeCertDoc && !selectedApp.communityCertDoc && !selectedApp.occupationProofDoc) && (
                  <p className="doc-note">No documents uploaded</p>
                )}
              </div>
              
              <div className="detail-section">
                <h3>✍️ Verification Remarks</h3>
                <textarea 
                  placeholder="Enter field verification remarks (address verification, document authenticity, beneficiary interview notes, etc.)..."
                  rows="5"
                  id="remarks"
                  className="remarks-input"
                />
              </div>

              <div className="action-buttons">
                <button 
                  className="btn-approve"
                  onClick={() => {
                    const remarks = document.getElementById('remarks').value;
                    handleVerify(selectedApp.id, 'APPROVED', remarks);
                  }}
                >
                  ✅ Approve
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => {
                    const remarks = document.getElementById('remarks').value;
                    if (!remarks) {
                      alert('Please provide remarks for rejection');
                      return;
                    }
                    handleVerify(selectedApp.id, 'REJECTED', remarks);
                  }}
                >
                  ❌ Reject
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setSelectedApp(null)}
                >
                  Cancel
                </button>
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

export default FieldOfficerDashboard;
