import React from 'react';
import { BrowserRouter as Router , Routes , Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './App.css';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import PatientProfilePage from './components/PatientProfilePage';
import SettingsPage from './components/SettingsPage'
import OTP from './components/OTP';
import EmailVerificationPage from './components/EmailVerificationPage';
import Sidebar from './components/Sidebar';
import ForgotPassPage from './components/ForgotPassPage';
import VerificationCodePage from './components/VerificationCodePage';
import NewPasswordPage from './components/NewPasswordPage';
import NewPasswordRedirectPage from './components/NewPasswordRedirectPage';

function ProtectedRoute({children}) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to='/login'/>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/email-verification" element={<EmailVerificationPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/otp" element={<OTP/>}/>

        <Route path="/forgot-password" element={<ForgotPassPage/>}/>
        <Route path="/verification-code" element={<VerificationCodePage/>}/>
        <Route path="/new-password" element={<NewPasswordPage/>}/>
        <Route path="/new-password-redirect" element={<NewPasswordRedirectPage/>}/>

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className='leftnav-div'>
                <Sidebar/>
                <main className='leftnav-main'>
                  <Routes>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/dashboard" element={<DashboardPage/>}/>
                    <Route path="/patientprofile" element={<PatientProfilePage/>}/>
                    <Route path="/settings" element={<SettingsPage/>}/>

                    <Route path="/" element={<Navigate to="/login"/>}/>
                  </Routes>

                </main>
              </div>
            </ProtectedRoute>
          }
        
        />
      </Routes>
    </Router>
  );
}

export default App;