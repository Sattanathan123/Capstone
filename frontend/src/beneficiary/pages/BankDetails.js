import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BankDetails.css';

const BankDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    accountHolderName: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/beneficiary/bank-details', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.bankAccountNumber) {
          setBankDetails(data);
        }
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBankDetails({
      ...bankDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/beneficiary/bank-details', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankDetails)
      });

      if (response.ok) {
        alert('Bank details saved successfully!');
        navigate('/beneficiary/dashboard');
      } else {
        alert('Failed to save bank details');
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
      alert('Error saving bank details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">{t('common.loading')}</div>;
  }

  return (
    <div className="bank-details-page">
      <header className="bank-header">
        <div className="header-content">
          <h1>{t('bank.title')}</h1>
          <p>{t('bank.subtitle')}</p>
        </div>
      </header>

      <div className="bank-content">
        <form onSubmit={handleSubmit} className="bank-form">
          <div className="form-group">
            <label>{t('bank.holder_label')} *</label>
            <input type="text" name="accountHolderName" value={bankDetails.accountHolderName} onChange={handleChange} required placeholder={t('bank.holder_placeholder')} />
          </div>

          <div className="form-group">
            <label>{t('bank.account_label')} *</label>
            <input type="text" name="bankAccountNumber" value={bankDetails.bankAccountNumber} onChange={handleChange} required maxLength="20" placeholder={t('bank.account_placeholder')} />
          </div>

          <div className="form-group">
            <label>{t('bank.ifsc_label')} *</label>
            <input type="text" name="bankIfscCode" value={bankDetails.bankIfscCode} onChange={handleChange} required maxLength="11" placeholder={t('bank.ifsc_placeholder')} style={{ textTransform: 'uppercase' }} />
          </div>

          <div className="form-group">
            <label>{t('bank.bank_label')} *</label>
            <input type="text" name="bankName" value={bankDetails.bankName} onChange={handleChange} required placeholder={t('bank.bank_placeholder')} />
          </div>

          <div className="info-box">
            <p><strong>{t('bank.important')}:</strong></p>
            <ul>
              <li>{t('bank.info1')}</li>
              <li>{t('bank.info2')}</li>
              <li>{t('bank.info3')}</li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">{t('bank.cancel')}</button>
            <button type="submit" disabled={saving} className="save-btn">{saving ? t('bank.saving') : t('bank.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetails;
