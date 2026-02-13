import React from 'react';
import './Footer.css';

const Footer = ({ setActiveTab }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Digital Beneficiary Identification</h4>
          <p>Empowering citizens through transparent and efficient welfare delivery</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo(0, 0); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('about'); window.scrollTo(0, 0); }}>About</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); setActiveTab('features'); window.scrollTo(0, 0); }}>Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 support@dbi.gov.in</p>
          <p>📞 1800-XXX-XXXX (Toll Free)</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Digital Beneficiary Identification System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
