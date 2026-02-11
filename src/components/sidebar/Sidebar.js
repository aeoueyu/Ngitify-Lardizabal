import React, { useState, useEffect } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css';
import logo from '../../assets/logo-white.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

// Import Modal
import Modal from '../modal/Modal'; 

// Icons
import dashboardIcon from '../../assets/sidebar-icons/dashboard.svg';
import usersIcon from '../../assets/sidebar-icons/users.svg';
import settingsIcon from '../../assets/sidebar-icons/settings.svg';
import warningIcon from '../../assets/alert-icons/warning.svg'; 
import patientSideIcon from '../../assets/sidebar-icons/patient2.svg'; 

// Dentist Icons
import financeIcon from '../../assets/sidebar-icons/finance.svg';
import recordIcon from '../../assets/sidebar-icons/patient-record.svg';
import scheduleIcon from '../../assets/sidebar-icons/schedule.svg';

import billingIcon from '../../assets/sidebar-icons/finance.svg'; // Or finance.svg
import folderIcon from '../../assets/sidebar-icons/folder.svg';

import cameraIcon from '../../assets/sidebar-icons/camera.svg';
import dentistIcon from '../../assets/sidebar-icons/dentist.svg'; // Placeholder if none
import surgeriesIcon from '../../assets/sidebar-icons/surgeries.svg';
import analyticsIcon from '../../assets/sidebar-icons/analytics.svg'; // Placeholder if none

