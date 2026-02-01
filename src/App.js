import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'; 

// --- COMPONENTS ---
import LoginPage from './components/login/LoginPage';
import RoleSelectionPage from './components/login/RoleSelectionPage';
import ForgotPassPage from './components/security/ForgotPassPage'; // Updated path
import VerificationCodePage from './components/security/VerificationCodePage'; // Updated path
import NewPasswordPage from './components/security/NewPasswordPage'; // Updated path
import NewPasswordRedirectPage from './components/security/NewPasswordRedirectPage'; // Updated path
import ActivateAccountPage from './components/email-activation/ActivateAccountPage';
import Website from './components/welcome/Website';
import Sidebar from './components/sidebar/Sidebar';
import SettingsPage from './components/settings/SettingsPage'; // Updated path

// --- DASHBOARDS ---
import OwnerDashboard from './components/dashboards/OwnerDashboard';
import DentistDashboard from './components/dashboards/DentistDashboard';
import SecretaryDashboard from './components/dashboards/SecretaryDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';

// --- USER MANAGEMENT ---
import ManageDentists from './components/user-management/ManageDentists';
import AddDentistPage from './components/add-user/AddDentistPage';
import EditDentistPage from './components/edit-user/EditDentistPage';
import ViewDentistPage from './components/view-user/ViewDentistPage';

import ManageSecretaries from './components/user-management/ManageSecretaries';
import AddSecretaryPage from './components/add-user/AddSecretaryPage';
import EditSecretaryPage from './components/edit-user/EditSecretaryPage';
import ViewSecretaryPage from './components/view-user/ViewSecretaryPage';

import ManagePatients from './components/user-management/ManagePatients';
import AddPatientPage from './components/add-user/AddPatientPage';
import EditPatientPage from './components/edit-user/EditPatientPage';
import ViewPatientPage from './components/view-user/ViewPatientPage';


// --- LAYOUTS ---
function MainLayout() {
  return (
    <div className='leftnav-div'>
      <Sidebar />
      <main className='leftnav-main'>
        <Outlet />
      </main>
    </div>
  );
}

// Temporary Auth Guard
function ProtectedRoute({ children }) {
  const isLoggedIn = true; // TODO: Connect to actual auth state
  return isLoggedIn ? children : <Navigate to='/login' />;
}

function App() {
  return (
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Website />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassPage />} />
        <Route path="/verification-code" element={<VerificationCodePage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/password-reset-success" element={<NewPasswordRedirectPage />} />
        <Route path="/activate-account/:token" element={<ActivateAccountPage />} />

        {/* PROTECTED ROUTES (Sidebar Layout) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            
            {/* OWNER ROUTES */}
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            
            <Route path="/owner/manage-dentists" element={<ManageDentists />} />
            <Route path="/owner/add-dentist" element={<AddDentistPage />} />
            <Route path="/owner/edit-dentist/:id" element={<EditDentistPage />} />
            <Route path="/owner/view-dentist/:id" element={<ViewDentistPage />} />

            <Route path="/owner/manage-secretaries" element={<ManageSecretaries />} />
            <Route path="/owner/add-secretary" element={<AddSecretaryPage />} />
            <Route path="/owner/edit-secretary/:id" element={<EditSecretaryPage />} />
            <Route path="/owner/view-secretary/:id" element={<ViewSecretaryPage />} />

            <Route path="/owner/manage-patients" element={<ManagePatients />} />
            <Route path="/owner/add-patient" element={<AddPatientPage />} />
            <Route path="/owner/edit-patient/:id" element={<EditPatientPage />} />
            <Route path="/owner/view-patient/:id" element={<ViewPatientPage />} />

            <Route path="/owner/settings" element={<SettingsPage />} />

            {/* DENTIST ROUTES */}
            <Route path="/dentist/dashboard" element={<DentistDashboard />} />
            <Route path="/dentist/settings" element={<SettingsPage />} />

            {/* SECRETARY ROUTES */}
            <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
            <Route path="/secretary/settings" element={<SettingsPage />} />
            <Route path="/secretary/manage-patients" element={<ManagePatients />} />
            <Route path="/secretary/add-patient" element={<AddPatientPage />} />
            <Route path="/secretary/edit-patient/:id" element={<EditPatientPage />} />
            <Route path="/secretary/view-patient/:id" element={<ViewPatientPage />} />

            {/* PATIENT ROUTES */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/settings" element={<SettingsPage />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;