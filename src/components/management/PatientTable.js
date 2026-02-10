import React from 'react';
import styles from '../../styles/management/PatientTable.module.css';

const PatientTable = ({ patients }) => {
    if (!patients || patients.length === 0) {
        return <p>No patients found.</p>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.patientTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Birthdate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient._id}>
                            <td>{`${patient.name.first} ${patient.name.last}`}</td>
                            <td>{patient.email}</td>
                            <td>{patient.contactNumber}</td>
                            <td>{new Date(patient.birthdate).toLocaleDateString()}</td>
                            <td className={styles.actionButtons}>
                                <button className={styles.viewButton}>View</button>
                                <button className={styles.editButton}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;
