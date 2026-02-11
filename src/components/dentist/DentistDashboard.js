import React from 'react';
import styles from '../../styles/dentist/DentistDashboard.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FaUserMd, FaSyringe, FaDollarSign } from 'react-icons/fa';

export default function DentistDashboard() {
    // Sample Static Data
    const summary = {
        upcomingSurgeries: 5,
        patientsHandled: 23,
        commissionThisMonth: 45000,
    };

    const surgeriesPerWeek = [
        { week: 'Week 1', surgeries: 4 },
        { week: 'Week 2', surgeries: 6 },
        { week: 'Week 3', surgeries: 3 },
        { week: 'Week 4', surgeries: 8 },
    ];

    const procedureTypes = [
        { name: 'Extractions', value: 40 },
        { name: 'Fillings', value: 30 },
        { name: 'Surgeries', value: 30 },
    ];

    const commissionPerProcedure = [
        { name: 'Cleaning', commission: 5000 },
        { name: 'Extraction', commission: 12000 },
        { name: 'Filling', commission: 8000 },
        { name: 'Surgery', commission: 20000 },
    ];

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dentist Dashboard</h1>
                    <p className={styles.subtitle}>Your personal performance and schedule overview.</p>
                </div>
                <div className={styles.dateBadge}>February 2026</div>
            </header>

            {/* QUICK OVERVIEW */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Upcoming Surgeries</span>
                        <h2 className={styles.statValue}>{summary.upcomingSurgeries}</h2>
                    </div>
                    <FaUserMd className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Patients Handled (This Week)</span>
                        <h2 className={styles.statValue}>{summary.patientsHandled}</h2>
                    </div>
                    <FaSyringe className={styles.statIcon} />
                </div>
                <div className={styles.statCard}>
                    <div>
                        <span className={styles.statLabel}>Commission Summary (This Month)</span>
                        <h2 className={styles.statValue}>₱{summary.commissionThisMonth.toLocaleString()}</h2>
                    </div>
                    <FaDollarSign className={styles.statIcon} />
                </div>
            </div>

            {/* CHARTS */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Surgeries Per Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={surgeriesPerWeek}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="surgeries" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Procedure Types</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={procedureTypes} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                                {procedureTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className={`${styles.chartCard} ${styles.fullWidthCard}`}>
                    <h3 className={styles.chartTitle}>Commission Earned Per Procedure</h3>
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
            </div>
        </div>
    );
}
