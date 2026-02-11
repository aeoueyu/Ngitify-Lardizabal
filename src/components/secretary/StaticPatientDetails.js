import React from 'react';
import styles from '../../styles/secretary/PatientRecords.module.css';

const StaticPatientDetails = ({ patient }) => {
    if (!patient) {
        return null;
    }

    const patientName = patient.name ? `${patient.name.first} ${patient.name.last}` : 'N/A';

    return (
        <div className={styles.detailsContainer}>
            <h2 className={styles.detailsTitle}>Patient Details for {patientName} (View-Only)</h2>
            <div className={styles.detailsSection}>
                <h3>Odontogram</h3>
                <img src="/sample-odontogram.png" alt="Sample Odontogram" className={styles.image} />
                <p>Status: Last updated on Jan 15, 2024. No new findings.</p>
            </div>
            <div className={styles.detailsSection}>
                <h3>X-ray</h3>
                <img src="/sample-xray.png" alt="Sample X-ray" className={styles.image} />
                <p>Panoramic X-ray taken on Dec 20, 2023. Shows impacted wisdom tooth on lower right quadrant.</p>
            </div>
            <div className={styles.detailsSection}>
                <h3>Electronic Medical Record (EMR)</h3>
                <p>
                    <strong>Allergies:</strong> None reported. <br />
                    <strong>Medications:</strong> None. <br />
                    <strong>Administrative Notes:</strong> Patient has a history of appointment cancellations. Please confirm 24 hours prior.
                </p>
            </div>
        </div>
    );
};

export default StaticPatientDetails;
