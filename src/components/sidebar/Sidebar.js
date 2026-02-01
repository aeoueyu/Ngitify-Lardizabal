import React, { useState, useEffect } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css';
import logo from '../../assets/logo-white.svg'; 
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

// Import Sidebar Icons
import dashboardIcon from '../../assets/sidebar-icons/dashboard.svg';
import usersIcon from '../../assets/sidebar-icons/users.svg';
import settingsIcon from '../../assets/sidebar-icons/settings.svg';
import warningIcon from '../../assets/alert-icons/warning.svg'; 

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Kunin ang role para sa dynamic links
    const userRole = localStorage.getItem('userRole') || 'owner'; 

    // States
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Check active path for styling
    const isActive = (path) => location.pathname === path;
    const isUserMgmtActive = location.pathname.includes('/owner/manage');

    // Auto-open submenu
    useEffect(() => {
        if (location.pathname.includes('/owner/manage')) {
            setIsUserMgmtOpen(true);
        }
    }, [location.pathname]);

    // LOGOUT HANDLERS
    const handleLogoutClick = () => setShowLogoutModal(true);

    const confirmLogout = () => {
        localStorage.clear(); // Clear all data
        setShowLogoutModal(false);
        navigate('/login', { replace: true });
    };

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="NgitiFy" className={styles.logo} />
                </div>

                <ul className={styles.navMenu}>
                    
                    {/* --- DASHBOARD (Dynamic Link) --- */}
                    <li 
                        className={`${styles.navItem} ${isActive(`/${userRole}/dashboard`) && !isUserMgmtOpen ? styles.active : ''}`}
                        onClick={() => navigate(`/${userRole}/dashboard`)}
                    >
                        <img src={dashboardIcon} alt="Dashboard" className={styles.icon} />
                        <span>Dashboard</span>
                    </li>

                    {/* --- USER MANAGEMENT (Owner Only) --- */}
                    {userRole === 'owner' && (
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
                    )}

                    {/* SUBMENU ITEMS (Owner Only) */}
                    {userRole === 'owner' && (
                        <div className={`${styles.subMenuContainer} ${isUserMgmtOpen ? styles.show : ''}`}>
                            <ul className={styles.subMenu}>
                                <li 
                                    className={isActive('/owner/manage-dentists') ? styles.subActive : ''}
                                    onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-dentists'); }}
                                >
                                    Dentists
                                </li>
                                <li 
                                    className={isActive('/owner/manage-secretaries') ? styles.subActive : ''}
                                    onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-secretaries'); }}
                                >
                                    Secretaries
                                </li>
                                <li 
                                    className={isActive('/owner/manage-patients') ? styles.subActive : ''}
                                    onClick={(e) => { e.stopPropagation(); navigate('/owner/manage-patients'); }}
                                >
                                    Patients
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* --- SETTINGS (Dynamic Link) --- */}
                    <li 
                        className={`${styles.navItem} ${isActive(`/${userRole}/settings`) && !isUserMgmtOpen ? styles.active : ''}`}
                        onClick={() => navigate(`/${userRole}/settings`)}
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

            {/* --- LOGOUT MODAL --- */}
            {showLogoutModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Confirm Logout</h3>
                        <p className={styles.modalMessage}>Are you sure you want to log out?</p>
                        
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className={styles.modalLogoutBtn} onClick={confirmLogout}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}