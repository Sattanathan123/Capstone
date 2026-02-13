import React from 'react';
import { motion } from 'framer-motion';
import './TrustBadges.css';

const TrustBadges = () => {
  const badges = [
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Bank-grade encryption protects your data',
      color: '#003d82'
    },
    {
      icon: '🛡️',
      title: 'Transparent',
      description: 'Complete visibility of application status',
      color: '#0056b3'
    },
    {
      icon: '✅',
      title: 'Government Verified',
      description: 'Official government authentication system',
      color: '#138808'
    },
    {
      icon: '🌍',
      title: 'Inclusive',
      description: 'Accessible to all citizens across India',
      color: '#ff9933'
    }
  ];

  return (
    <section className="trust-section">
      <motion.div
        className="trust-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Why Trust DBI?</h2>
        <p>Built on the pillars of security, transparency, and inclusivity</p>
      </motion.div>

      <div className="trust-grid">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="trust-badge"
            style={{ '--badge-color': badge.color }}
          >
            <div className="badge-icon">
              {badge.icon}
            </div>
            <h3>{badge.title}</h3>
            <p>{badge.description}</p>
            <div className="badge-shine"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
