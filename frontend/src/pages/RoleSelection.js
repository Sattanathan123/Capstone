import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    { id: 'BENEFICIARY', name: 'Beneficiary', path: '/register/beneficiary' },
    { id: 'FIELD_OFFICER', name: 'Field Officer', path: '/register/field-officer' },
    { id: 'DISTRICT_ADMIN', name: 'District Admin', path: '/register/district-admin' },
    { id: 'SYSTEM_ADMIN', name: 'System Administrator', path: '/register/system-admin' },
    { id: 'SANCTIONING_OFFICER', name: 'Sanctioning Officer', path: '/register/sanctioning-authority' }
  ];

  const handleRoleChange = (e) => {
    const role = roles.find(r => r.id === e.target.value);
    if (role) {
      setSelectedRole(role.id);
      navigate(role.path);
    }
  };

  return (
    <div className="role-selection-page">
      <button className="back-to-home" onClick={() => navigate('/')}>← Back to Home</button>
      
      <motion.div 
        className="role-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Select Your Role</h1>
        <p className="role-subtitle">Choose the role that best describes you</p>
        
        <div className="dropdown-container">
          <select 
            value={selectedRole} 
            onChange={handleRoleChange}
            className="role-dropdown"
          >
            <option value="">-- Select a Role --</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
