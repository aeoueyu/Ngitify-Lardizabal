import React, { useState, useEffect } from 'react';
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
    
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    const isUserMgmtActive = location.pathname.includes('/owner/manage');

    // EFFECT: Auto-close/open base sa URL
    useEffect(() => {
        if (location.pathname.includes('/owner/manage')) {
            setIsUserMgmtOpen(true);
        } else {
            setIsUserMgmtOpen(false);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="NgitiFy" className={styles.logo} />
            </div>

            <ul className={styles.navMenu}>
                
                {/* DASHBOARD */}
                <li 
                    // UPDATED CONDITION: Active lang kung Dashboard route AND sarado ang User Mgmt
                    className={`${styles.navItem} ${isActive('/owner/dashboard') && !isUserMgmtOpen ? styles.active : ''}`}
                    onClick={() => {
                        navigate('/owner/dashboard');
                    }}
                >
                    <img src={dashboardIcon} alt="Dashboard" className={styles.icon} />
                    <span>Dashboard</span>
                </li>

                {/* USER MANAGEMENT */}
                <li 
                    // Ito ay active basta bukas siya o nasa loob ka ng subpages niya
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
                    // UPDATED CONDITION: Active lang kung Settings route AND sarado ang User Mgmt
                    className={`${styles.navItem} ${isActive('/owner/settings') && !isUserMgmtOpen ? styles.active : ''}`}
                    onClick={() => {
                        navigate('/owner/settings');
                    }}
                >
                    <img src={settingsIcon} alt="Settings" className={styles.icon} />
                    <span>Settings</span>
                </li>
            </ul>

            <div className={styles.logoutSection}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    LOGOUT
                </button>
            </div>
        </div>
    );
}