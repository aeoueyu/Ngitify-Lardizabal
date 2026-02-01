import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'; // Siguraduhin na App.css ang import, hindi module kung global styles ang gamit

// --- COMPONENTS ---
import LoginPage from './components/login/LoginPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import PatientProfilePage from './components/PatientProfilePage';
import SettingsPage from './components/SettingsPage';
import Sidebar from './components/sidebar/Sidebar';
import ForgotPassPage from './components/ForgotPassPage';
import VerificationCodePage from './components/VerificationCodePage';
import NewPasswordPage from './components/NewPasswordPage';
import NewPasswordRedirectPage from './components/NewPasswordRedirectPage';
import Website from './components/welcome/Website';
import RoleSelectionPage from './components/login/RoleSelectionPage';

// --- USER MANAGEMENT IMPORTS ---
import ManageDentists from './components/user-management/ManageDentists';
import AddDentistPage from './components/add-user/AddDentistPage';
import EditDentistPage from './components/edit-user/EditDentistPage';
import ViewDentistPage from './components/view-user/ViewDentistPage';

import ManageSecretaries from './components/user-management/ManageSecretaries';
import AddSecretaryPage from './components/add-user/AddSecretaryPage';

import ManagePatients from './components/user-management/ManagePatients';
import AddPatientPage from './components/add-user/AddPatientPage';

import ActivateAccountPage from './components/email-activation/ActivateAccountPage';

// --- PROTECTED ROUTE CHECKER ---
function ProtectedRoute({ children }) {
  // Temporary: Set true for development. Ibalik sa localStorage logic pag tapos na ang UI dev.
  const isLoggedIn = true; 
  // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to='/login' />;
}

// --- MAIN LAYOUT COMPONENT (Sidebar + Content) ---
function MainLayout() {
  return (
    <div className='leftnav-div'>
      <Sidebar />
      <main className='leftnav-main'>
        {/* Ang <Outlet /> ay kung saan irerender ng React ang child routes */}
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        
        {/* ================= PUBLIC ROUTES (Walang Sidebar) ================= */}
        <Route path="/" element={<Website />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassPage />} />
        <Route path="/verification-code" element={<VerificationCodePage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/new-password-redirect" element={<NewPasswordRedirectPage />} />
        <Route path="/activate-account/:token" element={<ActivateAccountPage />} />


        {/* ================= PROTECTED ROUTES (May Sidebar) ================= */}
        <Route element={
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        }>
            {/* Redirect /home to dashboard or keep as is */}
            <Route path="/home" element={<HomePage />} />
            
            {/* Owner / Dashboard Routes */}
            <Route path="/owner/dashboard" element={<DashboardPage />} />
            
            {/* User Management Routes */}
            <Route path="/owner/manage-dentists" element={<ManageDentists />} />
            <Route path="/owner/add-dentist" element={<AddDentistPage />} />
            <Route path="/owner/edit-dentist/:id" element={<EditDentistPage />} />
            <Route path="/owner/view-dentist/:id" element={<ViewDentistPage />} />

            <Route path="/owner/manage-secretaries" element={<ManageSecretaries />} />
            <Route path="owner/add-secretary" element={<AddSecretaryPage/>} />

            <Route path="/owner/manage-patients" element={<ManagePatients />} />
            <Route path="owner/add-patient" element={<AddPatientPage/>} />
            
            {/* Other Protected Pages */}
            <Route path="/patientprofile" element={<PatientProfilePage />} />
            <Route path="/owner/settings" element={<SettingsPage />} />
            
            {/* Fallback for /dashboard if you use it directly */}
            <Route path="/dashboard" element={<Navigate to="/owner/dashboard" replace />} />
        </Route>

        {/* Catch-all: Redirect to Website/Login if page not found */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;