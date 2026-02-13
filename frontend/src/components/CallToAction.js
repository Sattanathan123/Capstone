import React from 'react';
import { motion } from 'framer-motion';
import './CallToAction.css';

const CallToAction = ({ setActiveTab }) => {
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
          <h2>Ready to Get Started?</h2>
          <p>Join millions of beneficiaries accessing welfare schemes through DBI</p>
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
            whileHover={{ 
              scale: 1.08,
              y: -5,
              boxShadow: "0 15px 40px rgba(255, 153, 51, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTab('register'); window.scrollTo(0, 0); }}
          >
            <span className="btn-icon">📝</span>
            <span className="btn-text">
              <strong>Register Now</strong>
              <small>Create your digital identity</small>
            </span>
          </motion.button>

          <motion.button
            className="cta-btn-secondary"
            whileHover={{ 
              scale: 1.08,
              y: -5,
              boxShadow: "0 15px 40px rgba(0, 61, 130, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">🔑</span>
            <span className="btn-text">
              <strong>Login</strong>
              <small>Access your account</small>
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
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span>Quick Registration</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span>100% Secure</span>
          </div>
          <div className="info-item">
            <span className="info-icon">✅</span>
            <span>Government Verified</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
