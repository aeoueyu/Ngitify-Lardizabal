import React from 'react';
import styles from '../../styles/dentist/Financials.module.css';

export default function Financials() {
    const history = [
        { id: 1, date: "Feb 03", service: "Tooth Extraction", fee: "₱2,000", commission: "₱800.00", status: "Pending" },
        { id: 2, date: "Feb 02", service: "Root Canal", fee: "₱5,000", commission: "₱2,000.00", status: "Paid" },
        { id: 3, date: "Feb 01", service: "Dental Cleaning", fee: "₱1,200", commission: "₱480.00", status: "Paid" },
        { id: 4, date: "Jan 30", service: "Teeth Whitening", fee: "₱6,000", commission: "₱2,400.00", status: "Paid" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Financial Overview</h1>
                    <p className={styles.subtitle}>Track your earned commissions and service performance.</p>
                </div>
                <button className={styles.exportBtn}>Download Statement</button>
            </header>

            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <label>Today's Commission</label>
                    <h2 style={{ color: '#ea8b89' }}>₱4,150.00</h2>
                    <span className={styles.trend}>From completed procedures</span>
                </div>
                <div className={styles.statCard}>
                    <label>Total This Month</label>
                    <h2>₱48,200.00</h2>
                    <span className={styles.trend}>128 Total Services</span>
                </div>
                <div className={styles.statCard}>
                    <label>Net Earnings (Est.)</label>
                    <h2 style={{ color: '#4d8794' }}>₱43,380.00</h2>
                    <span className={styles.trend}>After 10% Withholding Tax</span>
                </div>
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.tableSection}>
                    <div className={styles.sectionHeader}>
                        <h3>Recent Commission Breakdown</h3>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Service Rendered</th>
                                <th>Client Fee</th>
                                <th style={{ textAlign: 'right' }}>Commission Earned</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td>
                                        <div className={styles.serviceCol}>
                                            <strong>{item.service}</strong>
                                        </div>
                                    </td>
                                    <td>{item.fee}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className={styles.amountBadge}>{item.commission}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                            backgroundColor: item.status === 'Paid' ? '#e0f2f1' : '#fff3e0',
                                            color: item.status === 'Paid' ? '#00695c' : '#ef6c00',
                                            textTransform: 'uppercase'
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.sidePanel}>
                    <div className={styles.insightCard}>
                        <h3>Earnings by Category</h3>
                        <div className={styles.chartPlaceholder}>
                            <div className={styles.barItem} style={{ height: '80%' }}><span>Surgery</span></div>
                            <div className={styles.barItem} style={{ height: '45%' }}><span>General</span></div>
                            <div className={styles.barItem} style={{ height: '65%' }}><span>Cosmetic</span></div>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <h4>Monthly Summary</h4>
                        <div className={styles.infoRow}>
                            <span>Gross Commission</span>
                            <strong>₱48,200.00</strong>
                        </div>
                        <div className={styles.infoRow}>
                            <span>Est. Tax (10%)</span>
                            <strong style={{ color: '#ea8b89' }}>- ₱4,820.00</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}