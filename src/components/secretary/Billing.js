import React, { useState } from 'react';
import styles from '../../styles/secretary/Billing.module.css';

const recentTransactions = [
    { id: 'TXN72384', patient: 'Carlos Reyes', amount: 15000, status: 'Paid', date: '2023-10-26' },
    { id: 'TXN72383', patient: 'Maria Dela Cruz', amount: 8000, status: 'Paid', date: '2023-10-26' },
    { id: 'TXN72382', patient: 'Juan Santos', amount: 25000, status: 'Unpaid', date: '2023-10-25' },
    { id: 'TXN72381', patient: 'Ana Lim', amount: 12000, status: 'Paid', date: '2023-10-24' },
];

export default function Billing() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Billing & Finance</h1>
                <div className={styles.headerActions}>
                    <input type="text" placeholder="Search patients..." className={styles.searchInput} />
                    <input type="date" className={styles.dateFilter} />
                </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryCards}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Total Revenue (Today)</h3>
                    <p className={styles.cardValue}>₱23,000</p>
                    <p className={styles.cardTrend}>+5% from yesterday</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Outstanding Payments</h3>
                    <p className={styles.cardValue}>₱25,000</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Transactions Today</h3>
                    <p className={styles.cardValue}>2</p>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className={styles.transactionsTable}>
                <h2 className={styles.tableHeader}>Recent Transactions</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Patient</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map(tx => (
                            <tr key={tx.id}>
                                <td>{tx.id}</td>
                                <td>{tx.patient}</td>
                                <td>₱{tx.amount.toLocaleString()}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${tx.status === 'Paid' ? styles.statusPaid : styles.statusUnpaid}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td>{tx.date}</td>
                                <td>
                                    <button className={styles.actionButton}>View Receipt</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
