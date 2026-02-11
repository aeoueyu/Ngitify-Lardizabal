import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css'; 

// --- PUBLIC COMPONENTS ---
import Website from './components/welcome/Website';
import RoleSelectionPage from './components/login/RoleSelectionPage';
import LoginPage from './components/login/LoginPage';
import ForgotPassPage from './components/security/ForgotPassPage';
import VerificationCodePage from './components/security/VerificationCodePage';
import NewPasswordPage from './components/security/NewPasswordPage';
import NewPasswordRedirectPage from './components/security/NewPasswordRedirectPage';
import ActivateAccountPage from './components/email-activation/ActivateAccountPage';

// --- SHARED COMPONENTS ---
import Sidebar from './components/sidebar/Sidebar';
import SettingsPage from './components/settings/SettingsPage';
import AccountSettingsPage from './components/settings/AccountSettingsPage';
import SecuritySettingsPage from './components/settings/SecuritySettingsPage';
import StaffSettingsPage from './components/settings/StaffSettingsPage';

// --- DASHBOARDS ---
import AuditLogsPage from './components/audit-logs/AuditLogsPage';

// --- USER MANAGEMENT ---
import ManageDentists from './components/user-management/ManageDentists';
import AddDentistPage from './components/add-user/AddDentistPage';
import EditDentistPage from './components/edit-user/EditDentistPage';
import ViewDentistPage from './components/view-user/ViewDentistPage';

import ManageSecretaries from './components/user-management/ManageSecretaries';
import AddSecretaryPage from './components/add-user/AddSecretaryPage';
import EditSecretaryPage from './components/edit-user/EditSecretaryPage';
import ViewSecretaryPage from './components/view-user/ViewSecretaryPage';

import ManagePatientsPage from './pages/management/ManagePatientsPage';
import ManagePatients from './components/user-management/ManagePatients';
import AddPatientPage from './components/patient-management/AddPatientPage';
import EditPatientPage from './components/patient-management/EditPatientPage';
import ViewPatientPage from './components/patient-management/ViewPatientPage';

//DENTIST
import DentistDashboard from './components/dentist/DentistDashboard';
import PatientRecords from './components/dentist/PatientRecords';
import Financials from './components/dentist/Financials';
import Schedule from './components/dentist/Schedule';


//owner
import OwnerDashboard from './components/owner/OwnerDashboard';
import PatientRecordsOwner from './components/owner/PatientRecords';

//owner-surgery
import SurgeryScheduling from './components/owner/surgery/SurgeryScheduling';
import AssignSurgeon from './components/owner/surgery/AssignSurgeon';
import ViewSurgeryDetails from './components/owner/surgery/ViewSurgeryDetails';
import SurgeryStatistics from './components/owner/surgery/SurgeryStatistics';
import BillingFinance from './components/owner/finance/BillingFinance';

//sec
import SecretaryDashboard from './components/secretary/SecretaryDashboard';
import Billing from './components/secretary/Billing';
import DocumentManagement from './components/secretary/DocumentManagement';

//patient
import PatientDashboard from './components/patient/PatientDashboard';
import AIPostOp from './components/patient/AIPostOp';
import MyFinances from './components/patient/MyFinances';
import TreatmentJourney from './components/patient/TreatmentJourney';

import PatientProfilePage from './components/patient/PatientProfilePage';

// --- LAYOUT ---
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

