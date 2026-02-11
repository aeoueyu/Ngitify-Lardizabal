import React from 'react';
import styles from '../../../styles/dentist/settings/Settings.module.css';

export default function ScheduleSettings() {
    return (
        <div>
            <h2 className={styles.subHeader}>My Duty Calendar</h2>
            <p>This calendar is linked to the main Staff Calendar of your branch.</p>
            {/* Placeholder for a calendar component */}
            <div className={styles.calendarPlaceholder}>
                [Calendar Component Here]
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.subHeader}>Request Leave</h2>
            <div className={styles.formContainer}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="leaveStart">Start Date</label>
                        <input type="date" id="leaveStart" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="leaveEnd">End Date</label>
                        <input type="date" id="leaveEnd" />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="leaveReason">Reason (Optional)</label>
                    <textarea id="leaveReason" rows="3"></textarea>
                </div>
                <button className={styles.saveButton}>Submit Request</button>
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.subHeader}>Set Availability</h2>
            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="availability">Your Weekly Availability</label>
                    <input type="text" id="availability" defaultValue="Available Tue–Thu, 9 AM–5 PM" />
                </div>
                <button className={styles.saveButton}>Update Availability</button>
            </div>
        </div>
    );
}