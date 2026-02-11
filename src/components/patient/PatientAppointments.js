import React from 'react';
import styles from '../../styles/patient/PatientAppointments.module.css';

const PatientAppointments = () => {
    const upcomingAppointments = [
        { id: 1, date: 'February 20, 2026', time: '10:00 AM', service: 'Orthodontic Adjustment', dentist: 'Dr. Maria Clara', status: 'Confirmed' },
    ];

    const pastAppointments = [
        { id: 1, date: 'January 15, 2026', time: '2:00 PM', service: 'Dental Cleaning', dentist: 'Dr. Jose Rizal', status: 'Completed' },
        { id: 2, date: 'December 10, 2025', time: '11:00 AM', service: 'Wisdom Tooth Extraction', dentist: 'Dr. Gabriela Silang', status: 'Completed' },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Appointments & Surgeries</h1>

            <div className={styles.section}>
                <h2>Upcoming Appointments</h2>
                {upcomingAppointments.length > 0 ? (
                    <div className={styles.appointmentList}>
                        {upcomingAppointments.map(app => (
                            <div key={app.id} className={styles.appointmentCard}>
                                <p><strong>Date:</strong> {app.date}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                <p><strong>Service:</strong> {app.service}</p>
                                <p><strong>Dentist:</strong> {app.dentist}</p>
                                <p><strong>Status:</strong> <span className={`${styles.status} ${styles.confirmed}`}>{app.status}</span></p>
                                <div className={styles.actions}>
                                    <button className={styles.btn}>Request Reschedule</button>
                                    <button className={`${styles.btn} ${styles.btnCancel}`}>Request Cancel</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No upcoming appointments.</p>
                )}
            </div>

            <div className={styles.section}>
                <h2>Past Treatments</h2>
                {pastAppointments.length > 0 ? (
                    <div className={styles.appointmentList}>
                        {pastAppointments.map(app => (
                            <div key={app.id} className={`${styles.appointmentCard} ${styles.pastCard}`}>
                                <p><strong>Date:</strong> {app.date}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                <p><strong>Service:</strong> {app.service}</p>
                                <p><strong>Dentist:</strong> {app.dentist}</p>
                                <p><strong>Status:</strong> <span className={`${styles.status} ${styles.completed}`}>{app.status}</span></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No past treatments found.</p>
                )}
            </div>
        </div>
    );
};

export default PatientAppointments;
