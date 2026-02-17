import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SchemeApplication.css';

const SchemeApplication = () => {
  const navigate = useNavigate();
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [beneficiary, setBeneficiary] = useState(null);
  const [documents, setDocuments] = useState({
    aadhaar: null,
    incomeCertificate: null,
    communityCertificate: null,
    occupationProof: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [schemeId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [schemeRes, profileRes] = await Promise.all([
        fetch(`http://localhost:8080/api/beneficiary/schemes/${schemeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (schemeRes.ok) setScheme(await schemeRes.json());
      if (profileRes.ok) setBeneficiary(await profileRes.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, docType) => {
    setDocuments({ ...documents, [docType]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!window.confirm('Are you sure you want to submit this application?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/beneficiary/apply/${schemeId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        window.location.href = '/beneficiary/dashboard';
      } else {
        alert('Application failed: ' + await response.text());
      }
    } catch (error) {
      alert('Error submitting application');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="application-page">
      <div className="application-container">
        <button className="back-btn" onClick={() => navigate('/beneficiary/dashboard')}>
          ← Back to Dashboard
        </button>

        <h1>Scheme Application Form</h1>
        
        <div className="scheme-info">
          <h2>{scheme?.schemeName}</h2>
          <p>{scheme?.schemeDescription}</p>
          <div className="benefit-highlight">
            Maximum Benefit: ₹{scheme?.maxBenefitAmount?.toLocaleString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <section className="form-section">
            <h3>Personal Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Full Name</label>
                <input type="text" value={beneficiary?.fullName || ''} disabled />
              </div>
              <div className="detail-item">
                <label>Mobile Number</label>
                <input type="text" value={beneficiary?.mobileNumber || ''} disabled />
              </div>
              <div className="detail-item">
                <label>Email</label>
                <input type="text" value={beneficiary?.email || 'N/A'} disabled />
              </div>
              <div className="detail-item">
                <label>Date of Birth</label>
                <input type="text" value={beneficiary?.dateOfBirth || 'N/A'} disabled />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Address Details</h3>
            <div className="details-grid">
              <div className="detail-item full-width">
                <label>Address</label>
                <textarea value={beneficiary?.address || ''} disabled rows="2"></textarea>
              </div>
              <div className="detail-item">
                <label>State</label>
                <input type="text" value={beneficiary?.state || ''} disabled />
              </div>
              <div className="detail-item">
                <label>District</label>
                <input type="text" value={beneficiary?.district || ''} disabled />
              </div>
              <div className="detail-item">
                <label>Pincode</label>
                <input type="text" value={beneficiary?.pincode || ''} disabled />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Eligibility Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Annual Income</label>
                <input type="text" value={`₹${beneficiary?.annualIncome?.toLocaleString() || 'N/A'}`} disabled />
              </div>
              <div className="detail-item">
                <label>Community</label>
                <input type="text" value={beneficiary?.casteCategory || ''} disabled />
              </div>
              <div className="detail-item">
                <label>Occupation</label>
                <input type="text" value={beneficiary?.incomeSource || ''} disabled />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Required Documents</h3>
            <div className="documents-grid">
              <div className="document-upload">
                <label>Aadhaar Card *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'aadhaar')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="document-upload">
                <label>Income Certificate *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'incomeCertificate')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="document-upload">
                <label>Community Certificate *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'communityCertificate')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="document-upload">
                <label>Occupation Proof *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'occupationProof')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
            </div>
          </section>

          <div className="declaration">
            <input type="checkbox" id="declare" required />
            <label htmlFor="declare">
              I hereby declare that all the information provided is true and correct to the best of my knowledge.
            </label>
          </div>

          <button type="submit" className="submit-btn">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default SchemeApplication;
