import React from 'react';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './App.css';
import OverviewPage from './components/OverviewPage';
import DashboardPage from './components/DashboardPage';
import SettingsPage from './components/SettingsPage'
import Sidebar from './components/Sidebar';

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<LoginPage/>}/>
    //     <Route path="/signup" element={<SignupPage/>}/>
    //   </Routes>
    // </Router>

    // <Router>
    //   <div className='leftnav-div' style={{ display: 'flex' }}>
    //     <Sidebar /> 
        
    //     <main className='leftnav-main' style={{ flex: 1, padding: '20px' }}>
    //       <Routes>
    //         <Route path="/overview" element={<OverviewPage />} />
    //         <Route path="/dashboard" element={<DashboardPage />} />
    //         <Route path="/settings" element={<SettingsPage />} />
    //         <Route path="/" element={<OverviewPage />} />
    //       </Routes>
    //     </main>
    //   </div>
    // </Router>

    // <OverviewPage/>

    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
      </Routes>
      <div className='leftnav-div'>
        <Sidebar/>
        <main className='leftnav-main'>
          <Routes>
            <Route path="/overview" element={<OverviewPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;