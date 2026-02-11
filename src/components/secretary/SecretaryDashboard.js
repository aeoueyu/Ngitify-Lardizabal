import React, { useState } from 'react';
import styles from '../../styles/secretary/SecretaryDashboard.module.css';
import { FaUserPlus, FaCalendarCheck, FaFileInvoiceDollar, FaUsers, FaHeadset, FaBoxOpen } from 'react-icons/fa';

export default function SecretaryDashboard() {
    const [summary, setSummary] = useState({
        newPatients: 5,
        upcomingSurgeries: 3,
        pendingPayments: 8,
        staffOnDuty: 4,
        newTickets: 2,
        lowInventory: 1
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Secretary Dashboard</h1>
                    <p className={styles.subtitle}>Daily operations and task overview.</p>
                </div>
                <div className={styles.dateBadge}>February 2026</div>
            </header>

            {/* KEY METRICS ROW */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>New Patients Today</span>
                        <h2 className={styles.statValue}>{summary.newPatients}</h2>
                    </div>
                    <FaUserPlus className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Upcoming Surgeries</span>
                        <h2 className={styles.statValue}>{summary.upcomingSurgeries}</h2>
                    </div>
                    <FaCalendarCheck className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Pending Payments</span>
                        <h2 className={styles.statValue}>{summary.pendingPayments}</h2>
                    </div>
                    <FaFileInvoiceDollar className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Staff on Duty</span>
                        <h2 className={styles.statValue}>{summary.staffOnDuty}</h2>
                    </div>
                    <FaUsers className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>New Chatbot Tickets</span>
                        <h2 className={styles.statValue}>{summary.newTickets}</h2>
                    </div>
                    <FaHeadset className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Low Inventory Alerts</span>
                        <h2 className={styles.statValue}>{summary.lowInventory}</h2>
                    </div>
                    <FaBoxOpen className={styles.statIcon} />
                </div>
            </div>
        </div>
    );
}
