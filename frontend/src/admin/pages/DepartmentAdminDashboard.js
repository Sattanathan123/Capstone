import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSchemeForm from '../components/AddSchemeForm';
import './DepartmentAdminDashboard.css';

const DepartmentAdminDashboard = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || '');
    fetchSchemes();
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/feedback/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setFeedbacks(await response.json());
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchSchemes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/schemes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSchemes(data);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScheme = async (schemeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/schemes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(schemeData)
      });

      if (response.ok) {
        alert('Scheme added successfully!');
        setShowAddForm(false);
        fetchSchemes();
      } else {
        alert('Failed to add scheme');
      }
    } catch (error) {
      console.error('Error adding scheme:', error);
      alert('Error adding scheme');
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/schemes/${schemeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Scheme deleted successfully!');
        fetchSchemes();
      } else {
        alert('Failed to delete scheme');
      }
    } catch (error) {
      console.error('Error deleting scheme:', error);
      alert('Error deleting scheme');
    }
  };

  const getRoleName = (role) => {
    const roleNames = {
      'DEPT_ADMIN': 'Department Admin',
      'FIELD_VERIFICATION_OFFICER': 'Field Verification Officer',
      'SYSTEM_ADMIN': 'System Administrator',
      'MONITORING_AUDIT_OFFICER': 'Monitoring & Audit Officer',
      'SCHEME_SANCTIONING_AUTHORITY': 'Scheme Sanctioning Authority'
    };
    return roleNames[role] || role;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="role-badge">Role: {getRoleName(userRole)}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {userRole === 'DEPT_ADMIN' && (
          <div className="action-bar">
            <button className="add-scheme-btn" onClick={() => setShowAddForm(true)}>+ Add New Scheme</button>
            <button className="analytics-btn" onClick={() => navigate('/admin/analytics')}>📊 View Analytics</button>
            <button className="feedback-view-btn" onClick={() => setShowFeedbacks(!showFeedbacks)}>
              ⭐ Feedbacks {feedbacks.length > 0 && <span className="badge">{feedbacks.length}</span>}
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AddSchemeForm 
                onSubmit={handleAddScheme}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {showFeedbacks && (
          <div className="feedback-section">
            <h2>⭐ Beneficiary Feedbacks ({feedbacks.length})</h2>
            {feedbacks.length === 0 ? (
              <p className="no-schemes">No feedbacks yet.</p>
            ) : (
              <div className="feedback-cards">
                {feedbacks.map(f => (
                  <div key={f.id} className="feedback-card">
                    <div className="feedback-card-header">
                      <div>
                        <h3>{f.beneficiaryName}</h3>
                        <p>{f.district} | {f.schemeName}</p>
                      </div>
                      <div className="feedback-rating">{'⭐'.repeat(f.rating)}</div>
                    </div>
                    <div className="feedback-card-body">
                      <div className="feedback-row">
                        <span className="feedback-label">💰 Amount Spent On:</span>
                        <span>{f.amountSpentOn || 'Not specified'}</span>
                      </div>
                      <div className="feedback-row">
                        <span className="feedback-label">🎯 Benefit Received:</span>
                        <span>{f.benefitReceived || 'Not specified'}</span>
                      </div>
                      <div className="feedback-row">
                        <span className="feedback-label">👍 Would Recommend:</span>
                        <span>{f.wouldRecommend === true ? '✅ Yes' : f.wouldRecommend === false ? '❌ No' : 'Not answered'}</span>
                      </div>
                      {f.suggestions && (
                        <div className="feedback-row">
                          <span className="feedback-label">💡 Suggestions:</span>
                          <span>{f.suggestions}</span>
                        </div>
                      )}
                      {f.comments && (
                        <div className="feedback-row">
                          <span className="feedback-label">💬 Comments:</span>
                          <span>{f.comments}</span>
                        </div>
                      )}
                      <div className="feedback-row">
                        <span className="feedback-label">📅 Date:</span>
                        <span>{new Date(f.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="schemes-section">
          <h2>Scheme List</h2>
          
          {loading ? (
            <p className="loading">Loading schemes...</p>
          ) : schemes.length === 0 ? (
            <p className="no-schemes">No schemes available. Add a new scheme to get started.</p>
          ) : (
            <table className="schemes-table">
              <thead>
                <tr>
                  <th>Scheme Name</th>
                  <th>Scheme Component</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((scheme) => (
                  <tr key={scheme.id}>
                    <td>{scheme.schemeName}</td>
                    <td>
                      <span className="component-badge">
                        {scheme.schemeComponent}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${scheme.status.toLowerCase()}`}>
                        {scheme.status}
                      </span>
                    </td>
                    <td>
                      {userRole === 'DEPT_ADMIN' && (
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteScheme(scheme.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentAdminDashboard;
