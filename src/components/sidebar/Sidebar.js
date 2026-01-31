import React, { useState } from 'react';
import styles from '../../styles/sidebar/Sidebar.module.css'; // Gagawa tayo ng module css para dito
import logo from '../../assets/logo-white.svg'; // Siguraduhin na may white version ka, kung wala use text muna
import { useNavigate, useLocation } from 'react-router-dom';

// Icons (Pwede mong palitan ng actual icons mo later, gumamit muna ako ng text/unicode)
// Mas maganda kung may library ka like 'react-icons' o yung svg assets mo.

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State para sa dropdown ng User Management
    const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);

    // Helper para malaman kung active ang link
    const isActive = (path) => location.pathname === path;

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
                    <span className={styles.icon}>📊</span> {/* Palitan ng SVG mo */}
                    Dashboard
                </li>

                {/* USER MANAGEMENT (Dropdown) */}
                <li 
                    className={`${styles.navItem} ${isUserMgmtOpen ? styles.open : ''}`}
                    onClick={() => setIsUserMgmtOpen(!isUserMgmtOpen)}
                >
                    <div className={styles.navHeader}>
                        <span>
                            <span className={styles.icon}>👥</span>
                            User Management
                        </span>
                        <span className={styles.arrow}>{isUserMgmtOpen ? '▲' : '▼'}</span>
                    </div>
                </li>

                {/* SUBMENU ITEMS */}
                {isUserMgmtOpen && (
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
                )}

                {/* SETTINGS */}
                <li 
                    className={`${styles.navItem} ${isActive('/owner/settings') ? styles.active : ''}`}
                    onClick={() => navigate('/owner/settings')}
                >
                    <span className={styles.icon}>⚙️</span>
                    Settings
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