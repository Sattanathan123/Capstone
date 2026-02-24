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
            <h3>Active Schemes</h3>
            <div className="overview-value">{analytics.totalSchemes}</div>
            <p>Schemes currently running</p>
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

        {/* Scheme-wise Performance */}
        <section className="chart-section">
          <h2>Scheme-wise Performance</h2>
          <div className="scheme-list">
            {analytics.schemeWiseData && analytics.schemeWiseData.map((scheme, index) => (
              <div key={index} className="scheme-bar">
                <div className="scheme-info">
                  <span className="scheme-name">{scheme.schemeName}</span>
                  <span className="scheme-count">{scheme.applicationCount} applications</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculatePercentage(scheme.applicationCount, analytics.totalApplications)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Department-wise Statistics */}
        <section className="chart-section">
          <h2>Department-wise Statistics</h2>
          <div className="department-grid">
            {analytics.departmentWiseData && analytics.departmentWiseData.map((dept, index) => (
              <div key={index} className="department-card">
                <h4>{dept.departmentName}</h4>
                <div className="dept-stats">
                  <div className="dept-stat">
                    <span className="stat-label">Applications</span>
                    <span className="stat-value">{dept.totalApplications}</span>
                  </div>
                  <div className="dept-stat">
                    <span className="stat-label">Approved</span>
                    <span className="stat-value success">{dept.approved}</span>
                  </div>
                  <div className="dept-stat">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value warning">{dept.pending}</span>
                  </div>
                </div>
              </div>
            ))}
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
