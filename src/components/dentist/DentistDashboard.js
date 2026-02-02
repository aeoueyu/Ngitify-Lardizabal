import React, { useState, useEffect } from 'react';
import styles from '../../styles/dentist/DentistDashboard.module.css';

export default function DentistDashboard() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const dayName = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = currentDateTime.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <div className={styles.welcomeSection}>
                    <h1 className={styles.title}>Dentist Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back, Doc! Here's your performance overview.</p>
                </div>
                
                <div className={styles.topRightActions}>
                    <div className={styles.dateTime}>
                        <span className={styles.dayLabel}>{dayName}</span>
                        <span className={styles.dateLabel}>{formattedDate}</span>
                    </div>
                </div>
            </header>

            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statTitle}>Total Procedures (Feb)</span>
                    <h2 className={styles.statNumber}>128</h2>
                    <span className={styles.statTrend}>+12% from Jan</span>
                </div>
                <div className={styles.statCard} style={{ borderLeft: '4px solid #ea8b89' }}>
                    <span className={styles.statTitle}>My Revenue Contribution</span>
                    <h2 className={styles.statNumber} style={{ color: '#ea8b89' }}>₱80,400</h2>
                    <span className={styles.statTrend}>40 Extractions, 12 Root Canals</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statTitle}>Personal Commission</span>
                    <h2 className={styles.statNumber} style={{ color: '#005466' }}>₱48,200</h2>
                    <span className={styles.statTrend}>Paid Out</span>
                </div>
            </div>

            <div className={styles.mainGrid}>
                
                {/* PERFORMANCE BREAKDOWN */}
                <div className={styles.tableSection}>
                    <div className={styles.sectionHeader}>
                        <h3>Performance Breakdown (Top Services)</h3>
                        <span style={{fontSize: '12px', color: '#888'}}>Month: February</span>
                    </div>
                    <table className={styles.procedureTable}>
                        <thead>
                            <tr>
                                <th>Procedure Type</th>
                                <th>Count</th>
                                <th>Revenue</th>
                                <th>Contribution</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Tooth Extraction</strong></td>
                                <td>40</td>
                                <td>₱80,000</td>
                                <td><div className={styles.bar} style={{width:'80%', background:'#ea8b89'}}></div></td>
                            </tr>
                            <tr>
                                <td><strong>Root Canal Treatment</strong></td>
                                <td>12</td>
                                <td>₱60,000</td>
                                <td><div className={styles.bar} style={{width:'60%', background:'#4d8794'}}></div></td>
                            </tr>
                            <tr>
                                <td><strong>Teeth Whitening</strong></td>
                                <td>8</td>
                                <td>₱48,000</td>
                                <td><div className={styles.bar} style={{width:'48%', background:'#95a5a6'}}></div></td>
                            </tr>
                            <tr>
                                <td><strong>General Cleaning</strong></td>
                                <td>68</td>
                                <td>₱81,600</td>
                                <td><div className={styles.bar} style={{width:'82%', background:'#005466'}}></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* TODAY'S DUTY MINI-VIEW */}
                <div className={styles.calendarMini}>
                    <div className={styles.sectionHeader}>
                        <h3>Today's Schedule</h3>
                    </div>
                    <div className={styles.taskList}>
                        <div className={styles.taskItem}>
                            <div className={styles.time}>09:00 AM</div>
                            <div>
                                <strong>Mark Tuan</strong> <br/>
                                <span style={{fontSize:'12px', color:'#666'}}>General Cleaning</span>
                            </div>
                        </div>
                        <div className={styles.taskItem} style={{background:'#e0f7fa'}}>
                            <div className={styles.time}>11:30 AM</div>
                            <div>
                                <strong>Alice Gupta</strong> <br/>
                                <span style={{fontSize:'12px', color:'#006064'}}>Root Canal (Follow-up)</span>
                            </div>
                        </div>
                        <div className={styles.taskItem}>
                            <div className={styles.time}>02:00 PM</div>
                            <div>
                                <strong>John Doe</strong> <br/>
                                <span style={{fontSize:'12px', color:'#666'}}>Extraction #38</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}