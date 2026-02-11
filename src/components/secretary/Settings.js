import React, { useState } from 'react';
import styles from '../../styles/secretary/Settings.module.css';
import AccountSettingsPage from '../settings/AccountSettingsPage';

const SecretarySettings = () => {
    const [activeTab, setActiveTab] = useState('account');

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <AccountSettingsPage />;
            case 'notifications':
                return <NotificationSettings />;
            case 'appearance':
                return <AppearanceSettings />;
            default:
                return <AccountSettingsPage />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.title}>Settings</h2>
                <button 
                    className={`${styles.sidebarButton} ${activeTab === 'account' ? styles.active : ''}`} 
                    onClick={() => setActiveTab('account')}>
                    Account
                </button>
                <button 
                    className={`${styles.sidebarButton} ${activeTab === 'notifications' ? styles.active : ''}`} 
                    onClick={() => setActiveTab('notifications')}>
                    Notifications
                </button>
                <button 
                    className={`${styles.sidebarButton} ${activeTab === 'appearance' ? styles.active : ''}`} 
                    onClick={() => setActiveTab('appearance')}>
                    Language & Theme
                </button>
            </div>
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};

const NotificationSettings = () => (
    <div className={styles.staticPage}>
        <h3 className={styles.pageTitle}>Notification Preferences</h3>
        <div className={styles.settingItem}>
            <label>Email Notifications for New Surgeries</label>
            <input type="checkbox" defaultChecked />
        </div>
        <div className={styles.settingItem}>
            <label>SMS Alerts for Pending Payments</label>
            <input type="checkbox" />
        </div>
        <div className={styles.settingItem}>
            <label>Desktop Notifications for New Chatbot Tickets</label>
            <input type="checkbox" defaultChecked />
        </div>
    </div>
);

const AppearanceSettings = () => (
    <div className={styles.staticPage}>
        <h3 className={styles.pageTitle}>Language & Theme</h3>
        <div className={styles.settingItem}>
            <label>Language</label>
            <select>
                <option>English</option>
                <option>Tagalog</option>
            </select>
        </div>
        <div className={styles.settingItem}>
            <label>Theme</label>
            <select>
                <option>Light Mode</option>
                <option>Dark Mode</option>
            </select>
        </div>
    </div>
);

export default SecretarySettings;
