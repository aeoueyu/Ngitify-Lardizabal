import React from 'react';
import styles from '../../../styles/owner/ReportsAnalytics.module.css';

const monthlyReport = {
    month: 'January 2024',
    patientsServed: 150,
    surgeriesPerformed: 25,
    income: 500000,
};

const annualReport = {
    year: 2023,
    patientsServed: 1800,
    surgeriesPerformed: 300,
    income: 6000000,
};

export default function ReportsAnalytics() {
    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Reports & Analytics</h1>
                    <p className={styles.subTitle}>View and export monthly and annual reports.</p>
                </div>
                <div className={styles.actionsContainer}>
                    <button className={styles.actionButton}>Comparative View</button>
                    <button className={styles.actionButton}>Export to PDF</button>
                    <button className={styles.actionButton}>Export to Excel</button>
                </div>
            </div>

            <div className={styles.reportsGrid}>
                {/* Monthly Report */}
                <div className={styles.reportCard}>
                    <h2 className={styles.reportTitle}>Monthly Report ({monthlyReport.month})</h2>
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{monthlyReport.patientsServed}</span>
                            <span className={styles.statLabel}>Patients Served</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{monthlyReport.surgeriesPerformed}</span>
                            <span className={styles.statLabel}>Surgeries Performed</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>₱{monthlyReport.income.toLocaleString()}</span>
                            <span className={styles.statLabel}>Income</span>
                        </div>
                    </div>
                </div>

                {/* Annual Report */}
                <div className={styles.reportCard}>
                    <h2 className={styles.reportTitle}>Annual Report ({annualReport.year})</h2>
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{annualReport.patientsServed}</span>
                            <span className={styles.statLabel}>Patients Served</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{annualReport.surgeriesPerformed}</span>
                            <span className={styles.statLabel}>Surgeries Performed</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>₱{annualReport.income.toLocaleString()}</span>
                            <span className={styles.statLabel}>Income</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
