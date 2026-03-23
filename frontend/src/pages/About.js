import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="about">
      <motion.section 
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {t('about.title')}
        </motion.h2>
        <motion.p 
          className="lead"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {t('about.lead')}
        </motion.p>
      </motion.section>

      <section className="about-content">
        <motion.div 
          className="content-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>{t('about.mission_title')}</h3>
          <p>{t('about.mission_desc')}</p>
        </motion.div>

        <motion.div 
          className="content-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>{t('about.challenge_title')}</h3>
          <div className="challenge-grid">
            {[
              { icon: '⚠️', text: t('about.challenge1') },
              { icon: '📊', text: t('about.challenge2') },
              { icon: '🔗', text: t('about.challenge3') },
              { icon: '💻', text: t('about.challenge4') }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="challenge-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, x: 5 }}
              >
                <span className="icon">{item.icon}</span>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="content-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>{t('about.solution_title')}</h3>
          <p>{t('about.solution_desc')}</p>
        </motion.div>

        <motion.div 
          className="impact-goals"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>{t('about.impact_title')}</h3>
          <div className="goals-grid">
            {[
              { icon: '🎯', title: t('about.goal1_title'), desc: t('about.goal1_desc') },
              { icon: '📱', title: t('about.goal2_title'), desc: t('about.goal2_desc') },
              { icon: '💼', title: t('about.goal3_title'), desc: t('about.goal3_desc') },
              { icon: '🔒', title: t('about.goal4_title'), desc: t('about.goal4_desc') }
            ].map((goal, index) => (
              <motion.div 
                key={index}
                className="goal-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 12px 35px rgba(0, 61, 130, 0.2)"
                }}
              >
                <div className="goal-icon">
                  {goal.icon}
                </div>
                <h4>{goal.title}</h4>
                <p>{goal.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
