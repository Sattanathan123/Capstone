import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CallToAction.css';

const CallToAction = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <motion.section 
      className="cta-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="cta-content">
        <motion.div
          className="cta-text"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
        </motion.div>

        <motion.div
          className="cta-buttons-large"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.button
            className="cta-btn-primary"
            whileHover={{ scale: 1.08, y: -5, boxShadow: "0 15px 40px rgba(255, 153, 51, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { navigate('/register'); window.scrollTo(0, 0); }}
          >
            <span className="btn-icon">📝</span>
            <span className="btn-text">
              <strong>{t('cta.register')}</strong>
              <small>{t('cta.register_sub')}</small>
            </span>
          </motion.button>

          <motion.button
            className="cta-btn-secondary"
            whileHover={{ scale: 1.08, y: -5, boxShadow: "0 15px 40px rgba(0, 61, 130, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { navigate('/login'); window.scrollTo(0, 0); }}
          >
            <span className="btn-icon">🔑</span>
            <span className="btn-text">
              <strong>{t('cta.login')}</strong>
              <small>{t('cta.login_sub')}</small>
            </span>
          </motion.button>
        </motion.div>

        <motion.div
          className="cta-info"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="info-item"><span className="info-icon">⚡</span><span>{t('cta.quick')}</span></div>
          <div className="info-item"><span className="info-icon">🔒</span><span>{t('cta.secure')}</span></div>
          <div className="info-item"><span className="info-icon">✅</span><span>{t('cta.verified')}</span></div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
