import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeptAnalytics.css';

const DeptAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0,
    mySchemes: 0,
    activeSchemes: 0,
    schemeWiseData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching analytics with token:', token);
      const response = await fetch(`http://localhost:8080/api/admin/analytics?range=${timeRange}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Analytics response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics data received:', data);
        setAnalytics(data);
      } else {
        console.error('Failed to fetch analytics:', response.statusText);
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
            <h1>Department Analytics</h1>
            <p>Your schemes performance and insights</p>
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
              <h3>{analytics.totalApplications || 0}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="metric-card success">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <h3>{analytics.approvedApplications || 0}</h3>
              <p>Approved</p>
              <span className="metric-percent">{calculatePercentage(analytics.approvedApplications, analytics.totalApplications)}%</span>
            </div>
          </div>
          <div className="metric-card warning">
            <div className="metric-icon">⏳</div>
            <div className="metric-info">
              <h3>{analytics.pendingApplications || 0}</h3>
              <p>Pending</p>
              <span className="metric-percent">{calculatePercentage(analytics.pendingApplications, analytics.totalApplications)}%</span>
            </div>
          </div>
          <div className="metric-card danger">
            <div className="metric-icon">❌</div>
            <div className="metric-info">
              <h3>{analytics.rejectedApplications || 0}</h3>
              <p>Rejected</p>
              <span className="metric-percent">{calculatePercentage(analytics.rejectedApplications, analytics.totalApplications)}%</span>
            </div>
          </div>
        </section>

        {/* Overview Cards */}
        <section className="overview-section">
          <div className="overview-card">
            <h3>My Schemes</h3>
            <div className="overview-value">{analytics.mySchemes || 0}</div>
            <p>Total schemes managed</p>
          </div>
          <div className="overview-card">
            <h3>Active Schemes</h3>
            <div className="overview-value">{analytics.activeSchemes || 0}</div>
            <p>Currently running</p>
          </div>
          <div className="overview-card">
            <h3>Success Rate</h3>
            <div className="overview-value">{calculatePercentage(analytics.approvedApplications, analytics.totalApplications)}%</div>
            <p>Application approval rate</p>
          </div>
        </section>

        {/* Scheme-wise Performance */}
        <section className="chart-section">
          <h2>Scheme-wise Application Distribution</h2>
          <div className="chart-container">
            {analytics.schemeWiseData && analytics.schemeWiseData.length > 0 ? (
              <div className="simple-bar-chart">
                {analytics.schemeWiseData.map((scheme, index) => {
                  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
                  const percentage = calculatePercentage(scheme.applicationCount, analytics.totalApplications);
                  return (
                    <div key={index} className="bar-item">
                      <div className="bar-info">
                        <span className="bar-label">{scheme.schemeName}</span>
                        <span className="bar-value">{scheme.applicationCount}</span>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: colors[index % colors.length]
                          }}
                        ></div>
                      </div>
                      <span className="bar-percent">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-data">
                <p>📊 No scheme data available</p>
              </div>
            )}}
          </div>
        </section>

        {/* Application Status Distribution */}
        <section className="chart-section">
          <h2>Application Status Distribution</h2>
          <div className="status-distribution">
            <div className="status-item">
              <div className="status-bar approved" style={{ height: `${Math.max(calculatePercentage(analytics.approvedApplications, analytics.totalApplications), 10)}%` }}>
                <span className="status-label">Approved<br/>{analytics.approvedApplications}</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-bar pending" style={{ height: `${Math.max(calculatePercentage(analytics.pendingApplications, analytics.totalApplications), 10)}%` }}>
                <span className="status-label">Pending<br/>{analytics.pendingApplications}</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-bar rejected" style={{ height: `${Math.max(calculatePercentage(analytics.rejectedApplications, analytics.totalApplications), 10)}%` }}>
                <span className="status-label">Rejected<br/>{analytics.rejectedApplications}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeptAnalytics;
