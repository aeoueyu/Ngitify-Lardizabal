import React from 'react';
import styles from '../../../styles/dentist/revenue/Revenue.module.css';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EarningsSummary() {
    const commissionPerProcedure = [
        { name: 'Root Canal', commission: 1600 },
        { name: 'Extraction', commission: 3000 },
        { name: 'Implants', commission: 15000 },
        { name: 'Whitening', commission: 750 },
    ];

    const monthlyCommissionTrend = [
        { month: 'Nov', commission: 35000 },
        { month: 'Dec', commission: 48000 },
        { month: 'Jan', commission: 42000 },
        { month: 'Feb', commission: 20350 },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Monthly Summary of Earnings</h1>
                    <p className={styles.subTitle}>Review your earnings summary for February 2026.</p>
                </div>
            </header>

            <div className={styles.chartsGrid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Commission per Procedure Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={commissionPerProcedure}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="commission" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Monthly Commission Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyCommissionTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="commission" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
