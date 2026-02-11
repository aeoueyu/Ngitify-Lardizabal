import React, { useState } from 'react';
import styles from '../../../styles/owner/Surgery.module.css';

const sampleUnassignedSurgeries = [
    { id: 5, patient: 'Emilio Aguinaldo', procedure: 'Apicoectomy', date: '2024-08-22', status: 'Confirmed' },
    { id: 6, patient: 'Melchora Aquino', procedure: 'Dental Bonding', date: '2024-08-25', status: 'Confirmed' },
];

const availableSurgeons = [
    { id: 's1', name: 'Dr. Reyes' },
    { id: 's2', name: 'Dr. Santos' },
    { id: 's3', name: 'Dr. Cruz' },
    { id: 's4', name: 'Dr. Garcia (Owner)' },
];

export default function AssignSurgeon() {
    const [searchTerm, setSearchTerm] = useState('');
    const [assignments, setAssignments] = useState({});

    const handleAssign = (surgeryId, surgeonId) => {
        setAssignments(prev => ({ ...prev, [surgeryId]: surgeonId }));
    };

    const filteredSurgeries = sampleUnassignedSurgeries.filter(surgery =>
        surgery.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.procedure.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Assign Surgeon</h1>
                    <p className={styles.subTitle}>Assign surgeons to scheduled procedures.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by patient or procedure..."
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
                            <th style={{ width: '200px' }}>ASSIGN SURGEON</th>
                            <th className={styles.actionHeader}>ACTION</th>
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
                                <td>
                                    <select 
                                        className={styles.selectDropdown}
                                        value={assignments[surgery.id] || ''}
                                        onChange={(e) => handleAssign(surgery.id, e.target.value)}
                                    >
                                        <option value="" disabled>Select a surgeon</option>
                                        {availableSurgeons.map(surgeon => (
                                            <option key={surgeon.id} value={surgeon.id}>{surgeon.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className={styles.actionCell}>
                                    <button 
                                        className={styles.editBtn}
                                        disabled={!assignments[surgery.id]}
                                    >
                                        Confirm
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
