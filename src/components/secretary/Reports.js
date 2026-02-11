import React from 'react';
import styles from '../../styles/secretary/Reports.module.css';

const Reports = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Reports & Logs</h1>
            </div>

            <div className={styles.reportsGrid}>
                <div className={styles.reportCard}>
                    <h3 className={styles.cardTitle}>Daily Patient Registration</h3>
                    <p className={styles.cardValue}>12</p>
                    <button className={styles.viewButton}>View Report</button>
                </div>
                <div className={styles.reportCard}>
                    <h3 className={styles.cardTitle}>Surgery Schedule Summary</h3>
                    <p className={styles.cardValue}>5 Upcoming</p>
                    <button className={styles.viewButton}>View Report</button>
                </div>
                <div className={styles.reportCard}>
                    <h3 className={styles.cardTitle}>Billing Collection Report</h3>
                    <p className={styles.cardValue}>₱45,000</p>
                    <button className={styles.viewButton}>View Report</button>
                </div>
                <div className={styles.reportCard}>
                    <h3 className={styles.cardTitle}>Staff Attendance Log</h3>
                    <p className={styles.cardValue}>4 On Duty</p>
                    <button className={styles.viewButton}>View Log</button>
                </div>
                <div className={styles.reportCard}>
                    <h3 className={styles.cardTitle}>Ticket Resolution Report</h3>
                    <p className={styles.cardValue}>85% Resolved</p>
                    <button className={styles.viewButton}>View Report</button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
