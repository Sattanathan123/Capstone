import React, { useState } from 'react';

const TrackApplication = () => {
  const [applicationId, setApplicationId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!applicationId.trim()) {
      setError('Please enter Application ID');
      return;
    }

    setLoading(true);
    setError('');
    setTracking(null);

    try {
      const response = await fetch(`http://localhost:8080/api/track/${applicationId}`);
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

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h2>Track Your Application</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Enter Application ID (e.g., TN24000001)"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            fontSize: '16px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Tracking...' : 'Track Application'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {tracking && (
        <div>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3>Application Details</h3>
            <p><strong>Application ID:</strong> {tracking.applicationId}</p>
            <p><strong>Scheme:</strong> {tracking.schemeName}</p>
            <p><strong>Applicant:</strong> {tracking.applicantName}</p>
            <p><strong>Status:</strong> <span style={{ 
              color: tracking.status === 'SANCTIONED' ? 'green' : 
                     tracking.status === 'REJECTED' ? 'red' : 'orange',
              fontWeight: 'bold'
            }}>{tracking.status}</span></p>
            {tracking.sanctionedAmount && (
              <p><strong>Sanctioned Amount:</strong> ₹{tracking.sanctionedAmount}</p>
            )}
          </div>

          <div>
            <h3>Application Timeline</h3>
            
            <div style={{
              padding: '15px',
              margin: '10px 0',
              borderLeft: tracking.timeline.submitted ? '4px solid #28a745' : '4px solid #ddd',
              background: tracking.timeline.submitted ? '#d4edda' : '#f8f9fa'
            }}>
              <strong>1. Application Submitted</strong>
              <p>{tracking.appliedDate ? new Date(tracking.appliedDate).toLocaleString() : 'Pending'}</p>
            </div>

            <div style={{
              padding: '15px',
              margin: '10px 0',
              borderLeft: tracking.timeline.underReview ? '4px solid #28a745' : '4px solid #ddd',
              background: tracking.timeline.underReview ? '#d4edda' : '#f8f9fa'
            }}>
              <strong>2. Under Review</strong>
              <p>{tracking.remarks || 'Waiting for verification'}</p>
            </div>

            <div style={{
              padding: '15px',
              margin: '10px 0',
              borderLeft: tracking.timeline.verified ? '4px solid #28a745' : '4px solid #ddd',
              background: tracking.timeline.verified ? '#d4edda' : '#f8f9fa'
            }}>
              <strong>3. Verified by Field Officer</strong>
              <p>{tracking.verificationRemarks || 'Pending'}</p>
              {tracking.verifiedDate && <p><small>{new Date(tracking.verifiedDate).toLocaleString()}</small></p>}
            </div>

            <div style={{
              padding: '15px',
              margin: '10px 0',
              borderLeft: tracking.timeline.sanctioned ? '4px solid #28a745' : 
                         tracking.timeline.rejected ? '4px solid #dc3545' : '4px solid #ddd',
              background: tracking.timeline.sanctioned ? '#d4edda' : 
                         tracking.timeline.rejected ? '#f8d7da' : '#f8f9fa'
            }}>
              <strong>4. {tracking.timeline.sanctioned ? 'Sanctioned ✓' : 
                          tracking.timeline.rejected ? 'Rejected ✗' : 'Pending Sanction'}</strong>
              <p>{tracking.sanctioningRemarks || 'Pending'}</p>
              {tracking.sanctionedDate && <p><small>{new Date(tracking.sanctionedDate).toLocaleString()}</small></p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackApplication;
