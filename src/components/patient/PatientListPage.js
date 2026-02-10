import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user-management/ManageDentists.module.css'; // Reusing the same CSS

// Sample Static Data
const samplePatients = [
    { id: 1, name: 'John Doe', age: 34, gender: 'Male', lastVisit: '2023-10-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 28, gender: 'Female', lastVisit: '2023-11-01', status: 'Active' },
    { id: 3, name: 'Michael Johnson', age: 45, gender: 'Male', lastVisit: '2023-09-22', status: 'Inactive' },
    { id: 4, name: 'Emily Davis', age: 22, gender: 'Female', lastVisit: '2023-11-10', status: 'Active' },
    { id: 5, name: 'David Wilson', age: 50, gender: 'Male', lastVisit: '2023-08-19', status: 'Active' },
];

export default function PatientListPage() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState(samplePatients);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Patient Records</h1>
                    <p className={styles.subTitle}>View and manage all patient profiles.</p>
                </div>
                {/* No "Add" button for owner */}
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by name or gender..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>AGE</th>
                            <th>GENDER</th>
                            <th>LAST VISIT</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <tr key={patient.id}>
                                    <td className={styles.nameCell}>
                                        <div className={styles.avatarPlaceholder}>
                                            {patient.name.charAt(0)}
                                        </div>
                                        {patient.name}
                                    </td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.lastVisit}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${patient.status === 'Active' ? styles.active : styles.inactive}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className={styles.actionCell}>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => navigate(`/owner/patient-records/${patient.id}`)}
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className={styles.noData}>No patients found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
