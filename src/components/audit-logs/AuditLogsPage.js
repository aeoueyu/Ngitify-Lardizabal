import React, { useState, useEffect } from 'react';
import styles from '../../styles/audit-logs/AuditLogsPage.module.css';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/audit-logs');
            const data = await res.json();
            if (res.ok) setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search Filter
    const filteredLogs = logs.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format Date Helper
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>System <span className={styles.highlight}>Audit Logs</span></h1>
                    <p className={styles.subTitle}>Track system activities and user actions.</p>
                </div>
                {/* Optional: Export Button here if needed */}
            </div>

            <div className={styles.controlsContainer}>
                <input 
                    type="text" 
                    className={styles.searchBar} 
                    placeholder="Search logs by user, action, or details..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>TIMESTAMP</th>
                            <th>ACTION</th>
                            <th>USER</th>
                            <th>ROLE</th>
                            <th>DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading logs...</td></tr>
                        ) : filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr key={log._id}>
                                    <td className={styles.dateCell}>{formatDate(log.timestamp)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[log.action] || styles.DEFAULT}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className={styles.userCell}>{log.user}</td>
                                    <td style={{textTransform:'capitalize'}}>{log.role || 'System'}</td>
                                    <td className={styles.detailsCell}>{log.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}