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
    <div className="track-page">
      <div className="track-hero">
        <h1>{t('track.title')}</h1>
        <p>{t('track.subtitle')}</p>
        <div className="search-box">
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
      </div>

      <div className="track-body">
        {error && <div className="error-message">{error}</div>}

        {!tracking && !error && (
          <div className="track-empty">
            <div className="track-empty-icon">🔍</div>
            <h3>Enter your Application ID above to track status</h3>
            <p>e.g. TN24000001</p>
          </div>
        )}

        {tracking && (
          <div className="tracking-results">

            {/* Status Banner */}
            <div className={`status-banner status-banner--${tracking.status.toLowerCase()}`}>
              <span className="status-banner-icon">
                {['SANCTIONED','APPROVED','DISBURSED'].includes(tracking.status) ? '✅' :
                 tracking.status === 'REJECTED' ? '❌' :
                 tracking.status === 'FRAUD' ? '🚨' : '⏳'}
              </span>
              <div>
                <div className="status-banner-label">Current Status</div>
                <div className="status-banner-value">{tracking.status.replace(/_/g,' ')}</div>
              </div>
            </div>

            {/* Details Card */}
            <div className="details-card">
              <div className="details-card-header">
                <span>📄</span>
                <h3>{t('track.app_details')}</h3>
              </div>
              <div className="details-card-body">
                <div className="detail-row">
                  <span className="label">{t('track.app_id')}</span>
                  <span className="value">{tracking.applicationId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">{t('track.scheme')}</span>
                  <span className="value">{tracking.schemeName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">{t('track.applicant')}</span>
                  <span className="value">{tracking.applicantName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">{t('track.status')}</span>
                  <span className={`status-badge ${tracking.status.toLowerCase()}`}>{tracking.status.replace(/_/g,' ')}</span>
                </div>
                {tracking.sanctionedAmount && (
                  <div className="detail-row">
                    <span className="label">{t('track.sanctioned_amount')}</span>
                    <span className="value amount">₹{tracking.sanctionedAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="stepper-section">
              <div className="stepper-header">
                <span>🗓️</span>
                <h3>{t('track.timeline')}</h3>
              </div>
              <div className="stepper-body">
                {[
                  {
                    icon: '📝',
                    label: t('track.step1'),
                    state: tracking.timeline.submitted ? 'completed' : 'pending',
                    info: tracking.appliedDate ? new Date(tracking.appliedDate).toLocaleString() : null
                  },
                  {
                    icon: '🔍',
                    label: t('track.step2'),
                    state: tracking.timeline.underReview ? 'completed' : tracking.timeline.submitted ? 'active' : 'pending',
                    info: tracking.timeline.underReview ? (tracking.remarks || t('track.verified')) : tracking.timeline.submitted ? t('track.waiting') : null
                  },
                  {
                    icon: tracking.timeline.rejectedByFieldOfficer ? '❌' : '📋',
                    label: tracking.timeline.rejectedByFieldOfficer ? '❌ Rejected by Field Officer' : t('track.step3'),
                    state: tracking.timeline.rejectedByFieldOfficer ? 'rejected' : tracking.timeline.verified ? 'completed' : tracking.timeline.underReview ? 'active' : 'pending',
                    info: tracking.timeline.rejectedByFieldOfficer ? (tracking.remarks || 'Rejected by Field Verification Officer') : tracking.timeline.verified ? (tracking.verifiedDate ? new Date(tracking.verifiedDate).toLocaleString() : t('track.verified')) : tracking.timeline.underReview ? t('track.waiting') : null
                  },
                  {
                    icon: tracking.timeline.sanctioned ? '🎉' : tracking.timeline.rejected ? '❌' : '⏳',
                    label: tracking.timeline.sanctioned ? 'Verified by Sanctioning Officer ✓' : tracking.timeline.rejectedBySanctioning ? 'Rejected by Sanctioning Officer ✗' : tracking.timeline.rejectedByFieldOfficer ? 'Rejected by Sanctioning Officer ✗' : t('track.step4_pending'),
                    state: tracking.timeline.sanctioned ? 'completed' : tracking.timeline.rejected ? 'rejected' : tracking.timeline.verified ? 'active' : 'pending',
                    info: tracking.timeline.sanctioned ? (tracking.sanctionedDate ? new Date(tracking.sanctionedDate).toLocaleString() : null) : tracking.timeline.rejected ? (tracking.remarks || null) : tracking.timeline.verified ? t('track.waiting') : null
                  }
                ].map((step, i, arr) => (
                  <div key={i} className="stepper-item">
                    <div className="stepper-left">
                      <div className={`stepper-circle stepper-circle--${step.state}`}>
                        <span>{step.icon}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`stepper-line stepper-line--${step.state === 'completed' ? 'completed' : 'pending'}`} />
                      )}
                    </div>
                    <div className={`stepper-content stepper-content--${step.state}`}>
                      <div className="stepper-step-label">{step.label}</div>
                      {step.info && <div className="stepper-step-info">{step.info}</div>}
                      <span className={`stepper-badge stepper-badge--${step.state}`}>
                        {step.state === 'completed' ? '✓ Done' : step.state === 'active' ? '● In Progress' : step.state === 'rejected' ? '✗ Rejected' : '○ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;
