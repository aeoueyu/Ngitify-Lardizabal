import React from 'react';
import styles from '../../../styles/dentist/revenue/Revenue.module.css';

export default function CommissionView() {
    const commissionData = [
        { date: '2026-02-10', patient: 'Juan Dela Cruz', procedure: 'Root Canal Therapy', fee: 8000, rate: '20%', commission: 1600 },
        { date: '2026-02-08', patient: 'Maria Clara', procedure: 'Wisdom Tooth Extraction', fee: 6000, rate: '50%', commission: 3000 },
        { date: '2026-02-05', patient: 'Crisostomo Ibarra', procedure: 'Dental Implants', fee: 50000, rate: '30%', commission: 15000 },
        { date: '2026-02-02', patient: 'Jose Rizal', procedure: 'Teeth Whitening', fee: 5000, rate: '15%', commission: 750 },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Commission per Treatment/Surgery</h1>
                    <p className={styles.subTitle}>View your commission for each completed procedure.</p>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Procedure</th>
                            <th>Total Fee (PHP)</th>
                            <th>Commission Rate</th>
                            <th>Commission Amount (PHP)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissionData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.patient}</td>
                                <td>{item.procedure}</td>
                                <td>{item.fee.toLocaleString()}</td>
                                <td>{item.rate}</td>
                                <td>{item.commission.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
