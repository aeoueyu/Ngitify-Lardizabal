import React from 'react';
import ManagePatients from '../user-management/ManagePatients';
import styles from '../../styles/secretary/PatientRecords.module.css';

const PatientRecords = () => {
    return (
        <div className={styles.container}>
            <div className={styles.managePatientsContainer}>
                <ManagePatients />
            </div>
        </div>
    );
};

export default PatientRecords;
