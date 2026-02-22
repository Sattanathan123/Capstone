import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SystemAdminDashboard.css';

const SystemAdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({ totalUsers: 0, activeUsers: 0, systemUptime: '99.9%' });
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('http://localhost:8080/api/sysadmin/users'),
        fetch('http://localhost:8080/api/sysadmin/stats')
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData);
      setSystemStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/sysadmin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('User deleted successfully!');
        fetchSystemData();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/sysadmin/users/${userId}`);
      const userData = await response.json();
      setSelectedUser(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to load user details');
    }
  };

  const getRoleName = (role) => {
    const roleNames = {
      'BENEFICIARY': 'Beneficiary',
      'FIELD_VERIFICATION_OFFICER': 'Field Officer',
      'DEPT_ADMIN': 'Dept Admin',
      'SYSTEM_ADMIN': 'System Admin',
      'MONITORING_AUDIT_OFFICER': 'Monitoring Officer',
      'SCHEME_SANCTIONING_AUTHORITY': 'Sanctioning Authority'
    };
    return roleNames[role] || role;
  };

  const filteredUsers = filterRole === 'ALL' ? users : users.filter(u => u.role === filterRole);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="sysadmin-dashboard">
      <header className="sysadmin-header">
        <div className="header-content">
          <div>
            <h1>System Administrator Dashboard</h1>
            <p className="role-badge">⚙️ Full System Access</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{systemStats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{systemStats.activeUsers}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <h3>{systemStats.systemUptime}</h3>
              <p>System Uptime</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-info">
              <h3>Secure</h3>
              <p>Security Status</p>
            </div>
          </div>
        </section>

        <section className="users-section">
          <div className="section-header">
            <h2>👤 User Management</h2>
            <div className="filter-controls">
              <label>Filter by Role:</label>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="ALL">All Roles</option>
                <option value="BENEFICIARY">Beneficiary</option>
                <option value="FIELD_VERIFICATION_OFFICER">Field Officer</option>
                <option value="DEPT_ADMIN">Dept Admin</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
                <option value="MONITORING_AUDIT_OFFICER">Monitoring Officer</option>
                <option value="SCHEME_SANCTIONING_AUTHORITY">Sanctioning Authority</option>
              </select>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-badge-table">{getRoleName(user.role)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button 
                          className="btn-details"
                          onClick={() => handleViewDetails(user.id)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user.id, user.fullName)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="audit-section">
          <h2>📋 Recent Audit Logs</h2>
          <div className="audit-logs">
            <div className="log-item">
              <span className="log-time">2024-01-20 10:30 AM</span>
              <span className="log-action">User Login</span>
              <span className="log-user">rajesh@example.com</span>
            </div>
            <div className="log-item">
              <span className="log-time">2024-01-20 10:15 AM</span>
              <span className="log-action">User Deactivated</span>
              <span className="log-user">admin@example.com</span>
            </div>
            <div className="log-item">
              <span className="log-time">2024-01-20 09:45 AM</span>
              <span className="log-action">Password Reset</span>
              <span className="log-user">priya@example.com</span>
            </div>
          </div>
        </section>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Mobile:</strong> {selectedUser.mobileNumber}</p>
              <p><strong>Role:</strong> {getRoleName(selectedUser.role)}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Date of Birth:</strong> {selectedUser.dateOfBirth}</p>
              <p><strong>Caste Category:</strong> {selectedUser.casteCategory}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>State:</strong> {selectedUser.state}</p>
              <p><strong>District:</strong> {selectedUser.district}</p>
              <p><strong>Pincode:</strong> {selectedUser.pincode}</p>
              <p><strong>Annual Income:</strong> ₹{selectedUser.annualIncome?.toLocaleString()}</p>
              <p><strong>Registered:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
