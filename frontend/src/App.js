import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Register from './pages/Register';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import FieldOfficerRegister from './pages/register/FieldOfficerRegister';
import DeptAdminRegister from './pages/register/DeptAdminRegister';
import SystemAdminRegister from './pages/register/SystemAdminRegister';
import MonitoringOfficerRegister from './pages/register/MonitoringOfficerRegister';
import SanctioningAuthorityRegister from './pages/register/SanctioningAuthorityRegister';
import BeneficiaryDashboard from './beneficiary/pages/BeneficiaryDashboard';
import DepartmentAdminDashboard from './admin/pages/DepartmentAdminDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RoleSelection />} />
        <Route path="/register/beneficiary" element={<Register />} />
        <Route path="/register/field-officer" element={<FieldOfficerRegister />} />
        <Route path="/register/dept-admin" element={<DeptAdminRegister />} />
        <Route path="/register/system-admin" element={<SystemAdminRegister />} />
        <Route path="/register/monitoring-officer" element={<MonitoringOfficerRegister />} />
        <Route path="/register/sanctioning-authority" element={<SanctioningAuthorityRegister />} />
        <Route path="/beneficiary/dashboard" element={<ProtectedRoute role="BENEFICIARY"><BeneficiaryDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["DEPT_ADMIN", "DISTRICT_ADMIN", "STATE_ADMIN", "FIELD_VERIFICATION_OFFICER", "SYSTEM_ADMIN", "MONITORING_AUDIT_OFFICER", "SCHEME_SANCTIONING_AUTHORITY"]}><DepartmentAdminDashboard /></ProtectedRoute>} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children, role, roles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check single role or multiple roles
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function MainLayout() {
  const [activeTab, setActiveTab] = React.useState('home');

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleSignupClick = () => {
    window.location.href = '/register';
  };

  return (
    <>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home setActiveTab={setActiveTab} />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
