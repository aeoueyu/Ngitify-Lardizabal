import React, { useState, useEffect } from 'react';
import styles from '../../../styles/audit-logs/AuditLogsPage.module.css';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Hanapin ang part na ito sa iyong src/components/audit-logs/AuditLogsPage.js
// at palitan ang useEffect ng code na nasa ibaba:

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // 👇 DITO MO ILALAGAY (Palitan ang lumang fetch line nito)
                const response = await fetch(`http://localhost:5000/api/audit-logs?t=${new Date().getTime()}`);
                
                const data = await response.json();
                if (response.ok) {
                    setLogs(data);
                }
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs(); 

        // Optional: Kung gusto mo ng automatic refresh (Polling)
        const intervalId = setInterval(() => {
            fetchLogs();
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const filteredLogs = logs.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getBadgeClass = (action) => {
        const actionClass = action.toLowerCase().replace(/ /g, '_');
        return styles[actionClass] || '';
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Audit Logs</h1>
                    <p className={styles.subTitle}>Track all system activities.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by user, action, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>USER</th>
                            <th>ROLE</th>
                            <th>ACTION</th>
                            <th>DETAILS</th>
                            <th>TIMESTAMP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                        ) : filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr key={log._id}>
                                    <td>{log.user}</td>
                                    <td>{log.role}</td>
                                    <td>
                                        <span className={`${styles.badge} ${getBadgeClass(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>{log.details}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No audit logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}