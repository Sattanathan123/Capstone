import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/Toast';
import API_BASE from '../../config';
import './SchemeApplication.css';

const SchemeApplication = () => {
  const navigate = useNavigate();
  const { schemeId } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [scheme, setScheme] = useState(null);
  const [beneficiary, setBeneficiary] = useState(null);
  const [documents, setDocuments] = useState({ aadhaar: null, incomeCertificate: null, communityCertificate: null, occupationProof: null });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [parentDetails, setParentDetails] = useState({ parentName: '', parentOccupation: '', parentIncome: '', parentMobileNumber: '' });

  useEffect(() => { fetchData(); }, [schemeId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [schemeRes, profileRes] = await Promise.all([
        fetch(`${API_BASE}/api/beneficiary/schemes/${schemeId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/users/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (schemeRes.ok) setScheme(await schemeRes.json());
      if (profileRes.ok) {
        const data = await profileRes.json();
        setBeneficiary(data);
        setEditedData(data);
        setParentDetails({ parentName: data.parentName || '', parentOccupation: data.parentOccupation || '', parentIncome: data.parentIncome || '', parentMobileNumber: data.parentMobileNumber || '' });
      }
    } catch (error) {
      toast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, docType) => setDocuments({ ...documents, [docType]: e.target.files[0] });
  const handleEditChange = (field, value) => setEditedData({ ...editedData, [field]: value });

  const handleUpdateIncome = () => {
    const newIncome = prompt('Enter your updated annual income (₹):');
    if (!newIncome || isNaN(newIncome)) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/users/update-income`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ annualIncome: parseFloat(newIncome) })
    }).then(res => res.json()).then(data => {
      if (data.annualIncome) {
        setBeneficiary({ ...beneficiary, annualIncome: data.annualIncome });
        toast('Income updated successfully!', 'success');
        navigate('/beneficiary/dashboard', { state: { scrollTo: 'eligible-schemes', refreshSchemes: true } });
      } else {
        toast('Failed to update income', 'error');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documents.aadhaar || !documents.incomeCertificate || !documents.communityCertificate || !documents.occupationProof) {
      toast('Please upload all required documents', 'warning');
      return;
    }
    if (scheme && beneficiary?.annualIncome !== undefined) {
      if (beneficiary.annualIncome < scheme.minIncome || beneficiary.annualIncome > scheme.maxIncome) {
        toast(`Not Eligible! Your income ₹${beneficiary.annualIncome?.toLocaleString()} is outside the scheme range.`, 'error');
        return;
      }
    }
    const isEducationScheme = beneficiary?.incomeSource?.toLowerCase() === 'student' ||
      scheme?.schemeComponent?.toLowerCase().includes('education') ||
      scheme?.schemeName?.toLowerCase().includes('education');
    if (isEducationScheme && (!parentDetails.parentName || !parentDetails.parentOccupation || !parentDetails.parentIncome || !parentDetails.parentMobileNumber)) {
      toast('Please fill all parent details for education scheme', 'warning');
      return;
    }
    if (!window.confirm('Are you sure you want to submit this application?')) return;

    try {
      const token = localStorage.getItem('token');
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
      const docs = {
        aadhaarDoc: await toBase64(documents.aadhaar),
        incomeCertDoc: await toBase64(documents.incomeCertificate),
        communityCertDoc: await toBase64(documents.communityCertificate),
        occupationProofDoc: await toBase64(documents.occupationProof),
        ...(isEducationScheme && { parentDetails: JSON.stringify(parentDetails) })
      };
      const response = await fetch(`${API_BASE}/api/beneficiary/apply/${schemeId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(docs)
      });
      if (response.ok) {
        const result = await response.json();
        toast(result.message || 'Application submitted successfully!', 'success');
        setTimeout(() => { window.location.href = '/beneficiary/dashboard'; }, 1500);
      } else {
        toast('Application failed: ' + await response.text(), 'error');
      }
    } catch (error) {
      toast('Error submitting application', 'error');
    }
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

  const isEducationScheme = beneficiary?.incomeSource?.toLowerCase() === 'student' ||
    scheme?.schemeComponent?.toLowerCase().includes('education') ||
    scheme?.schemeName?.toLowerCase().includes('education');

  return (
    <div className="application-page">
      <div className="application-container">
        <button className="back-btn" onClick={() => navigate('/beneficiary/dashboard')}>{t('scheme_app.back')}</button>
        <h1>{t('scheme_app.form_title')}</h1>

        <div className="scheme-info">
          <h2>{scheme?.schemeName}</h2>
          <p>{scheme?.schemeDescription}</p>
          <div className="benefit-highlight">{t('scheme_app.max_benefit')}: ₹{scheme?.maxBenefitAmount?.toLocaleString()}</div>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <section className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{t('scheme_app.personal_details')}</h3>
              <button type="button" className="edit-btn" onClick={() => setEditMode(!editMode)}>
                {editMode ? t('scheme_app.lock') : t('scheme_app.edit')}
              </button>
            </div>
            <div className="details-grid">
              <div className="detail-item"><label>{t('scheme_app.full_name')}</label>
                <input type="text" value={editMode ? (editedData?.fullName || '') : (beneficiary?.fullName || '')} onChange={(e) => handleEditChange('fullName', e.target.value)} disabled={!editMode} />
              </div>
              <div className="detail-item"><label>{t('scheme_app.mobile')}</label>
                <input type="text" value={editMode ? (editedData?.mobileNumber || '') : (beneficiary?.mobileNumber || '')} onChange={(e) => handleEditChange('mobileNumber', e.target.value)} disabled={!editMode} />
              </div>
              <div className="detail-item"><label>{t('scheme_app.email')}</label>
                <input type="text" value={editMode ? (editedData?.email || 'N/A') : (beneficiary?.email || 'N/A')} onChange={(e) => handleEditChange('email', e.target.value)} disabled={!editMode} />
              </div>
              <div className="detail-item"><label>{t('scheme_app.dob')}</label>
                <input type="text" value={editMode ? (editedData?.dateOfBirth || 'N/A') : (beneficiary?.dateOfBirth || 'N/A')} onChange={(e) => handleEditChange('dateOfBirth', e.target.value)} disabled={!editMode} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>{t('scheme_app.address_details')}</h3>
            <div className="details-grid">
              <div className="detail-item full-width"><label>{t('scheme_app.address')}</label>
                <textarea value={editMode ? (editedData?.address || '') : (beneficiary?.address || '')} onChange={(e) => handleEditChange('address', e.target.value)} disabled={!editMode} rows="2"></textarea>
              </div>
              <div className="detail-item"><label>{t('scheme_app.state')}</label>
                <input type="text" value={editMode ? (editedData?.state || '') : (beneficiary?.state || '')} onChange={(e) => handleEditChange('state', e.target.value)} disabled={!editMode} />
              </div>
              <div className="detail-item"><label>{t('scheme_app.district')}</label>
                <input type="text" value={editMode ? (editedData?.district || '') : (beneficiary?.district || '')} onChange={(e) => handleEditChange('district', e.target.value)} disabled={!editMode} />
              </div>
              <div className="detail-item"><label>{t('scheme_app.pincode')}</label>
                <input type="text" value={editMode ? (editedData?.pincode || '') : (beneficiary?.pincode || '')} onChange={(e) => handleEditChange('pincode', e.target.value)} disabled={!editMode} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>{t('scheme_app.eligibility_details')}</h3>
            <div className="details-grid">
              <div className="detail-item"><label>{t('scheme_app.income')}</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="text" value={`₹${beneficiary?.annualIncome?.toLocaleString() || 'N/A'}`} disabled style={{ flex: 1 }} />
                  <button type="button" className="edit-btn" onClick={handleUpdateIncome}>{t('scheme_app.update')}</button>
                </div>
                <small style={{ color: '#888' }}>{t('scheme_app.income_hint')}</small>
              </div>
              <div className="detail-item"><label>{t('scheme_app.community')}</label>
                <input type="text" value={beneficiary?.casteCategory || ''} disabled />
              </div>
              <div className="detail-item"><label>{t('scheme_app.occupation_label')}</label>
                <input type="text" value={beneficiary?.incomeSource || ''} disabled />
              </div>
              <div className="detail-item"><label>{t('scheme_app.income_range')}</label>
                <input type="text" value={`₹${scheme?.minIncome?.toLocaleString()} - ₹${scheme?.maxIncome?.toLocaleString()}`} disabled
                  style={{ color: beneficiary?.annualIncome >= scheme?.minIncome && beneficiary?.annualIncome <= scheme?.maxIncome ? 'green' : 'red', fontWeight: 'bold' }} />
              </div>
            </div>
          </section>

          {isEducationScheme && (
            <section className="form-section">
              <h3>{t('scheme_app.parent_details')}</h3>
              <div className="details-grid">
                <div className="detail-item"><label>{t('scheme_app.parent_name')} *</label>
                  <input type="text" value={parentDetails.parentName} onChange={(e) => setParentDetails({ ...parentDetails, parentName: e.target.value })} required />
                </div>
                <div className="detail-item"><label>{t('scheme_app.parent_occupation')} *</label>
                  <input type="text" value={parentDetails.parentOccupation} onChange={(e) => setParentDetails({ ...parentDetails, parentOccupation: e.target.value })} required />
                </div>
                <div className="detail-item"><label>{t('scheme_app.parent_income')} *</label>
                  <input type="number" value={parentDetails.parentIncome} onChange={(e) => setParentDetails({ ...parentDetails, parentIncome: e.target.value })} required />
                </div>
                <div className="detail-item"><label>{t('scheme_app.parent_mobile')} *</label>
                  <input type="tel" value={parentDetails.parentMobileNumber} maxLength="10" onChange={(e) => setParentDetails({ ...parentDetails, parentMobileNumber: e.target.value })} required />
                </div>
              </div>
            </section>
          )}

          <section className="form-section">
            <h3>{t('scheme_app.documents')}</h3>
            <div className="documents-grid">
              <div className="document-upload"><label>{t('scheme_app.aadhaar_doc')} *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'aadhaar')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="document-upload"><label>{t('scheme_app.income_cert')} *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'incomeCertificate')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="document-upload"><label>{t('scheme_app.community_cert')} *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'communityCertificate')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="document-upload"><label>{t('scheme_app.occupation_proof')} *</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'occupationProof')} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
            </div>
          </section>

          <div className="declaration">
            <input type="checkbox" id="declare" required />
            <label htmlFor="declare">{t('scheme_app.declaration')}</label>
          </div>

          <button type="submit" className="submit-btn">{t('scheme_app.submit')}</button>
        </form>
      </div>
    </div>
  );
};

export default SchemeApplication;
