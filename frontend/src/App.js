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
import TrackApplication from './pages/TrackApplication';
import FieldOfficerRegister from './pages/register/FieldOfficerRegister';
import DeptAdminRegister from './pages/register/DeptAdminRegister';
import SystemAdminRegister from './pages/register/SystemAdminRegister';
import MonitoringOfficerRegister from './pages/register/MonitoringOfficerRegister';
import SanctioningAuthorityRegister from './pages/register/SanctioningAuthorityRegister';
import BeneficiaryDashboard from './beneficiary/pages/BeneficiaryDashboard';
import SchemeApplication from './beneficiary/pages/SchemeApplication';
import DepartmentAdminDashboard from './admin/pages/DepartmentAdminDashboard';
import DeptAnalytics from './admin/pages/DeptAnalytics';
import FieldOfficerDashboard from './officer/pages/FieldOfficerDashboard';
import SystemAdminDashboard from './sysadmin/pages/SystemAdminDashboard';
import Analytics from './sysadmin/pages/Analytics';
import SanctioningDashboard from './sanctioning/pages/SanctioningDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RoleSelection />} />
        <Route path="/register/beneficiary" element={<Register />} />
        <Route path="/register/field-officer" element={<FieldOfficerRegister />} />
        <Route path="/register/district-admin" element={<DeptAdminRegister />} />
        <Route path="/register/system-admin" element={<SystemAdminRegister />} />
        <Route path="/register/sanctioning-authority" element={<SanctioningAuthorityRegister />} />
        <Route path="/track" element={<TrackApplication />} />
        <Route path="/beneficiary/dashboard" element={<ProtectedRoute role="BENEFICIARY"><BeneficiaryDashboard /></ProtectedRoute>} />
        <Route path="/beneficiary/apply/:schemeId" element={<ProtectedRoute role="BENEFICIARY"><SchemeApplication /></ProtectedRoute>} />
        <Route path="/officer/dashboard" element={<ProtectedRoute role="FIELD_VERIFICATION_OFFICER"><FieldOfficerDashboard /></ProtectedRoute>} />
        <Route path="/sanctioning/dashboard" element={<ProtectedRoute role="SCHEME_SANCTIONING_AUTHORITY"><SanctioningDashboard /></ProtectedRoute>} />
        <Route path="/sysadmin/dashboard" element={<ProtectedRoute role="SYSTEM_ADMIN"><SystemAdminDashboard /></ProtectedRoute>} />
        <Route path="/sysadmin/analytics" element={<ProtectedRoute role="SYSTEM_ADMIN"><Analytics /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["DEPT_ADMIN", "DISTRICT_ADMIN", "STATE_ADMIN", "MONITORING_AUDIT_OFFICER"]}><DepartmentAdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={["DEPT_ADMIN", "DISTRICT_ADMIN", "STATE_ADMIN", "MONITORING_AUDIT_OFFICER"]}><DeptAnalytics /></ProtectedRoute>} />
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
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleSignupClick = () => {
    window.location.href = '/register';
  };

  return (
    <>
      <Header 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