// Simple Auth Guard
function ProtectedRoute({ children }) {
  const userId = localStorage.getItem('userId');
  return userId ? children : <Navigate to='/login' />;
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

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            
            {/* OWNER ROUTES */}
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/patient-records" element={<PatientRecordsOwner />} />
            <Route path="/owner/patient-records/:id" element={<PatientProfilePage />} />
            
            <Route path="/owner/surgery-scheduling" element={<SurgeryScheduling />} />
            <Route path="/owner/surgery-assignment" element={<AssignSurgeon />} />
            <Route path="/owner/surgery-details" element={<ViewSurgeryDetails />} />
            <Route path="/owner/surgery-statistics" element={<SurgeryStatistics />} />
            <Route path="/owner/billing-finance" element={<BillingFinance />} />

            <Route path="/owner/manage-dentists" element={<ManageDentists />} />
            <Route path="/owner/add-dentist" element={<AddDentistPage />} />
            <Route path="/owner/edit-dentist/:id" element={<EditDentistPage />} />
            <Route path="/owner/view-dentist/:id" element={<ViewDentistPage />} />

            {/* <Route path="/owner/manage-co-owners" element={<ManageCoOwners />} />
            <Route path="/owner/add-co-owner" element={<AddCoOwnerPage />} />
            <Route path="/owner/view-co-owner/:id" element={<ViewCoOwnerPage />} />
            <Route path="/owner/edit-co-owner/:id" element={<EditCoOwnerPage />} /> */}

            <Route path="/owner/manage-secretaries" element={<ManageSecretaries />} />
            <Route path="/owner/add-secretary" element={<AddSecretaryPage />} />
            <Route path="/owner/edit-secretary/:id" element={<EditSecretaryPage />} />
            <Route path="/owner/view-secretary/:id" element={<ViewSecretaryPage />} />

            <Route path="/patients" element={<ManagePatientsPage />} />
            <Route path="/add-patient" element={<AddPatientPage />} />
            <Route path="/owner/manage-patients" element={<ManagePatientsPage />} />
            <Route path="/owner/add-patient" element={<AddPatientPage />} />
            <Route path="/owner/edit-patient/:id" element={<EditPatientPage />} />
            <Route path="/owner/view-patient/:id" element={<ViewPatientPage />} />

            <Route path="/patient-management" element={<ManagePatientsPage />} />
            <Route path="/patient-management/add" element={<AddPatientPage />} />
            <Route path="/patient-management/edit/:id" element={<EditPatientPage />} />
            <Route path="/patient-management/view/:id" element={<ViewPatientPage />} />

            <Route path="/owner/audit-logs" element={<AuditLogsPage />} />

            <Route path="/owner/clinic-records" element={<PatientRecordsOwner />} />

            {/* OWNER SETTINGS (Refactored for Outlet) */}
            <Route path="/owner/settings" element={<SettingsPage />}>
                <Route index element={<Navigate to="personal" replace />} />
                <Route path="personal" element={<AccountSettingsPage />} />
                <Route path="security" element={<SecuritySettingsPage />} />
                <Route path="staff" element={<StaffSettingsPage />} />
            </Route>

            {/* SECRETARY ROUTES */}
            <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
            <Route path="/secretary/manage-patients" element={<ManagePatients />} />
            <Route path="/secretary/add-patient" element={<AddPatientPage />} />
            <Route path="/secretary/edit-patient/:id" element={<EditPatientPage />} />
            <Route path="/secretary/view-patient/:id" element={<ViewPatientPage />} />
            <Route path="/secretary/billing/" element={<Billing />} />
            <Route path="/secretary/document-management" element={<DocumentManagement />} />
            
            {/* SECRETARY SETTINGS */}
            <Route path="/secretary/settings" element={<Navigate to="/secretary/settings/personal" replace />} />
            <Route path="/secretary/settings/personal" element={<SettingsPage section="personal" />} />
            <Route path="/secretary/settings/security" element={<SettingsPage section="security" />} />

            {/* DENTIST ROUTES */}
            <Route path="/dentist/dashboard" element={<DentistDashboard />} />
            <Route path="/dentist/patient-records" element={<PatientRecords />} />
            <Route path="/dentist/financials" element={<Financials />} />
            <Route path="/dentist/schedule" element={<Schedule />} />
            
            {/* DENTIST SETTINGS */}
            <Route path="/dentist/settings" element={<Navigate to="/dentist/settings/personal" replace />} />
            <Route path="/dentist/settings/personal" element={<SettingsPage section="personal" />} />
            <Route path="/dentist/settings/security" element={<SettingsPage section="security" />} />

            {/* PATIENT ROUTES */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/aipost-op" element={<AIPostOp />} />
            <Route path="/patient/my-finances" element={<MyFinances />} />
            <Route path="/patient/treatment-journey" element={<TreatmentJourney />} />
            
            {/* PATIENT SETTINGS */}
            <Route path="/patient/settings" element={<Navigate to="/patient/settings/personal" replace />} />
            <Route path="/patient/settings/personal" element={<SettingsPage section="personal" />} />
            <Route path="/patient/settings/security" element={<SettingsPage section="security" />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;