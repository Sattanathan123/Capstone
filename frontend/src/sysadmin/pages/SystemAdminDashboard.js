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
      // Mock data - replace with actual API calls
      setUsers([
        { id: 1, fullName: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'BENEFICIARY', status: 'ACTIVE', registeredDate: '2024-01-10' },
        { id: 2, fullName: 'Priya Sharma', email: 'priya@example.com', role: 'FIELD_VERIFICATION_OFFICER', status: 'ACTIVE', registeredDate: '2024-01-12' },
        { id: 3, fullName: 'Amit Singh', email: 'amit@example.com', role: 'DEPT_ADMIN', status: 'ACTIVE', registeredDate: '2024-01-15' },
        { id: 4, fullName: 'Sunita Devi', email: 'sunita@example.com', role: 'BENEFICIARY', status: 'INACTIVE', registeredDate: '2024-01-08' }
      ]);

      setSystemStats({ totalUsers: 1250, activeUsers: 1180, systemUptime: '99.9%' });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    console.log(`Toggling user ${userId} to ${newStatus}`);
    alert(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
    fetchSystemData();
  };

  const handleResetPassword = (userId) => {
    console.log(`Resetting password for user ${userId}`);
    alert('Password reset link sent to user email!');
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
                          className={`btn-toggle ${user.status === 'ACTIVE' ? 'deactivate' : 'activate'}`}
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          {user.status === 'ACTIVE' ? '🚫' : '✅'}
                        </button>
                        <button 
                          className="btn-reset"
                          onClick={() => handleResetPassword(user.id)}
                        >
                          🔑
                        </button>
                        <button 
                          className="btn-details"
                          onClick={() => setSelectedUser(user)}
                        >
                          👁️
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
              <p><strong>Role:</strong> {getRoleName(selectedUser.role)}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Registered:</strong> {new Date(selectedUser.registeredDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
