import React, { useState } from 'react';
import styles from '../../../styles/owner/dentist-tools/AssignedSurgeries.module.css';
import addIcon from '../../../assets/button-icons/add.svg';

const sampleSurgeries = [
    { id: 1, patientName: 'Juan Dela Cruz', surgeryType: 'Wisdom Tooth Extraction', date: '2024-03-15', status: 'Scheduled' },
    { id: 2, patientName: 'Maria Clara', surgeryType: 'Root Canal Therapy', date: '2024-03-18', status: 'Scheduled' },
    { id: 3, patientName: 'Jose Rizal', surgeryType: 'Dental Implant', date: '2024-03-20', status: 'Completed' },
    { id: 4, patientName: 'Andres Bonifacio', surgeryType: 'Wisdom Tooth Extraction', date: '2024-03-22', status: 'Cancelled' },
];

export default function AssignedSurgeries() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSurgeries = sampleSurgeries.filter(surgery =>
        surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.surgeryType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Assigned Surgeries</h1>
                    <p className={styles.subTitle}>View and manage your assigned surgeries.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by patient or surgery type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>PATIENT</th>
                            <th>SURGERY TYPE</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSurgeries.map(surgery => (
                            <tr key={surgery.id}>
                                <td className={styles.nameCell}>
                                    <div className={styles.avatarPlaceholder}>
                                        {surgery.patientName.charAt(0)}
                                    </div>
                                    {surgery.patientName}
                                </td>
                                <td>{surgery.surgeryType}</td>
                                <td>{surgery.date}</td>
                                <td><span className={`${styles.statusBadge} ${styles[surgery.status.toLowerCase()]}`}>{surgery.status}</span></td>
                                <td className={styles.actionCell}>
                                    <button className={styles.viewBtn}>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
