import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import AwarenessCards from '../components/AwarenessCards';
import TrustBadges from '../components/TrustBadges';
import CallToAction from '../components/CallToAction';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [scrollY, setScrollY] = useState(0);
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <motion.div 
          className="hero-background"
          style={{ y: backgroundY, opacity }}
        >
          <div className="bg-pattern pattern-1"></div>
          <div className="bg-pattern pattern-2"></div>
          <div className="bg-pattern pattern-3"></div>
        </motion.div>
        
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Empowering Citizens Through Digital Identity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A unified platform for accurate beneficiary identification and seamless welfare delivery across all government schemes
          </motion.p>
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button 
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/register'); window.scrollTo(0, 0); }}
            >
              Register Now
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/track'); window.scrollTo(0, 0); }}
            >
              Track Application
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate('/features'); window.scrollTo(0, 0); }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <motion.div 
            className="id-card"
            whileHover={{ 
              rotateY: 0,
              scale: 1.05,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-header">
              <span className="card-icon">🆔</span>
              <span>Digital ID</span>
            </div>
            <div className="card-body">
              <div className="avatar">👤</div>
              <div className="card-details">
                <div className="detail-line"></div>
                <div className="detail-line short"></div>
              </div>
            </div>
            <div className="card-footer">
              <span className="verified">✓ Verified</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <AwarenessCards />

      <section className="info-cards">
        {[
          { icon: '🎯', title: 'Accurate Beneficiary Identification', desc: 'AI-powered verification ensures only eligible beneficiaries receive welfare benefits', delay: 0.1 },
          { icon: '🛡️', title: 'Reduced Duplication & Leakage', desc: 'Blockchain-backed system eliminates duplicate entries and prevents benefit leakage', delay: 0.2 },
          { icon: '💰', title: 'Direct Benefit Transfer', desc: 'Instant transfer of benefits directly to verified beneficiary bank accounts', delay: 0.3 }
        ].map((card, index) => (
          <motion.div 
            key={index}
            className="card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: card.delay, duration: 0.6 }}
            whileHover={{ 
              y: -10,
              boxShadow: "0 15px 40px rgba(0, 61, 130, 0.2)",
              scale: 1.02
            }}
          >
            <div className="card-icon-large">
              {card.icon}
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="process-flow">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>
        <div className="steps">
          {[
            { num: 1, icon: '📝', title: 'Register', desc: 'Create your profile with basic details', delay: 0.1 },
            { num: 2, icon: '✅', title: 'Verify Identity', desc: 'Complete Aadhaar-based verification', delay: 0.3 },
            { num: 3, icon: '👍', title: 'Get Approved', desc: 'Automated eligibility assessment', delay: 0.5 },
            { num: 4, icon: '🎁', title: 'Receive Benefits', desc: 'Direct transfer to your account', delay: 0.7 }
          ].map((step, index) => (
            <React.Fragment key={index}>
              <motion.div 
                className="step"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: step.delay, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: "0 10px 35px rgba(255, 153, 51, 0.3)"
                }}
              >
                <motion.div 
                  className="step-number"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: step.delay + 0.2, type: "spring", stiffness: 200 }}
                >
                  {step.num}
                </motion.div>
                <div className="step-icon">
                  {step.icon}
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
              {index < 3 && (
                <motion.div 
                  className="arrow"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: step.delay + 0.3, duration: 0.4 }}
                >
                  →
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <TrustBadges />

      <section className="stats">
        {[
          { value: '10M+', label: 'Registered Beneficiaries', delay: 0.1 },
          { value: '99.8%', label: 'Accuracy Rate', delay: 0.2 },
          { value: '₹5000Cr+', label: 'Benefits Disbursed', delay: 0.3 },
          { value: '28', label: 'States/UTs Connected', delay: 0.4 }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: stat.delay, duration: 0.6 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.h3
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 150 }}
            >
              {stat.value}
            </motion.h3>
            <p>{stat.label}</p>
          </motion.div>
        ))}
      </section>

      <CallToAction />
    </div>
  );
};

export default Home;
