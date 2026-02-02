import React, { useState, useEffect } from 'react';
import styles from '../../styles/secretary/SecretaryDashboard.module.css';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function SecretaryDashboard() {
    // MOCK DATA: Triage Alerts (Galing sa AI Chatbot)
    const triageAlerts = [
        { id: 102, patient: "Maria Clara", issue: "Abnormal Bleeding (Post-Op)", severity: "Urgent", time: "5m ago" },
        { id: 105, patient: "Jose Rizal", issue: "Severe Pain Rating 9/10", severity: "High", time: "15m ago" }
    ];

    // MOCK DATA: Today's Queue
    const queue = [
        { id: 1, name: "Mark Tuan", time: "09:00 AM", purpose: "Consultation", status: "In Clinic" },
        { id: 2, name: "Alice Gupta", time: "10:30 AM", purpose: "Filling", status: "Waiting" },
    ];

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const dayName = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = currentDateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Secretary Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back! Here are today's updates.</p>
                </div>
                <div className={styles.dateTime}>
                    <span className={styles.dayLabel}>{dayName}</span>
                    <span className={styles.dateLabel}>{formattedDate}</span>
                </div>
            </header>

            {/* TRIAGE NOTIFICATION SYSTEM */}
            {triageAlerts.length > 0 && (
                <div className={styles.triageSection}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.urgentTitle}>🚨 Urgent Triage Alerts (AI Detected)</h3>
                    </div>
                    <div className={styles.alertGrid}>
                        {triageAlerts.map(alert => (
                            <div key={alert.id} className={styles.alertCard}>
                                <div className={styles.alertHeader}>
                                    <span className={styles.ticketNum}>Ticket #{alert.id}</span>
                                    <span className={styles.timeTag}>{alert.time}</span>
                                </div>
                                <h4 className={styles.alertPatient}>{alert.patient}</h4>
                                <p className={styles.alertIssue}>{alert.issue}</p>
                                <button className={styles.callBtn}>Call Immediately</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.mainGrid}>
                {/* QUICK ACTIONS */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>12</span>
                        <span className={styles.statLabel}>Appointments Today</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>5</span>
                        <span className={styles.statLabel}>Pending Payments</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>3</span>
                        <span className={styles.statLabel}>Docs to Upload</span>
                    </div>
                </div>

                {/* PATIENT QUEUE */}
                <div className={styles.queueCard}>
                    <h3>Today's Patient Queue</h3>
                    <table className={styles.queueTable}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Patient Name</th>
                                <th>Purpose</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queue.map(q => (
                                <tr key={q.id}>
                                    <td><strong>{q.time}</strong></td>
                                    <td>{q.name}</td>
                                    <td>{q.purpose}</td>
                                    <td><span className={styles.statusBadge}>{q.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}