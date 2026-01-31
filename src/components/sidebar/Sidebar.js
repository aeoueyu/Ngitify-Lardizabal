import React, { useState } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css';
import logo from '../../assets/logo-white.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

// Import Sidebar Icons
import dashboardIcon from '../../assets/sidebar-icons/dashboard.svg';
import usersIcon from '../../assets/sidebar-icons/users.svg';
import settingsIcon from '../../assets/sidebar-icons/settings.svg';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State para sa dropdown ng User Management
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);

    // Helper para malaman kung active ang link
    const isActive = (path) => location.pathname === path;

    // Helper para malaman kung active ang parent menu (User Mgmt)
    const isUserMgmtActive = location.pathname.includes('/owner/manage');

    const handleLogout = () => {
        // Clear session logic here if needed
        navigate('/login');
    };

    return (
        <div className={styles.sidebar}>
            {/* Logo Section */}
            <div className={styles.logoContainer}>
                <img src={logo} alt="NgitiFy" className={styles.logo} />
            </div>

            {/* Navigation Menu */}
            <ul className={styles.navMenu}>
                
                {/* DASHBOARD */}
                <li 
                    className={`${styles.navItem} ${isActive('/owner/dashboard') ? styles.active : ''}`}
                    onClick={() => navigate('/owner/dashboard')}
                >
                    <img src={dashboardIcon} alt="Dashboard" className={styles.icon} />
                    <span>Dashboard</span>
                </li>

                {/* USER MANAGEMENT (Dropdown) */}
                <li 
                    className={`${styles.navItem} ${isUserMgmtOpen || isUserMgmtActive ? styles.parentActive : ''}`}
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
                    className={`${styles.navItem} ${isActive('/owner/settings') ? styles.active : ''}`}
                    onClick={() => navigate('/owner/settings')}
                >
                    <img src={settingsIcon} alt="Settings" className={styles.icon} />
                    <span>Settings</span>
                </li>
            </ul>

            {/* Logout Button */}
            <div className={styles.logoutSection}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    LOGOUT
                </button>
            </div>
        </div>
    );
}