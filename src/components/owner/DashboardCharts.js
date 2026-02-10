import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../styles/owner/DashboardCharts.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardCharts() {
    const [chartData, setChartData] = useState({
        surgeries: [
            { name: 'Jan 2026', surgeries: 4 },
            { name: 'Feb 2026', surgeries: 3 },
            { name: 'Mar 2026', surgeries: 5 },
            { name: 'Apr 2026', surgeries: 4 },
            { name: 'May 2026', surgeries: 6 },
            { name: 'Jun 2026', surgeries: 8 },
        ],
        patients: [
            { name: 'Jan 2026', newPatients: 10 },
            { name: 'Feb 2026', newPatients: 15 },
            { name: 'Mar 2026', newPatients: 12 },
            { name: 'Apr 2026', newPatients: 20 },
            { name: 'May 2026', newPatients: 18 },
            { name: 'Jun 2026', newPatients: 25 },
        ],
        revenue: [
            { name: 'Consultation', value: 150000 },
            { name: 'Surgery', value: 100000 },
        ]
    });

    return (
        <>
            <div className={`${styles.chartCard} ${styles.fullWidth}`}>
                <h3>Patient Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.patients}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="newPatients" stroke="#ea8b89" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.grid}>
                <div className={styles.chartCard}>
                    <h3>Surgeries per Month</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.surgeries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="surgeries" fill="#005466" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.chartCard}>
                    <h3>Revenue Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.revenue}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.revenue.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}