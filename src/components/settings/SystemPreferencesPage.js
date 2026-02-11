import React from 'react';
import styles from '../../styles/settings/SystemPreferencesPage.module.css';

export default function SystemPreferencesPage() {
    // Sample data
    const preferences = [
        { id: 'theme', label: 'Theme', value: 'Light', options: ['Light', 'Dark'] },
        { id: 'language', label: 'Language', value: 'English', options: ['English', 'Filipino'] },
        { id: 'notifications', label: 'Enable Email Notifications', value: true },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>System Preferences</h1>
            </div>
            <p className={styles.subtitle}>Adjust your system-wide settings.</p>

            <div className={styles.formContainer}>
                {preferences.map(pref => (
                    <div key={pref.id} className={styles.formGroup}>
                        <label htmlFor={pref.id} className={styles.label}>{pref.label}</label>
                        {Array.isArray(pref.options) ? (
                            <select id={pref.id} className={styles.select} defaultValue={pref.value}>
                                {pref.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <label className={styles.switch}>
                                <input type="checkbox" defaultChecked={pref.value} />
                                <span className={styles.slider}></span>
                            </label>
                        )}
                    </div>
                ))}
                <div className={styles.actions}>
                    <button className={styles.saveButton}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
