import React, { useState, useEffect } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css';
import logo from '../../assets/logo-white.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

// Icons
import dashboardIcon from '../../assets/sidebar-icons/dashboard.svg';
import usersIcon from '../../assets/sidebar-icons/users.svg';
import settingsIcon from '../../assets/sidebar-icons/settings.svg';
import warningIcon from '../../assets/alert-icons/warning.svg'; 
import patientSideIcon from '../../assets/icons/patient.svg'; 
import auditIcon from '../../assets/sidebar-icons/audit.svg';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const userRole = localStorage.getItem('role') || 'patient'; 

    // Dropdown States
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // --- HELPER FOR ACTIVE STATE ---
    // Check exact path match
    const isActive = (path) => location.pathname === path;
    
    // Check if parent path allows active state (e.g. /owner/manage-dentists makes User Mgmt active)
    const isUserMgmtActive = location.pathname.includes('/owner/manage');
    const isSettingsActive = location.pathname.includes('/settings');

    // Auto-open submenu based on current URL on load
    useEffect(() => {
        if (isUserMgmtActive) {
            setIsUserMgmtOpen(true);
            setIsSettingsOpen(false);
        } else if (isSettingsActive) {
            setIsSettingsOpen(true);
            setIsUserMgmtOpen(false);
        } else {
            setIsUserMgmtOpen(false);
            setIsSettingsOpen(false);
        }
    }, [location.pathname, isUserMgmtActive, isSettingsActive]);

    // --- NAVIGATION HANDLERS ---

    const handleDashboardClick = () => {
        // Close others
        setIsUserMgmtOpen(false);
        setIsSettingsOpen(false);
        navigate(`/${userRole}/dashboard`);
    };

    const handleUserMgmtClick = () => {
        // 1. Open Dropdown
        setIsUserMgmtOpen(true);
        // 2. Close others
        setIsSettingsOpen(false);
        // 3. Navigate to DEFAULT tab (Manage Dentists)
        navigate('/owner/manage-dentists');
    };

    const handleSettingsClick = () => {
        // 1. Open Dropdown
        setIsSettingsOpen(true);
        // 2. Close others
        setIsUserMgmtOpen(false);
        // 3. Navigate to DEFAULT tab (Personal Info)
        navigate(`/${userRole}/settings/personal`);
    };

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
                    
                    {/* 1. DASHBOARD */}
                    <li 
                        className={`${styles.navItem} ${isActive(`/${userRole}/dashboard`) ? styles.active : ''}`}
                        onClick={handleDashboardClick}
                    >
                        <img src={dashboardIcon} alt="Dashboard" className={styles.icon} />
                        <span>Dashboard</span>
                    </li>

                    {/* 2. USER MANAGEMENT (Owner Only) */}
                    {userRole === 'owner' && (
                        <>
                            <li 
                                className={`${styles.navItem} ${isUserMgmtActive ? styles.active : ''}`}
                                onClick={handleUserMgmtClick}
                            >
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}>
                                        <img src={usersIcon} alt="Users" className={styles.icon} />
                                        <span>User Management</span>
                                    </div>
                                    <span className={`${styles.arrow} ${isUserMgmtOpen ? styles.rotate : ''}`}>▼</span>
                                </div>
                            </li>
                            <div className={`${styles.subMenuContainer} ${isUserMgmtOpen ? styles.show : ''}`}>
                                <ul className={styles.subMenu}>
                                    <li 
                                        onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-dentists'); }} 
                                        className={isActive('/owner/manage-dentists') ? styles.subActive : ''}
                                    >
                                        Dentists
                                    </li>
                                    <li 
                                        onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-secretaries'); }} 
                                        className={isActive('/owner/manage-secretaries') ? styles.subActive : ''}
                                    >
                                        Secretaries
                                    </li>
                                    <li 
                                        onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-patients'); }} 
                                        className={isActive('/owner/manage-patients') ? styles.subActive : ''}
                                    >
                                        Patients
                                    </li>
                                </ul>
                            </div>
                            <li 
                                className={`${styles.navItem} ${isActive('/owner/audit-logs') ? styles.active : ''}`}
                                onClick={() => navigate('/owner/audit-logs')}
                            >
                                <div className={styles.navHeader}>
                                    <div className={styles.navLabel}>
                                        {/* Palitan mo ng tamang path sa icon mo */}
                                        <img src={auditIcon} alt="Audit Logs" className={styles.icon} />
                                        <span>Audit Logs</span>
                                    </div>
                                </div>
                            </li>
                        </>
                    )}

                    {/* 3. PATIENT MANAGEMENT (Secretary Only) */}
                    {userRole === 'secretary' && (
                        <li 
                            className={`${styles.navItem} ${location.pathname.includes('patient') ? styles.active : ''}`}
                            onClick={() => navigate('/secretary/manage-patients')}
                        >
                            <img src={patientSideIcon} alt="Patients" className={styles.icon} style={{ filter: 'brightness(0) invert(1)' }} />
                            <span>Patient Management</span>
                        </li>
                    )}

                    {/* 4. SETTINGS (All Roles) */}
                    <li 
                        className={`${styles.navItem} ${isSettingsActive ? styles.active : ''}`}
                        onClick={handleSettingsClick}
                    >
                        <div className={styles.navHeader}>
                            <div className={styles.navLabel}>
                                <img src={settingsIcon} alt="Settings" className={styles.icon} />
                                <span>Settings</span>
                            </div>
                            <span className={`${styles.arrow} ${isSettingsOpen ? styles.rotate : ''}`}>▼</span>
                        </div>
                    </li>
                    <div className={`${styles.subMenuContainer} ${isSettingsOpen ? styles.show : ''}`}>
                        <ul className={styles.subMenu}>
                            <li 
                                onClick={(e) => { e.stopPropagation(); navigate(`/${userRole}/settings/personal`); }} 
                                className={isActive(`/${userRole}/settings/personal`) ? styles.subActive : ''}
                            >
                                Personal Information
                            </li>
                            <li 
                                onClick={(e) => { e.stopPropagation(); navigate(`/${userRole}/settings/security`); }} 
                                className={isActive(`/${userRole}/settings/security`) ? styles.subActive : ''}
                            >
                                Password & Security
                            </li>
                        </ul>
                    </div>

                </ul>

                <div className={styles.logoutSection}>
                    <button className={styles.logoutBtn} onClick={() => setShowLogoutModal(true)}>
                        LOGOUT
                    </button>
                </div>
            </div>

            {/* Logout Modal */}
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