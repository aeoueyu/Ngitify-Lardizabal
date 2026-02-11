import React, { useState, useEffect } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css';
import logo from '../../assets/logo-white.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

// Icons
import dashboardIcon from '../../assets/sidebar-icons/dashboard.svg';
import usersIcon from '../../assets/sidebar-icons/users.svg';
import settingsIcon from '../../assets/sidebar-icons/settings.svg';
import warningIcon from '../../assets/alert-icons/warning.svg'; 
import patientSideIcon from '../../assets/sidebar-icons/patient2.svg'; 
import auditIcon from '../../assets/sidebar-icons/audit.svg';

// Dentist Icons
import financeIcon from '../../assets/sidebar-icons/finance.svg';
import recordIcon from '../../assets/sidebar-icons/patient-record.svg';
import scheduleIcon from '../../assets/sidebar-icons/schedule.svg';

import billingIcon from '../../assets/sidebar-icons/finance.svg'; // Or finance.svg
import folderIcon from '../../assets/sidebar-icons/folder.svg';

import cameraIcon from '../../assets/sidebar-icons/camera.svg'; // Placeholder if none
import surgeriesIcon from '../../assets/sidebar-icons/surgeries.svg'; // Placeholder if none

// NEW ICON (Ensure you have this!)
import clinicIcon from '../../assets/sidebar-icons/clinic.svg'; // If wala pa, use users.svg temporarily

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const userRole = localStorage.getItem('role') || 'patient'; 

    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
    const [isSurgeryMgmtOpen, setIsSurgeryMgmtOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (path) => location.pathname === path;
    const isUserMgmtActive = location.pathname.includes('/owner/manage');
    const isSurgeryMgmtActive = location.pathname.includes('/owner/surgery');
    const isSettingsActive = location.pathname.includes('/settings');

    useEffect(() => {
        if (isUserMgmtActive) { setIsUserMgmtOpen(true); setIsSettingsOpen(false); setIsSurgeryMgmtOpen(false); }
        else if (isSettingsActive) { setIsSettingsOpen(true); setIsUserMgmtOpen(false); setIsSurgeryMgmtOpen(false); }
        else if (isSurgeryMgmtActive) { setIsSurgeryMgmtOpen(true); setIsUserMgmtOpen(false); setIsSettingsOpen(false); }
        else { setIsUserMgmtOpen(false); setIsSettingsOpen(false); setIsSurgeryMgmtOpen(false); }
    }, [location.pathname, isUserMgmtActive, isSettingsActive, isSurgeryMgmtActive]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="NgitiFy" className={styles.logo} />
                </div>

                <ul className={styles.navMenu}>
                    
                    {/* DASHBOARD */}
                    <li className={`${styles.navItem} ${isActive(`/${userRole}/dashboard`) ? styles.active : ''}`} onClick={() => navigate(`/${userRole}/dashboard`)}>
                        <img src={dashboardIcon} alt="Dashboard" className={styles.icon} />
                        <span>Dashboard</span>
                    </li>

                    {/* OWNER MENU */}
                    {userRole === 'owner' && (
                        <>
                            {/* Patient Records - Unified */}
                            <li className={`${styles.navItem} ${location.pathname.includes('/owner/patient-records') ? styles.active : ''}`} onClick={() => navigate('/owner/patient-records')}>
                                <img src={recordIcon} alt="Records" className={styles.icon} />
                                <span>Patient Records</span>
                            </li>

                            {/* Surgeries Section */}
                            <li className={`${styles.navItem} ${isSurgeryMgmtActive ? styles.active : ''}`} onClick={() => { setIsSurgeryMgmtOpen(!isSurgeryMgmtOpen); setIsUserMgmtOpen(false); setIsSettingsOpen(false); }}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={surgeriesIcon} alt="Surgeries" className={styles.icon} /><span>Surgeries</span></div>
                                    <span className={`${styles.arrow} ${isSurgeryMgmtOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isSurgeryMgmtOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/owner/surgery-scheduling')} className={isActive('/owner/surgery-scheduling') ? styles.subActive : ''}>Surgery Scheduling</li>
                                    <li onClick={() => navigate('/owner/surgery-assignment')} className={isActive('/owner/surgery-assignment') ? styles.subActive : ''}>Assign Surgeon</li>
                                    <li onClick={() => navigate('/owner/surgery-details')} className={isActive('/owner/surgery-details') ? styles.subActive : ''}>View Surgery Details</li>
                                    <li onClick={() => navigate('/owner/surgery-statistics')} className={isActive('/owner/surgery-statistics') ? styles.subActive : ''}>Surgery Statistics</li>
                                </ul>
                            </div>


                            {/* Management Section */}
                            <li className={`${styles.navItem} ${isUserMgmtActive ? styles.active : ''}`} onClick={() => { setIsUserMgmtOpen(!isUserMgmtOpen); setIsSettingsOpen(false); }}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={usersIcon} alt="Users" className={styles.icon} /><span>User Management</span></div>
                                    <span className={`${styles.arrow} ${isUserMgmtOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isUserMgmtOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/owner/manage-dentists')} className={isActive('/owner/manage-dentists') ? styles.subActive : ''}>Dentists</li>
                                    <li onClick={() => navigate('/owner/manage-secretaries')} className={isActive('/owner/manage-secretaries') ? styles.subActive : ''}>Secretaries</li>
                                </ul>
                            </div>


                            <li className={`${styles.navItem} ${isActive('/owner/audit-logs') ? styles.active : ''}`} onClick={() => navigate('/owner/audit-logs')}>
                                <img src={auditIcon} alt="Audit" className={styles.icon} />
                                <span>Audit Logs</span>
                            </li>

                            {/* MY PRACTICE (Dentist Features for Owner) */}
                            <div className={styles.sectionDivider}>MY PRACTICE</div>

                            <li className={`${styles.navItem} ${isActive('/dentist/schedule') ? styles.active : ''}`} onClick={() => navigate('/dentist/schedule')}>
                                <img src={scheduleIcon} alt="Schedule" className={styles.icon} />
                                <span>My Schedule</span>
                            </li>
                            <li className={`${styles.navItem} ${isActive('/dentist/financials') ? styles.active : ''}`} onClick={() => navigate('/dentist/financials')}>
                                <img src={financeIcon} alt="Finance" className={styles.icon} />
                                <span>My Earnings</span>
                            </li>
                        </>
                    )}

                    {/* DENTIST MENU */}
                    {userRole === 'dentist' && (
                        <>
                            <li className={`${styles.navItem} ${isActive('/dentist/schedule') ? styles.active : ''}`} onClick={() => navigate('/dentist/schedule')}>
                                <img src={scheduleIcon} alt="Schedule" className={styles.icon} /><span>Schedule</span>
                            </li>
                            <li className={`${styles.navItem} ${isActive('/dentist/financials') ? styles.active : ''}`} onClick={() => navigate('/dentist/financials')}>
                                <img src={financeIcon} alt="Finance" className={styles.icon} /><span>My Earnings</span>
                            </li>
                        </>
                    )}

                    {/* SECRETARY MENU */}
                    {userRole === 'secretary' && (
                        <>
                            <li className={`${styles.navItem} ${isActive('/secretary/manage-patients') ? styles.active : ''}`} onClick={() => navigate('/secretary/manage-patients')}>
                                <img src={patientSideIcon} alt="Patients" className={styles.icon} />
                                <span>Patient Registration</span> {/* Renamed for clarity */}
                            </li>

                            <li className={`${styles.navItem} ${isActive('/secretary/billing') ? styles.active : ''}`} onClick={() => navigate('/secretary/billing')}>
                                <img src={billingIcon || financeIcon} alt="Billing" className={styles.icon} />
                                <span>Billing & Payments</span>
                            </li>

                            <li className={`${styles.navItem} ${isActive('/secretary/document-management') ? styles.active : ''}`} onClick={() => navigate('/secretary/document-management')}>
                                <img src={folderIcon || usersIcon} alt="Docs" className={styles.icon} />
                                <span>Documents</span>
                            </li>
                        </>
                    )}

                    {/* PATIENT MENU */}
                    {userRole === 'patient' && (
                        <>
                            <li className={`${styles.navItem} ${isActive('/patient/aipost-op') ? styles.active : ''}`} onClick={() => navigate('/patient/aipost-op')}>
                                <img src={cameraIcon || dashboardIcon} alt="AI Check" className={styles.icon} />
                                <span>AI Post-Op</span>
                            </li>
                            <li className={`${styles.navItem} ${isActive('/patient/my-finances') ? styles.active : ''}`} onClick={() => navigate('/patient/my-finances')}>
                                <img src={billingIcon} alt="Finance" className={styles.icon} />
                                <span>My Finances</span>
                            </li>
                        </>
                    )}

                    {/* SETTINGS (All Roles) */}
                    <li className={`${styles.navItem} ${isSettingsActive ? styles.active : ''}`} onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsUserMgmtOpen(false); }}>
                        <div className={styles.navHeader}>
                            <div className={styles.navLabel}><img src={settingsIcon} alt="Settings" className={styles.icon} /><span>Settings</span></div>
                            <span className={`${styles.arrow} ${isSettingsOpen ? styles.rotate : ''}`}>▼</span>
                        </div>
                    </li>
                    <div className={`${styles.subMenuContainer} ${isSettingsOpen ? styles.show : ''}`}>
                        <ul className={styles.subMenu}>
                            <li onClick={() => navigate(`/${userRole}/settings/personal`)} className={isActive(`/${userRole}/settings/personal`) ? styles.subActive : ''}>Personal Information</li>
                            <li onClick={() => navigate(`/${userRole}/settings/security`)} className={isActive(`/${userRole}/settings/security`) ? styles.subActive : ''}>Password & Security</li>
                        </ul>
                    </div>

                </ul>

                <div className={styles.logoutSection}>
                    <button className={styles.logoutBtn} onClick={() => setShowLogoutModal(true)}>LOGOUT</button>
                </div>
            </div>

            {showLogoutModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Confirm Logout</h3>
                        <p className={styles.modalMessage}>Are you sure you want to log out?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className={styles.modalLogoutBtn} onClick={handleLogout}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}