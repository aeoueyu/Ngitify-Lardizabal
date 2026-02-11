import React from 'react';
import styles from '../../styles/patient/PatientNotifications.module.css';

const PatientNotifications = () => {
    const notifications = [
        { id: 1, type: 'reminder', message: 'Your appointment with Dr. Maria Clara is tomorrow at 10:00 AM.', time: '1 day ago' },
        { id: 2, type: 'billing', message: 'Your payment of ₱2,500.00 for Dental Cleaning was successful.', time: '3 days ago' },
        { id: 3, type: 'ticket', message: 'A new response has been added to your support ticket #12345.', time: '5 days ago' },
        { id: 4, type: 'simulation', message: 'Your AI Predictive Simulation results are ready to view.', time: '1 week ago' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'reminder': return '📅';
            case 'billing': return '💳';
            case 'ticket': return '💬';
            case 'simulation': return '🦷';
            default: return '🔔';
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Notifications</h1>
            <div className={styles.notificationList}>
                {notifications.map(notif => (
                    <div key={notif.id} className={`${styles.notificationCard} ${styles[notif.type]}`}>
                        <div className={styles.icon}>{getIcon(notif.type)}</div>
                        <div className={styles.content}>
                            <p className={styles.message}>{notif.message}</p>
                            <p className={styles.time}>{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientNotifications;
