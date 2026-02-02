import React from 'react';
import styles from '../../styles/patient/MyFinances.module.css';

export default function MyFinances() {
    const transactions = [
        { id: "INV-001", date: "Feb 03, 2026", service: "Braces (Install)", amount: 40000, status: "Partial", pdf: "invoice_001.pdf" },
        { id: "INV-002", date: "Jan 15, 2026", service: "Cleaning", amount: 1500, status: "Paid", pdf: "invoice_002.pdf" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>My Finances</h1>
                <p className={styles.subtitle}>View your payment history and download invoices.</p>
            </header>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Service</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.date}</td>
                                <td><strong>{t.service}</strong></td>
                                <td>₱{t.amount.toLocaleString()}</td>
                                <td><span className={t.status === 'Paid' ? styles.paid : styles.partial}>{t.status}</span></td>
                                <td><button className={styles.dlBtn}>⬇ PDF</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}