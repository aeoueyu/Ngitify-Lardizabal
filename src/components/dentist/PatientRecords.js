import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/owner/PatientRecords.module.css';
import { mockPatients } from '../../data/patients';

export default function PatientRecords() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const allPatients = mockPatients;

    const filtered = allPatients.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.branch && p.branch.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Patient Records</h1>
                    <p className={styles.subtitle}>View and manage patient clinical records.</p>
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
                        {filtered.length > 0 ? (
                            filtered.map(patient => (
                                <tr key={patient.id}>
                                    <td><strong>{patient.name}</strong></td>
                                    <td className={styles.mono}>{patient.id}</td>
                                    <td>{patient.branch}</td>
                                    <td>{patient.lastVisit}</td>
                                    <td>
                                        <span className={patient.status === 'active' ? styles.statusActive : styles.statusInactive}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button 
                                            className={styles.viewBtn} 
                                            onClick={() => navigate(`/dentist/patient-records/${patient.id}`)}
                                        >
                                            View Patient
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
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
