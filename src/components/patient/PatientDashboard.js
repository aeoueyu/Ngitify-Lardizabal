import React from 'react';
import styles from '../../styles/patient/PatientDashboard.module.css';

const PatientDashboard = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>Next Appointment</h3>
                    <p>Date: February 20, 2026</p>
                    <p>Time: 10:00 AM</p>
                    <p>Assigned Dentist: Dr. Maria Clara</p>
                </div>
                <div className={styles.card}>
                    <h3>Outstanding Balance</h3>
                    <p>Amount: ₱5,000.00</p>
                    <p className={styles.dueDate}>Due: February 28, 2026</p>
                </div>
                <div className={`${styles.card} ${styles.notificationsCard}`}>
                    <h3>Notifications</h3>
                    <ul>
                        <li>New ticket update: Your inquiry has been received.</li>
                        <li>Billing due soon for your recent cleaning.</li>
                        <li>Predictive simulation results are now available for viewing.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
