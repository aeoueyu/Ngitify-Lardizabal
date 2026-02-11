import React from 'react';
import styles from '../../styles/patient/MyRecords.module.css';

const MyRecords = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Records</h1>
            
            <div className={styles.recordSection}>
                <h2>Electronic Medical Record (EMR)</h2>
                <div className={styles.recordContent}>
                    <p><strong>Date:</strong> January 15, 2026</p>
                    <p><strong>Diagnosis:</strong> Plaque-induced gingivitis</p>
                    <p><strong>Treatment:</strong> Prophylaxis and oral hygiene instruction.</p>
                    <p><strong>Notes:</strong> Patient advised to use soft-bristled toothbrush and floss daily. Follow-up in 6 months.</p>
                </div>
            </div>

            <div className={styles.recordSection}>
                <h2>Odontogram</h2>
                <div className={styles.imageContainer}>
                    <img src="/sample-odontogram.png" alt="Sample Odontogram" className={styles.image} />
                </div>
            </div>

            <div className={styles.recordSection}>
                <h2>X-ray Viewer</h2>
                <div className={styles.imageContainer}>
                    <img src="/sample-xray.png" alt="Sample X-ray" className={styles.image} />
                </div>
            </div>

            <div className={styles.recordSection}>
                <h2>Predictive Simulation Results</h2>
                <div className={styles.recordContent}>
                    <p>No simulation results saved yet. Use the AI Predictive Simulator to generate one.</p>
                </div>
            </div>
        </div>
    );
};

export default MyRecords;
