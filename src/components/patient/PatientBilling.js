import React from 'react';
import styles from '../../styles/patient/PatientBilling.module.css';

const PatientBilling = () => {
    const billingHistory = [
        { id: 1, date: 'January 15, 2026', description: 'Dental Cleaning', amount: '₱2,500.00', status: 'Paid' },
        { id: 2, date: 'December 10, 2025', description: 'Wisdom Tooth Extraction', amount: '₱8,000.00', status: 'Paid' },
        { id: 3, date: 'November 5, 2025', description: 'Orthodontic Consultation', amount: '₱1,500.00', status: 'Paid' },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Billing & Payments</h1>

            <div className={styles.summaryCard}>
                <h2>Outstanding Balance</h2>
                <p className={styles.balanceAmount}>₱5,000.00</p>
                <p className={styles.dueDate}>Due by: February 28, 2026</p>
                <button className={styles.payNowBtn}>Pay Now</button>
            </div>

            <div className={styles.historySection}>
                <h2>Billing History</h2>
                <table className={styles.billingTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billingHistory.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.description}</td>
                                <td>{item.amount}</td>
                                <td><span className={`${styles.status} ${styles.paid}`}>{item.status}</span></td>
                                <td>
                                    <button className={styles.downloadBtn}>Download Receipt</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientBilling;
