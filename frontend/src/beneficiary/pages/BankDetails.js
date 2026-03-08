import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BankDetails.css';

const BankDetails = () => {
  const navigate = useNavigate();
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
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="bank-details-page">
      <header className="bank-header">
        <div className="header-content">
          <h1>Bank Account Details</h1>
          <p>Add your bank details for Direct Benefit Transfer (DBT)</p>
        </div>
      </header>

      <div className="bank-content">
        <form onSubmit={handleSubmit} className="bank-form">
          <div className="form-group">
            <label>Account Holder Name *</label>
            <input
              type="text"
              name="accountHolderName"
              value={bankDetails.accountHolderName}
              onChange={handleChange}
              required
              placeholder="As per bank records"
            />
          </div>

          <div className="form-group">
            <label>Bank Account Number *</label>
            <input
              type="text"
              name="bankAccountNumber"
              value={bankDetails.bankAccountNumber}
              onChange={handleChange}
              required
              maxLength="20"
              placeholder="Enter account number"
            />
          </div>

          <div className="form-group">
            <label>IFSC Code *</label>
            <input
              type="text"
              name="bankIfscCode"
              value={bankDetails.bankIfscCode}
              onChange={handleChange}
              required
              maxLength="11"
              placeholder="e.g., SBIN0001234"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label>Bank Name *</label>
            <input
              type="text"
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleChange}
              required
              placeholder="Enter bank name"
            />
          </div>

          <div className="info-box">
            <p><strong>Important:</strong></p>
            <ul>
              <li>Ensure account details match your bank records</li>
              <li>Account must be active and operational</li>
              <li>Funds will be transferred via Direct Benefit Transfer (DBT)</li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? 'Saving...' : 'Save Bank Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetails;
