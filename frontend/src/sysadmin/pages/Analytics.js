import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0,
    totalSchemes: 0,
    totalBeneficiaries: 0,
    monthlyTrend: [],
    schemeWiseData: [],
    departmentWiseData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/sysadmin/analytics?range=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return <div className="loading-screen">Loading Analytics...</div>;
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div className="header-content">
          <div>
            <h1>Platform Analytics</h1>
            <p>Comprehensive insights and statistics</p>
          </div>
          <div className="header-actions">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-filter">
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          </div>
        </div>
      </header>

      <div className="analytics-content">
        {/* Key Metrics */}
        <section className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">📊</div>
            <div className="metric-info">
              <h3>{analytics.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="metric-card success">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <h3>{analytics.approvedApplications}</h3>
              <p>Approved</p>
              <span className="metric-percent">{calculatePercentage(analytics.approvedApplications, analytics.totalApplications)}%</span>
            </div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">⏳</div>
            <div className="metric-info">
              <h3>{analytics.pendingApplications}</h3>
              <p>Pending</p>
              <span className="metric-percent">{calculatePercentage(analytics.pendingApplications, analytics.totalApplications)}%</span>
            </div>
          </div>
          <div className="metric-card danger">
            <div className="metric-icon">❌</div>
            <div className="metric-info">
              <h3>{analytics.rejectedApplications}</h3>
              <p>Rejected</p>
              <span className="metric-percent">{calculatePercentage(analytics.rejectedApplications, analytics.totalApplications)}%</span>
            </div>
          </div>
        </section>

        {/* Overview Cards */}
        <section className="overview-section">
          <div className="overview-card">
            <h3>Total Officers</h3>
            <div className="overview-value">{analytics.totalOfficers}</div>
            <p>Field & Sanctioning Officers</p>
          </div>
          <div className="overview-card">
            <h3>Total Admins</h3>
            <div className="overview-value">{analytics.totalAdmins}</div>
            <p>Department Administrators</p>
          </div>
          <div className="overview-card">
            <h3>Total Beneficiaries</h3>
            <div className="overview-value">{analytics.totalBeneficiaries}</div>
            <p>Registered users</p>
          </div>
          <div className="overview-card">
            <h3>Success Rate</h3>
            <div className="overview-value">{calculatePercentage(analytics.approvedApplications, analytics.totalApplications)}%</div>
            <p>Application approval rate</p>
          </div>
        </section>

        {/* Role-wise User Distribution */}
        <section className="chart-section">
          <h2>User Role Distribution</h2>
          <div className="chart-container">
            {analytics.roleWiseData && analytics.roleWiseData.length > 0 ? (
              <div className="donut-chart-wrapper">
                <div className="donut-chart">
                  <svg viewBox="0 0 200 200" className="donut-svg">
                    {(() => {
                      let cumulativePercentage = 0;
                      const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
                      const totalUsers = analytics.roleWiseData.reduce((sum, role) => sum + role.count, 0);
                      return analytics.roleWiseData.map((role, index) => {
                        const percentage = (role.count / totalUsers) * 100;
                        const strokeDasharray = `${percentage} ${100 - percentage}`;
                        const strokeDashoffset = -cumulativePercentage;
                        cumulativePercentage += percentage;
                        return (
                          <circle
                            key={index}
                            cx="100"
                            cy="100"
                            r="31.83"
                            fill="transparent"
                            stroke={colors[index % colors.length]}
                            strokeWidth="25"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 100 100)"
                          />
                        );
                      });
                    })()
                    }
                  </svg>
                  <div className="donut-center">
                    <span className="total-users">{analytics.roleWiseData.reduce((sum, role) => sum + role.count, 0)}</span>
                    <span className="total-label">Total Users</span>
                  </div>
                </div>
                <div className="donut-legend">
                  {analytics.roleWiseData.map((role, index) => {
                    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
                    const totalUsers = analytics.roleWiseData.reduce((sum, r) => sum + r.count, 0);
                    return (
                      <div key={index} className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: colors[index % colors.length] }}></div>
                        <div className="legend-text">
                          <span className="legend-name">{role.role}</span>
                          <span className="legend-count">{role.count} ({((role.count / totalUsers) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No user data available</p>
            )}
          </div>
        </section>

        {/* Application Status Trend */}
        <section className="chart-section">
          <h2>Application Status Trend</h2>
          <div className="trend-chart">
            {analytics.statusTrendData && analytics.statusTrendData.length > 0 ? (
              <div className="trend-bars">
                {analytics.statusTrendData.map((status, index) => {
                  const colors = ['#4CAF50', '#FF9800', '#F44336'];
                  const maxCount = Math.max(...analytics.statusTrendData.map(s => s.count));
                  const barHeight = maxCount > 0 ? (status.count / maxCount) * 100 : 0;
                  return (
                    <div key={index} className="trend-bar-container">
                      <div className="trend-bar-wrapper">
                        <div 
                          className="trend-bar" 
                          style={{ 
                            height: `${Math.max(barHeight, 10)}%`,
                            backgroundColor: colors[index],
                            background: `linear-gradient(135deg, ${colors[index]}, ${colors[index]}dd)`
                          }}
                        >
                          <div className="bar-value">{status.count}</div>
                        </div>
                      </div>
                      <div className="trend-label">
                        <span className="status-name">{status.status}</span>
                        <span className="status-percent">{status.percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No trend data available</p>
            )}
          </div>
        </section>

        {/* Application Status Distribution */}
        <section className="chart-section">
          <h2>Application Status Distribution</h2>
          <div className="status-distribution">
            <div className="status-item">
              <div className="status-bar approved" style={{ height: `${calculatePercentage(analytics.approvedApplications, analytics.totalApplications)}%` }}>
                <span className="status-label">Approved<br/>{analytics.approvedApplications}</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-bar pending" style={{ height: `${calculatePercentage(analytics.pendingApplications, analytics.totalApplications)}%` }}>
                <span className="status-label">Pending<br/>{analytics.pendingApplications}</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-bar rejected" style={{ height: `${calculatePercentage(analytics.rejectedApplications, analytics.totalApplications)}%` }}>
                <span className="status-label">Rejected<br/>{analytics.rejectedApplications}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
