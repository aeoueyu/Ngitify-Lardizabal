import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../../styles/owner/Finance.module.css';

// Mock Data
const revenueData = {
    totalRevenue: 1250000,
    paid: 950000,
    unpaid: 300000,
};

const monthlyRevenue = [
    { name: 'Jan', revenue: 180000 },
    { name: 'Feb', revenue: 220000 },
    { name: 'Mar', revenue: 250000 },
    { name: 'Apr', revenue: 190000 },
    { name: 'May', revenue: 240000 },
    { name: 'Jun', revenue: 170000 },
];

const monthlyPaymentStatus = [
    { name: 'Jan', paid: 150000, unpaid: 30000 },
    { name: 'Feb', paid: 200000, unpaid: 20000 },
    { name: 'Mar', paid: 210000, unpaid: 40000 },
    { name: 'Apr', paid: 180000, unpaid: 10000 },
    { name: 'May', paid: 220000, unpaid: 20000 },
    { name: 'Jun', paid: 150000, unpaid: 20000 },
];

const paymentStatus = [
    { name: 'Paid', value: revenueData.paid },
    { name: 'Unpaid', value: revenueData.unpaid },
];

const recentTransactions = [
    { id: 'TXN72384', patient: 'Carlos Reyes', amount: 15000, status: 'Paid', date: '2023-10-26' },
    { id: 'TXN72383', patient: 'Maria Dela Cruz', amount: 8000, status: 'Paid', date: '2023-10-26' },
    { id: 'TXN72382', patient: 'Juan Santos', amount: 25000, status: 'Unpaid', date: '2023-10-25' },
    { id: 'TXN72381', patient: 'Ana Lim', amount: 12000, status: 'Paid', date: '2023-10-24' },
];

export default function BillingFinance() {
    const [timeframe, setTimeframe] = useState('monthly');

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Billing & Finance</h1>
                    <p className={styles.subTitle}>Track revenue, payments, and outstanding balances.</p>
                </div>
                <div className={styles.timeframeSelector}>
                    <button 
                        className={timeframe === 'monthly' ? styles.activeTimeframe : ''} 
                        onClick={() => setTimeframe('monthly')}>
                        Monthly
                    </button>
                    <button 
                        className={timeframe === 'annually' ? styles.activeTimeframe : ''} 
                        onClick={() => setTimeframe('annually')}>
                        Annually
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <h4>Total Revenue</h4>
                    <p>₱{revenueData.totalRevenue.toLocaleString()}</p>
                </div>
                <div className={styles.kpiCard} style={{ '--kpi-color': '#2e7d32' }}>
                    <h4>Total Paid</h4>
                    <p>₱{revenueData.paid.toLocaleString()}</p>
                </div>
                <div className={styles.kpiCard} style={{ '--kpi-color': '#c62828' }}>
                    <h4>Outstanding Balance</h4>
                    <p>₱{revenueData.unpaid.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>Monthly Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#005466" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.chartCard}>
                            <h3 className={styles.cardTitle}>Payment Status by Month (Paid vs. Unpaid)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyPaymentStatus}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="paid" stackId="a" fill="#2e7d32" name="Paid" />
                                    <Bar dataKey="unpaid" stackId="a" fill="#c62828" name="Unpaid" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
            </div>

            {/* Recent Transactions Table */}
            <div className={styles.tableContainer}>
                <h3 className={styles.cardTitle}>Recent Transactions</h3>
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
                                <td className={styles.patientCell}>{tx.patient}</td>
                                <td>₱{tx.amount.toLocaleString()}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[tx.status.toLowerCase()]}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td>{tx.date}</td>
                                <td className={styles.actionCell}>
                                    <button className={styles.viewBtn}>View Receipt</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
