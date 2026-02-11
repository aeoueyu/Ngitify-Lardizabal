import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from '../../styles/settings/SettingsPage.module.css';

export default function SettingsPage() {
    const userRole = localStorage.getItem('role'); 

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
