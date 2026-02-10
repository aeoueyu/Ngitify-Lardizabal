import React, { useState, useEffect } from 'react';
import styles from '../../styles/owner/PatientRecords.module.css';

export default function PatientRecords() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for now
    const mockPatients = [
        { _id: '1', firstName: 'Juan', lastName: 'Dela Cruz', email: 'juan.delacruz@example.com', contactNumber: '09171234567', dateOfBirth: '1990-05-15' },
        { _id: '2', firstName: 'Maria', lastName: 'Clara', email: 'maria.clara@example.com', contactNumber: '09287654321', dateOfBirth: '1992-08-22' },
        { _id: '3', firstName: 'Andres', lastName: 'Bonifacio', email: 'andres.b@example.com', contactNumber: '09998887766', dateOfBirth: '1985-11-30' },
    ];

    useEffect(() => {
        // In the future, we will fetch from an API
        setPatients(mockPatients);
    }, []);

    const filteredPatients = patients.filter(p => 
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Patient Records</h1>
                    <p className={styles.subTitle}>Manage all patient profiles in the system.</p>
                </div>
                <button className={styles.addButton}>+ Add New Patient</button>
            </div>
            <div className={styles.controls}>
                <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.patientTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Date of Birth</th>
                            <th className={styles.actionsHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => (
                            <tr key={patient._id}>
                                <td>
                                    <div className={styles.nameCell}>
                                        <div className={styles.avatarPlaceholder}>
                                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                        </div>
                                        <span>{patient.firstName} {patient.lastName}</span>
                                    </div>
                                </td>
                                <td>{patient.email}</td>
                                <td>{patient.contactNumber}</td>
                                <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                                <td className={styles.actions}>
                                    <button className={`${styles.actionButton} ${styles.viewBtn}`}>View</button>
                                    <button className={`${styles.actionButton} ${styles.editBtn}`}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
