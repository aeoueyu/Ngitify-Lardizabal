import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/owner/Surgery.module.css';
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
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Patient Records</h1>
                    <p className={styles.subTitle}>View and manage patient clinical records.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by patient, ID, or branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>PATIENT</th>
                            <th>ID</th>
                            <th>BRANCH</th>
                            <th>LAST VISIT</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(patient => (
                            <tr key={patient.id}>
                                <td className={styles.nameCell}>
                                    <div className={styles.avatarPlaceholder}>
                                        {patient.name.charAt(0)}
                                    </div>
                                    {patient.name}
                                </td>
                                <td>{patient.id}</td>
                                <td>{patient.branch}</td>
                                <td>{patient.lastVisit}</td>
                                <td><span className={`${styles.statusBadge} ${patient.status === 'active' ? styles.confirmed : styles.cancelled}`}>{patient.status}</span></td>
                                <td className={styles.actionCell}>
                                    <button 
                                        className={styles.viewBtn}
                                        onClick={() => navigate(`/dentist/patient-records/${patient.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
