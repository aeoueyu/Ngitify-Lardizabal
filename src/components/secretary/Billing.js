import React, { useState } from 'react';
import styles from '../../styles/secretary/Billing.module.css';

export default function Billing() {
    const [transactions, setTransactions] = useState([
        { id: "TRX-001", patient: "Alice Gupta", service: "Braces (Install)", total: 40000, paid: 10000, balance: 30000, method: "Cash", status: "Partial", date: "Feb 03, 2026" },
        { id: "TRX-002", patient: "Mark Tuan", service: "Cleaning", total: 2000, paid: 2000, balance: 0, method: "GCash", status: "Paid", date: "Feb 03, 2026" },
    ]);

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Helper to format currency
    const formatPhp = (num) => `₱${num.toLocaleString()}`;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Billing & Finance</h1>
                    <p className={styles.subtitle}>Manage payments, track balances, and record multi-channel transactions.</p>
                </div>
                <button className={styles.newBtn} onClick={() => setShowPaymentModal(true)}>+ New Transaction</button>
            </header>

            <div className={styles.contentCard}>
                <table className={styles.billingTable}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Patient Name</th>
                            <th>Service</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Method</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(trx => (
                            <tr key={trx.id}>
                                <td className={styles.mono}>{trx.id}</td>
                                <td><strong>{trx.patient}</strong></td>
                                <td>{trx.service}</td>
                                <td>{formatPhp(trx.total)}</td>
                                <td style={{color: '#2e7d32'}}>{formatPhp(trx.paid)}</td>
                                <td style={{color: trx.balance > 0 ? '#c62828' : '#888', fontWeight: 'bold'}}>
                                    {formatPhp(trx.balance)}
                                </td>
                                <td><span className={styles.methodTag}>{trx.method}</span></td>
                                <td>
                                    <span className={trx.status === 'Paid' ? styles.statusPaid : styles.statusPartial}>
                                        {trx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Mock Modal for "New Transaction" */}
            {showPaymentModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3>Record Payment</h3>
                        <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>This is a mock form for recording payments.</p>
                        <div className={styles.formGroup}><label>Patient Name</label><input className={styles.input} placeholder="Search patient..." /></div>
                        <div className={styles.formGroup}><label>Service</label><input className={styles.input} placeholder="e.g. Braces" /></div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}><label>Amount Received</label><input className={styles.input} placeholder="0.00" /></div>
                            <div className={styles.formGroup}>
                                <label>Method</label>
                                <select className={styles.input}>
                                    <option>Cash</option>
                                    <option>GCash</option>
                                    <option>Credit Card</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.cancelBtn} onClick={() => setShowPaymentModal(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={() => setShowPaymentModal(false)}>Record Payment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}