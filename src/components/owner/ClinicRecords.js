import React, { useState } from 'react';
import styles from '../../styles/owner/ClinicRecords.module.css';

export default function ClinicRecords() {
    const [searchTerm, setSearchTerm] = useState('');

    // MOCK DATA: Consolidated Patients from All Branches
    const allPatients = [
        { id: "P-001", name: "Alice Gupta", branch: "Parañaque", lastVisit: "Feb 02, 2026", status: "Active" },
        { id: "P-002", name: "Mark Tuan", branch: "Las Piñas", lastVisit: "Jan 28, 2026", status: "Active" },
        { id: "P-004", name: "Maria Clara", branch: "Manila (HQ)", lastVisit: "Feb 03, 2026", status: "Active" },
    ];

    const filtered = allPatients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Clinic Records (Consolidated)</h1>
                    <p className={styles.subtitle}>Centralized EMR database across all branches.</p>
                </div>
            </header>

            <div className={styles.contentCard}>
                <div className={styles.controls}>
                    <input 
                        type="text" 
                        placeholder="Search patient name, ID, or branch..." 
                        className={styles.searchBar} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className={styles.filterBadge}>Total Records: {allPatients.length}</div>
                </div>

                <table className={styles.recordTable}>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>ID</th>
                            <th>Branch</th>
                            <th>Last Visit</th>
                            <th>Status</th>
                            <th style={{textAlign: 'center'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(patient => (
                            <tr key={patient.id}>
                                <td><strong>{patient.name}</strong></td>
                                <td className={styles.mono}>{patient.id}</td>
                                <td>{patient.branch}</td>
                                <td>{patient.lastVisit}</td>
                                <td>
                                    <span className={patient.status === 'Active' ? styles.statusActive : styles.statusInactive}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <button className={styles.viewBtn}>View Medical History</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#888'}}>No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}