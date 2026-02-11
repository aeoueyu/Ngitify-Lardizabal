import React from 'react';
import styles from '../../../styles/user-management/ManageDentists.module.css'; // Re-use the same style
import customStyles from '../../../styles/settings/SystemPreferencesPage.module.css'; // Custom styles for form elements

export default function SystemPreferencesPage() {
    // Sample data
    const preferences = [
        { id: 'theme', label: 'Theme', value: 'Light', options: ['Light', 'Dark'] },
        { id: 'language', label: 'Language', value: 'English', options: ['English', 'Filipino'] },
        { id: 'notifications', label: 'Enable Email Notifications', value: true },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>System Preferences</h1>
                    <p className={styles.subTitle}>Adjust your system-wide settings.</p>
                </div>
            </div>

            <div className={customStyles.formContainer}>
                {preferences.map(pref => (
                    <div key={pref.id} className={customStyles.formGroup}>
                        <label htmlFor={pref.id} className={customStyles.label}>{pref.label}</label>
                        {Array.isArray(pref.options) ? (
                            <select id={pref.id} className={customStyles.select} defaultValue={pref.value}>
                                {pref.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <label className={customStyles.switch}>
                                <input type="checkbox" defaultChecked={pref.value} />
                                <span className={customStyles.slider}></span>
                            </label>
                        )}
                    </div>
                ))}
                <div className={customStyles.actions}>
                    <button className={customStyles.saveButton}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}