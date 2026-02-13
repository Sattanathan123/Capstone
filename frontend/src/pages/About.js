import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
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
          About Digital Beneficiary Identification
        </motion.h2>
        <motion.p 
          className="lead"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Transforming welfare delivery through technology and transparency
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
          <h3>Our Mission</h3>
          <p>
            The Digital Beneficiary Identification (DBI) system aims to revolutionize how government welfare schemes 
            reach citizens. By leveraging cutting-edge technology, we ensure that benefits reach the right people 
            at the right time, eliminating inefficiencies and promoting inclusive growth.
          </p>
        </motion.div>

        <motion.div 
          className="content-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>The Challenge</h3>
          <div className="challenge-grid">
            {[
              { icon: '⚠️', text: 'High risk of inclusion/exclusion errors due to manual selection processes' },
              { icon: '📊', text: 'Poor tracking of beneficiary outcomes and progress' },
              { icon: '🔗', text: 'Fragmented beneficiary data maintained by different departments' },
              { icon: '💻', text: 'Limited interoperability between state databases and central systems' }
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
          <h3>Our Solution</h3>
          <p>
            DBI provides a unified, digital platform that integrates with existing government databases, 
            uses AI-powered verification, and ensures end-to-end transparency in beneficiary identification 
            and benefit delivery. The system is designed to be accessible, secure, and scalable across all 
            states and union territories.
          </p>
        </motion.div>

        <motion.div 
          className="impact-goals"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Impact Goals</h3>
          <div className="goals-grid">
            {[
              { icon: '🎯', title: 'Accurate Targeting', desc: 'Precise identification of eligible beneficiaries for all welfare schemes' },
              { icon: '📱', title: 'Digital Tracking', desc: 'End-to-end project tracking and beneficiary monitoring' },
              { icon: '💼', title: 'Livelihood Enhancement', desc: 'Data-driven skill development and income-generation initiatives' },
              { icon: '🔒', title: 'Transparency', desc: 'Enhanced accountability and reduced leakages in benefit delivery' }
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
