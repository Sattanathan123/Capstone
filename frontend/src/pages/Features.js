import React from 'react';
import { motion } from 'framer-motion';
import './Features.css';

const Features = () => {
  const coreFeatures = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      desc: 'Multi-factor authentication with Aadhaar integration ensures only authorized access',
      points: ['Biometric verification', 'OTP-based login', 'Digital signature support']
    },
    {
      icon: '🤖',
      title: 'AI-Powered Verification',
      desc: 'Machine learning algorithms for accurate beneficiary identification',
      points: ['Automated eligibility checks', 'Duplicate detection', 'Fraud prevention']
    },
    {
      icon: '📊',
      title: 'Real-Time Dashboard',
      desc: 'Comprehensive analytics and monitoring for administrators',
      points: ['Live beneficiary statistics', 'Scheme performance metrics', 'Geographic distribution maps']
    },
    {
      icon: '🔗',
      title: 'System Integration',
      desc: 'Seamless connectivity with existing government databases',
      points: ['State database sync', 'Banking system integration', 'Document verification APIs']
    },
    {
      icon: '📱',
      title: 'Mobile Accessibility',
      desc: 'Access services anytime, anywhere through mobile devices',
      points: ['Responsive web design', 'Progressive web app', 'Offline capability']
    },
    {
      icon: '🌐',
      title: 'Multi-Language Support',
      desc: 'Available in all major Indian languages for inclusive access',
      points: ['22 scheduled languages', 'Regional language support', 'Voice assistance']
    }
  ];

  return (
    <div className="features">
      <motion.section 
        className="features-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Platform Features
        </motion.h2>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Comprehensive tools for efficient welfare delivery
        </motion.p>
      </motion.section>

      <section className="features-content">
        <div className="feature-category">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Core Capabilities
          </motion.h3>
          <div className="features-grid">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 15px 40px rgba(0, 61, 130, 0.2)"
                }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
                <ul>
                  {feature.points.map((point, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + idx * 0.1 + 0.3 }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="feature-category">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            For Beneficiaries
          </motion.h3>
          <div className="benefits-list">
            {[
              { title: 'Easy Registration', desc: 'Simple, step-by-step registration process with minimal documentation' },
              { title: 'Track Application Status', desc: 'Real-time updates on application progress and approval status' },
              { title: 'Direct Benefit Transfer', desc: 'Instant credit of benefits to linked bank accounts' },
              { title: 'Grievance Redressal', desc: 'Quick resolution of issues through integrated helpdesk' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <span className="check">✓</span>
                <div>
                  <h5>{benefit.title}</h5>
                  <p>{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="feature-category">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            For Administrators
          </motion.h3>
          <div className="benefits-list">
            {[
              { title: 'Centralized Management', desc: 'Single platform to manage multiple welfare schemes' },
              { title: 'Advanced Analytics', desc: 'Data-driven insights for better policy decisions' },
              { title: 'Audit Trail', desc: 'Complete transaction history for transparency and accountability' },
              { title: 'Report Generation', desc: 'Automated reports for monitoring and compliance' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <span className="check">✓</span>
                <div>
                  <h5>{benefit.title}</h5>
                  <p>{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="security-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Security & Privacy</h3>
          <div className="security-grid">
            {[
              { icon: '🛡️', title: 'Data Encryption', desc: 'End-to-end encryption for all sensitive information' },
              { icon: '🔒', title: 'Privacy Compliance', desc: 'Adherence to data protection regulations and guidelines' },
              { icon: '⚡', title: 'Blockchain Backed', desc: 'Immutable records for enhanced security and trust' },
              { icon: '👁️', title: 'Access Control', desc: 'Role-based permissions and activity monitoring' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="security-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 12px 30px rgba(0, 61, 130, 0.2)"
                }}
              >
                <span className="shield">
                  {item.icon}
                </span>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Features;
