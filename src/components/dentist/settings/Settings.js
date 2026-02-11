import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styles from '../../../styles/dentist/settings/Settings.module.css';

const pageTitles = {
    account: 'Account Settings',
    schedule: 'Schedule Settings',
    clinical: 'Clinical Preferences',
    notifications: 'Notification Settings',
    revenue: 'Revenue Settings',
};

export default function Settings() {
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();
    const pageTitle = pageTitles[currentPath] || 'Settings';

    return (
        <div className={styles.container}>
            <header className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>{pageTitle}</h1>
                    <p className={styles.subTitle}>Manage your account and preferences.</p>
                </div>
            </header>

                <div className={styles.settingsContent}>
                    <Outlet />
                </div>
        </div>
    );
}