import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './TrustBadges.css';

const TrustBadges = () => {
  const { t } = useTranslation();

  const badges = [
    { icon: '🔒', title: t('trust.b1_title'), description: t('trust.b1_desc'), color: '#003d82' },
    { icon: '🛡️', title: t('trust.b2_title'), description: t('trust.b2_desc'), color: '#0056b3' },
    { icon: '✅', title: t('trust.b3_title'), description: t('trust.b3_desc'), color: '#138808' },
    { icon: '🌍', title: t('trust.b4_title'), description: t('trust.b4_desc'), color: '#ff9933' }
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
        <h2>{t('trust.title')}</h2>
        <p>{t('trust.subtitle')}</p>
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
