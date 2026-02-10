import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from '../../styles/settings/SettingsPage.module.css';

export default function SettingsPage() {
    const userRole = localStorage.getItem('role'); 

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.sidebar}>
                <h1 className={styles.title}>Settings</h1>
                <ul className={styles.navList}>
                    <li>
                        <NavLink to="personal" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            Personal Information
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="security" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                            Security
                        </NavLink>
                    </li>
                    {userRole === 'owner' && (
                        <li>
                            <NavLink to="staff" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                Staff Management
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
