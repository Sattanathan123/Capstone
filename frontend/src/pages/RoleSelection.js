import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'BENEFICIARY',
      title: 'Beneficiary',
      icon: '👤',
      description: 'Register to access government welfare schemes',
      path: '/register/beneficiary'
    },
    {
      id: 'FIELD_VERIFICATION_OFFICER',
      title: 'Field Verification Officer',
      icon: '👮',
      description: 'Verify beneficiary applications on ground',
      path: '/register/field-officer'
    },
    {
      id: 'DEPT_ADMIN',
      title: 'Department Admin',
      icon: '🏛️',
      description: 'Manage department schemes and operations',
      path: '/register/dept-admin'
    },
    {
      id: 'SYSTEM_ADMIN',
      title: 'System Administrator',
      icon: '⚙️',
      description: 'Manage system configuration and users',
      path: '/register/system-admin'
    },
    {
      id: 'MONITORING_AUDIT_OFFICER',
      title: 'Monitoring & Audit Officer',
      icon: '📊',
      description: 'Monitor and audit scheme implementations',
      path: '/register/monitoring-officer'
    },
    {
      id: 'SCHEME_SANCTIONING_AUTHORITY',
      title: 'Scheme Sanctioning Authority',
      icon: '✅',
      description: 'Approve and sanction scheme applications',
      path: '/register/sanctioning-authority'
    }
  ];

  return (
    <div className="role-selection-page">
      <div className="role-selection-header">
        <h1>Select Your Role</h1>
        <p>Choose the role that best describes your position</p>
        <button className="back-to-login" onClick={() => navigate('/login')}>
          ← Back to Login
        </button>
      </div>

      <div className="roles-grid">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            className="role-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(role.path)}
          >
            <div className="role-icon">{role.icon}</div>
            <h3>{role.title}</h3>
            <p>{role.description}</p>
            <button className="select-role-btn">Register →</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
