import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TrackApplication.css';

const TrackApplication = () => {
  const [searchParams] = useSearchParams();
  const [applicationId, setApplicationId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setApplicationId(idFromUrl);
      trackApplication(idFromUrl);
    }
  }, [searchParams]);

  const trackApplication = async (id) => {
    const trackId = id || applicationId;
    if (!trackId.trim()) {
      setError('Please enter Application ID');
      return;
    }

    setLoading(true);
    setError('');
    setTracking(null);

    try {
      const response = await fetch(`http://localhost:8080/api/track/${trackId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setTracking(data);
      }
    } catch (err) {
      setError('Failed to fetch tracking information');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = () => {
    trackApplication();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  return (
    <div className="track-container">
      <div className="track-header">
        <h1>Track Your Application</h1>
        <p>Enter your Application ID to check the status</p>
      </div>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Application ID (e.g., TN24000001)"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          className="track-input"
        />
        <button onClick={handleTrack} disabled={loading} className="track-button">
          {loading ? 'Tracking...' : 'Track Application'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tracking && (
        <div className="tracking-results">
          <div className="details-card">
            <h3>Application Details</h3>
            <div className="detail-row">
              <span className="label">Application ID:</span>
              <span className="value">{tracking.applicationId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Scheme:</span>
              <span className="value">{tracking.schemeName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Applicant:</span>
              <span className="value">{tracking.applicantName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className={`status-badge ${tracking.status.toLowerCase()}`}>
                {tracking.status}
              </span>
            </div>
            {tracking.sanctionedAmount && (
              <div className="detail-row">
                <span className="label">Sanctioned Amount:</span>
                <span className="value amount">₹{tracking.sanctionedAmount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="timeline-section">
            <h3>Application Timeline</h3>
            
            <div className={`timeline-step ${tracking.timeline.submitted ? 'completed' : ''}`}>
              <div className="step-marker">1</div>
              <div className="step-content">
                <h4>Application Submitted</h4>
                <p>{tracking.appliedDate ? new Date(tracking.appliedDate).toLocaleString() : 'Pending'}</p>
              </div>
            </div>

            <div className={`timeline-step ${tracking.timeline.underReview ? 'completed' : ''}`}>
              <div className="step-marker">2</div>
              <div className="step-content">
                <h4>Under Review</h4>
                <p>{tracking.remarks || 'Waiting for verification'}</p>
              </div>
            </div>

            <div className={`timeline-step ${tracking.timeline.verified ? 'completed' : ''}`}>
              <div className="step-marker">3</div>
              <div className="step-content">
                <h4>Verified by Field Officer</h4>
                <p>{tracking.verificationRemarks || 'Pending'}</p>
                {tracking.verifiedDate && (
                  <small>{new Date(tracking.verifiedDate).toLocaleString()}</small>
                )}
              </div>
            </div>

            <div className={`timeline-step ${tracking.timeline.sanctioned ? 'completed' : tracking.timeline.rejected ? 'rejected' : ''}`}>
              <div className="step-marker">4</div>
              <div className="step-content">
                <h4>
                  {tracking.timeline.sanctioned ? 'Sanctioned ✓' : 
                   tracking.timeline.rejected ? 'Rejected ✗' : 'Pending Sanction'}
                </h4>
                <p>{tracking.sanctioningRemarks || 'Pending'}</p>
                {tracking.sanctionedDate && (
                  <small>{new Date(tracking.sanctionedDate).toLocaleString()}</small>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackApplication;
