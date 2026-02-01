import React, { useState, useEffect } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css';
import logo from '../../assets/logo-white.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

// Import Icons
import dashboardIcon from '../../assets/sidebar-icons/dashboard.svg';
import usersIcon from '../../assets/sidebar-icons/users.svg';
import settingsIcon from '../../assets/sidebar-icons/settings.svg';
import warningIcon from '../../assets/alert-icons/warning.svg'; // Import Warning Icon

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // States
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal State

    const isActive = (path) => location.pathname === path;
    const isUserMgmtActive = location.pathname.includes('/owner/manage');

    // Auto-open submenu based on URL
    useEffect(() => {
        if (location.pathname.includes('/owner/manage')) {
            setIsUserMgmtOpen(true);
        } else {
            setIsUserMgmtOpen(false);
        }
    }, [location.pathname]);

    // HANDLERS
    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Open Modal instead of direct logout
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        navigate('/login'); // Proceed to logout
    };

    const cancelLogout = () => {
        setShowLogoutModal(false); // Close Modal
    };

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="NgitiFy" className={styles.logo} />
                </div>

                <ul className={styles.navMenu}>
                    
                    {/* DASHBOARD */}
                    <li 
                        className={`${styles.navItem} ${isActive('/owner/dashboard') && !isUserMgmtOpen ? styles.active : ''}`}
                        onClick={() => navigate('/owner/dashboard')}
                    >
                        <img src={dashboardIcon} alt="Dashboard" className={styles.icon} />
                        <span>Dashboard</span>
                    </li>

                    {/* USER MANAGEMENT */}
                    <li 
                        className={`${styles.navItem} ${isUserMgmtOpen || isUserMgmtActive ? styles.active : ''}`}
                        onClick={() => setIsUserMgmtOpen(!isUserMgmtOpen)}
                    >
                        <div className={styles.navHeader}>
                            <div className={styles.navLabel}>
                                <img src={usersIcon} alt="Users" className={styles.icon} />
                                <span>User Management</span>
                            </div>
                            <span className={`${styles.arrow} ${isUserMgmtOpen ? styles.rotate : ''}`}>▼</span>
                        </div>
                    </li>

                    {/* SUBMENU ITEMS */}
                    <div className={`${styles.subMenuContainer} ${isUserMgmtOpen ? styles.show : ''}`}>
                        <ul className={styles.subMenu}>
                            <li 
                                className={isActive('/owner/manage-dentists') ? styles.subActive : ''}
                                onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-dentists'); }}
                            >
                                Dentists
                            </li>
                            <li 
                                className={isActive('/owner/manage-staff') ? styles.subActive : ''}
                                onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-staff'); }}
                            >
                                Staff
                            </li>
                            <li 
                                className={isActive('/owner/manage-patients') ? styles.subActive : ''}
                                onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-patients'); }}
                            >
                                Patients
                            </li>
                        </ul>
                    </div>

                    {/* SETTINGS */}
                    <li 
                        className={`${styles.navItem} ${isActive('/owner/settings') && !isUserMgmtOpen ? styles.active : ''}`}
                        onClick={() => navigate('/owner/settings')}
                    >
                        <img src={settingsIcon} alt="Settings" className={styles.icon} />
                        <span>Settings</span>
                    </li>
                </ul>

                <div className={styles.logoutSection}>
                    <button className={styles.logoutBtn} onClick={handleLogoutClick}>
                        LOGOUT
                    </button>
                </div>
            </div>

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            {showLogoutModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Confirm Logout</h3>
                        <p className={styles.modalMessage}>Are you sure you want to log out?</p>
                        
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={cancelLogout}>Cancel</button>
                            <button className={styles.modalLogoutBtn} onClick={confirmLogout}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}