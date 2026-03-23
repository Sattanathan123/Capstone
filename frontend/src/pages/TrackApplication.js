import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TrackApplication.css';

const TrackApplication = () => {
  const [searchParams] = useSearchParams();
  const [applicationId, setApplicationId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
        <h1>{t('track.title')}</h1>
        <p>{t('track.subtitle')}</p>
      </div>
      
      <div className="search-section">
        <input
          type="text"
          placeholder={t('track.placeholder')}
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          className="track-input"
        />
        <button onClick={handleTrack} disabled={loading} className="track-button">
          {loading ? t('track.tracking') : t('track.btn')}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tracking && (
        <div className="tracking-results">
          <div className="details-card">
            <h3>{t('track.app_details')}</h3>
            <div className="detail-row">
              <span className="label">{t('track.app_id')}:</span>
              <span className="value">{tracking.applicationId}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('track.scheme')}:</span>
              <span className="value">{tracking.schemeName}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('track.applicant')}:</span>
              <span className="value">{tracking.applicantName}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('track.status')}:</span>
              <span className={`status-badge ${tracking.status.toLowerCase()}`}>
                {tracking.status}
              </span>
            </div>
            {tracking.sanctionedAmount && (
              <div className="detail-row">
                <span className="label">{t('track.sanctioned_amount')}:</span>
                <span className="value amount">₹{tracking.sanctionedAmount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="timeline-section">
            <h3>{t('track.timeline')}</h3>
            
            <div className={`timeline-step ${tracking.timeline.submitted ? 'completed' : ''}`}>
              <div className="step-marker">1</div>
              <div className="step-content">
                <h4>{t('track.step1')}</h4>
                <p>{tracking.appliedDate ? new Date(tracking.appliedDate).toLocaleString() : t('track.pending')}</p>
              </div>
            </div>

            <div className={`timeline-step ${tracking.timeline.underReview ? 'completed' : ''}`}>
              <div className="step-marker">2</div>
              <div className="step-content">
                <h4>{t('track.step2')}</h4>
                <p>{tracking.remarks || t('track.waiting')}</p>
              </div>
            </div>

            <div className={`timeline-step ${tracking.timeline.verified ? 'completed' : ''}`}>
              <div className="step-marker">3</div>
              <div className="step-content">
                <h4>{t('track.step3')}</h4>
                <p>{tracking.timeline.verified && tracking.verifiedDate ? tracking.remarks || t('track.verified') : t('track.pending')}</p>
                {tracking.verifiedDate && (
                  <small>{new Date(tracking.verifiedDate).toLocaleString()}</small>
                )}
              </div>
            </div>

            <div className={`timeline-step ${tracking.timeline.sanctioned ? 'completed' : tracking.timeline.rejected ? 'rejected' : ''}`}>
              <div className="step-marker">4</div>
              <div className="step-content">
                <h4>
                  {tracking.timeline.sanctioned ? t('track.step4_sanctioned') :
                   tracking.timeline.rejected ? t('track.step4_rejected') : t('track.step4_pending')}
                </h4>
                <p>{tracking.sanctioningRemarks || t('track.pending')}</p>
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
