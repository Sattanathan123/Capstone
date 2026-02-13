import React from 'react';
import { motion } from 'framer-motion';
import './AwarenessCards.css';

const AwarenessCards = () => {
  const cards = [
    {
      icon: '📋',
      title: 'What is DBI?',
      description: 'Digital system to identify and verify beneficiaries for welfare schemes.',
      details: [
        'Unified digital identity platform',
        'Connects citizens with government schemes',
        'Eliminates manual verification delays'
      ]
    },
    {
      icon: '🔍',
      title: 'Why Digital Verification?',
      description: 'Prevents duplication, ensures fairness, improves efficiency.',
      details: [
        'Real-time eligibility checks',
        'Prevents fraudulent claims',
        'Faster benefit delivery'
      ]
    },
    {
      icon: '💳',
      title: 'Direct Benefit Delivery',
      description: 'Benefits reach verified citizens directly, without intermediaries.',
      details: [
        'Bank account integration',
        'Instant fund transfer',
        'No middleman involvement'
      ]
    },
    {
      icon: '✅',
      title: 'Reduced Errors & Leakages',
      description: 'Eliminates inclusion and exclusion errors.',
      details: [
        'AI-powered verification',
        'Duplicate detection system',
        'Transparent audit trail'
      ]
    }
  ];

  return (
    <section className="awareness-section">
      <motion.div
        className="awareness-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Understanding Digital Beneficiary Identification</h2>
        <p>Building trust through transparency and technology</p>
      </motion.div>

      <div className="awareness-grid">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="awareness-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ 
              y: -12,
              boxShadow: "0 20px 50px rgba(0, 61, 130, 0.25)"
            }}
          >
            <div className="awareness-icon">
              {card.icon}
            </div>
            <h3>{card.title}</h3>
            <p className="awareness-desc">{card.description}</p>
            <ul className="awareness-details">
              {card.details.map((detail, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + idx * 0.1 + 0.3 }}
                >
                  {detail}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AwarenessCards;