// NEW ICON (Ensure you have this!)
import clinicIcon from '../../assets/sidebar-icons/clinic.svg'; // If wala pa, use users.svg temporarily

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const userRole = localStorage.getItem('role') || 'patient'; 

    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
    const [isSurgeryMgmtOpen, setIsSurgeryMgmtOpen] = useState(false);
    const [isFinanceMgmtOpen, setIsFinanceMgmtOpen] = useState(false);
    const [isDentistToolsOpen, setIsDentistToolsOpen] = useState(false);
    const [isRevenueOpen, setIsRevenueOpen] = useState(false);
    const [isDentistSettingsOpen, setIsDentistSettingsOpen] = useState(false);
    const [isOwnerSettingsOpen, setIsOwnerSettingsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleRevenue = () => {
        setIsRevenueOpen(!isRevenueOpen);
        if (isDentistToolsOpen) setIsDentistToolsOpen(false);
        if (isDentistSettingsOpen) setIsDentistSettingsOpen(false);
    };

    const toggleDentistTools = () => {
        setIsDentistToolsOpen(!isDentistToolsOpen);
        if (isRevenueOpen) setIsRevenueOpen(false);
        if (isDentistSettingsOpen) setIsDentistSettingsOpen(false);
    };

    const toggleDentistSettings = () => {
        setIsDentistSettingsOpen(!isDentistSettingsOpen);
        if (isRevenueOpen) setIsRevenueOpen(false);
        if (isDentistToolsOpen) setIsDentistToolsOpen(false);
    };

    const toggleOwnerSettings = () => {
        setIsOwnerSettingsOpen(!isOwnerSettingsOpen);
    };

    const isActive = (path) => location.pathname === path;
    const isUserMgmtActive = location.pathname.includes('/owner/manage') || 
                             location.pathname.includes('/owner/assign-permissions');
    const isSurgeryMgmtActive = location.pathname.includes('/owner/surgery');
    const isFinanceMgmtActive = location.pathname.includes('/owner/billing-finance');
    const isDentistToolsActive = location.pathname.includes('/tools');
    const isRevenueActive = location.pathname.includes('/dentist/revenue');
    const isDentistSettingsActive = location.pathname.includes('/dentist/settings');
    const isOwnerSettingsActive = location.pathname.includes('/owner/settings');

    useEffect(() => {
        if (isUserMgmtActive) {
            setIsUserMgmtOpen(true);
        } else if (isSurgeryMgmtActive) {
            setIsSurgeryMgmtOpen(true);
        } else if (isDentistToolsActive) {
            setIsDentistToolsOpen(true);
        } else if (isRevenueActive) {
            setIsRevenueOpen(true);
        } else if (isDentistSettingsActive) {
            setIsDentistSettingsOpen(true);
        } else if (isOwnerSettingsActive) {
            setIsOwnerSettingsOpen(true);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            const email = localStorage.getItem('userEmail'); // Assuming you store email in localStorage
            const role = localStorage.getItem('role');
            await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role })
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.clear();
            setShowLogoutModal(false); // Close modal
            navigate('/login', { replace: true });
        }
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
                            <li className={`${styles.navItem} ${isSurgeryMgmtActive ? styles.active : ''}`} onClick={() => {
                                if (isSurgeryMgmtActive) {
                                    setIsSurgeryMgmtOpen(!isSurgeryMgmtOpen);
                                } else {
                                    navigate('/owner/surgery-scheduling');
                                }
                            }}>
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


                            <li className={`${styles.navItem} ${isFinanceMgmtActive ? styles.active : ''}`} onClick={() => navigate('/owner/billing-finance')}>
                                <img src={financeIcon} alt="Finance" className={styles.icon} />
                                <span>Billing & Finance</span>
                            </li>

                            {/* Management Section */}
                            <li className={`${styles.navItem} ${isUserMgmtActive ? styles.active : ''}`} onClick={() => {
                                if (isUserMgmtActive) {
                                    setIsUserMgmtOpen(!isUserMgmtOpen);
                                } else {
                                    navigate('/owner/manage-dentists');
                                }
                            }}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={usersIcon} alt="Users" className={styles.icon} /><span>User Management</span></div>
                                    <span className={`${styles.arrow} ${isUserMgmtOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isUserMgmtOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/owner/manage-dentists')} className={isActive('/owner/manage-dentists') ? styles.subActive : ''}>Dentists</li>
                                    <li onClick={() => navigate('/owner/manage-secretaries')} className={isActive('/owner/manage-secretaries') ? styles.subActive : ''}>Secretaries</li>
                                    <li onClick={() => navigate('/owner/manage-branch-owners')} className={isActive('/owner/manage-branch-owners') ? styles.subActive : ''}>Branch Owners</li>
                                    <li onClick={() => navigate('/owner/assign-permissions')} className={isActive('/owner/assign-permissions') ? styles.subActive : ''}>Assign Permissions</li>
                                </ul>
                            </div>

                            <li className={`${styles.navItem} ${isActive('/owner/staff-calendar') ? styles.active : ''}`} onClick={() => navigate('/owner/staff-calendar')}>
                                <img src={scheduleIcon} alt="Staff Calendar" className={styles.icon} />
                                <span>Staff Calendar</span>
                            </li>

                            <li className={`${styles.navItem} ${isActive('/owner/reports-analytics') ? styles.active : ''}`} onClick={() => navigate('/owner/reports-analytics')}>
                                <img src={analyticsIcon} alt="Reports" className={styles.icon} />
                                <span>Reports & Analytics</span>
                            </li>




                            {/* MY PRACTICE (Dentist Features for Owner) */}
                            <div className={styles.sectionDivider}>MY PRACTICE</div>

                            <li className={`${styles.navItem} ${isDentistToolsActive ? styles.active : ''}`} onClick={() => {
                                if (isDentistToolsActive) {
                                    setIsDentistToolsOpen(!isDentistToolsOpen);
                                } else {
                                    navigate('/owner/dentist-tools/assigned-surgeries');
                                }
                            }}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={dentistIcon} alt="Tools" className={styles.icon} /><span>Dentist Tools</span></div>
                                    <span className={`${styles.arrow} ${isDentistToolsOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isDentistToolsOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/owner/dentist-tools/assigned-surgeries')} className={isActive('/owner/dentist-tools/assigned-surgeries') ? styles.subActive : ''}>View Assigned Surgeries</li>
                                    <li onClick={() => navigate('/owner/dentist-tools/treatment-notes')} className={isActive('/owner/dentist-tools/treatment-notes') ? styles.subActive : ''}>Add Treatment Notes</li>
                                    <li onClick={() => navigate('/owner/dentist-tools/records')} className={isActive('/owner/dentist-tools/records') ? styles.subActive : ''}>Access Odontogram & X-Ray</li>
                                </ul>
                            </div>
                            <li className={`${styles.navItem} ${isOwnerSettingsActive ? styles.active : ''}`} onClick={toggleOwnerSettings}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={settingsIcon} alt="Settings" className={styles.icon} /><span>Settings</span></div>
                                    <span className={`${styles.arrow} ${isOwnerSettingsOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isOwnerSettingsOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/owner/settings/account')} className={isActive('/owner/settings/account') ? styles.subActive : ''}>Account Settings</li>
                                    <li onClick={() => navigate('/owner/settings/branch')} className={isActive('/owner/settings/branch') ? styles.subActive : ''}>Branch Settings</li>
                                    <li onClick={() => navigate('/owner/settings/system')} className={isActive('/owner/settings/system') ? styles.subActive : ''}>System Preferences</li>
                                    <li onClick={() => navigate('/owner/settings/financial')} className={isActive('/owner/settings/financial') ? styles.subActive : ''}>Financial Settings</li>
                                    <li onClick={() => navigate('/owner/settings/audit')} className={isActive('/owner/settings/audit') ? styles.subActive : ''}>Audit Logs</li>
                                </ul>
                            </div>
                        </>
                    )}

                    {/* DENTIST MENU */}
                    {userRole === 'dentist' && (
                        <>
                            <li className={`${styles.navItem} ${isActive('/dentist/patient-records') ? styles.active : ''}`} onClick={() => navigate('/dentist/patient-records')}>
                                <img src={recordIcon} alt="Records" className={styles.icon} /><span>Patient Records</span>
                            </li>
                            <li className={`${styles.navItem} ${isActive('/dentist/surgeries') ? styles.active : ''}`} onClick={() => navigate('/dentist/surgeries')}>
                                <img src={surgeriesIcon} alt="Surgeries" className={styles.icon} /><span>Surgeries</span>
                            </li>
                            <li className={`${styles.navItem} ${isDentistToolsActive ? styles.active : ''}`} onClick={() => {
                                 if (isDentistToolsActive) {
                                     setIsDentistToolsOpen(!isDentistToolsOpen);
                                 } else {
                                     navigate('/dentist/tools/assigned-surgeries');
                                 }
                             }}>
                                 <div className={styles.navHeader}>
                                     <div className={styles.navLabel}><img src={dentistIcon} alt="Tools" className={styles.icon} /><span>Dentist Tools</span></div>
                                     <span className={`${styles.arrow} ${isDentistToolsOpen ? styles.rotate : ''}`}>▼</span>
                                 </div>
                             </li>
                             <div className={`${styles.subMenuContainer} ${isDentistToolsOpen ? styles.show : ''}`}>
                                 <ul className={styles.subMenu}>
                                     <li onClick={() => navigate('/dentist/tools/assigned-surgeries')} className={isActive('/dentist/tools/assigned-surgeries') ? styles.subActive : ''}>View Assigned Surgeries</li>
                                     <li onClick={() => navigate('/dentist/tools/treatment-notes')} className={isActive('/dentist/tools/treatment-notes') ? styles.subActive : ''}>Add Treatment Notes</li>
                                     <li onClick={() => navigate('/dentist/tools/records')} className={isActive('/dentist/tools/records') ? styles.subActive : ''}>Access Odontogram & X-Ray</li>
                                     <li onClick={() => navigate('/dentist/tools/personal-calendar')} className={isActive('/dentist/tools/personal-calendar') ? styles.subActive : ''}>Personal Calendar</li>
                                 </ul>
                             </div>
                            <li className={`${styles.navItem} ${isRevenueActive ? styles.active : ''}`} onClick={() => {
                                if (isRevenueActive) {
                                    setIsRevenueOpen(!isRevenueOpen);
                                } else {
                                    navigate('/dentist/revenue/commission-view');
                                }
                            }}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={financeIcon} alt="Revenue" className={styles.icon} /><span>Revenue & Commission</span></div>
                                    <span className={`${styles.arrow} ${isRevenueOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isRevenueOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/dentist/revenue/commission-view')} className={isActive('/dentist/revenue/commission-view') ? styles.subActive : ''}>View Commission</li>
                                    <li onClick={() => navigate('/dentist/revenue/earnings-summary')} className={isActive('/dentist/revenue/earnings-summary') ? styles.subActive : ''}>Monthly Earnings Summary</li>
                                </ul>
                            </div>
                            <li className={`${styles.navItem} ${isDentistSettingsActive ? styles.active : ''}`} onClick={toggleDentistSettings}>
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}><img src={settingsIcon} alt="Settings" className={styles.icon} /><span>Settings</span></div>
                                    <span className={`${styles.arrow} ${isDentistSettingsOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isDentistSettingsOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li onClick={() => navigate('/dentist/settings/account')} className={isActive('/dentist/settings/account') ? styles.subActive : ''}>Account Settings</li>
                                    <li onClick={() => navigate('/dentist/settings/schedule')} className={isActive('/dentist/settings/schedule') ? styles.subActive : ''}>Schedule Settings</li>
                                    <li onClick={() => navigate('/dentist/settings/clinical')} className={isActive('/dentist/settings/clinical') ? styles.subActive : ''}>Clinical Preferences</li>
                                    <li onClick={() => navigate('/dentist/settings/notifications')} className={isActive('/dentist/settings/notifications') ? styles.subActive : ''}>Notification Settings</li>
                                    <li onClick={() => navigate('/dentist/settings/revenue')} className={isActive('/dentist/settings/revenue') ? styles.subActive : ''}>Revenue Settings</li>
                                </ul>
                            </div>
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
                            <li className={`${styles.navItem} ${location.pathname.includes('/secretary/settings') ? styles.active : ''}`} onClick={() => navigate('/secretary/settings')}>
                                <img src={settingsIcon} alt="Settings" className={styles.icon} />
                                <span>Settings</span>
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

                </ul>

                <div className={styles.logoutSection}>
                    <button className={styles.logoutBtn} onClick={() => setShowLogoutModal(true)}>LOGOUT</button>
                </div>
            </div>

            {/* Logout Modal Rendered Here */}
            {showLogoutModal && (
                <Modal
                    icon={warningIcon}
                    title="Logout"
                    body="Are you sure you want to logout?"
                    primaryButtonText="Yes, Logout"
                    secondaryButtonText="Cancel"
                    onPrimaryClick={handleLogout}
                    onSecondaryClick={() => setShowLogoutModal(false)}
                    onClose={() => setShowLogoutModal(false)}
                />
            )}
        </>
    );
}