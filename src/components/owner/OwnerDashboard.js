import React from 'react';
import styles from '../../styles/owner/OwnerDashboard.module.css';

export default function OwnerDashboard() {
    // MOCK DATA: Executive Summary
    const financialData = {
        totalRevenue: "₱850,000",
        growth: "+15%",
        branches: [
            { name: "Parañaque Branch", revenue: 500000, color: '#005466' },
            { name: "Las Piñas Branch", revenue: 350000, color: '#ea8b89' }
        ]
    };

    const topServices = [
        { name: "Veneers", earnings: "₱320,000", count: 12 },
        { name: "Implants", earnings: "₱210,000", count: 5 },
        { name: "Orthodontics", earnings: "₱150,000", count: 30 },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Executive Dashboard</h1>
                    <p className={styles.subtitle}>Overview of clinic performance and financial health.</p>
                </div>
                <div className={styles.dateBadge}>February 2026</div>
            </header>

            {/* KEY METRICS ROW */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Clinic Revenue</span>
                    <h2 className={styles.statValue}>{financialData.totalRevenue}</h2>
                    <span className={styles.statTrend}>▲ {financialData.growth} vs last month</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Active Patients</span>
                    <h2 className={styles.statValue}>1,240</h2>
                    <span className={styles.statSub}>Across all branches</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Procedures</span>
                    <h2 className={styles.statValue}>342</h2>
                    <span className={styles.statSub}>Completed this month</span>
                </div>
            </div>

            <div className={styles.mainGrid}>
                {/* BRANCH PERFORMANCE CHART */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <h3>Branch Performance (Revenue)</h3>
                    </div>
                    <div className={styles.barChart}>
                        {financialData.branches.map((branch, index) => (
                            <div key={index} className={styles.chartRow}>
                                <div className={styles.labelCol}>
                                    <span className={styles.branchName}>{branch.name}</span>
                                    <span className={styles.branchRev}>₱{branch.revenue.toLocaleString()}</span>
                                </div>
                                <div className={styles.barContainer}>
                                    <div 
                                        className={styles.barFill} 
                                        style={{ 
                                            width: `${(branch.revenue / 600000) * 100}%`, // Mock scale base on max
                                            backgroundColor: branch.color 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}><span style={{background: '#005466'}}></span> Parañaque</div>
                        <div className={styles.legendItem}><span style={{background: '#ea8b89'}}></span> Las Piñas</div>
                    </div>
                </div>

                {/* TOP SERVICES TABLE */}
                <div className={styles.tableCard}>
                    <div className={styles.cardHeader}>
                        <h3>Top Earning Services</h3>
                        <button className={styles.viewBtn}>View Full Report</button>
                    </div>
                    <table className={styles.serviceTable}>
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Cases</th>
                                <th style={{textAlign: 'right'}}>Total Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topServices.map((service, i) => (
                                <tr key={i}>
                                    <td><strong>{service.name}</strong></td>
                                    <td>{service.count}</td>
                                    <td style={{textAlign: 'right', color: '#005466', fontWeight: 'bold'}}>
                                        {service.earnings}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}