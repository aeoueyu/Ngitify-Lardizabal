import React from 'react';
import styles from '../../../styles/dentist/settings/Settings.module.css';

const ToggleSwitch = ({ label, defaultChecked }) => (
    <div className={styles.toggleContainer}>
        <span>{label}</span>
        <label className={styles.switch}>
            <input type="checkbox" defaultChecked={defaultChecked} />
            <span className={styles.slider}></span>
        </label>
    </div>
);

export default function NotificationSettings() {
    return (
        <div>
            <h2 className={styles.subHeader}>Notification Preferences</h2>
            <p>Choose which notifications you want to receive.</p>
            
            <div className={styles.notificationList}>
                <ToggleSwitch label="Reminders for upcoming surgeries" defaultChecked={true} />
                <ToggleSwitch label="Alerts for new patient assignments" defaultChecked={true} />
                <ToggleSwitch label="Commission updates (when revenue summary is updated)" defaultChecked={false} />
                <ToggleSwitch label="System announcements and updates" defaultChecked={true} />
            </div>
        </div>
    );
}