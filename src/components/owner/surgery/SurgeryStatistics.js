import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../../styles/owner/Surgery.module.css';

// Mock data - in a real app, this would come from an API
const kpiData = {
    totalSurgeries: 128,
    totalRevenue: 640000,
    averagePerMonth: 21,
};

const monthlyData = [
    { name: 'Jan', surgeries: 18 },
    { name: 'Feb', surgeries: 22 },
    { name: 'Mar', surgeries: 25 },
    { name: 'Apr', surgeries: 19 },
    { name: 'May', surgeries: 24 },
    { name: 'Jun', surgeries: 20 },
];

const procedureData = [
    { name: 'Wisdom Tooth Extraction', value: 45, color: '#005466' },
    { name: 'Dental Implant', value: 30, color: '#007a8c' },
    { name: 'Root Canal Therapy', value: 25, color: '#00a0b0' },
    { name: 'Gingivectomy', value: 18, color: '#66c2d0' },
    { name: 'Others', value: 10, color: '#b3e0e6' },
];
const COLORS = procedureData.map(p => p.color);

export default function SurgeryStatistics() {
    const [timeframe, setTimeframe] = useState('monthly');

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Surgery Statistics</h1>
                    <p className={styles.subTitle}>Analytics and reports for surgical procedures.</p>
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

            {/* KPIs */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <h4>Total Surgeries</h4>
                    <p>{kpiData.totalSurgeries}</p>
                </div>
                <div className={styles.kpiCard}>
                    <h4>Total Revenue</h4>
                    <p>₱{kpiData.totalRevenue.toLocaleString()}</p>
                </div>
                <div className={styles.kpiCard}>
                    <h4>Average/Month</h4>
                    <p>{kpiData.averagePerMonth}</p>
                </div>
            </div>

            {/* Charts */}
            <div className={styles.chartsGrid}>
                {/* Bar Chart */}
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>Surgeries per Month</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="surgeries" fill="#005466" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>Procedure Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={procedureData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {procedureData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
