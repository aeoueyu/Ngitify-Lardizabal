import React, { useState, useEffect } from 'react';
import styles from '../../styles/owner/OwnerDashboard.module.css';
import DashboardCharts from './DashboardCharts';
import DashboardAlerts from './DashboardAlerts';
import { FaMoneyBillWave, FaUserFriends, FaToolbox, FaBoxOpen } from 'react-icons/fa';

export default function OwnerDashboard() {
    const [summary, setSummary] = useState({
        patientCount: 125,
        surgeryCount: 30,
        totalRevenue: 250000,
        lowStockCount: 8
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Executive Dashboard</h1>
                    <p className={styles.subtitle}>Overview of clinic performance and financial health.</p>
                </div>
                <div className={styles.dateBadge}>February 2026</div>
            </header>

            {/* KEY METRICS ROW */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Total Clinic Revenue</span>
                        <h2 className={styles.statValue}>₱{summary.totalRevenue.toLocaleString()}</h2>
                    </div>
                    <FaMoneyBillWave className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Active Patients</span>
                        <h2 className={styles.statValue}>{summary.patientCount}</h2>
                    </div>
                    <FaUserFriends className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Total Procedures</span>
                        <h2 className={styles.statValue}>{summary.surgeryCount}</h2>
                    </div>
                    <FaToolbox className={styles.statIcon} />
                </div>
                 <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Items with Low Stock</span>
                        <h2 className={styles.statValue}>{summary.lowStockCount}</h2>
                    </div>
                    <FaBoxOpen className={styles.statIcon} />
                </div>
            </div>

            <DashboardCharts />
            <DashboardAlerts />
            
        </div>
    );
}