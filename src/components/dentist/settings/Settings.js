import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from '../../../styles/dentist/settings/Settings.module.css';

export default function Settings() {
    return (
        <div className={styles.container}>
            <header className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Settings</h1>
                    <p className={styles.subTitle}>Manage your account and preferences.</p>
                </div>
            </header>

            <div className={styles.settingsGrid}>
                <div className={styles.settingsContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}