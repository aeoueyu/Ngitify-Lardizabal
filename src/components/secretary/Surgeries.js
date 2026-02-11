import React, { useState } from 'react';
import styles from '../../styles/secretary/Surgery.module.css';

const sampleSurgeries = [
    { id: 1, patient: 'Juan Dela Cruz', procedure: 'Wisdom Tooth Extraction', date: '2024-08-15', surgeon: 'Dr. Reyes', status: 'Confirmed' },
    { id: 2, patient: 'Maria Clara', procedure: 'Dental Implant', date: '2024-08-16', surgeon: 'Dr. Santos', status: 'Pending' },
    { id: 3, patient: 'Jose Rizal', procedure: 'Root Canal Therapy', date: '2024-08-18', surgeon: 'Dr. Reyes', status: 'Completed' },
    { id: 4, patient: 'Andres Bonifacio', procedure: 'Gingivectomy', date: '2024-08-20', surgeon: 'Dr. Cruz', status: 'Cancelled' },
];

export default function Surgeries() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSurgeries = sampleSurgeries.filter(surgery =>
        surgery.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.surgeon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Surgery Schedule</h1>
                    <p className={styles.subTitle}>View upcoming and past surgeries.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by patient, procedure, or surgeon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>PATIENT</th>
                            <th>PROCEDURE</th>
                            <th>DATE</th>
                            <th>SURGEON</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSurgeries.map(surgery => (
                            <tr key={surgery.id}>
                                <td className={styles.nameCell}>
                                    <div className={styles.avatarPlaceholder}>
                                        {surgery.patient.charAt(0)}
                                    </div>
                                    {surgery.patient}
                                </td>
                                <td>{surgery.procedure}</td>
                                <td>{surgery.date}</td>
                                <td>{surgery.surgeon}</td>
                                <td><span className={`${styles.statusBadge} ${styles[surgery.status.toLowerCase()]}`}>{surgery.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
