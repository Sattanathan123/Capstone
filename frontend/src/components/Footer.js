import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/logo.png" alt="" className="footer-logo-img" onError={(e) => e.target.style.display='none'} />
            <h4>BeniNect</h4>
          </div>
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-section">
          <h4>{t('footer.quick_links')}</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo(0, 0); }}>{t('footer.home')}</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); navigate('/about'); window.scrollTo(0, 0); }}>{t('footer.about')}</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); navigate('/features'); window.scrollTo(0, 0); }}>{t('footer.features')}</a></li>
            <li><a href="#contact">{t('footer.contact_link')}</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>{t('footer.support')}</h4>
          <ul>
            <li><a href="#help">{t('footer.help')}</a></li>
            <li><a href="#faq">{t('footer.faq')}</a></li>
            <li><a href="#privacy">{t('footer.privacy')}</a></li>
            <li><a href="#terms">{t('footer.terms')}</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>{t('footer.contact')}</h4>
          <p>📧 support@beninect.gov.in</p>
          <p>📞 {t('footer.toll_free')}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
